// api/index.js - Entry Point Serverless Vercel
const app = require('../server');
const { sequelize } = require('../models');

let isInitialized = false;

module.exports = async (req, res) => {
  if (!isInitialized) {
    try {
      await sequelize.sync();
      isInitialized = true;
    } catch (err) {
      console.error('[Vercel DB Init Error]:', err);
    }
  }
  return app(req, res);
};
