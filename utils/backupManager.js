const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', 'backups');
const SQLITE_FILE = path.join(__dirname, '..', 'data', 'eportfolio.sqlite');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Format timestamp for backup filenames (YYYY-MM-DD_HH-mm-ss)
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`;
}

/**
 * Clean up older backups, keeping the most recent N files
 */
function cleanupOldBackups(maxKeep = 30) {
  try {
    ensureBackupDir();
    const files = fs.readdirSync(BACKUP_DIR)
      .map(file => {
        const filePath = path.join(BACKUP_DIR, file);
        return {
          file,
          path: filePath,
          time: fs.statSync(filePath).mtime.getTime()
        };
      })
      .sort((a, b) => b.time - a.time);

    if (files.length > maxKeep) {
      const toDelete = files.slice(maxKeep);
      toDelete.forEach(f => {
        try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
      });
    }
  } catch (err) {
    console.error('[Backup] Gagal membersihkan backup lama:', err.message);
  }
}

/**
 * Mengambil seluruh data dari basis data Sequelize dalam bentuk JSON
 */
async function exportFullData() {
  const { Profile, Artifact, Reflection, CourseReflection } = require('../models');

  const [profile, artifacts, reflections, courseReflections] = await Promise.all([
    Profile.findOne(),
    Artifact.findAll({ order: [['id', 'ASC']] }),
    Reflection.findAll({ order: [['id', 'ASC']] }),
    CourseReflection.findAll({ order: [['id', 'ASC']] })
  ]);

  return {
    appName: 'E-Portofolio Calon Guru',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    counts: {
      profile: profile ? 1 : 0,
      artifacts: artifacts.length,
      reflections: reflections.length,
      courseReflections: courseReflections.length
    },
    data: {
      profile: profile ? profile.toJSON() : null,
      artifacts: artifacts.map(a => a.toJSON()),
      reflections: reflections.map(r => r.toJSON()),
      courseReflections: courseReflections.map(c => c.toJSON())
    }
  };
}

/**
 * Membuat snapshot cadangan otomatis (file .sqlite dan file .json)
 */
async function createAutoBackup(reason = 'auto') {
  try {
    ensureBackupDir();
    const timestamp = getTimestamp();

    // 1. Cadangkan file sqlite jika ada
    let sqliteBackupName = null;
    if (fs.existsSync(SQLITE_FILE)) {
      sqliteBackupName = `backup_${timestamp}_${reason}.sqlite`;
      const destPath = path.join(BACKUP_DIR, sqliteBackupName);
      fs.copyFileSync(SQLITE_FILE, destPath);
    }

    // 2. Cadangkan format JSON lengkap
    let jsonBackupName = null;
    try {
      const dump = await exportFullData();
      jsonBackupName = `backup_${timestamp}_${reason}.json`;
      const jsonDestPath = path.join(BACKUP_DIR, jsonBackupName);
      fs.writeFileSync(jsonDestPath, JSON.stringify(dump, null, 2), 'utf8');
    } catch (dbErr) {
      // Jika saat start DB belum connect, lewati dump JSON
    }

    cleanupOldBackups(30);

    console.log(`[Backup] Berhasil membuat snapshot cadangan (${reason}): ${sqliteBackupName || jsonBackupName}`);
    return {
      success: true,
      timestamp,
      sqlite: sqliteBackupName,
      json: jsonBackupName
    };
  } catch (error) {
    console.error('[Backup Error] Gagal membuat snapshot cadangan:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Memulihkan data dari objek / payload JSON
 */
async function restoreFromJSON(dumpData) {
  const { sequelize, Profile, Artifact, Reflection, CourseReflection } = require('../models');

  if (!dumpData || !dumpData.data) {
    throw new Error('Format file cadangan tidak valid (data tidak ditemukan).');
  }

  // Buat cadangan penyelamatan sebelum restore!
  await createAutoBackup('before-restore-override');

  const { profile, artifacts, reflections, courseReflections } = dumpData.data;

  // Lakukan transaksi restore
  await sequelize.transaction(async (t) => {
    // 1. Profil
    if (profile) {
      await Profile.destroy({ where: {}, truncate: true, transaction: t });
      const profileClean = { ...profile };
      delete profileClean.id;
      delete profileClean.createdAt;
      delete profileClean.updatedAt;
      await Profile.create(profileClean, { transaction: t });
    }

    // 2. Artifak
    if (Array.isArray(artifacts) && artifacts.length > 0) {
      await Artifact.destroy({ where: {}, truncate: true, transaction: t });
      const cleanArtifacts = artifacts.map(a => {
        const item = { ...a };
        delete item.id;
        delete item.createdAt;
        delete item.updatedAt;
        return item;
      });
      await Artifact.bulkCreate(cleanArtifacts, { transaction: t });
    }

    // 3. Refleksi Utama
    if (Array.isArray(reflections) && reflections.length > 0) {
      await Reflection.destroy({ where: {}, truncate: true, transaction: t });
      const cleanReflections = reflections.map(r => {
        const item = { ...r };
        delete item.id;
        delete item.createdAt;
        delete item.updatedAt;
        return item;
      });
      await Reflection.bulkCreate(cleanReflections, { transaction: t });
    }

    // 4. Refleksi Pengalaman Belajar (Mata Kuliah)
    if (Array.isArray(courseReflections) && courseReflections.length > 0) {
      await CourseReflection.destroy({ where: {}, truncate: true, transaction: t });
      const cleanCourses = courseReflections.map(c => {
        const item = { ...c };
        delete item.id;
        delete item.createdAt;
        delete item.updatedAt;
        return item;
      });
      await CourseReflection.bulkCreate(cleanCourses, { transaction: t });
    }
  });

  return {
    success: true,
    message: 'Data berhasil dipulihkan secara utuh!',
    restoredCounts: {
      profile: profile ? 1 : 0,
      artifacts: artifacts ? artifacts.length : 0,
      reflections: reflections ? reflections.length : 0,
      courseReflections: courseReflections ? courseReflections.length : 0
    }
  };
}

/**
 * Daftar berkas cadangan di server
 */
function listBackups() {
  ensureBackupDir();
  const files = fs.readdirSync(BACKUP_DIR);
  return files.map(file => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    return {
      filename: file,
      sizeBytes: stats.size,
      sizeFormatted: `${(stats.size / 1024).toFixed(1)} KB`,
      createdAt: stats.mtime.toISOString(),
      type: file.endsWith('.sqlite') ? 'sqlite' : file.endsWith('.json') ? 'json' : 'other'
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  BACKUP_DIR,
  SQLITE_FILE,
  ensureBackupDir,
  createAutoBackup,
  exportFullData,
  restoreFromJSON,
  listBackups
};
