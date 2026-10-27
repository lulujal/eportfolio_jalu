const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dialect = process.env.DB_DIALECT || (process.env.DB_NAME ? 'postgres' : 'sqlite');

let sequelize;

if (dialect === 'postgres') {
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.DB_SSL === 'true' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    });
  } else {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'eportfolio_guru',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
      }
    );
  }
} else {
  // SQLite fallback
  const fs = require('fs');
  let storagePath = process.env.SQLITE_PATH || path.join(__dirname, '..', 'data', 'eportfolio.sqlite');

  // Khusus Vercel Serverless: salin file SQLite ke /tmp agar tidak terkena error read-only filesystem
  if (process.env.VERCEL) {
    const tmpPath = path.join('/tmp', 'eportfolio.sqlite');
    if (!fs.existsSync(tmpPath) && fs.existsSync(storagePath)) {
      try {
        fs.copyFileSync(storagePath, tmpPath);
        storagePath = tmpPath;
      } catch (err) {
        console.warn('[Vercel SQLite] Gagal menyalin ke /tmp, menggunakan path asli:', err.message);
      }
    } else if (fs.existsSync(tmpPath)) {
      storagePath = tmpPath;
    }
  }

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
  });
}

module.exports = { sequelize, dialect };
