const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gelar: {
    type: DataTypes.STRING,
    defaultValue: 'S.Pd.'
  },
  nim: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lptk: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prodi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sekolah_mitra: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guru_pamong: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dosen_pembimbing: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  linkedin: {
    type: DataTypes.STRING
  },
  foto_url: {
    type: DataTypes.STRING,
    defaultValue: '/images/profile-placeholder.jpg'
  },
  sambutan_pengantar: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  visi_guru: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  periode_ppl: {
    type: DataTypes.STRING,
    defaultValue: 'Semester Ganjil 2026/2027'
  },
  total_jam_praktek: {
    type: DataTypes.INTEGER,
    defaultValue: 288
  }
}, {
  tableName: 'profiles',
  timestamps: true
});

module.exports = Profile;
