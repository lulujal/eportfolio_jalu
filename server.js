const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const IS_VERCEL = !!process.env.VERCEL;

const { sequelize, dialect, Profile } = require('./models');
const apiRoutes = require('./routes/api');
const seedDatabase = require('./seeders/seedData');

let createAutoBackup;
if (!IS_VERCEL) {
  const bm = require('./utils/backupManager');
  createAutoBackup = bm.createAutoBackup;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Pastikan direktori data ada jika menggunakan sqlite (hanya lokal)
if (!IS_VERCEL && dialect === 'sqlite') {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Pastikan direktori uploads untuk dokumen PDF ada (hanya di env lokal)
if (!IS_VERCEL) {
  const uploadDir = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  // Siapkan direktori backup
  const { ensureBackupDir } = require('./utils/backupManager');
  ensureBackupDir();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Fallback untuk SPA ke index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inisialisasi Database dan Server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log(`[Database] Terhubung dengan sukses menggunakan dialect: ${dialect.toUpperCase()}`);

    // Sinkronisasi model
    await sequelize.sync();

    // Periksa apakah data sudah ada, jika belum, lakukan auto-seeding
    const profileCount = await Profile.count();
    if (profileCount === 0) {
      console.log('[Database] Mengisi data awal portofolio calon guru sesuai standar rubrik...');
      await seedDatabase();
    } else if (!process.env.VERCEL) {
      // Buat snapshot cadangan otomatis saat server lokal dinyalakan
      await createAutoBackup('startup');
    }

    if (!process.env.VERCEL) {
      // Jadwalkan cadangan otomatis berkala setiap 60 menit (hanya di lingkungan persistent lokal)
      setInterval(async () => {
        try {
          await createAutoBackup('periodic');
        } catch (err) {
          console.error('[Backup] Gagal membuat snapshot berkala:', err.message);
        }
      }, 60 * 60 * 1000);

      app.listen(PORT, () => {
        console.log('====================================================');
        console.log(`  E-PORTOFOLIO CALON GURU BERHASIL DIJALANKAN!`);
        console.log(`  Server aktif di: http://localhost:${PORT}`);
        console.log(`  Dialect Database: ${dialect}`);
        console.log('====================================================');
      });
    }
  } catch (error) {
    console.error('[Server Error] Gagal memulai server:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
