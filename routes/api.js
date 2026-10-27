const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const apiController = require('../controllers/apiController');

// Konfigurasi Multer untuk Upload Dokumen PDF & Berkas
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30 MB
});

// Route Konfigurasi Lingkungan
router.get('/config', apiController.getConfig);

// Route Profil Calon Guru (Beranda)
router.get('/profile', apiController.getProfile);
router.put('/profile', upload.single('foto'), apiController.updateProfile);

// Route Artifak Bukti Mengajar (mendukung JSON dan form upload)
router.get('/artifacts', apiController.getArtifacts);
router.get('/artifacts/:id', apiController.getArtifactById);
router.post('/artifacts', upload.single('file'), apiController.createArtifact);
router.put('/artifacts/:id', upload.single('file'), apiController.updateArtifact);
router.delete('/artifacts/:id', apiController.deleteArtifact);

// Route Refleksi Utama
router.get('/reflections', apiController.getReflections);
router.get('/reflections/:id', apiController.getReflectionById);
router.put('/reflections/:id', apiController.updateReflection);

// Route Refleksi Pengalaman Belajar Mata Kuliah 2 Semester
router.get('/course-reflections', apiController.getCourseReflections);
router.get('/course-reflections/:id', apiController.getCourseReflectionById);
router.post('/course-reflections', upload.single('pdf_file'), apiController.createCourseReflection);
router.put('/course-reflections/:id', upload.single('pdf_file'), apiController.updateCourseReflection);
router.delete('/course-reflections/:id', apiController.deleteCourseReflection);

// Route Statistik & Kelengkapan
router.get('/stats', apiController.getStats);

// Route Cadangan & Pemulihan Data (Backup & Restore)
router.get('/backup/export', apiController.exportBackup);
router.get('/backup/download-sqlite', apiController.downloadSqliteBackup);
router.post('/backup/create', apiController.createInstantBackup);
router.get('/backup/list', apiController.listBackups);
router.post('/backup/restore', upload.single('backup_file'), apiController.restoreBackup);

module.exports = router;
