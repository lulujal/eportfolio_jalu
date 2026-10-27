# E-Portofolio Calon Guru (PPL Mandiri)

Aplikasi web e-portofolio interaktif dan profesional untuk calon guru yang dikembangkan secara komprehensif untuk memenuhi **Rubrik Penilaian E-Portfolio PPL Mandiri (Skor Maksimal 100 Poin)**.

---

## 🌟 Keselarasan dengan Rubrik Penilaian (100 Poin)

| No | Komponen Rubrik | Bobot | Implementasi dalam Aplikasi |
|:---|:---|:---:|:---|
| 1 | **Beranda (Homepage)** | 20 Poin | Profil lengkap calon guru (NIM, LPTK, Prodi, Sekolah Mitra, Guru Pamong, Dosen Pembimbing Lapangan), kontak resmi (Email, WhatsApp, LinkedIn), pengantar e-portfolio akademik, visi guru, dan statistik PPL. |
| 2 | **Artifak (Bukti Mengajar)** | 20 Poin | 5 kategori representasi PPL: Modul Ajar Kurikulum Merdeka (RPP), Media Interaktif (GeoGebra/LKPD), Portofolio Asesmen Siswa (HOTS), Lembar Supervisi GP & DPL, dan Video Praktik Mengajar. |
| 3 | **Analisis Artifak** | 20 Poin | Modal analisis mendalam untuk setiap artifak yang menguraikan Konteks Kelas, Tujuan Pembelajaran, Kelebihan, Kekurangan/Tantangan, serta **Integrasi Kajian Teori Pedagogik** (Tomlinson, Vygotsky, TPACK, Bruner, Barrows, Donald Schön). |
| 4 | **Refleksi & RTL** | 20 Poin | Empat pilar refleksi: Model Guru yang Dituju, Filosofi Pendidikan Ki Hadjar Dewantara (KHD), Refleksi Akhir PPL & RTL, serta **Refleksi Pengalaman Belajar Mata Kuliah (2 Semester)** yang dilengkapi upload dokumen PDF dan CRUD mandiri. |
| 5 | **Tata Bahasa & Estetika** | 20 Poin | Bahasa Indonesia formal dan baku berstandar EBI/akademik, istilah pedagogik mutakhir, serta desain responsif elegan bertema institusi pendidikan. |

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js & Express.js
- **ORM**: Sequelize v6
- **Database (RDBMS)**:
  - **PostgreSQL Ready**: Didukung penuh melalui driver `pg` & `pg-hstore`
  - **SQLite Fallback**: Mode bawaan yang langsung aktif tanpa memerlukan instalasi server basis data eksternal
- **Frontend**: Vanilla JavaScript murni (Single Page Application dengan Hash Routing: `#beranda`, `#artifak`, `#refleksi`)
- **Desain & Styling**: Tailwind CSS, Font Awesome 6, Google Fonts (Plus Jakarta Sans & Merriweather)

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Instalasi Dependensi (Sudah dilakukan)
```bash
npm install
```

### 2. Konfigurasi Lingkungan (.env)
Buka file `.env`:
```env
PORT=3000
DB_DIALECT=sqlite

# Mode Aplikasi (Development vs Production):
# - 'development' : Menampilkan seluruh tombol Edit, Tambah Bukti, Tambah Refleksi MK, dan Hapus (Aktif saat ini).
# - 'production'  : Menyembunyikan seluruh fitur edit/tambah/hapus sehingga menjadi portofolio publik yang rapi & siap dinilai penguji.
NODE_ENV=development

# Atau untuk beralih ke PostgreSQL:
# DB_DIALECT=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=eportfolio_guru
# DB_USER=postgres
# DB_PASSWORD=postgres
```

### 3. Menjalankan Server
```bash
npm start
```
Buka peramban (browser) di: **[http://localhost:3000](http://localhost:3000)**

### 4. Cadangan & Pemulihan Data (Backup & Restore)
Aplikasi telah dilengkapi sistem perlindungan data otomatis:
- **Snapshot Otomatis**: Server secara otomatis membuat cadangan `.sqlite` dan `.json` di `data/backups/` setiap kali server dinyalakan serta berkala setiap 60 menit.
- **Pusat Backup di Web UI**: Klik tombol **"Backup Data"** di bagian atas halaman web untuk:
  - Mengunduh cadangan lengkap dalam format `.JSON` ke laptop Anda (1-klik).
  - Mengunduh file basis data `.sqlite`.
  - Memulihkan data (*restore*) kapan saja dari file `.json` yang telah Anda simpan.
  - Memulihkan dari riwayat snapshot otomatis di server.
- **Keamanan Seeding**: Perintah `npm run seed` kini otomatis membuat cadangan terlebih dahulu dan mendeteksi data pengguna agar tidak tertimpa tanpa izin.

---

## 📁 Struktur Direktori

```text
eportfolio-calon-guru/
├── config/
│   └── database.js          # Konfigurasi Sequelize ORM (PostgreSQL & SQLite)
├── controllers/
│   └── apiController.js     # Logika CRUD profil, artifak, dan refleksi
├── models/
│   ├── index.js             # Indeks model Sequelize
│   ├── Profile.js           # Model data profil calon guru & beranda
│   ├── Artifact.js          # Model artifak & analisis pedagogik mendalam
│   └── Reflection.js        # Model 3 pilar refleksi & RTL
├── routes/
│   └── api.js               # Definisi endpoint REST API
├── seeders/
│   └── seedData.js          # Pengisi data awal berstandar nilai 100 poin
├── public/                  # Frontend Vanilla JS
│   ├── index.html           # Struktur semantik utama & tata letak SPA
│   ├── css/
│   │   └── style.css        # Custom style, kartu akademis, dan mode cetak
│   └── js/
│       ├── app.js           # Controller utama & router navigasi Vanilla JS
│       └── components/
│           ├── homeView.js       # Tampilan Beranda
│           ├── artifactView.js   # Galeri artifak & filter kategori
│           ├── reflectionView.js # Refleksi KHD, Model Guru & RTL
│           └── modalView.js      # Modal analisis artifak & form tambah bukti
├── .env                     # File variabel lingkungan
├── package.json
└── README.md
```
