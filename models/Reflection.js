const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reflection = sequelize.define('Reflection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kategori: {
    type: DataTypes.STRING, // 'filosofi_mengajar', 'model_guru_tujuan', 'refleksi_akhir_ppl'
    allowNull: false
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subjudul: {
    type: DataTypes.STRING,
    allowNull: true
  },
  kutipan_filosofis: {
    type: DataTypes.STRING,
    allowNull: true
  },
  konten: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Khusus Refleksi Akhir & Model Guru (Rubrik):
  kekuatan: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Analisis kekuatan diri calon guru'
  },
  kelemahan: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Analisis kelemahan atau tantangan yang dihadapi'
  },
  rencana_tindak_lanjut: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Rencana tindak lanjut (RTL) untuk pengembangan diri berkelanjutan'
  },
  poin_utama: {
    type: DataTypes.TEXT, // Disimpan sebagai JSON string atau teks bertitik
    allowNull: true
  },
  urutan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'reflections',
  timestamps: true
});

module.exports = Reflection;
