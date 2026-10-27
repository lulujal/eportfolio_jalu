const { Profile, Artifact, Reflection, CourseReflection, dialect } = require('../models');
const { Op } = require('sequelize');
const backupManager = require('../utils/backupManager');
const fs = require('fs');
const path = require('path');

// Konfigurasi Lingkungan (Development vs Production)
exports.getConfig = (req, res) => {
  const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
  const isDevelopment = nodeEnv !== 'production';
  res.json({
    success: true,
    data: {
      nodeEnv,
      isDevelopment,
      enableEdit: isDevelopment
    }
  });
};

// Controller Profil
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profil belum dibuat.' });
    }
    const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
    const isDevelopment = nodeEnv !== 'production';
    res.json({
      success: true,
      data: profile,
      dialect,
      config: {
        nodeEnv,
        isDevelopment,
        enableEdit: isDevelopment
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    // Jika ada file foto yang diupload, simpan path-nya
    let updateData = { ...req.body };
    if (req.file) {
      updateData.foto_url = `/uploads/${req.file.filename}`;
    }
    // Jika ada foto_url dari body (paste URL), tetap gunakan
    // (sudah ada di req.body, tidak perlu tambahan)

    if (!profile) {
      profile = await Profile.create(updateData);
    } else {
      await profile.update(updateData);
    }
    res.json({ success: true, message: 'Profil berhasil diperbarui.', data: profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil.', error: error.message });
  }
};

// Controller Artifak
exports.getArtifacts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const whereClause = {};

    if (category && category !== 'semua') {
      whereClause.kategori = category;
    }

    if (search) {
      whereClause[Op.or] = [
        { judul: { [Op.like]: `%${search}%` } },
        { deskripsi_singkat: { [Op.like]: `%${search}%` } },
        { kajian_teori: { [Op.like]: `%${search}%` } },
        { kelas_target: { [Op.like]: `%${search}%` } }
      ];
    }

    const artifacts = await Artifact.findAll({
      where: whereClause,
      order: [['urutan', 'ASC'], ['id', 'ASC']]
    });

    res.json({ success: true, data: artifacts });
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data artifak.', error: error.message });
  }
};

exports.getArtifactById = async (req, res) => {
  try {
    const { id } = req.params;
    const artifact = await Artifact.findByPk(id);
    if (!artifact) {
      return res.status(404).json({ success: false, message: 'Artifak tidak ditemukan.' });
    }
    res.json({ success: true, data: artifact });
  } catch (error) {
    console.error('Error fetching artifact by id:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail artifak.', error: error.message });
  }
};

exports.createArtifact = async (req, res) => {
  try {
    const {
      judul,
      kategori,
      kategori_label,
      tanggal_kegiatan,
      kelas_target,
      deskripsi_singkat,
      konteks,
      tujuan,
      kelebihan,
      kekurangan,
      kajian_teori,
      video_url,
      penilai,
      nilai_feedback
    } = req.body;

    let file_url = req.body.file_url || null;
    let file_nama = req.body.file_nama || null;

    if (req.file) {
      file_url = '/uploads/' + req.file.filename;
      file_nama = req.file.originalname;
    }

    if (!judul || !kategori || !konteks || !tujuan || !kajian_teori) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi judul, kategori, konteks, tujuan, dan kajian teori sesuai rubrik.'
      });
    }

    // Pemetaan label kategori jika belum terisi
    const categoryLabels = {
      'rpp': 'RPP / Modul Ajar',
      'media': 'Media & Bahan Ajar',
      'hasil_siswa': 'Contoh Hasil Kerja Siswa',
      'penilaian_supervisi': 'Penilaian dari GP & DPL',
      'video_praktik': 'Video Praktik Mengajar',
      'lainnya': 'Dokumentasi Lainnya'
    };

    const newArtifact = await Artifact.create({
      judul,
      kategori,
      kategori_label: kategori_label || categoryLabels[kategori] || 'Artifak PPL',
      tanggal_kegiatan: tanggal_kegiatan || new Date().toISOString().split('T')[0],
      kelas_target: kelas_target || 'Kelas Pembelajaran',
      deskripsi_singkat: deskripsi_singkat || judul,
      konteks,
      tujuan,
      kelebihan: kelebihan || '-',
      kekurangan: kekurangan || '-',
      kajian_teori,
      file_url,
      file_nama,
      video_url,
      penilai,
      nilai_feedback,
      urutan: 99
    });

    res.status(201).json({ success: true, message: 'Artifak berhasil ditambahkan.', data: newArtifact });
  } catch (error) {
    console.error('Error creating artifact:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan artifak.', error: error.message });
  }
};

