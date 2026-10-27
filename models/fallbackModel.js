// models/fallbackModel.js - In-Memory / JSON Data Provider untuk Vercel Serverless
const fs = require('fs');
const path = require('path');

let cache = null;

function loadData() {
  if (cache) return cache;
  try {
    const jsonPath = path.join(__dirname, '..', 'data', 'fallback-data.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      cache = JSON.parse(raw);
    }
  } catch (err) {
    console.error('[FallbackModel] Gagal membaca data JSON:', err.message);
  }

  if (!cache) {
    cache = {
      profile: null,
      artifacts: [],
      reflections: [],
      courseReflections: []
    };
  }
  return cache;
}

const Profile = {
  async findOne() {
    const data = loadData();
    return data.profile ? { ...data.profile, update: async (u) => Object.assign(data.profile, u) } : null;
  },
  async count() {
    const data = loadData();
    return data.profile ? 1 : 0;
  },
  async create(obj) {
    const data = loadData();
    data.profile = { id: 1, ...obj };
    return { ...data.profile, update: async (u) => Object.assign(data.profile, u) };
  }
};

const Artifact = {
  async findAll(options = {}) {
    const data = loadData();
    let list = [...(data.artifacts || [])];

    if (options.where) {
      if (options.where.kategori) {
        list = list.filter(a => a.kategori === options.where.kategori);
      }
    }

    list.sort((a, b) => (a.urutan || 0) - (b.urutan || 0) || a.id - b.id);
    return list.map(item => ({
      ...item,
      update: async (u) => Object.assign(item, u),
      destroy: async () => {
        data.artifacts = data.artifacts.filter(x => x.id !== item.id);
      }
    }));
  },

  async findByPk(id) {
    const data = loadData();
    const item = data.artifacts.find(a => String(a.id) === String(id));
    if (!item) return null;
    return {
      ...item,
      update: async (u) => Object.assign(item, u),
      destroy: async () => {
        data.artifacts = data.artifacts.filter(x => x.id !== item.id);
      }
    };
  },

  async count(options = {}) {
    const items = await this.findAll(options);
    return items.length;
  },

  async create(obj) {
    const data = loadData();
    const newId = (data.artifacts.reduce((max, a) => Math.max(max, a.id || 0), 0) || 0) + 1;
    const item = { id: newId, ...obj };
    data.artifacts.push(item);
    return { ...item, update: async (u) => Object.assign(item, u) };
  }
};

const Reflection = {
  async findAll(options = {}) {
    const data = loadData();
    const list = [...(data.reflections || [])];
    list.sort((a, b) => (a.urutan || 0) - (b.urutan || 0) || a.id - b.id);
    return list.map(item => ({
      ...item,
      update: async (u) => Object.assign(item, u)
    }));
  },

  async findByPk(id) {
    const data = loadData();
    const item = data.reflections.find(r => String(r.id) === String(id));
    if (!item) return null;
    return {
      ...item,
      update: async (u) => Object.assign(item, u)
    };
  },

  async count() {
    const data = loadData();
    return (data.reflections || []).length;
  }
};

const CourseReflection = {
  async findAll(options = {}) {
    const data = loadData();
    let list = [...(data.courseReflections || [])];
    if (options.where && options.where.semester) {
      list = list.filter(c => c.semester === options.where.semester);
    }
    list.sort((a, b) => (a.semester || 1) - (b.semester || 1) || (a.urutan || 0) - (b.urutan || 0) || a.id - b.id);
    return list.map(item => ({
      ...item,
      update: async (u) => Object.assign(item, u),
      destroy: async () => {
        data.courseReflections = data.courseReflections.filter(x => x.id !== item.id);
      }
    }));
  },

  async findByPk(id) {
    const data = loadData();
    const item = data.courseReflections.find(c => String(c.id) === String(id));
    if (!item) return null;
    return {
      ...item,
      update: async (u) => Object.assign(item, u),
      destroy: async () => {
        data.courseReflections = data.courseReflections.filter(x => x.id !== item.id);
      }
    };
  },

  async count() {
    const data = loadData();
    return (data.courseReflections || []).length;
  },

  async create(obj) {
    const data = loadData();
    const newId = (data.courseReflections.reduce((max, c) => Math.max(max, c.id || 0), 0) || 0) + 1;
    const item = { id: newId, ...obj };
    data.courseReflections.push(item);
    return { ...item, update: async (u) => Object.assign(item, u) };
  }
};

module.exports = {
  Profile,
  Artifact,
  Reflection,
  CourseReflection
};
