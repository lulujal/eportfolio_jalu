// app.js - Vanilla JS Central Controller & Router for E-Portofolio Calon Guru

class App {
  constructor() {
    this.state = {
      profile: null,
      artifacts: [],
      filteredArtifacts: [],
      reflections: [],
      courseReflections: [],
      stats: null,
      isDevelopment: true,
      currentRoute: 'beranda'
    };

    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.fetchInitialData();
    this.handleRoute();
  }

  setupEventListeners() {
    // Hash change routing
    window.addEventListener('hashchange', () => this.handleRoute());

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    if (mobileBtn && drawer) {
      mobileBtn.addEventListener('click', () => {
        drawer.classList.toggle('hidden');
      });

      // Close drawer on link click
      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => drawer.classList.add('hidden'));
      });
    }

    // Modal backdrop click to close
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', () => this.closeModal());
    }

    // Esc key to close modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  async fetchInitialData() {
    try {
      const [profileRes, artifactsRes, reflectionsRes, statsRes, courseReflectionsRes] = await Promise.all([
        fetch('/api/profile').then(r => r.json()),
        fetch('/api/artifacts').then(r => r.json()),
        fetch('/api/reflections').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/course-reflections').then(r => r.json()).catch(() => ({ success: false, data: [] }))
      ]);

      if (profileRes.success) {
        this.state.profile = profileRes.data;
        if (profileRes.config) {
          this.state.isDevelopment = profileRes.config.isDevelopment;
        }
      }
      if (artifactsRes.success) {
        this.state.artifacts = artifactsRes.data;
        this.state.filteredArtifacts = [...artifactsRes.data];
      }
      if (reflectionsRes.success) this.state.reflections = reflectionsRes.data;
      if (courseReflectionsRes && courseReflectionsRes.success) {
        this.state.courseReflections = courseReflectionsRes.data;
      }
      if (statsRes.success) this.state.stats = statsRes.data;

      this.updateBadgesAndHeader();
    } catch (error) {
      console.error('Gagal mengambil data portofolio:', error);
      this.showToast('Gagal memuat data dari server.', 'error');
    }
  }

  updateBadgesAndHeader() {
    const profile = this.state.profile;
    if (profile) {
      const topLptk = document.getElementById('top-lptk-badge');
      if (topLptk) topLptk.innerHTML = `<i class="fa-solid fa-graduation-cap mr-1 text-sky-400"></i> LPTK: ${profile.lptk}`;

      const topSekolah = document.getElementById('top-sekolah-badge');
      if (topSekolah) topSekolah.innerHTML = `<i class="fa-solid fa-school mr-1 text-sky-400"></i> Mitra: ${profile.sekolah_mitra}`;

      const footerLptk = document.getElementById('footer-lptk');
      if (footerLptk) footerLptk.innerHTML = `<i class="fa-solid fa-building-columns text-sky-600 mr-2"></i> ${profile.lptk}`;

      const footerSekolah = document.getElementById('footer-sekolah');
      if (footerSekolah) footerSekolah.innerHTML = `<i class="fa-solid fa-school text-sky-600 mr-2"></i> ${profile.sekolah_mitra}`;

      const footerKontak = document.getElementById('footer-kontak');
      if (footerKontak) footerKontak.innerHTML = `<i class="fa-solid fa-envelope text-sky-600 mr-2"></i> ${profile.email}`;
    }

    const badgeTotal = document.getElementById('badge-total-artifak');
    if (badgeTotal) badgeTotal.textContent = this.state.artifacts.length;

    // Pengaturan Tombol Tambah berdasarkan Environment (Development vs Production)
    const btnHeaderAdd = document.getElementById('btn-header-add-artifact');
    const btnMobileAdd = document.getElementById('btn-mobile-add-artifact');

    if (this.state.isDevelopment) {
      if (btnHeaderAdd) btnHeaderAdd.style.display = 'inline-flex';
      if (btnMobileAdd) btnMobileAdd.style.display = 'flex';
    } else {
      if (btnHeaderAdd) btnHeaderAdd.style.display = 'none';
      if (btnMobileAdd) btnMobileAdd.style.display = 'none';
    }
  }

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'beranda';
    const mainApp = document.getElementById('app');
    this.state.currentRoute = hash;

    // Update active class pada navigasi
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${hash}`) {
        link.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (hash === 'beranda') {
      mainApp.innerHTML = window.HomeView.render(this.state.profile, this.state.stats);
    } else if (hash === 'artifak') {
      mainApp.innerHTML = window.ArtifactView.render(this.state.filteredArtifacts);
    } else if (hash === 'refleksi') {
      mainApp.innerHTML = window.ReflectionView.render(this.state.reflections, this.state.courseReflections);
    } else {
      mainApp.innerHTML = window.HomeView.render(this.state.profile, this.state.stats);
    }
  }

  // Filter Artifak berdasarkan Kategori
  filterArtifactCategory(cat) {
    window.ArtifactView.activeCategory = cat;
    this.applyArtifactFilters();
  }

  // Pencarian Artifak
  searchArtifacts(query) {
    window.ArtifactView.searchQuery = query.toLowerCase();
    this.applyArtifactFilters();
  }

  applyArtifactFilters() {
    const cat = window.ArtifactView.activeCategory;
    const q = window.ArtifactView.searchQuery;

    this.state.filteredArtifacts = this.state.artifacts.filter(art => {
      const matchCat = (cat === 'semua') || (art.kategori === cat);
      const matchQ = !q || (
        (art.judul && art.judul.toLowerCase().includes(q)) ||
        (art.deskripsi_singkat && art.deskripsi_singkat.toLowerCase().includes(q)) ||
        (art.kajian_teori && art.kajian_teori.toLowerCase().includes(q)) ||
        (art.kelas_target && art.kelas_target.toLowerCase().includes(q))
      );
      return matchCat && matchQ;
    });

    const mainApp = document.getElementById('app');
    if (this.state.currentRoute === 'artifak') {
      mainApp.innerHTML = window.ArtifactView.render(this.state.filteredArtifacts);
      
      const searchInput = document.getElementById('search-artifact-input');
      if (searchInput && q) {
        searchInput.focus();
        searchInput.selectionStart = searchInput.selectionEnd = searchInput.value.length;
      }
    }
  }

  // Tab Refleksi
  switchReflectionTab(tab) {
    window.ReflectionView.activeTab = tab;
    const mainApp = document.getElementById('app');
    if (this.state.currentRoute === 'refleksi') {
      mainApp.innerHTML = window.ReflectionView.render(this.state.reflections, this.state.courseReflections);
    }
  }

  // Filter Semester Refleksi Mata Kuliah
  filterCourseSemester(semester) {
    window.ReflectionView.activeSemester = semester;
    const mainApp = document.getElementById('app');
    if (this.state.currentRoute === 'refleksi') {
      mainApp.innerHTML = window.ReflectionView.render(this.state.reflections, this.state.courseReflections);
    }
  }

  // ==================== MODAL MANAGEMENT ====================

  openArtifactDetail(id) {
    const artifact = this.state.artifacts.find(a => a.id === id);
    if (!artifact) return;

    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = window.ModalView.renderArtifactDetail(artifact);
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  openAddArtifactModal() {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = window.ModalView.renderAddArtifactForm();
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  openEditArtifactModal(id) {
    const artifact = this.state.artifacts.find(a => a.id === id);
    if (!artifact) return;

    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = window.ModalView.renderEditArtifactForm(artifact);
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  // Modal Edit Profil Calon Guru
  openEditProfileModal() {
    if (!this.state.profile) return;
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = window.ModalView.renderEditProfileModal(this.state.profile);
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  openAddCourseReflectionModal() {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = window.ModalView.renderAddCourseReflectionForm();
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  openEditCourseReflectionModal(id) {
    const cr = this.state.courseReflections.find(c => c.id === id);
    if (!cr) return;

    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = window.ModalView.renderEditCourseReflectionForm(cr);
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  openCourseReflectionDetail(id) {
    const cr = this.state.courseReflections.find(c => c.id === id);
    if (!cr) return;

    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = window.ModalView.renderCourseReflectionDetail(cr);
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  // Modal Edit Refleksi Utama (KHD, Model Guru, Refleksi Akhir)
  openEditReflectionModal(id) {
    const ref = this.state.reflections.find(r => r.id === id);
    if (!ref) return;

    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = window.ModalView.renderEditReflectionForm(ref);
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  // Modal Pusat Cadangan Data (Backup & Restore)
  async openBackupModal() {
    try {
      const res = await fetch('/api/backup/list');
      const json = await res.json();
      const backups = json.success ? json.data : [];

      const modalContainer = document.getElementById('modal-container');
      const modalContent = document.getElementById('modal-content');
      modalContent.innerHTML = window.ModalView.renderBackupModal(backups);
      modalContainer.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    } catch (err) {
      console.error('Error opening backup modal:', err);
      this.showToast('Gagal memuat riwayat cadangan.', 'error');
    }
  }

  // Buat snapshot instan di server
  async createManualBackup() {
    try {
      const res = await fetch('/api/backup/create', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        this.showToast('Snapshot cadangan baru berhasil dibuat!', 'success');
        this.openBackupModal();
      } else {
        this.showToast(json.message || 'Gagal membuat cadangan.', 'error');
      }
    } catch (err) {
      this.showToast('Gagal menghubungi server.', 'error');
    }
  }

  // Pulihkan data dari unggahan berkas JSON
  async restoreBackupFromFile(e) {
    e.preventDefault();
    if (!confirm('Peringatan: Memulihkan data akan menggantikan data yang saat ini tampil dengan isi file cadangan. Lanjutkan?')) {
      return;
    }

    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();

      if (json.success) {
        this.showToast('Data berhasil dipulihkan secara utuh!', 'success');
        this.closeModal();
        await this.fetchInitialData();
        this.handleRoute();
      } else {
        this.showToast(json.message || 'Gagal memulihkan data.', 'error');
      }
    } catch (err) {
      console.error('Restore error:', err);
      this.showToast('Terjadi kesalahan saat memulihkan berkas.', 'error');
    }
  }

  // Pulihkan data dari berkas cadangan di server
  async restoreBackupFromServer(filename) {
    if (!confirm(`Apakah Anda yakin ingin memulihkan data dari snapshot "${filename}"?`)) {
      return;
    }

    try {
      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backup_filename: filename })
      });
      const json = await res.json();

      if (json.success) {
        this.showToast(json.message || 'Data berhasil dipulihkan!', 'success');
        this.closeModal();
        await this.fetchInitialData();
        this.handleRoute();
      } else {
        this.showToast(json.message || 'Gagal memulihkan snapshot.', 'error');
      }
    } catch (err) {
      this.showToast('Gagal memulihkan snapshot.', 'error');
    }
  }

  closeModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // ==================== FORM SUBMISSIONS ====================

  // Tambah Artifak
  async submitAddArtifact(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/artifacts', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        this.showToast('Artifak berhasil ditambahkan!', 'success');
        this.closeModal();
        await this.fetchInitialData();
        if (this.state.currentRoute !== 'artifak') {
          window.location.hash = '#artifak';
        } else {
          this.applyArtifactFilters();
        }
      } else {
        this.showToast(data.message || 'Gagal menyimpan artifak.', 'error');
      }
    } catch (error) {
      console.error('Error submitting artifact:', error);
      this.showToast('Terjadi gangguan jaringan saat menyimpan.', 'error');
    }
  }

  // Edit Artifak
  async submitEditArtifact(e, id) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch(`/api/artifacts/${id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        this.showToast('Artifak berhasil diperbarui!', 'success');
        this.closeModal();
        await this.fetchInitialData();
        if (this.state.currentRoute === 'artifak') {
          this.applyArtifactFilters();
        }
      } else {
        this.showToast(data.message || 'Gagal memperbarui artifak.', 'error');
      }
    } catch (error) {
      console.error('Error updating artifact:', error);
      this.showToast('Gagal menghubungi server.', 'error');
    }
  }

  // Hapus Artifak
  async deleteArtifact(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus artifak bukti mengajar ini?')) return;

    try {
      const res = await fetch(`/api/artifacts/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        this.showToast('Artifak berhasil dihapus.', 'success');
        this.closeModal();
        await this.fetchInitialData();
        this.applyArtifactFilters();
      } else {
        this.showToast(data.message || 'Gagal menghapus.', 'error');
      }
    } catch (error) {
      console.error('Error deleting artifact:', error);
      this.showToast('Gagal menghubungi server.', 'error');
    }
  }

  // Tambah Refleksi Pengalaman Belajar Mata Kuliah
  async submitAddCourseReflection(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/course-reflections', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        this.showToast('Refleksi mata kuliah berhasil ditambahkan!', 'success');
        this.closeModal();
        await this.fetchInitialData();
        window.ReflectionView.activeTab = 'refleksi_pengalaman_belajar';
        if (this.state.currentRoute !== 'refleksi') {
          window.location.hash = '#refleksi';
        } else {
          const mainApp = document.getElementById('app');
          mainApp.innerHTML = window.ReflectionView.render(this.state.reflections, this.state.courseReflections);
        }
      } else {
        this.showToast(data.message || 'Gagal menyimpan refleksi mata kuliah.', 'error');
      }
    } catch (error) {
      console.error('Error submitting course reflection:', error);
      this.showToast('Terjadi gangguan jaringan saat menyimpan berkas.', 'error');
    }
  }

  // Edit Refleksi Pengalaman Belajar Mata Kuliah
  async submitEditCourseReflection(e, id) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch(`/api/course-reflections/${id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        this.showToast('Refleksi mata kuliah berhasil diperbarui!', 'success');
        this.closeModal();
        await this.fetchInitialData();
        const mainApp = document.getElementById('app');
        if (this.state.currentRoute === 'refleksi') {
          mainApp.innerHTML = window.ReflectionView.render(this.state.reflections, this.state.courseReflections);
        }
      } else {
        this.showToast(data.message || 'Gagal memperbarui refleksi.', 'error');
      }
    } catch (error) {
      console.error('Error updating course reflection:', error);
      this.showToast('Gagal menghubungi server.', 'error');
    }
  }

  // Hapus Refleksi Pengalaman Belajar Mata Kuliah
  async deleteCourseReflection(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan refleksi mata kuliah ini?')) return;

    try {
      const res = await fetch(`/api/course-reflections/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        this.showToast('Refleksi mata kuliah berhasil dihapus.', 'success');
        this.closeModal();
        await this.fetchInitialData();
        const mainApp = document.getElementById('app');
        if (this.state.currentRoute === 'refleksi') {
          mainApp.innerHTML = window.ReflectionView.render(this.state.reflections, this.state.courseReflections);
        }
      } else {
        this.showToast(data.message || 'Gagal menghapus.', 'error');
      }
    } catch (error) {
      console.error('Error deleting course reflection:', error);
      this.showToast('Gagal menghubungi server.', 'error');
    }
  }

  // Edit Refleksi Utama (KHD, Model Guru, Refleksi Akhir)
  async submitEditReflection(e, id) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/reflections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        this.showToast('Lembar refleksi berhasil diperbarui!', 'success');
        this.closeModal();
        await this.fetchInitialData();
        const mainApp = document.getElementById('app');
        if (this.state.currentRoute === 'refleksi') {
          mainApp.innerHTML = window.ReflectionView.render(this.state.reflections, this.state.courseReflections);
        }
      } else {
        this.showToast(data.message || 'Gagal memperbarui refleksi.', 'error');
      }
    } catch (error) {
      console.error('Error updating reflection:', error);
      this.showToast('Gagal menghubungi server.', 'error');
    }
  }

  // Edit Profil & Foto Calon Guru
  async submitEditProfile(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('btn-submit-edit-profile');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        this.showToast('Profil dan foto berhasil diperbarui!', 'success');
        this.closeModal();
        await this.fetchInitialData();
        this.updateBadgesAndHeader();
        const mainApp = document.getElementById('app');
        if (this.state.currentRoute === 'beranda') {
          mainApp.innerHTML = window.HomeView.render(this.state.profile, this.state.stats);
        }
      } else {
        this.showToast(data.message || 'Gagal memperbarui profil.', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showToast('Gagal menghubungi server.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan';
      }
    }
  }

  // Toast Notifikasi
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast) return;

    toastMsg.textContent = message;
    if (type === 'success') {
      toastIcon.className = 'fa-solid fa-circle-check text-emerald-400 text-lg';
    } else {
      toastIcon.className = 'fa-solid fa-circle-exclamation text-rose-400 text-lg';
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
  }
}

// Inisialisasi Aplikasi saat DOM Siap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
