const { sequelize, dialect, useFallback } = require('../config/database');

let Profile, Artifact, Reflection, CourseReflection;

if (useFallback) {
  // Gunakan data provider JSON tanpa ketergantungan modul native sqlite3 (Vercel Serverless)
  const fallback = require('./fallbackModel');
  Profile = fallback.Profile;
  Artifact = fallback.Artifact;
  Reflection = fallback.Reflection;
  CourseReflection = fallback.CourseReflection;
} else {
  // Gunakan Sequelize ORM (Lokal / PostgreSQL)
  Profile = require('./Profile');
  Artifact = require('./Artifact');
  Reflection = require('./Reflection');
  CourseReflection = require('./CourseReflection');
}

module.exports = {
  sequelize,
  dialect,
  useFallback,
  Profile,
  Artifact,
  Reflection,
  CourseReflection
};
