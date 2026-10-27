// reflectionView.js - Menampilkan 4 Pilar Refleksi:
// 1. Model Guru yang Dituju
// 2. Filosofi Mengajar Ki Hadjar Dewantara
// 3. Refleksi Akhir PPL Mandiri (Kekuatan, Kelemahan, RTL)
// 4. Refleksi Pengalaman Belajar Mata Kuliah 2 Semester (dengan PDF Upload & CRUD)

window.ReflectionView = {
  activeTab: 'semua', // 'semua', 'model_guru_tujuan', 'filosofi_mengajar', 'refleksi_akhir_ppl', 'refleksi_pengalaman_belajar'
  activeSemester: 'semua', // 'semua', 'Semester 1', 'Semester 2'

  render(reflections, courseReflections = []) {
    const isDev = window.app && window.app.state ? window.app.state.isDevelopment : true;
    const pillarMeta = {
      'model_guru_tujuan': {
        title: 'Model Guru yang Dituju',
        icon: 'fa-user-graduate',
        color: 'sky',
        desc: 'Konsepsi ideal sosok pendidik abad ke-21 yang transformatif, adaptif, dan berintegritas.'
      },
      'filosofi_mengajar': {
        title: 'Filosofi Mengajar (KHD)',
        icon: 'fa-seedling',
        color: 'emerald',
        desc: 'Internalisasi nilai luhur Ki Hadjar Dewantara: Menuntun kodrat dan memerdekakan akal budi murid.'
      },
      'refleksi_akhir_ppl': {
        title: 'Refleksi Akhir PPL & RTL',
        icon: 'fa-chart-line',
        color: 'purple',
        desc: 'Telaah kritis pengalaman lapangan: Pemetaan kekuatan diri, kelemahan, serta rencana aksi nyata (RTL).'
      }
    };

    // Filter course reflections berdasarkan semester jika dipilih
    const filteredCourses = courseReflections.filter(c => {
      if (this.activeSemester === 'semua') return true;
      return c.semester === this.activeSemester;
    });

    const isLearningReflectionTab = this.activeTab === 'refleksi_pengalaman_belajar';
    const showPillars = this.activeTab === 'semua' || ['model_guru_tujuan', 'filosofi_mengajar', 'refleksi_akhir_ppl'].includes(this.activeTab);

    return `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- Header Refleksi -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <i class="fa-solid fa-graduation-cap"></i> Refleksi & Pengembangan Diri
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Refleksi Filosofis & Pengalaman Belajar
            </h1>
            <p class="text-sm text-slate-600 mt-1 max-w-2xl">
              Ruang kontemplasi kritis calon guru mencakup filosofi KHD, model guru yang dituju, evaluasi PPL mandiri, serta refleksi bermakna per mata kuliah 2 semester.
            </p>
          </div>

          <div class="flex items-center gap-2">
            ${isDev ? `
              <button onclick="window.app.openAddCourseReflectionModal()" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition flex items-center gap-2">
                <i class="fa-solid fa-plus"></i>
                <span>Tambah Refleksi MK</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Tab Navigasi Refleksi -->
        <div class="my-8 flex flex-wrap gap-2">
          <button onclick="window.app.switchReflectionTab('semua')" class="px-4 py-2 rounded-xl text-xs font-semibold transition ${this.activeTab === 'semua' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
            Semua Catatan Refleksi
          </button>
          <button onclick="window.app.switchReflectionTab('model_guru_tujuan')" class="px-4 py-2 rounded-xl text-xs font-semibold transition ${this.activeTab === 'model_guru_tujuan' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
            <i class="fa-solid fa-user-graduate mr-1.5 text-sky-500"></i> Model Guru yang Dituju
          </button>
          <button onclick="window.app.switchReflectionTab('filosofi_mengajar')" class="px-4 py-2 rounded-xl text-xs font-semibold transition ${this.activeTab === 'filosofi_mengajar' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
            <i class="fa-solid fa-seedling mr-1.5 text-emerald-500"></i> Filosofi Mengajar KHD
          </button>
          <button onclick="window.app.switchReflectionTab('refleksi_akhir_ppl')" class="px-4 py-2 rounded-xl text-xs font-semibold transition ${this.activeTab === 'refleksi_akhir_ppl' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
            <i class="fa-solid fa-chart-line mr-1.5 text-purple-500"></i> Refleksi Akhir & RTL
          </button>
          <button onclick="window.app.switchReflectionTab('refleksi_pengalaman_belajar')" class="px-4 py-2 rounded-xl text-xs font-semibold transition ${this.activeTab === 'refleksi_pengalaman_belajar' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'}">
            <i class="fa-solid fa-graduation-cap mr-1.5 text-indigo-500"></i> Refleksi Pengalaman Belajar
            <span class="ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${this.activeTab === 'refleksi_pengalaman_belajar' ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-800'} font-bold">
              ${courseReflections.length} MK
            </span>
          </button>
        </div>

        <!-- 1. Refleksi Pengalaman Belajar Per-Card (Jika tab 'refleksi_pengalaman_belajar' atau ditampilkan di bawah) -->
        ${isLearningReflectionTab ? `
          <div class="mb-14">
            
            <!-- Filter Semester & Info -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 mb-8">
              <div>
                <h3 class="font-serif font-bold text-indigo-950 text-lg flex items-center gap-2">
                  <i class="fa-solid fa-layer-group text-indigo-600"></i> Refleksi Mata Kuliah 2 Semester
                </h3>
                <p class="text-xs text-indigo-800/80 mt-1">
                  Mendokumentasikan telaah pengalaman belajar, artefak unggulan, pemaknaan, dan berkas PDF per mata kuliah.
                </p>
              </div>

              <!-- Filter Semester Pills -->
              <div class="flex items-center gap-2 bg-white p-1 rounded-xl border border-indigo-200 shadow-sm shrink-0">
                <button onclick="window.app.filterCourseSemester('semua')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition ${this.activeSemester === 'semua' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}">
                  Semua Semester (${courseReflections.length})
                </button>
                <button onclick="window.app.filterCourseSemester('Semester 1')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition ${this.activeSemester === 'Semester 1' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}">
                  Semester 1 (${courseReflections.filter(c => c.semester === 'Semester 1').length})
                </button>
                <button onclick="window.app.filterCourseSemester('Semester 2')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition ${this.activeSemester === 'Semester 2' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}">
                  Semester 2 (${courseReflections.filter(c => c.semester === 'Semester 2').length})
                </button>
              </div>
            </div>

            <!-- Grid Kartu Refleksi Mata Kuliah -->
            ${filteredCourses.length > 0 ? `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${filteredCourses.map(cr => `
                  <div class="academic-card bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    
                    <div>
                      <!-- Semester & SKS Badges -->
                      <div class="flex items-center justify-between gap-2 mb-3">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cr.semester === 'Semester 1' ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                            <i class="fa-solid fa-calendar-check mr-1 text-[10px]"></i> ${cr.semester}
                          </span>
                          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            ${cr.sks} SKS
                          </span>
                        </div>
                        ${cr.kode_mk ? `
                          <span class="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                            ${cr.kode_mk}
                          </span>
                        ` : ''}
                      </div>

                      <!-- Judul Mata Kuliah -->
                      <h3 class="text-base font-bold font-serif text-slate-900 leading-snug hover:text-indigo-600 transition">
                        ${cr.nama_mata_kuliah}
                      </h3>

                      ${cr.dosen_pengampu ? `
                        <p class="text-xs text-slate-500 mt-1 mb-3 flex items-center">
                          <i class="fa-solid fa-chalkboard-user mr-1.5 text-indigo-600"></i> ${cr.dosen_pengampu}
                        </p>
                      ` : '<div class="mb-3"></div>'}

                      <!-- Review Pengalaman Belajar -->
                      <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                        <div class="font-bold text-indigo-950 flex items-center gap-1.5">
                          <i class="fa-solid fa-book-open text-indigo-600 text-[11px]"></i>
                          <span>Pengalaman Belajar Bermakna:</span>
                        </div>
                        <p class="text-slate-600 leading-relaxed line-clamp-3">
                          ${cr.pengalaman_belajar}
                        </p>
                      </div>

                      <!-- Artefak Unggulan jika ada -->
                      ${cr.artefak_pembelajaran ? `
                        <div class="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-[11px] text-slate-700 mb-3">
                          <span class="font-bold text-amber-900 block mb-0.5 flex items-center gap-1">
                            <i class="fa-solid fa-award text-amber-600 text-xs"></i> Artefak Pembelajaran:
                          </span>
                          <p class="line-clamp-2 text-slate-600 italic">
                            ${cr.artefak_pembelajaran}
                          </p>
                        </div>
                      ` : ''}

                      <!-- Lampiran Dokumen PDF -->
                      <div class="pt-2 pb-1">
                        ${cr.pdf_file_url ? `
                          <a href="${cr.pdf_file_url}" target="_blank" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 transition" title="Buka Dokumen PDF">
                            <i class="fa-solid fa-file-pdf text-red-600 text-sm"></i>
                            <span class="truncate max-w-[200px] sm:max-w-[260px]">${cr.pdf_file_nama || 'Dokumen Refleksi PDF'}</span>
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-red-500"></i>
                          </a>
                        ` : `
                          <span class="text-[11px] text-slate-400 italic flex items-center gap-1">
                            <i class="fa-regular fa-file"></i> Belum ada dokumen PDF dilampirkan
                          </span>
                        `}
                      </div>

                    </div>

                    <!-- Action Buttons: Detail, Edit, Hapus -->
                    <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button onclick="window.app.openCourseReflectionDetail(${cr.id})" class="flex-1 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition border border-indigo-200 flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-eye text-xs"></i>
                        <span>Lihat Refleksi Penuh</span>
                      </button>

                      ${isDev ? `
                        <button onclick="window.app.openEditCourseReflectionModal(${cr.id})" class="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-xs transition border border-amber-200 flex items-center justify-center gap-1.5" title="Edit Data Refleksi MK">
                          <i class="fa-solid fa-pen-to-square text-xs"></i>
                          <span>Edit</span>
                        </button>

                        <button onclick="window.app.deleteCourseReflection(${cr.id})" class="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition border border-red-200" title="Hapus Refleksi MK">
                          <i class="fa-regular fa-trash-can text-xs"></i>
                        </button>
                      ` : ''}
                    </div>

                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <div class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl mx-auto mb-3">
                  <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-sm">Belum ada refleksi untuk semester ini</h4>
                <p class="text-xs text-slate-500 mt-1 mb-4">Tambahkan refleksi pengalaman belajar mata kuliah beserta berkas PDF.</p>
                ${isDev ? `
                  <button onclick="window.app.openAddCourseReflectionModal()" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                    + Tambah Refleksi MK
                  </button>
                ` : ''}
              </div>
            `}

          </div>
        ` : ''}

        <!-- 2. Tiga Pilar Refleksi Utama (KHD, Model Guru, Refleksi Akhir PPL) -->
        ${showPillars ? `
          <div class="space-y-12">
            ${reflections
              .filter(r => this.activeTab === 'semua' || r.kategori === this.activeTab)
              .map(ref => {
                const meta = pillarMeta[ref.kategori] || { title: ref.judul, icon: 'fa-book', color: 'sky', desc: '' };
                let points = [];
                try {
                  if (ref.poin_utama) {
                    if (typeof ref.poin_utama === 'string' && ref.poin_utama.trim().startsWith('[')) {
                      points = JSON.parse(ref.poin_utama);
                    } else if (typeof ref.poin_utama === 'string') {
                      points = ref.poin_utama.split('\n').map(p => p.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
                    }
                  }
                } catch (e) {
                  points = typeof ref.poin_utama === 'string' ? ref.poin_utama.split('\n').filter(Boolean) : [];
                }

                return `
                  <article class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    
                    <!-- Banner / Top Info -->
                    <div class="bg-gradient-to-r from-slate-900 to-primary-900 p-6 sm:p-8 text-white">
                      <div class="flex items-center justify-between gap-2 mb-3">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-200 border border-white/20">
                          <i class="fa-solid ${meta.icon} mr-1.5"></i> ${meta.title}
                        </span>

                        ${isDev ? `
                          <button onclick="window.app.openEditReflectionModal(${ref.id})" class="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-200 border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm" title="Edit Lembar Refleksi Ini">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                            <span>Edit Refleksi</span>
                          </button>
                        ` : ''}
                      </div>

                      <h2 class="text-xl sm:text-2xl font-bold font-serif leading-snug">
                        ${ref.judul}
                      </h2>
                      
                      ${ref.subjudul ? `
                        <p class="text-xs sm:text-sm text-sky-200/90 mt-1 font-light">
                          ${ref.subjudul}
                        </p>
                      ` : ''}

                      ${ref.kutipan_filosofis ? `
                        <div class="mt-4 pt-4 border-t border-white/15">
                          <blockquote class="italic font-serif text-xs sm:text-sm text-slate-200 leading-relaxed">
                            ${ref.kutipan_filosofis}
                          </blockquote>
                        </div>
                      ` : ''}
                    </div>

                    <!-- Isi Narasi Reflektif -->
                    <div class="p-6 sm:p-8 space-y-6">
                      
                      <!-- Narasi Pokok -->
                      <div class="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed">
                        <p class="whitespace-pre-line text-justify leading-relaxed">${ref.konten}</p>
                      </div>

                      <!-- Highlight Poin Inti -->
                      ${points.length > 0 ? `
                        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <i class="fa-solid fa-star text-amber-500"></i> Poin Kunci Esensial
                          </h4>
                          <ul class="space-y-1.5 text-xs text-slate-600">
                            ${points.map(pt => `
                              <li class="flex items-start gap-2">
                                <i class="fa-solid fa-circle-chevron-right text-sky-600 text-[11px] mt-0.5"></i>
                                <span>${pt}</span>
                              </li>
                            `).join('')}
                          </ul>
                        </div>
                      ` : ''}

                      <!-- Grid Kekuatan & Kelemahan -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        
                        <!-- Analisis Kekuatan Diri -->
                        <div class="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                          <div class="flex items-center gap-2 mb-3 text-emerald-800 font-bold text-sm">
                            <div class="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                              <i class="fa-solid fa-shield-halved"></i>
                            </div>
                            <h3>Analisis Kekuatan Diri (Strengths)</h3>
                          </div>
                          <div class="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                            ${ref.kekuatan || 'Menguasai materi dan mampu membangun kedekatan emosional yang sehat dengan peserta didik.'}
                          </div>
                        </div>

                        <!-- Analisis Kelemahan / Area Pertumbuhan -->
                        <div class="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                          <div class="flex items-center gap-2 mb-3 text-amber-800 font-bold text-sm">
                            <div class="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
                              <i class="fa-solid fa-compass-drafting"></i>
                            </div>
                            <h3>Area Pengembangan & Tantangan (Growth Areas)</h3>
                          </div>
                          <div class="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                            ${ref.kelemahan || 'Manajemen alokasi waktu pada saat kegiatan diskusi kelompok heterogen.'}
                          </div>
                        </div>

                      </div>

                      <!-- Rencana Tindak Lanjut / RTL -->
                      ${ref.rencana_tindak_lanjut ? `
                        <div class="rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50/60 to-sky-50/60 p-6">
                          <div class="flex items-center gap-2 mb-3 text-primary-900 font-bold text-sm">
                            <div class="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-xs">
                              <i class="fa-solid fa-route"></i>
                            </div>
                            <h3>Rencana Tindak Lanjut (RTL) Pengembangan Keprofesian Berkelanjutan</h3>
                          </div>
                          <div class="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                            ${ref.rencana_tindak_lanjut}
                          </div>
                        </div>
                      ` : ''}

                      ${isDev ? `
                        <div class="pt-4 border-t border-slate-100 flex justify-end">
                          <button onclick="window.app.openEditReflectionModal(${ref.id})" class="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                            <span>Edit Lembar Refleksi Ini</span>
                          </button>
                        </div>
                      ` : ''}

                    </div>

                  </article>
                `;
              }).join('')}
          </div>
        ` : ''}

        <!-- Di tab 'semua', tampilkan juga ringkasan preview Refleksi Pengalaman Belajar Mata Kuliah -->
        ${this.activeTab === 'semua' && courseReflections.length > 0 ? `
          <div class="mt-16 pt-10 border-t border-slate-200">
            <div class="flex items-center justify-between mb-6">
              <div>
                <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Refleksi Perkuliahan
                </span>
                <h3 class="font-serif font-bold text-slate-900 text-xl mt-2">
                  Refleksi Pengalaman Belajar Mata Kuliah (2 Semester)
                </h3>
                <p class="text-xs text-slate-500 mt-1">Dokumentasi artefak dan refleksi mendalam per mata kuliah.</p>
              </div>
              <button onclick="window.app.switchReflectionTab('refleksi_pengalaman_belajar')" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <span>Lihat Semua (${courseReflections.length} MK)</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${courseReflections.slice(0, 4).map(cr => `
                <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-indigo-300 transition">
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded ${cr.semester === 'Semester 1' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}">
                      ${cr.semester}
                    </span>
                    ${cr.pdf_file_url ? `
                      <span class="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                        <i class="fa-solid fa-file-pdf"></i> PDF Tersedia
                      </span>
                    ` : ''}
                  </div>
                  <h4 class="font-bold text-slate-900 text-sm font-serif line-clamp-1">${cr.nama_mata_kuliah}</h4>
                  <p class="text-xs text-slate-500 line-clamp-2 mt-1">${cr.pengalaman_belajar}</p>
                  <div class="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span class="text-slate-400 text-[11px]">${cr.sks} SKS</span>
                    <button onclick="window.app.openCourseReflectionDetail(${cr.id})" class="text-indigo-600 font-semibold hover:underline">
                      Detail Refleksi &rarr;
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </section>
    `;
  }
};
