const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dialect = process.env.DB_DIALECT || (process.env.DB_NAME || process.env.DATABASE_URL ? 'postgres' : 'sqlite');

let sequelize = null;
let useFallback = false;

if (dialect === 'postgres') {
  try {
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
  } catch (err) {
    console.warn('[Postgres Init Warning]:', err.message);
    useFallback = true;
  }
} else {
  // SQLite
  // Periksa apakah modul sqlite3 native binary terpasang dan dapat di-require
  let sqliteAvailable = false;
  try {
    require('sqlite3');
    sqliteAvailable = true;
  } catch (err) {
    sqliteAvailable = false;
  }

  if (sqliteAvailable && !process.env.FORCE_JSON_FALLBACK) {
    try {
      const fs = require('fs');
      let storagePath = process.env.SQLITE_PATH || path.join(__dirname, '..', 'data', 'eportfolio.sqlite');

      if (process.env.VERCEL) {
        const tmpPath = path.join('/tmp', 'eportfolio.sqlite');
        if (!fs.existsSync(tmpPath) && fs.existsSync(storagePath)) {
          try {
            fs.copyFileSync(storagePath, tmpPath);
            storagePath = tmpPath;
          } catch (e) {
            console.warn('[Vercel SQLite] Gagal menyalin ke /tmp:', e.message);
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
    } catch (err) {
      console.warn('[SQLite Init Error]:', err.message);
      useFallback = true;
    }
  } else {
    // Di Vercel Serverless Function di mana sqlite3 native binary tidak didukung Node 24
    console.log('[Database] Menggunakan Data Provider JSON (Dioptimasi untuk Vercel Serverless)');
    useFallback = true;
  }
}

// Fallback dummy sequelize object agar sync() dan authenticate() tidak melempar error
if (!sequelize) {
  sequelize = {
    sync: async () => {},
    authenticate: async () => {},
    define: () => ({})
  };
}

module.exports = { sequelize, dialect, useFallback };