exports.updateArtifact = async (req, res) => {
  try {
    const { id } = req.params;
    const artifact = await Artifact.findByPk(id);
    if (!artifact) {
      return res.status(404).json({ success: false, message: 'Artifak tidak ditemukan.' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.file_url = '/uploads/' + req.file.filename;
      updateData.file_nama = req.file.originalname;
    }

    const categoryLabels = {
      'rpp': 'RPP / Modul Ajar',
      'media': 'Media & Bahan Ajar',
      'hasil_siswa': 'Contoh Hasil Kerja Siswa',
      'penilaian_supervisi': 'Penilaian dari GP & DPL',
      'video_praktik': 'Video Praktik Mengajar',
      'lainnya': 'Dokumentasi Lainnya'
    };

    if (updateData.kategori && categoryLabels[updateData.kategori]) {
      updateData.kategori_label = categoryLabels[updateData.kategori];
    }

    await artifact.update(updateData);
    res.json({ success: true, message: 'Artifak berhasil diperbarui.', data: artifact });
  } catch (error) {
    console.error('Error updating artifact:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui artifak.', error: error.message });
  }
};

exports.deleteArtifact = async (req, res) => {
  try {
    const { id } = req.params;
    const artifact = await Artifact.findByPk(id);
    if (!artifact) {
      return res.status(404).json({ success: false, message: 'Artifak tidak ditemukan.' });
    }

    await artifact.destroy();
    res.json({ success: true, message: 'Artifak berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting artifact:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus artifak.', error: error.message });
  }
};

// Controller Refleksi Utama
exports.getReflections = async (req, res) => {
  try {
    const { kategori } = req.query;
    const whereClause = {};
    if (kategori) {
      whereClause.kategori = kategori;
    }

    const reflections = await Reflection.findAll({
      where: whereClause,
      order: [['urutan', 'ASC'], ['id', 'ASC']]
    });

    res.json({ success: true, data: reflections });
  } catch (error) {
    console.error('Error fetching reflections:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data refleksi.', error: error.message });
  }
};

exports.getReflectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const reflection = await Reflection.findByPk(id);
    if (!reflection) {
      return res.status(404).json({ success: false, message: 'Refleksi tidak ditemukan.' });
    }
    res.json({ success: true, data: reflection });
  } catch (error) {
    console.error('Error fetching reflection by id:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail refleksi.', error: error.message });
  }
};

exports.updateReflection = async (req, res) => {
  try {
    const { id } = req.params;
    const reflection = await Reflection.findByPk(id);
    if (!reflection) {
      return res.status(404).json({ success: false, message: 'Refleksi tidak ditemukan.' });
    }

    const updateData = { ...req.body };
    if (updateData.poin_utama && typeof updateData.poin_utama === 'string') {
      const trimmed = updateData.poin_utama.trim();
      if (!trimmed.startsWith('[')) {
        const points = trimmed
          .split('\n')
          .map(p => p.trim().replace(/^[-•*]\s*/, ''))
          .filter(Boolean);
        updateData.poin_utama = JSON.stringify(points);
      }
    }

    await reflection.update(updateData);
    res.json({ success: true, message: 'Refleksi berhasil diperbarui.', data: reflection });
  } catch (error) {
    console.error('Error updating reflection:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui refleksi.', error: error.message });
  }
};

