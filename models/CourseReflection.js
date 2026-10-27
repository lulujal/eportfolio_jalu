const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CourseReflection = sequelize.define('CourseReflection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_mata_kuliah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kode_mk: {
    type: DataTypes.STRING,
    allowNull: true
  },
  semester: {
    type: DataTypes.STRING, // 'Semester 1' atau 'Semester 2'
    allowNull: false
  },
  sks: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  },
  dosen_pengampu: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deskripsi_singkat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pengalaman_belajar: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Review pengalaman belajar yang bermakna selama perkuliahan'
  },
  artefak_pembelajaran: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Artefak / tugas unggulan yang dihasilkan'
  },
  analisis_refleksi: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mengapa artefak ini bermakna dan apa paradigma baru yang didapat'
  },
  desain_pembelajaran_baru: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Rencana aplikasi / aksi nyata pada praktik pembelajaran di sekolah'
  },
  pdf_file_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pdf_file_nama: {
    type: DataTypes.STRING,
    allowNull: true
  },
  urutan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'course_reflections',
  timestamps: true
});

module.exports = CourseReflection;
