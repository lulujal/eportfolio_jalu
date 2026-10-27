const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Artifact = sequelize.define('Artifact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kategori: {
    type: DataTypes.STRING, // 'rpp', 'media', 'hasil_siswa', 'penilaian_supervisi', 'video_praktik', 'lainnya'
    allowNull: false
  },
  kategori_label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal_kegiatan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kelas_target: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi_singkat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Kriteria Rubrik Analisis Artifak:
  konteks: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Konteks situasi kelas, karakteristik peserta didik, lingkungan belajar'
  },
  tujuan: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Tujuan pembelajaran, capaian kompetensi dasar'
  },
  kelebihan: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Kelebihan dan efektivitas implementasi artifak'
  },
  kekurangan: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Tantangan, kendala, atau aspek yang belum maksimal'
  },
  kajian_teori: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Integrasi kajian teori pendidikan (e.g. Vygotsky, Piaget, TPACK, Tomlinson)'
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  file_nama: {
    type: DataTypes.STRING,
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  penilai: {
    type: DataTypes.STRING, // misal: 'Drs. H. Mulyadi, M.Pd (Guru Pamong)'
    allowNull: true
  },
  nilai_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  urutan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'artifacts',
  timestamps: true
});

module.exports = Artifact;