// Controller Refleksi Pengalaman Belajar Mata Kuliah 2 Semester
exports.getCourseReflections = async (req, res) => {
  try {
    const { semester } = req.query;
    const whereClause = {};
    if (semester && semester !== 'semua') {
      whereClause.semester = semester;
    }

    const courseReflections = await CourseReflection.findAll({
      where: whereClause,
      order: [['semester', 'ASC'], ['urutan', 'ASC'], ['id', 'ASC']]
    });

    res.json({ success: true, data: courseReflections });
  } catch (error) {
    console.error('Error fetching course reflections:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data refleksi mata kuliah.', error: error.message });
  }
};

exports.getCourseReflectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const cr = await CourseReflection.findByPk(id);
    if (!cr) {
      return res.status(404).json({ success: false, message: 'Refleksi mata kuliah tidak ditemukan.' });
    }
    res.json({ success: true, data: cr });
  } catch (error) {
    console.error('Error fetching course reflection by id:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail refleksi mata kuliah.', error: error.message });
  }
};

exports.createCourseReflection = async (req, res) => {
  try {
    const {
      nama_mata_kuliah,
      kode_mk,
      semester,
      sks,
      dosen_pengampu,
      deskripsi_singkat,
      pengalaman_belajar,
      artefak_pembelajaran,
      analisis_refleksi,
      desain_pembelajaran_baru,
      urutan
    } = req.body;

    let pdf_file_url = req.body.pdf_file_url || null;
    let pdf_file_nama = req.body.pdf_file_nama || null;

    if (req.file) {
      pdf_file_url = '/uploads/' + req.file.filename;
      pdf_file_nama = req.file.originalname;
    }

    if (!nama_mata_kuliah || !semester || !pengalaman_belajar) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi Nama Mata Kuliah, Semester, dan Review Pengalaman Belajar.'
      });
    }

    const newCR = await CourseReflection.create({
      nama_mata_kuliah,
      kode_mk: kode_mk || '',
      semester: semester || 'Semester 1',
      sks: sks ? parseInt(sks) : 2,
      dosen_pengampu: dosen_pengampu || '',
      deskripsi_singkat: deskripsi_singkat || '',
      pengalaman_belajar,
      artefak_pembelajaran: artefak_pembelajaran || '',
      analisis_refleksi: analisis_refleksi || '',
      desain_pembelajaran_baru: desain_pembelajaran_baru || '',
      pdf_file_url,
      pdf_file_nama,
      urutan: urutan ? parseInt(urutan) : 99
    });

    res.status(201).json({ success: true, message: 'Refleksi mata kuliah berhasil ditambahkan.', data: newCR });
  } catch (error) {
    console.error('Error creating course reflection:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan refleksi mata kuliah.', error: error.message });
  }
};

