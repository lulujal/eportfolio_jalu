// homeView.js - Menampilkan Beranda (Profil, Kontak, Pengantar E-Portfolio, Statistik)

window.HomeView = {
  render(profile, stats) {
    if (!profile) {
      return `
        <div class="max-w-4xl mx-auto py-12 text-center">
          <p class="text-slate-500">Memuat profil calon guru...</p>
        </div>
      `;
    }

    const isDev = window.app && window.app.state ? window.app.state.isDevelopment : true;

    return `
      <!-- Hero Header & Academic Profile Card -->
      <section class="bg-gradient-to-b from-sky-50 via-white to-slate-50 pt-10 pb-16 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Foto & Kartu Identitas Resmi -->
            <div class="lg:col-span-4">
              <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-sky-700 to-primary-900"></div>
                
                <!-- Avatar Profil -->
                <div class="relative z-10 mx-auto w-32 h-32 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-slate-100 mt-4 mb-3 group">
                  <img src="${profile.foto_url}" alt="${profile.nama}" class="w-full h-full object-cover object-center" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'">
                  ${isDev ? `
                  <button onclick="window.app.openEditProfileModal()" title="Ubah Foto Profil"
                    class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold gap-1 cursor-pointer">
                    <i class="fa-solid fa-camera text-xl"></i>
                    <span>Ubah Foto</span>
                  </button>` : ''}
                </div>

                ${isDev ? `
                <div class="relative z-10 mb-3">
                  <button onclick="window.app.openEditProfileModal()" 
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-semibold transition shadow-sm">
                    <i class="fa-solid fa-camera"></i> Ubah Foto / Profil
                  </button>
                </div>
                ` : ''}

                <div class="relative z-10">
                  <h1 class="text-xl font-bold font-serif text-slate-900 leading-snug">
                    ${profile.nama}
                  </h1>
                  <p class="text-xs font-semibold text-sky-700 mt-1 uppercase tracking-wide">
                    ${profile.gelar}
                  </p>
                  
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono mt-3 border border-slate-200">
                    <i class="fa-solid fa-id-card text-sky-600"></i> NIM: ${profile.nim}
                  </div>

                  <!-- Detail Institusi -->
                  <div class="mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs text-slate-600">
                    <div class="flex items-start gap-2.5">
                      <i class="fa-solid fa-graduation-cap text-sky-600 mt-0.5 w-4"></i>
                      <div>
                        <span class="block font-semibold text-slate-900">LPTK Penyelenggara</span>
                        <span>${profile.lptk}</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5">
                      <i class="fa-solid fa-book text-sky-600 mt-0.5 w-4"></i>
                      <div>
                        <span class="block font-semibold text-slate-900">Program Studi / Bidang</span>
                        <span>${profile.prodi}</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5">
                      <i class="fa-solid fa-school text-sky-600 mt-0.5 w-4"></i>
                      <div>
                        <span class="block font-semibold text-slate-900">Sekolah Mitra PPL</span>
                        <span>${profile.sekolah_mitra}</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5">
                      <i class="fa-solid fa-user-tie text-sky-600 mt-0.5 w-4"></i>
                      <div>
                        <span class="block font-semibold text-slate-900">Guru Pamong</span>
                        <span>${profile.guru_pamong}</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5">
                      <i class="fa-solid fa-chalkboard-user text-sky-600 mt-0.5 w-4"></i>
                      <div>
                        <span class="block font-semibold text-slate-900">Dosen Pembimbing Lapangan</span>
                        <span>${profile.dosen_pembimbing}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Kontak Resmi Calon Guru -->
                  <div class="mt-6 pt-5 border-t border-slate-100 flex justify-center gap-3">
                    <a href="mailto:${profile.email}" title="Kirim Email" class="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition flex items-center justify-center text-sm border border-sky-200">
                      <i class="fa-solid fa-envelope"></i>
                    </a>
                    <a href="https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" title="WhatsApp" class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition flex items-center justify-center text-sm border border-emerald-200">
                      <i class="fa-brands fa-whatsapp"></i>
                    </a>
                    <a href="${profile.linkedin}" target="_blank" title="LinkedIn" class="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition flex items-center justify-center text-sm border border-blue-200">
                      <i class="fa-brands fa-linkedin-in"></i>
                    </a>
                  </div>

                </div>
              </div>
            </div>

            <!-- Konten Utama Beranda: Pengantar E-Portfolio & Visi -->
            <div class="lg:col-span-8 space-y-6">
              
              <!-- Badge Sambutan -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  <i class="fa-solid fa-award mr-1.5"></i> Praktik Pengalaman Lapangan (PPL) Mandiri
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <i class="fa-regular fa-calendar-check mr-1.5"></i> ${profile.periode_ppl}
                </span>
              </div>

              <!-- Pengantar E-Portfolio (Rubrik Beranda 20 Poin) -->
              <div class="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm relative">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                    <i class="fa-solid fa-pen-nib text-lg"></i>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold font-serif text-slate-900">Pengantar E-Portfolio</h2>
                    <p class="text-xs text-slate-500">Tujuan, Orientasi Pembelajaran, dan Akuntabilitas Profesional</p>
                  </div>
                </div>

                <div class="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
                  <p class="whitespace-pre-line">${profile.sambutan_pengantar}</p>
                </div>
              </div>

              <!-- Visi Pribadi Guru -->
              <div class="bg-gradient-to-br from-primary-900 to-slate-900 rounded-2xl p-7 text-white shadow-lg relative overflow-hidden">
                <div class="absolute -right-8 -bottom-8 opacity-10 text-white text-9xl">
                  <i class="fa-solid fa-quote-right"></i>
                </div>
                
                <div class="relative z-10">
                  <div class="flex items-center gap-2 mb-3 text-sky-300 text-xs font-bold uppercase tracking-wider">
                    <i class="fa-solid fa-compass"></i>
                    <span>Visi Calon Guru Profesional</span>
                  </div>
                  <blockquote class="font-serif italic text-base sm:text-lg leading-relaxed text-slate-100 mb-4">
                    "${profile.visi_guru}"
                  </blockquote>
                  <div class="flex items-center gap-2 text-xs text-sky-200/80">
                    <i class="fa-solid fa-seedling text-emerald-400"></i>
                    <span>Berorientasi pada Filosofi Pendidikan Ki Hadjar Dewantara</span>
                  </div>
                </div>
              </div>

              <!-- Kartu Statistik Pencapaian PPL Mandiri -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div class="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <div class="text-2xl sm:text-3xl font-extrabold text-sky-700 font-serif">
                    ${profile.total_jam_praktek || 288}
                  </div>
                  <div class="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Jam Praktik</div>
                  <div class="text-[11px] text-slate-400 mt-0.5">Terbimbing & Mandiri</div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-serif">
                    ${stats ? stats.totalArtifacts : 5}
                  </div>
                  <div class="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Artifak Teruji</div>
                  <div class="text-[11px] text-slate-400 mt-0.5">5 Kategori Rubrik</div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <div class="text-2xl sm:text-3xl font-extrabold text-purple-600 font-serif">
                    ${stats ? stats.totalReflections : 3}
                  </div>
                  <div class="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Pilar Refleksi</div>
                  <div class="text-[11px] text-slate-400 mt-0.5">KHD, Model & RTL</div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <div class="text-2xl sm:text-3xl font-extrabold text-amber-500 font-serif">
                    A
                  </div>
                  <div class="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Predikat PPL</div>
                  <div class="text-[11px] text-emerald-600 font-semibold mt-0.5">Sangat Baik</div>
                </div>

              </div>

              <!-- Quick Action Navigation -->
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <a href="#artifak" class="inline-flex items-center px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-md shadow-sky-600/30 transition gap-2">
                  <i class="fa-solid fa-folder-open"></i>
                  <span>Eksplorasi Artifak & Bukti Mengajar</span>
                  <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>
                <a href="#refleksi" class="inline-flex items-center px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-300 shadow-sm transition gap-2">
                  <i class="fa-solid fa-lightbulb text-amber-500"></i>
                  <span>Baca Refleksi & RTL</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      <!-- Seksi Ringkasan 4 Kategori Bukti Mengajar -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="text-xs font-bold tracking-wider text-sky-600 uppercase bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Cakupan Komprehensif
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-3">
            Struktur Bukti Mengajar PPL Mandiri
          </h2>
          <p class="text-sm text-slate-600 mt-2">
            Mewakili seluruh tahapan pembelajaran: perencanaan pembelajaran mendalam, inovasi media, hasil karya siswa, dan rekaman praktik kelas.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition group cursor-pointer" onclick="window.location.hash='#artifak'">
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition">
              <i class="fa-solid fa-file-lines"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm">RPP / Modul Ajar</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Perencanaan berorientasi Pembelajaran Mendalam (Deep Learning) berbasis Kurikulum Merdeka.</p>
          </div>

          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition group cursor-pointer" onclick="window.location.hash='#artifak'">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition">
              <i class="fa-solid fa-cubes"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm">Media Interaktif</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Inovasi LKPD dan perangkat simulasi media pembelajaran digital (TPACK).</p>
          </div>

          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition group cursor-pointer" onclick="window.location.hash='#artifak'">
            <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm">Hasil Karya Siswa</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Artefak asesmen autentik HOTS dan portofolio proyek murid.</p>
          </div>

          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition group cursor-pointer" onclick="window.location.hash='#artifak'">
            <div class="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition">
              <i class="fa-solid fa-video"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm">Video Praktik</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Rekaman interaksi kelas dan sintaks Problem-Based Learning.</p>
          </div>

        </div>
      </section>
    `;
  }
};
