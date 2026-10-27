// modalView.js - Menangani dialog detail analisis artifak, form tambah/edit bukti, form refleksi mata kuliah, dan modal rubrik

window.ModalView = {
  // 1. Modal Detail Analisis Artifak (Konteks, Tujuan, Kelebihan, Kekurangan, Teori)
  renderArtifactDetail(artifact) {
    const isDev = window.app && window.app.state ? window.app.state.isDevelopment : true;
    const categoryBadges = {
      'rpp': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'fa-file-lines' },
      'media': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'fa-cubes' },
      'hasil_siswa': { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'fa-chart-pie' },
      'penilaian_supervisi': { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'fa-clipboard-check' },
      'video_praktik': { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'fa-video' }
    };

    const badge = categoryBadges[artifact.kategori] || { bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'fa-folder' };

    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <!-- Header Modal -->
        <div class="flex items-start justify-between pb-5 border-b border-slate-200 gap-4">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}">
                <i class="fa-solid ${badge.icon} mr-1.5"></i> ${artifact.kategori_label || artifact.kategori}
              </span>
              <span class="text-xs text-slate-500 flex items-center">
                <i class="fa-regular fa-calendar mr-1"></i> ${artifact.tanggal_kegiatan}
              </span>
              <span class="text-xs text-slate-500 flex items-center">
                <i class="fa-solid fa-chalkboard-user mr-1"></i> ${artifact.kelas_target}
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-tight">
              ${artifact.judul}
            </h2>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <!-- Ikhtisar Singkat -->
        <div class="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm italic">
          <i class="fa-solid fa-quote-left text-sky-600 mr-2 opacity-50"></i>
          ${artifact.deskripsi_singkat}
        </div>

        <!-- Konten Analisis Mendalam Sesuai Rubrik -->
        <div class="space-y-6 text-sm text-slate-700">
          
          <!-- 1. Konteks Pembelajaran -->
          <div class="rounded-xl border border-slate-200 p-5 bg-white shadow-sm">
            <div class="flex items-center gap-2 mb-3 text-sky-800 font-bold text-base">
              <div class="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs">
                <i class="fa-solid fa-compass"></i>
              </div>
              <h3>1. Konteks Pembelajaran</h3>
            </div>
            <p class="text-slate-600 leading-relaxed whitespace-pre-line">${artifact.konteks}</p>
          </div>

          <!-- 2. Tujuan & Capaian Pembelajaran -->
          <div class="rounded-xl border border-slate-200 p-5 bg-white shadow-sm">
            <div class="flex items-center gap-2 mb-3 text-sky-800 font-bold text-base">
              <div class="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs">
                <i class="fa-solid fa-bullseye"></i>
              </div>
              <h3>2. Tujuan & Sasaran Kompetensi</h3>
            </div>
            <p class="text-slate-600 leading-relaxed whitespace-pre-line">${artifact.tujuan}</p>
          </div>

          <!-- 3. Analisis Kelebihan & Kelemahan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Kelebihan -->
            <div class="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
              <div class="flex items-center gap-2 mb-3 text-emerald-800 font-bold">
                <i class="fa-solid fa-circle-check text-emerald-600"></i>
                <h3>Kelebihan & Keberhasilan</h3>
              </div>
              <p class="text-slate-700 leading-relaxed whitespace-pre-line">${artifact.kelebihan}</p>
            </div>

            <!-- Kelemahan / Kendala -->
            <div class="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
              <div class="flex items-center gap-2 mb-3 text-amber-800 font-bold">
                <i class="fa-solid fa-triangle-exclamation text-amber-600"></i>
                <h3>Kekurangan & Tantangan Lapangan</h3>
              </div>
              <p class="text-slate-700 leading-relaxed whitespace-pre-line">${artifact.kekurangan}</p>
            </div>
          </div>

          <!-- 4. Kajian Teori Pedagogik Terintegrasi -->
          <div class="rounded-xl border border-primary-200 bg-primary-50/30 p-5 shadow-sm">
            <div class="flex items-center gap-2 mb-3 text-primary-900 font-bold text-base">
              <div class="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-xs">
                <i class="fa-solid fa-book-bookmark"></i>
              </div>
              <h3>Kajian Teori Pedagogik yang Terintegrasi</h3>
              <span class="ml-auto text-[11px] font-semibold uppercase tracking-wider bg-primary-100 text-primary-800 px-2 py-0.5 rounded">Landasan Teoretis</span>
            </div>
            <p class="text-slate-700 leading-relaxed whitespace-pre-line font-medium">${artifact.kajian_teori}</p>
          </div>

          <!-- 5. Umpan Balik / Nilai GP & DPL jika ada -->
          ${artifact.penilai ? `
            <div class="rounded-xl border border-purple-200 bg-purple-50/40 p-5">
              <div class="flex items-center gap-2 mb-2 text-purple-900 font-bold">
                <i class="fa-solid fa-user-check text-purple-600"></i>
                <h3>Catatan Penilaian Guru Pamong / Dosen Pembimbing:</h3>
              </div>
              <p class="text-xs font-semibold text-purple-700 mb-1">${artifact.penilai}</p>
              <p class="text-slate-700 italic">"${artifact.nilai_feedback || 'Terverifikasi Sangat Baik'}"</p>
            </div>
          ` : ''}

          <!-- 6. Lampiran File / Tautan Dokumen / Video -->
          <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              ${artifact.file_url ? `
                <a href="${artifact.file_url}" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-300 transition">
                  <i class="fa-solid fa-file-pdf text-red-500 mr-2 text-sm"></i>
                  <span>${artifact.file_nama || 'Dokumen Bukti'}</span>
                  <i class="fa-solid fa-arrow-up-right-from-square ml-2 text-[10px] text-slate-400"></i>
                </a>
              ` : ''}
              ${artifact.video_url ? `
                <a href="${artifact.video_url}" target="_blank" class="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium text-xs border border-red-200 transition">
                  <i class="fa-brands fa-youtube mr-2 text-base text-red-600"></i>
                  <span>Putar Video Praktik</span>
                  <i class="fa-solid fa-arrow-up-right-from-square ml-2 text-[10px]"></i>
                </a>
              ` : ''}
            </div>

            <div class="flex items-center gap-2">
              ${isDev ? `
                <button onclick="window.app.openEditArtifactModal(${artifact.id})" class="px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition border border-amber-200 flex items-center gap-1.5">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span>Edit Artifak</span>
                </button>
                <button onclick="window.app.deleteArtifact(${artifact.id})" class="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200 flex items-center gap-1.5">
                  <i class="fa-regular fa-trash-can"></i>
                  <span>Hapus</span>
                </button>
              ` : ''}
              <button onclick="window.app.closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                Tutup
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  // 2. Modal Tambah Artifak Baru
  renderAddArtifactForm() {
    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <i class="fa-solid fa-folder-plus"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold font-serif text-slate-900">Tambah Artifak / Bukti Mengajar</h2>
              <p class="text-xs text-slate-500">Lengkapi komponen analisis artifak dan unggah dokumen bukti</p>
            </div>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="form-add-artifact" onsubmit="window.app.submitAddArtifact(event)" enctype="multipart/form-data" class="space-y-4 text-sm">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Judul Artifak <span class="text-red-500">*</span></label>
              <input type="text" name="judul" required placeholder="Contoh: Modul Ajar Terdiferensiasi Informatika" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kategori Bukti <span class="text-red-500">*</span></label>
              <select name="kategori" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">
                <option value="rpp">RPP / Modul Ajar</option>
                <option value="media">Media & Bahan Ajar</option>
                <option value="hasil_siswa">Contoh Hasil Kerja Siswa</option>
                <option value="video_praktik">Video Praktik Mengajar</option>
                <option value="lainnya">Dokumentasi Lainnya</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tanggal Kegiatan</label>
              <input type="date" name="tanggal_kegiatan" value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kelas / Sasaran Pembelajaran</label>
              <input type="text" name="kelas_target" placeholder="Contoh: Kelas X-4 Fase E" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Deskripsi Singkat Artifak</label>
            <textarea name="deskripsi_singkat" rows="2" placeholder="Ringkasan isi dan maksud dari artifak ini..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"></textarea>
          </div>

          <!-- Komponen Analisis Mendalam -->
          <div class="p-4 bg-sky-50/50 rounded-xl border border-sky-200 space-y-4">
            <h4 class="font-bold text-sky-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-graduation-cap"></i> Parameter Analisis Mendalam
            </h4>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">1. Konteks Pembelajaran <span class="text-red-500">*</span></label>
              <textarea name="konteks" required rows="2" placeholder="Jelaskan situasi kelas, karakteristik peserta didik, atau masalah awal yang dihadapi..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">2. Tujuan Pembelajaran <span class="text-red-500">*</span></label>
              <textarea name="tujuan" required rows="2" placeholder="Tujuan yang ingin dicapai dan kompetensi yang dilatihkan..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">3. Kelebihan / Keberhasilan</label>
                <textarea name="kelebihan" rows="2" placeholder="Dampak positif, peningkatan hasil belajar, keaktifan siswa..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"></textarea>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">4. Kekurangan / Tantangan</label>
                <textarea name="kekurangan" rows="2" placeholder="Kendala waktu, sarana, atau respons siswa yang belum optimal..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"></textarea>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">5. Kajian Teori Pedagogik yang Terintegrasi <span class="text-red-500">*</span></label>
              <textarea name="kajian_teori" required rows="2" placeholder="Kaitkan dengan teori belajar (e.g., Vygotsky ZPD, Teori Pembelajaran Berdiferensiasi Tomlinson, TPACK, dsb.)..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"></textarea>
            </div>
          </div>

          <!-- Upload Dokumen / Tautan -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-file-arrow-up text-sky-600"></i> Lampiran Berkas / Dokumen PDF
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Unggah Dokumen / Gambar (PDF, DOCX, JPG, PNG)</label>
                <input type="file" name="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none bg-white text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100">
                <span class="text-[11px] text-slate-400 mt-1 block">Maksimal 30 MB (format PDF, DOCX, JPG, PNG)</span>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Atau Tautan Karya / Dokumen (Canva / Drive / Web / Gambar)</label>
                <input type="url" name="file_url" placeholder="https://canva.link/... atau https://drive.google.com/..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-xs">
                <span class="text-[11px] text-slate-400 mt-1 block">Mendukung link presentasi Canva, Google Drive, gambar, & web</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Nama Tampilan Dokumen</label>
                <input type="text" name="file_nama" placeholder="Contoh: Modul_Ajar_Informatika.pdf" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-xs">
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tautan Video Praktik (Opsional)</label>
                <input type="url" name="video_url" placeholder="https://youtube.com/..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-xs">
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md shadow-sky-600/30 flex items-center gap-1.5">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>Simpan Artifak</span>
            </button>
          </div>

        </form>
      </div>
    `;
  },

  // 3. Modal Edit Artifak (Pre-filled dengan data yang ada)
  renderEditArtifactForm(artifact) {
    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold font-serif text-slate-900">Edit Artifak / Bukti Mengajar</h2>
              <p class="text-xs text-slate-500">Perbarui rincian analisis atau berkas dokumen bukti mengajar</p>
            </div>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="form-edit-artifact" onsubmit="window.app.submitEditArtifact(event, ${artifact.id})" enctype="multipart/form-data" class="space-y-4 text-sm">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Judul Artifak <span class="text-red-500">*</span></label>
              <input type="text" name="judul" required value="${artifact.judul || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kategori Bukti <span class="text-red-500">*</span></label>
              <select name="kategori" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">
                <option value="rpp" ${artifact.kategori === 'rpp' ? 'selected' : ''}>RPP / Modul Ajar</option>
                <option value="media" ${artifact.kategori === 'media' ? 'selected' : ''}>Media & Bahan Ajar</option>
                <option value="hasil_siswa" ${artifact.kategori === 'hasil_siswa' ? 'selected' : ''}>Contoh Hasil Kerja Siswa</option>
                <option value="video_praktik" ${artifact.kategori === 'video_praktik' ? 'selected' : ''}>Video Praktik Mengajar</option>
                <option value="lainnya" ${artifact.kategori === 'lainnya' ? 'selected' : ''}>Dokumentasi Lainnya</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tanggal Kegiatan</label>
              <input type="date" name="tanggal_kegiatan" value="${artifact.tanggal_kegiatan || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kelas / Sasaran Pembelajaran</label>
              <input type="text" name="kelas_target" value="${artifact.kelas_target || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Deskripsi Singkat Artifak</label>
            <textarea name="deskripsi_singkat" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none">${artifact.deskripsi_singkat || ''}</textarea>
          </div>

          <!-- Parameter Analisis Mendalam -->
          <div class="p-4 bg-sky-50/50 rounded-xl border border-sky-200 space-y-4">
            <h4 class="font-bold text-sky-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-graduation-cap"></i> Parameter Analisis Mendalam
            </h4>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">1. Konteks Pembelajaran <span class="text-red-500">*</span></label>
              <textarea name="konteks" required rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">${artifact.konteks || ''}</textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">2. Tujuan Pembelajaran <span class="text-red-500">*</span></label>
              <textarea name="tujuan" required rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">${artifact.tujuan || ''}</textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">3. Kelebihan / Keberhasilan</label>
                <textarea name="kelebihan" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">${artifact.kelebihan || ''}</textarea>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">4. Kekurangan / Tantangan</label>
                <textarea name="kekurangan" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">${artifact.kekurangan || ''}</textarea>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">5. Kajian Teori Pedagogik yang Terintegrasi <span class="text-red-500">*</span></label>
              <textarea name="kajian_teori" required rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">${artifact.kajian_teori || ''}</textarea>
            </div>
          </div>

          <!-- Lampiran Berkas / Tautan Dokumen -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-file-arrow-up text-amber-600"></i> Lampiran Berkas & Tautan
            </h4>

            ${artifact.file_url ? `
              <div class="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span class="flex items-center gap-2 text-slate-700 truncate">
                  <i class="fa-solid fa-file-pdf text-red-500"></i>
                  <span>Berkas saat ini: <strong>${artifact.file_nama || artifact.file_url}</strong></span>
                </span>
                <a href="${artifact.file_url}" target="_blank" class="text-sky-600 hover:underline font-semibold ml-2 shrink-0">
                  Lihat Berkas
                </a>
              </div>
            ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Unggah Berkas / Gambar Baru</label>
                <input type="file" name="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none bg-white text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100">
                <span class="text-[11px] text-slate-400 mt-1 block">Biarkan kosong jika tidak ingin mengubah berkas (PDF, JPG, PNG)</span>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tautan Karya / Dokumen (Canva / Drive / Web / Gambar)</label>
                <input type="text" name="file_url" value="${artifact.file_url || ''}" placeholder="https://canva.link/... atau https://drive.google.com/..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-xs">
                <span class="text-[11px] text-slate-400 mt-1 block">Mendukung link presentasi Canva, Google Drive, gambar, & web</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Nama Tampilan Dokumen</label>
                <input type="text" name="file_nama" value="${artifact.file_nama || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-xs">
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tautan Video Praktik (Opsional)</label>
                <input type="text" name="video_url" value="${artifact.video_url || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-xs">
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5">
              <i class="fa-solid fa-check"></i>
              <span>Perbarui Artifak</span>
            </button>
          </div>

        </form>
      </div>
    `;
  },

  // 4. Modal Tambah Refleksi Pengalaman Belajar Mata Kuliah (CRUD)
  renderAddCourseReflectionForm() {
    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-base">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold font-serif text-slate-900">Tambah Refleksi Pengalaman Belajar</h2>
              <p class="text-xs text-slate-500">Dokumentasikan refleksi bermakna per mata kuliah PPG (2 Semester)</p>
            </div>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="form-add-course-reflection" onsubmit="window.app.submitAddCourseReflection(event)" enctype="multipart/form-data" class="space-y-4 text-sm">
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-6">
              <label class="block font-semibold text-slate-700 mb-1">Nama Mata Kuliah <span class="text-red-500">*</span></label>
              <input type="text" name="nama_mata_kuliah" required placeholder="Contoh: Pembelajaran Berdiferensiasi" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>

            <div class="md:col-span-3">
              <label class="block font-semibold text-slate-700 mb-1">Semester <span class="text-red-500">*</span></label>
              <select name="semester" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="block font-semibold text-slate-700 mb-1">Bobot SKS</label>
              <input type="number" name="sks" min="1" max="8" value="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Mata Kuliah (Opsional)</label>
              <input type="text" name="kode_mk" placeholder="Contoh: PPG-201" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Dosen Pengampu / Instruktur</label>
              <input type="text" name="dosen_pengampu" placeholder="Contoh: Dr. Wawan Setiawan, M.Ed." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Gambaran Umum / Deskripsi Mata Kuliah</label>
            <textarea name="deskripsi_singkat" rows="2" placeholder="Fokus dan ruang lingkup materi pada mata kuliah ini..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
          </div>

          <div class="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-4">
            <h4 class="font-bold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-feather-pointed"></i> Pilar Refleksi Pengalaman Belajar
            </h4>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">1. Review Pengalaman Belajar Bermakna <span class="text-red-500">*</span></label>
              <textarea name="pengalaman_belajar" required rows="3" placeholder="Apa pengalaman belajar yang paling bermakna dan berkesan yang Anda alami selama perkuliahan ini?" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">2. Artefak Pembelajaran yang Dihasilkan</label>
              <textarea name="artefak_pembelajaran" rows="2" placeholder="Sebutkan artefak/produk tugas unggulan (e.g., Modul ajar, infografis, video, lembar kerja)..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">3. Analisis Refleksi & Pemaknaan Artefak</label>
              <textarea name="analisis_refleksi" rows="2" placeholder="Mengapa artefak tersebut bermakna? Paradigma baru apa yang Anda peroleh setelah menyelesaikan tugas tersebut?" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">4. Desain Pembelajaran Baru / Aksi Nyata di Sekolah</label>
              <textarea name="desain_pembelajaran_baru" rows="2" placeholder="Bagaimana Anda akan menerapkan ilmu/keterampilan ini ketika kelak mengajar di kelas nyata?" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"></textarea>
            </div>
          </div>

          <!-- Unggah Dokumen PDF Lampiran Refleksi -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-file-pdf text-red-500 text-sm"></i> Lampiran Dokumen Refleksi (PDF)
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Pilih Berkas PDF untuk Diunggah</label>
                <input type="file" name="pdf_file" accept=".pdf,application/pdf" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none bg-white text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100">
                <span class="text-[11px] text-slate-400 mt-1 block">Maksimal 30 MB (Dokumen PDF lengkap)</span>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Atau Masukkan Tautan Dokumen (Google Drive)</label>
                <input type="url" name="pdf_file_url" placeholder="https://docs.google.com/..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-xs">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nama Berkas PDF</label>
              <input type="text" name="pdf_file_nama" placeholder="Contoh: Refleksi_Mata_Kuliah_Pembelajaran_Berdiferensiasi.pdf" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-xs">
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>Simpan Refleksi MK</span>
            </button>
          </div>

        </form>
      </div>
    `;
  },

  // 5. Modal Edit Refleksi Pengalaman Belajar Mata Kuliah
  renderEditCourseReflectionForm(cr) {
    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold font-serif text-slate-900">Edit Refleksi Mata Kuliah</h2>
              <p class="text-xs text-slate-500">Perbarui telaah reflektif dan berkas PDF mata kuliah</p>
            </div>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="form-edit-course-reflection" onsubmit="window.app.submitEditCourseReflection(event, ${cr.id})" enctype="multipart/form-data" class="space-y-4 text-sm">
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-6">
              <label class="block font-semibold text-slate-700 mb-1">Nama Mata Kuliah <span class="text-red-500">*</span></label>
              <input type="text" name="nama_mata_kuliah" required value="${cr.nama_mata_kuliah || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>

            <div class="md:col-span-3">
              <label class="block font-semibold text-slate-700 mb-1">Semester <span class="text-red-500">*</span></label>
              <select name="semester" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                <option value="Semester 1" ${cr.semester === 'Semester 1' ? 'selected' : ''}>Semester 1</option>
                <option value="Semester 2" ${cr.semester === 'Semester 2' ? 'selected' : ''}>Semester 2</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="block font-semibold text-slate-700 mb-1">Bobot SKS</label>
              <input type="number" name="sks" min="1" max="8" value="${cr.sks || 2}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Mata Kuliah (Opsional)</label>
              <input type="text" name="kode_mk" value="${cr.kode_mk || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Dosen Pengampu / Instruktur</label>
              <input type="text" name="dosen_pengampu" value="${cr.dosen_pengampu || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Gambaran Umum / Deskripsi Mata Kuliah</label>
            <textarea name="deskripsi_singkat" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">${cr.deskripsi_singkat || ''}</textarea>
          </div>

          <div class="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-4">
            <h4 class="font-bold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-feather-pointed"></i> Pilar Refleksi Pengalaman Belajar
            </h4>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">1. Review Pengalaman Belajar Bermakna <span class="text-red-500">*</span></label>
              <textarea name="pengalaman_belajar" required rows="3" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">${cr.pengalaman_belajar || ''}</textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">2. Artefak Pembelajaran yang Dihasilkan</label>
              <textarea name="artefak_pembelajaran" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">${cr.artefak_pembelajaran || ''}</textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">3. Analisis Refleksi & Pemaknaan Artefak</label>
              <textarea name="analisis_refleksi" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">${cr.analisis_refleksi || ''}</textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">4. Desain Pembelajaran Baru / Aksi Nyata di Sekolah</label>
              <textarea name="desain_pembelajaran_baru" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">${cr.desain_pembelajaran_baru || ''}</textarea>
            </div>
          </div>

          <!-- Unggah / Ganti Dokumen PDF Lampiran -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-file-pdf text-red-500 text-sm"></i> Lampiran Dokumen Refleksi (PDF)
            </h4>

            ${cr.pdf_file_url ? `
              <div class="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span class="flex items-center gap-2 text-slate-700 truncate">
                  <i class="fa-solid fa-file-pdf text-red-500"></i>
                  <span>PDF Saat Ini: <strong>${cr.pdf_file_nama || cr.pdf_file_url}</strong></span>
                </span>
                <a href="${cr.pdf_file_url}" target="_blank" class="text-indigo-600 hover:underline font-semibold ml-2 shrink-0">
                  Lihat PDF
                </a>
              </div>
            ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Unggah PDF Baru (Opsional)</label>
                <input type="file" name="pdf_file" accept=".pdf,application/pdf" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none bg-white text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100">
                <span class="text-[11px] text-slate-400 mt-1 block">Biarkan kosong jika tidak ingin mengganti file PDF</span>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tautan URL Dokumen (Drive)</label>
                <input type="text" name="pdf_file_url" value="${cr.pdf_file_url || ''}" placeholder="https://..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-xs">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nama Tampilan File PDF</label>
              <input type="text" name="pdf_file_nama" value="${cr.pdf_file_nama || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-xs">
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5">
              <i class="fa-solid fa-check"></i>
              <span>Perbarui Refleksi MK</span>
            </button>
          </div>

        </form>
      </div>
    `;
  },

  // 6. Modal Detail Refleksi Pengalaman Belajar Mata Kuliah
  renderCourseReflectionDetail(cr) {
    const isDev = window.app && window.app.state ? window.app.state.isDevelopment : true;
    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-start justify-between pb-5 border-b border-slate-200 gap-4">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${cr.semester === 'Semester 1' ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                <i class="fa-solid fa-calendar-check mr-1.5"></i> ${cr.semester}
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <i class="fa-solid fa-award mr-1 text-amber-500"></i> ${cr.sks} SKS
              </span>
              ${cr.kode_mk ? `
                <span class="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  ${cr.kode_mk}
                </span>
              ` : ''}
            </div>
            <h2 class="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-tight">
              ${cr.nama_mata_kuliah}
            </h2>
            ${cr.dosen_pengampu ? `
              <p class="text-xs text-slate-500 mt-1 flex items-center">
                <i class="fa-solid fa-chalkboard-user mr-1.5 text-indigo-600"></i> Dosen Pengampu: <strong>${cr.dosen_pengampu}</strong>
              </p>
            ` : ''}
          </div>
          <button onclick="window.app.closeModal()" class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        ${cr.deskripsi_singkat ? `
          <div class="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm italic">
            <i class="fa-solid fa-quote-left text-indigo-600 mr-2 opacity-50"></i>
            ${cr.deskripsi_singkat}
          </div>
        ` : ''}

        <div class="space-y-5 text-sm text-slate-700 mt-4">
          
          <!-- 1. Review Pengalaman Belajar -->
          <div class="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
            <div class="flex items-center gap-2 mb-3 text-indigo-900 font-bold text-base">
              <div class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                <i class="fa-solid fa-book-open"></i>
              </div>
              <h3>1. Review Pengalaman Belajar Bermakna</h3>
            </div>
            <p class="text-slate-600 leading-relaxed whitespace-pre-line">${cr.pengalaman_belajar}</p>
          </div>

          <!-- 2. Artefak Pembelajaran Unggulan -->
          ${cr.artefak_pembelajaran ? `
            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center gap-2 mb-3 text-sky-900 font-bold text-base">
                <div class="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-trophy"></i>
                </div>
                <h3>2. Artefak Pembelajaran yang Dihasilkan</h3>
              </div>
              <p class="text-slate-600 leading-relaxed whitespace-pre-line">${cr.artefak_pembelajaran}</p>
            </div>
          ` : ''}

          <!-- 3. Analisis Refleksi & Desain Pembelajaran Baru -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${cr.analisis_refleksi ? `
              <div class="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
                <div class="flex items-center gap-2 mb-3 text-emerald-800 font-bold">
                  <i class="fa-solid fa-lightbulb text-emerald-600"></i>
                  <h3>3. Analisis Refleksi & Makna</h3>
                </div>
                <p class="text-slate-700 leading-relaxed whitespace-pre-line text-xs sm:text-sm">${cr.analisis_refleksi}</p>
              </div>
            ` : ''}

            ${cr.desain_pembelajaran_baru ? `
              <div class="rounded-xl border border-sky-200 bg-sky-50/40 p-5 shadow-sm">
                <div class="flex items-center gap-2 mb-3 text-sky-800 font-bold">
                  <i class="fa-solid fa-rocket text-sky-600"></i>
                  <h3>4. Desain Pembelajaran Baru (Aksi Nyata)</h3>
                </div>
                <p class="text-slate-700 leading-relaxed whitespace-pre-line text-xs sm:text-sm">${cr.desain_pembelajaran_baru}</p>
              </div>
            ` : ''}
          </div>

          <!-- Lampiran Dokumen PDF -->
          <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              ${cr.pdf_file_url ? `
                <a href="${cr.pdf_file_url}" target="_blank" class="inline-flex items-center px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 transition gap-2 shadow-sm">
                  <i class="fa-solid fa-file-pdf text-red-600 text-base"></i>
                  <span>${cr.pdf_file_nama || 'Buka Dokumen Refleksi PDF'}</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
              ` : `
                <span class="text-xs text-slate-400 italic">
                  <i class="fa-regular fa-file text-slate-300 mr-1"></i> Tidak ada lampiran PDF
                </span>
              `}
            </div>

            <div class="flex items-center gap-2">
              ${isDev ? `
                <button onclick="window.app.openEditCourseReflectionModal(${cr.id})" class="px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition border border-amber-200 flex items-center gap-1.5">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span>Edit</span>
                </button>
                <button onclick="window.app.deleteCourseReflection(${cr.id})" class="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200 flex items-center gap-1.5">
                  <i class="fa-regular fa-trash-can"></i>
                  <span>Hapus</span>
                </button>
              ` : ''}
              <button onclick="window.app.closeModal()" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                Tutup
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  // 7. Modal Edit Lembar Refleksi Utama (KHD, Model Guru, Refleksi Akhir PPL & RTL)
  renderEditReflectionForm(ref) {
    let pointsText = '';
    try {
      if (ref.poin_utama) {
        if (typeof ref.poin_utama === 'string' && ref.poin_utama.startsWith('[')) {
          pointsText = JSON.parse(ref.poin_utama).join('\n');
        } else {
          pointsText = ref.poin_utama;
        }
      }
    } catch (e) {
      pointsText = ref.poin_utama || '';
    }

    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold font-serif text-slate-900">Edit Lembar Refleksi</h2>
              <p class="text-xs text-slate-500">Sesuaikan narasi filosofis, analisis kekuatan & kelemahan, serta Rencana Tindak Lanjut (RTL)</p>
            </div>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="form-edit-reflection" onsubmit="window.app.submitEditReflection(event, ${ref.id})" class="space-y-4 text-sm">
          
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Judul Refleksi <span class="text-red-500">*</span></label>
            <input type="text" name="judul" required value="${(ref.judul || '').replace(/"/g, '&quot;')}" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none">
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Subjudul / Tajuk Pembahasan</label>
            <input type="text" name="subjudul" value="${(ref.subjudul || '').replace(/"/g, '&quot;')}" placeholder="Contoh: Meresapi Hakikat Pengajaran..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none">
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Kutipan Filosofis (Quote Utama)</label>
            <textarea name="kutipan_filosofis" rows="2" placeholder="Kutipan pemikiran Ki Hadjar Dewantara atau kutipan reflektif..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none italic">${ref.kutipan_filosofis || ''}</textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Isi Narasi Reflektif Lengkap <span class="text-red-500">*</span></label>
            <textarea name="konten" required rows="7" placeholder="Tuliskan telaah narasi refleksi kritis Anda di sini..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-sans leading-relaxed text-xs sm:text-sm">${ref.konten || ''}</textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Poin-Poin Kunci Esensial (1 baris per poin)</label>
            <textarea name="poin_utama" rows="3" placeholder="Pendidikan sebagai proses menuntun kodrat&#10;Trilogi Kepemimpinan Guru KHD&#10;Pembelajaran berpusat pada murid" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-sans text-xs">${pointsText}</textarea>
            <span class="text-[11px] text-slate-400 mt-1 block">Tuliskan setiap poin pada baris baru (Enter).</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <label class="block font-bold text-emerald-900 mb-1 flex items-center gap-1.5 text-xs">
                <i class="fa-solid fa-shield-halved text-emerald-600"></i> Analisis Kekuatan Diri (Strengths)
              </label>
              <textarea name="kekuatan" rows="4" placeholder="Uraikan kekuatan pedagogik, sosial, penguasaan materi..." class="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-xs leading-relaxed">${ref.kekuatan || ''}</textarea>
            </div>

            <div class="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <label class="block font-bold text-amber-900 mb-1 flex items-center gap-1.5 text-xs">
                <i class="fa-solid fa-compass-drafting text-amber-600"></i> Area Pengembangan Diri (Growth Areas)
              </label>
              <textarea name="kelemahan" rows="4" placeholder="Kendala alokasi waktu, respons siswa, atau aspek yang masih perlu diperbaiki..." class="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-xs leading-relaxed">${ref.kelemahan || ''}</textarea>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-primary-50/50 border border-primary-200">
            <label class="block font-bold text-primary-950 mb-1 flex items-center gap-1.5 text-xs">
              <i class="fa-solid fa-route text-sky-600"></i> Rencana Tindak Lanjut (RTL) Pengembangan Keprofesian
            </label>
            <textarea name="rencana_tindak_lanjut" rows="4" placeholder="Rencana aksi nyata jangka pendek (1-3 bulan), jangka menengah (6-12 bulan), dan jangka panjang (1-3 tahun)..." class="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white text-xs leading-relaxed">${ref.rencana_tindak_lanjut || ''}</textarea>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5">
              <i class="fa-solid fa-check"></i>
              <span>Simpan Perubahan Refleksi</span>
            </button>
          </div>

        </form>
      </div>
    `;
  },

  // 8. Modal Pedoman Rubrik
  renderRubrikGuide() {
    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
              <i class="fa-solid fa-clipboard-check"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold font-serif text-slate-900">Pedoman Portofolio PPL Mandiri</h2>
              <p class="text-xs text-slate-500">Standar Evaluasi Calon Guru Profesional</p>
            </div>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-3">
          <p>
            Portofolio digital ini mencakup seluruh komponen penilaian PPL Mandiri secara holistik:
          </p>
          <ul class="space-y-1.5 list-disc list-inside">
            <li><strong>Beranda</strong>: Profil, kontak, pengantar, dan visi calon guru</li>
            <li><strong>Artifak Bukti Mengajar</strong>: RPP/Modul ajar, media, hasil karya siswa, lembar supervisi, dan rekaman kelas</li>
            <li><strong>Analisis Artifak</strong>: Konteks, sasaran, kekuatan, kelemahan, serta integrasi kajian teori pedagogik</li>
            <li><strong>Refleksi & RTL</strong>: Model guru, filosofi Ki Hadjar Dewantara, evaluasi akhir PPL, serta refleksi pengalaman belajar mata kuliah 2 semester</li>
          </ul>
        </div>

        <div class="mt-6 text-right">
          <button onclick="window.app.closeModal()" class="px-5 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition">
            Tutup
          </button>
        </div>
      </div>
    `;
  },

  // 8. Modal Pusat Cadangan & Pemulihan Data (Backup & Restore)
  renderBackupModal(backups = []) {
    return `
      <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <!-- Header Modal -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold font-serif text-slate-900">Pusat Cadangan & Keamanan Data</h2>
              <p class="text-xs text-slate-500">Amankan dan pulihkan data artifak, refleksi, dan profil portofolio Anda</p>
            </div>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Banner Keamanan Aktif -->
        <div class="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
          <i class="fa-solid fa-circle-check text-emerald-600 text-base mt-0.5"></i>
          <div>
            <div class="font-bold text-emerald-950 mb-0.5">Sistem Perlindungan Otomatis Aktif</div>
            <p class="text-emerald-800 leading-relaxed">
              Sistem telah dikonfigurasi untuk <strong>membuat snapshot otomatis</strong> di server setiap kali aplikasi dijalankan dan sebelum perubahan besar. Data Anda terlindungi dari risiko hilang.
            </p>
          </div>
        </div>

        <!-- Bagian 1: Unduh Cadangan ke Komputer (1-Klik) -->
        <div class="mb-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
            <i class="fa-solid fa-cloud-arrow-down text-sky-600 text-base"></i>
            <h3>1. Unduh Cadangan ke Laptop / Komputer Anda</h3>
          </div>
          <p class="text-xs text-slate-500 mb-4 leading-relaxed">
            Simpan salinan data portofolio di komputer Anda sebagai cadangan pribadi yang aman.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href="/api/backup/export" download class="px-4 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold flex flex-col items-center justify-center text-center transition group">
              <i class="fa-solid fa-file-code text-xl text-sky-600 mb-1.5 group-hover:scale-110 transition-transform"></i>
              <span>Unduh Data Lengkap (.JSON)</span>
              <span class="text-[10px] text-sky-600/70 font-normal mt-0.5">Format universal & mudah dipulihkan</span>
            </a>

            <a href="/api/backup/download-sqlite" download class="px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex flex-col items-center justify-center text-center transition group">
              <i class="fa-solid fa-database text-xl text-slate-600 mb-1.5 group-hover:scale-110 transition-transform"></i>
              <span>Unduh Basis Data (.sqlite)</span>
              <span class="text-[10px] text-slate-500 font-normal mt-0.5">Salinan biner asli SQLite</span>
            </a>

            <button onclick="window.app.createManualBackup()" class="px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex flex-col items-center justify-center text-center transition group">
              <i class="fa-solid fa-camera-rotate text-xl text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform"></i>
              <span>Buat Snapshot Baru di Server</span>
              <span class="text-[10px] text-emerald-600/70 font-normal mt-0.5">Simpan ke folder data/backups/</span>
            </button>
          </div>
        </div>

        <!-- Bagian 2: Pulihkan Data dari Berkas JSON (Restore) -->
        <div class="mb-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
            <i class="fa-solid fa-clock-rotate-left text-amber-600 text-base"></i>
            <h3>2. Pulihkan Data dari Berkas Cadangan (.JSON)</h3>
          </div>
          <p class="text-xs text-slate-500 mb-4 leading-relaxed">
            Jika Anda pernah mengunduh file cadangan <code>.json</code> sebelumnya, Anda dapat mengunggahnya kembali di sini untuk memulihkan seluruh data portofolio.
          </p>

          <form onsubmit="window.app.restoreBackupFromFile(event)" class="flex flex-col sm:flex-row items-center gap-3">
            <input type="file" name="backup_file" accept=".json,application/json" required class="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 border border-slate-200 rounded-xl px-2 py-1.5 bg-slate-50">
            <button type="submit" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs whitespace-nowrap shadow-sm shadow-amber-600/30 flex items-center justify-center gap-1.5 transition">
              <i class="fa-solid fa-arrow-rotate-left"></i>
              <span>Pulihkan Data</span>
            </button>
          </form>
        </div>

        <!-- Bagian 3: Riwayat Snapshot Cadangan Otomatis di Server -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <i class="fa-solid fa-list-check text-indigo-600 text-base"></i>
              <h3>3. Riwayat Snapshot Tersimpan di Server</h3>
            </div>
            <button onclick="window.app.openBackupModal()" class="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1">
              <i class="fa-solid fa-rotate-right"></i> Refresh
            </button>
          </div>

          ${backups.length > 0 ? `
            <div class="overflow-x-auto max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                  <tr>
                    <th class="p-2.5">Nama Berkas Snapshot</th>
                    <th class="p-2.5">Tipe</th>
                    <th class="p-2.5">Ukuran</th>
                    <th class="p-2.5">Waktu Dibuat</th>
                    <th class="p-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${backups.map(b => `
                    <tr class="hover:bg-slate-50">
                      <td class="p-2.5 font-mono text-[11px] font-semibold text-slate-800 truncate max-w-[220px]" title="${b.filename}">
                        ${b.filename}
                      </td>
                      <td class="p-2.5">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${b.type === 'json' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}">
                          ${b.type.toUpperCase()}
                        </span>
                      </td>
                      <td class="p-2.5 text-slate-500">${b.sizeFormatted}</td>
                      <td class="p-2.5 text-slate-500 text-[11px]">
                        ${new Date(b.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td class="p-2.5 text-right">
                        <button onclick="window.app.restoreBackupFromServer('${b.filename}')" class="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-semibold transition" title="Pulihkan data dari snapshot ini">
                          <i class="fa-solid fa-arrow-rotate-left mr-1"></i> Pulihkan
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
              Belum ada snapshot cadangan di server.
            </div>
          `}
        </div>

        <div class="mt-6 flex justify-end">
          <button onclick="window.app.closeModal()" class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition">
            Tutup
          </button>
        </div>
      </div>
    `;
  },

  // 9. Modal Edit Foto & Profil
  renderEditProfileModal(profile) {
    return `
      <div class="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between pb-5 border-b border-slate-200 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg">
              <i class="fa-solid fa-user-pen"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold font-serif text-slate-900">Edit Profil</h2>
              <p class="text-xs text-slate-500 mt-0.5">Ubah foto, nama, dan data identitas</p>
            </div>
          </div>
          <button onclick="window.app.closeModal()" class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form id="edit-profile-form" onsubmit="window.app.submitEditProfile(event)" enctype="multipart/form-data">

          <!-- Pratinjau Foto -->
          <div class="flex flex-col items-center mb-6">
            <div class="w-28 h-28 rounded-2xl border-4 border-sky-200 shadow-md overflow-hidden bg-slate-100 mb-3" id="foto-preview-wrapper">
              <img id="foto-preview-img" src="${profile.foto_url || ''}" alt="Foto Profil"
                class="w-full h-full object-cover object-center"
                onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'">
            </div>
            <p class="text-xs text-slate-500">Pratinjau foto profil</p>
          </div>

          <!-- Tab Pilihan: Upload File atau URL -->
          <div class="mb-5">
            <div class="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-semibold mb-4">
              <button type="button" id="tab-upload" onclick="window.ModalView._switchFotoTab('upload')"
                class="flex-1 px-4 py-2.5 bg-sky-600 text-white transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-upload"></i> Upload dari Komputer
              </button>
              <button type="button" id="tab-url" onclick="window.ModalView._switchFotoTab('url')"
                class="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-link"></i> Tempel URL Foto
              </button>
            </div>

            <!-- Panel Upload File -->
            <div id="panel-upload">
              <label class="block text-xs font-semibold text-slate-700 mb-2">
                <i class="fa-solid fa-image mr-1 text-sky-600"></i> Pilih File Foto (JPG, PNG, WEBP — maks 5MB)
              </label>
              <input type="file" name="foto" id="input-foto-file" accept="image/jpeg,image/png,image/webp,image/gif"
                class="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 border border-slate-200 rounded-xl cursor-pointer bg-slate-50 p-1"
                onchange="window.ModalView._previewFotoFile(event)">
            </div>

            <!-- Panel URL -->
            <div id="panel-url" class="hidden">
              <label class="block text-xs font-semibold text-slate-700 mb-2">
                <i class="fa-solid fa-link mr-1 text-sky-600"></i> URL Foto (Google Drive, Imgur, LinkedIn, dll.)
              </label>
              <input type="text" name="foto_url" id="input-foto-url" value="${profile.foto_url || ''}"
                placeholder="https://contoh.com/foto-saya.jpg"
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                oninput="window.ModalView._previewFotoUrl(this.value)">
              <p class="text-xs text-slate-400 mt-1.5">
                <i class="fa-solid fa-circle-info mr-1"></i>
                Untuk Google Drive: buka foto → Bagikan → Siapapun dengan link → salin link, lalu ubah ke format:
                <code class="bg-slate-100 px-1 rounded">https://drive.google.com/uc?export=view&id=ID_FILE</code>
              </p>
            </div>
          </div>

          <hr class="border-slate-100 my-5">

          <!-- Field Teks Profil -->
          <div class="space-y-4 text-sm">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" name="nama" value="${profile.nama || ''}" required
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Gelar / Predikat</label>
                <input type="text" name="gelar" value="${profile.gelar || ''}"
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">NIM</label>
                <input type="text" name="nim" value="${profile.nim || ''}"
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input type="email" name="email" value="${profile.email || ''}"
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">WhatsApp (format: 628xxx)</label>
                <input type="text" name="whatsapp" value="${profile.whatsapp || ''}"
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                <input type="text" name="linkedin" value="${profile.linkedin || ''}"
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">LPTK Penyelenggara</label>
              <input type="text" name="lptk" value="${profile.lptk || ''}"
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Program Studi / Bidang Studi</label>
              <input type="text" name="prodi" value="${profile.prodi || ''}"
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Sekolah Mitra PPL</label>
              <input type="text" name="sekolah_mitra" value="${profile.sekolah_mitra || ''}"
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Guru Pamong</label>
                <input type="text" name="guru_pamong" value="${profile.guru_pamong || ''}"
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Dosen Pembimbing Lapangan</label>
                <input type="text" name="dosen_pembimbing" value="${profile.dosen_pembimbing || ''}"
                  class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Tagline / Moto</label>
              <input type="text" name="tagline" value="${profile.tagline || ''}"
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Bio Singkat</label>
              <textarea name="bio" rows="3"
                class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none">${profile.bio || ''}</textarea>
            </div>

          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <button type="button" onclick="window.app.closeModal()"
              class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition">
              Batal
            </button>
            <button type="submit" id="btn-submit-edit-profile"
              class="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-md shadow-sky-600/25 transition flex items-center gap-2">
              <i class="fa-solid fa-floppy-disk"></i>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    `;
  },

  // Helper: switch tab foto (upload / url)
  _switchFotoTab(tab) {
    const tabUpload = document.getElementById('tab-upload');
    const tabUrl = document.getElementById('tab-url');
    const panelUpload = document.getElementById('panel-upload');
    const panelUrl = document.getElementById('panel-url');
    const inputFile = document.getElementById('input-foto-file');
    const inputUrl = document.getElementById('input-foto-url');

    if (tab === 'upload') {
      tabUpload.className = tabUpload.className.replace('bg-slate-100 text-slate-600 hover:bg-slate-200', 'bg-sky-600 text-white');
      tabUrl.className = tabUrl.className.replace('bg-sky-600 text-white', 'bg-slate-100 text-slate-600 hover:bg-slate-200');
      panelUpload.classList.remove('hidden');
      panelUrl.classList.add('hidden');
      // Kosongkan URL supaya tidak dikirim
      if (inputUrl) inputUrl.removeAttribute('name');
      if (inputFile) inputFile.setAttribute('name', 'foto');
    } else {
      tabUrl.className = tabUrl.className.replace('bg-slate-100 text-slate-600 hover:bg-slate-200', 'bg-sky-600 text-white');
      tabUpload.className = tabUpload.className.replace('bg-sky-600 text-white', 'bg-slate-100 text-slate-600 hover:bg-slate-200');
      panelUrl.classList.remove('hidden');
      panelUpload.classList.add('hidden');
      // Nonaktifkan file input, aktifkan URL
      if (inputFile) { inputFile.removeAttribute('name'); inputFile.value = ''; }
      if (inputUrl) inputUrl.setAttribute('name', 'foto_url');
    }
  },

  // Helper: pratinjau foto dari file lokal
  _previewFotoFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.getElementById('foto-preview-img');
      if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  // Helper: pratinjau foto dari URL
  _previewFotoUrl(url) {
    const img = document.getElementById('foto-preview-img');
    if (img && url) img.src = url;
  }
};