exports.updateCourseReflection = async (req, res) => {
  try {
    const { id } = req.params;
    const cr = await CourseReflection.findByPk(id);
    if (!cr) {
      return res.status(404).json({ success: false, message: 'Refleksi mata kuliah tidak ditemukan.' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.pdf_file_url = '/uploads/' + req.file.filename;
      updateData.pdf_file_nama = req.file.originalname;
    }

    if (updateData.sks) {
      updateData.sks = parseInt(updateData.sks);
    }
    if (updateData.urutan) {
      updateData.urutan = parseInt(updateData.urutan);
    }

    await cr.update(updateData);
    res.json({ success: true, message: 'Refleksi mata kuliah berhasil diperbarui.', data: cr });
  } catch (error) {
    console.error('Error updating course reflection:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui refleksi mata kuliah.', error: error.message });
  }
};

exports.deleteCourseReflection = async (req, res) => {
  try {
    const { id } = req.params;
    const cr = await CourseReflection.findByPk(id);
    if (!cr) {
      return res.status(404).json({ success: false, message: 'Refleksi mata kuliah tidak ditemukan.' });
    }

    await cr.destroy();
    res.json({ success: true, message: 'Refleksi mata kuliah berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting course reflection:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus refleksi mata kuliah.', error: error.message });
  }
};

// Ringkasan Statistik Portofolio
exports.getStats = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const artifactsCount = await Artifact.count();
    const reflectionsCount = await Reflection.count();
    const courseReflectionsCount = await CourseReflection.count();
    
    // Grouping per kategori
    const rppCount = await Artifact.count({ where: { kategori: 'rpp' } });
    const mediaCount = await Artifact.count({ where: { kategori: 'media' } });
    const hasilSiswaCount = await Artifact.count({ where: { kategori: 'hasil_siswa' } });
    const supervisiCount = await Artifact.count({ where: { kategori: 'penilaian_supervisi' } });
    const videoCount = await Artifact.count({ where: { kategori: 'video_praktik' } });

    res.json({
      success: true,
      data: {
        totalArtifacts: artifactsCount,
        totalReflections: reflectionsCount,
        totalCourseReflections: courseReflectionsCount,
        totalHours: profile ? profile.total_jam_praktek : 288,
        categories: {
          rpp: rppCount,
          media: mediaCount,
          hasil_siswa: hasilSiswaCount,
          penilaian_supervisi: supervisiCount,
          video_praktik: videoCount
        },
        rubricScorePotential: 100
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Gagal memuat statistik.', error: error.message });
  }
};

// ==================== CONTROLLER CADANGAN & PEMULIHAN (BACKUP & RESTORE) ====================

// 1. Ekspor Backup JSON Lengkap
exports.exportBackup = async (req, res) => {
  try {
    const dump = await backupManager.exportFullData();
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `eportfolio-backup-${dateStr}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(JSON.stringify(dump, null, 2));
  } catch (error) {
    console.error('Error exporting backup:', error);
    res.status(500).json({ success: false, message: 'Gagal mengekspor data cadangan.', error: error.message });
  }
};

// 2. Unduh file basis data SQLite langsung
exports.downloadSqliteBackup = async (req, res) => {
  try {
    if (!fs.existsSync(backupManager.SQLITE_FILE)) {
      return res.status(404).json({ success: false, message: 'File SQLite tidak ditemukan.' });
    }
    const dateStr = new Date().toISOString().split('T')[0];
    res.download(backupManager.SQLITE_FILE, `eportfolio-${dateStr}.sqlite`);
  } catch (error) {
    console.error('Error downloading sqlite:', error);
    res.status(500).json({ success: false, message: 'Gagal mengunduh file basis data.', error: error.message });
  }
};

// 3. Buat snapshot cadangan instan di server
exports.createInstantBackup = async (req, res) => {
  try {
    const result = await backupManager.createAutoBackup('manual');
    if (result.success) {
      res.json({ success: true, message: 'Cadangan data berhasil dibuat di server!', data: result });
    } else {
      res.status(500).json({ success: false, message: 'Gagal membuat cadangan.', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat cadangan.', error: error.message });
  }
};

// 4. Daftar berkas cadangan di server
exports.listBackups = async (req, res) => {
  try {
    const list = backupManager.listBackups();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar cadangan.', error: error.message });
  }
};

// 5. Restore data dari JSON atau berkas cadangan server
exports.restoreBackup = async (req, res) => {
  try {
    let dumpData = null;

    if (req.file) {
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      dumpData = JSON.parse(fileContent);
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    } else if (req.body && req.body.data) {
      dumpData = req.body;
    } else if (req.body && req.body.backup_filename) {
      const filePath = path.join(backupManager.BACKUP_DIR, req.body.backup_filename);
      if (fs.existsSync(filePath)) {
        if (filePath.endsWith('.json')) {
          dumpData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } else if (filePath.endsWith('.sqlite')) {
          await backupManager.createAutoBackup('before-sqlite-restore');
          fs.copyFileSync(filePath, backupManager.SQLITE_FILE);
          return res.json({ success: true, message: 'File basis data SQLite berhasil dipulihkan dari server! Silakan muat ulang halaman.' });
        }
      } else {
        return res.status(404).json({ success: false, message: 'File cadangan server tidak ditemukan.' });
      }
    }

    if (!dumpData) {
      return res.status(400).json({ success: false, message: 'Mohon unggah berkas cadangan JSON yang valid.' });
    }

    const result = await backupManager.restoreFromJSON(dumpData);
    res.json(result);
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ success: false, message: 'Gagal memulihkan cadangan: ' + error.message });
  }
};
