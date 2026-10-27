// artifactView.js - Menampilkan Galeri Artifak / Bukti Mengajar & Akses Analisis Mendalam

window.ArtifactView = {
  activeCategory: 'semua',
  searchQuery: '',

  // Helper untuk mengekstrak URL thumbnail dari URL berkas/video/karya
  getThumbnailData(item) {
    const url = item.file_url || item.video_url || '';
    const defaultImgs = {
      'media': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      'hasil_siswa': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      'video_praktik': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
    };

    if (!url) {
      return {
        url: defaultImgs[item.kategori] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
        badgeText: item.kategori_label || 'Media Pembelajaran',
        icon: 'fa-solid fa-graduation-cap'
      };
    }

    // 1. YouTube Video
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return {
        url: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
        badgeText: 'YouTube',
        icon: 'fa-brands fa-youtube text-red-500'
      };
    }

    // 2. Google Drive (PDF / Image / Presentation di Drive)
    const driveMatch = url.match(/(?:file\/d\/|id=|open\?id=)([a-zA-Z0-9_-]{20,})/);
    if (driveMatch) {
      return {
        url: `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w600`,
        badgeText: 'Google Drive',
        icon: 'fa-brands fa-google-drive text-amber-400'
      };
    }

    // 3. Canva Presentation / Design
    if (url.includes('canva.link') || url.includes('canva.com')) {
      return {
        url: `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=600`,
        badgeText: 'Desain Canva',
        icon: 'fa-solid fa-palette text-pink-400'
      };
    }

    // 4. File Gambar Langsung atau Hasil Upload Lokal
    if (url.match(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i) || url.startsWith('/uploads/')) {
      return {
        url: url,
        badgeText: 'Gambar / Poster',
        icon: 'fa-regular fa-image text-emerald-400'
      };
    }

    // 5. Tautan Web Umum (Simulasi / Web App / dll.)
    return {
      url: `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=600`,
      badgeText: 'Aplikasi Web',
      icon: 'fa-solid fa-globe text-sky-400'
    };
  },

  render(artifacts) {
    const isDev = window.app && window.app.state ? window.app.state.isDevelopment : true;
    const categoryBadges = {
      'rpp': { label: 'RPP / Modul Ajar', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'fa-file-lines' },
      'media': { label: 'Media & Bahan Ajar', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'fa-cubes' },
      'hasil_siswa': { label: 'Contoh Hasil Kerja Siswa', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'fa-chart-pie' },
      'video_praktik': { label: 'Video Praktik Mengajar', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'fa-video' },
      'lainnya': { label: 'Dokumentasi Lainnya', bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'fa-folder' }
    };

    return `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- Header Halaman Artifak -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-2">
              <i class="fa-solid fa-graduation-cap"></i> Bukti Pembelajaran & Telaah Pedagogik
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Daftar Artifak & Bukti Mengajar
            </h1>
            <p class="text-sm text-slate-600 mt-1 max-w-2xl">
              Koleksi bukti otentik kegiatan PPL Mandiri yang dilengkapi telaah analisis mendalam (konteks, tujuan, kelebihan, kekurangan) dan integrasi kajian teori pedagogik.
            </p>
          </div>

          <div class="flex items-center gap-3">
            ${isDev ? `
              <button onclick="window.app.openAddArtifactModal()" class="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition flex items-center gap-2">
                <i class="fa-solid fa-plus"></i>
                <span>Tambah Bukti Baru</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Filter Kategori & Kotak Pencarian -->
        <div class="my-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <!-- Tombol Filter Kategori -->
          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button onclick="window.app.filterArtifactCategory('semua')" class="filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${this.activeCategory === 'semua' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
              Semua Artifak
            </button>
            <button onclick="window.app.filterArtifactCategory('rpp')" class="filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${this.activeCategory === 'rpp' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
              <i class="fa-solid fa-file-lines mr-1 text-blue-500"></i> RPP / Modul Ajar
            </button>
            <button onclick="window.app.filterArtifactCategory('media')" class="filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${this.activeCategory === 'media' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
              <i class="fa-solid fa-cubes mr-1 text-emerald-500"></i> Media Ajar
            </button>
            <button onclick="window.app.filterArtifactCategory('hasil_siswa')" class="filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${this.activeCategory === 'hasil_siswa' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
              <i class="fa-solid fa-chart-pie mr-1 text-amber-500"></i> Hasil Siswa
            </button>
            <button onclick="window.app.filterArtifactCategory('video_praktik')" class="filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${this.activeCategory === 'video_praktik' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
              <i class="fa-solid fa-video mr-1 text-rose-500"></i> Video Praktik
            </button>
          </div>

          <!-- Input Pencarian -->
          <div class="relative w-full md:w-72">
            <input type="text" id="search-artifact-input" value="${this.searchQuery}" oninput="window.app.searchArtifacts(this.value)" placeholder="Cari artifak, teori, materi..." class="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none transition">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
          </div>

        </div>

        <!-- Grid Kartu Artifak -->
        ${artifacts && artifacts.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${artifacts.map(item => {
              const badge = categoryBadges[item.kategori] || { label: item.kategori, bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'fa-folder' };
              const thumb = this.getThumbnailData(item);

              // Konfigurasi visual untuk kategori yang memiliki Thumbnail Header (Media Ajar, Hasil Siswa, Video Praktik)
              const visualConfigs = {
                'media': {
                  badgeBg: 'bg-emerald-600',
                  badgeText: 'Media Ajar',
                  badgeIcon: 'fa-solid fa-cubes',
                  actionText: 'Buka Media',
                  theoryTitle: 'Integrasi Teori & Media (TPACK):',
                  theoryBg: 'bg-emerald-50/70 border-emerald-200 text-slate-700',
                  theoryTitleColor: 'text-emerald-900',
                  theoryIconColor: 'text-emerald-600',
                  fallbackImg: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
                },
                'hasil_siswa': {
                  badgeBg: 'bg-amber-500',
                  badgeText: 'Hasil Siswa',
                  badgeIcon: 'fa-solid fa-chart-pie',
                  actionText: 'Buka Karya',
                  theoryTitle: 'Integrasi Teori & Asesmen:',
                  theoryBg: 'bg-amber-50/70 border-amber-200 text-slate-700',
                  theoryTitleColor: 'text-amber-900',
                  theoryIconColor: 'text-amber-600',
                  fallbackImg: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
                },
                'video_praktik': {
                  badgeBg: 'bg-rose-600',
                  badgeText: 'Video Praktik',
                  badgeIcon: 'fa-solid fa-video',
                  actionText: 'Tonton Video',
                  theoryTitle: 'Integrasi Teori & Model:',
                  theoryBg: 'bg-rose-50/70 border-rose-200 text-slate-700',
                  theoryTitleColor: 'text-rose-900',
                  theoryIconColor: 'text-rose-600',
                  fallbackImg: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
                }
              };

              const visualCfg = visualConfigs[item.kategori];

              // 1. Tampilan Visual Card dengan Thumbnail (Media Ajar, Hasil Kerja Siswa, Video Praktik)
              if (visualCfg) {
                return `
                  <div class="academic-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition">
                    
                    <!-- Thumbnail Header dari URL / Berkas -->
                    <div class="relative w-full h-48 bg-slate-900 overflow-hidden group/thumb">
                      <img src="${thumb.url}" alt="${item.judul}" 
                           class="w-full h-full object-cover group-hover/thumb:scale-105 transition duration-500" 
                           onerror="this.onerror=null; this.src='${visualCfg.fallbackImg}';">
                      
                      <!-- Overlay Gradient & Badge -->
                      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-black/20 flex flex-col justify-between p-3.5">
                        
                        <div class="flex items-center justify-between gap-2">
                          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${visualCfg.badgeBg} text-white shadow-sm">
                            <i class="${visualCfg.badgeIcon} mr-1.5"></i> ${visualCfg.badgeText}
                          </span>
                          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm border border-white/20">
                            <i class="${thumb.icon} mr-1.5"></i> ${thumb.badgeText}
                          </span>
                        </div>

                        <div class="flex items-center justify-between">
                          <span class="text-[11px] text-white/90 font-mono flex items-center drop-shadow">
                            <i class="fa-regular fa-calendar mr-1"></i> ${item.tanggal_kegiatan}
                          </span>
                          ${(item.file_url || item.video_url) ? `
                            <a href="${item.file_url || item.video_url}" target="_blank" 
                               class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md transition transform hover:scale-105 backdrop-blur-sm">
                              <span>${visualCfg.actionText}</span>
                              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </a>
                          ` : ''}
                        </div>

                      </div>
                    </div>

                    <!-- Body Card -->
                    <div class="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <h3 class="text-base font-bold font-serif text-slate-900 leading-snug line-clamp-2 hover:text-sky-700 transition">
                          ${item.judul}
                        </h3>

                        <div class="text-xs text-sky-700 font-medium mt-1 mb-3 flex items-center">
                          <i class="fa-solid fa-chalkboard-user mr-1.5 text-sky-600"></i> ${item.kelas_target}
                        </div>

                        <p class="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                          ${item.deskripsi_singkat}
                        </p>

                        <!-- Snippet Kajian Teori -->
                        <div class="p-3 rounded-xl ${visualCfg.theoryBg} border text-[11px] mb-4">
                          <span class="font-bold ${visualCfg.theoryTitleColor} block mb-0.5">
                            <i class="fa-solid fa-book-bookmark ${visualCfg.theoryIconColor} mr-1"></i> ${visualCfg.theoryTitle}
                          </span>
                          <p class="line-clamp-2 italic text-slate-600">
                            ${item.kajian_teori}
                          </p>
                        </div>

                        <!-- Checklist Rubrik Indicator -->
                        <div class="flex flex-wrap gap-1.5 text-[10px] text-slate-500 mb-4">
                          <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            <i class="fa-solid fa-check text-[9px] mr-1"></i> Konteks
                          </span>
                          <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            <i class="fa-solid fa-check text-[9px] mr-1"></i> Tujuan
                          </span>
                          <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            <i class="fa-solid fa-check text-[9px] mr-1"></i> Refleksi
                          </span>
                          <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            <i class="fa-solid fa-check text-[9px] mr-1"></i> Kajian Teori
                          </span>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button onclick="window.app.openArtifactDetail(${item.id})" class="flex-1 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs transition border border-sky-200 flex items-center justify-center gap-1.5" title="Lihat Analisis Mendalam">
                          <i class="fa-solid fa-microscope text-xs"></i>
                          <span>Analisis</span>
                        </button>

                        ${isDev ? `
                          <button onclick="window.app.openEditArtifactModal(${item.id})" class="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-xs transition border border-amber-200 flex items-center justify-center gap-1.5" title="Edit Data Artifak">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                            <span>Edit</span>
                          </button>
                        ` : ''}
                        
                        ${(item.file_url || item.video_url) ? `
                          <a href="${item.file_url || item.video_url}" target="_blank" title="Buka Tautan" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition border border-slate-200">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                          </a>
                        ` : ''}
                      </div>

                    </div>

                  </div>
                `;
              }

              // 2. Tampilan Kartu Artifak Standar Dokumen (RPP / Modul Ajar & Lainnya)
              return `
                <div class="academic-card bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between relative overflow-hidden">
                  
                  <!-- Top Badge & Info -->
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}">
                        <i class="fa-solid ${badge.icon} mr-1.5"></i> ${badge.label}
                      </span>
                      <span class="text-[11px] text-slate-400 font-mono">
                        <i class="fa-regular fa-calendar mr-1"></i> ${item.tanggal_kegiatan}
                      </span>
                    </div>

                    <h3 class="text-base font-bold font-serif text-slate-900 leading-snug line-clamp-2 hover:text-sky-700 transition">
                      ${item.judul}
                    </h3>

                    <div class="text-xs text-sky-700 font-medium mt-1 mb-3 flex items-center">
                      <i class="fa-solid fa-chalkboard-user mr-1.5 text-sky-600"></i> ${item.kelas_target}
                    </div>

                    <p class="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      ${item.deskripsi_singkat}
                    </p>

                    <!-- Snippet Kajian Teori -->
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 mb-4">
                      <span class="font-bold text-sky-900 block mb-0.5">
                        <i class="fa-solid fa-book-bookmark text-sky-600 mr-1"></i> Integrasi Teori:
                      </span>
                      <p class="line-clamp-2 italic text-slate-600">
                        ${item.kajian_teori}
                      </p>
                    </div>

                    <!-- Checklist Rubrik Indicator -->
                    <div class="flex flex-wrap gap-1.5 text-[10px] text-slate-500 mb-4">
                      <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        <i class="fa-solid fa-check text-[9px] mr-1"></i> Konteks
                      </span>
                      <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        <i class="fa-solid fa-check text-[9px] mr-1"></i> Tujuan
                      </span>
                      <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        <i class="fa-solid fa-check text-[9px] mr-1"></i> Kelebihan & Kekurangan
                      </span>
                      <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        <i class="fa-solid fa-check text-[9px] mr-1"></i> Kajian Teori
                      </span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button onclick="window.app.openArtifactDetail(${item.id})" class="flex-1 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs transition border border-sky-200 flex items-center justify-center gap-1.5" title="Lihat Analisis Mendalam">
                      <i class="fa-solid fa-microscope text-xs"></i>
                      <span>Analisis</span>
                    </button>

                    ${isDev ? `
                      <button onclick="window.app.openEditArtifactModal(${item.id})" class="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-xs transition border border-amber-200 flex items-center justify-center gap-1.5" title="Edit Data Artifak">
                        <i class="fa-solid fa-pen-to-square text-xs"></i>
                        <span>Edit</span>
                      </button>
                    ` : ''}
                    
                    ${item.file_url ? `
                      <a href="${item.file_url}" target="_blank" title="Buka Berkas / Tautan" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition border border-slate-200">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                      </a>
                    ` : ''}
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-4">
              <i class="fa-regular fa-folder-open"></i>
            </div>
            <h3 class="text-base font-bold text-slate-800">Tidak ada artifak ditemukan</h3>
            <p class="text-xs text-slate-500 mt-1 mb-4">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori bukti mengajar.
            </p>
            <button onclick="window.app.filterArtifactCategory('semua')" class="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold">
              Tampilkan Semua Bukti
            </button>
          </div>
        `}

      </section>
    `;
  }
};
