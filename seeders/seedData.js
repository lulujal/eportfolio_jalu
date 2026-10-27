const { sequelize, Profile, Artifact, Reflection, CourseReflection } = require('../models');
const { createAutoBackup } = require('../utils/backupManager');

async function seedDatabase(options = {}) {
  try {
    // 1. Amankan data dengan snapshot cadangan otomatis sebelum operasi apa pun!
    await createAutoBackup('before-seed');

    const isForce = options.force || process.argv.includes('--force') || process.env.FORCE_SEED === 'true';

    if (isForce) {
      console.log('[Seed] Mode FORCE aktif: Menyinkronkan ulang skema tabel...');
      await sequelize.sync({ force: true });
    } else {
      await sequelize.sync({ alter: true });
    }

    // 2. Cegah penimpaan data pengguna yang sudah tersimpan
    const existingProfile = await Profile.count();
    const existingArtifacts = await Artifact.count();
    if ((existingProfile > 0 || existingArtifacts > 0) && !isForce) {
      console.log('[Seed Aman] Data pengguna terdeteksi ada di basis data. Melewati penulisan seeder agar data tidak hilang.');
      console.log('[Seed Aman] (Catatan: Snapshot cadangan tetap dibuat di folder data/backups/)');
      return;
    }

    console.log('Database synced successfully.');

    // 1. Seed Profile Calon Guru (Beranda)
    await Profile.create({
      nama: 'Jalu Adhi Wiguna',
      gelar: 'S.Pd. (Calon Guru Profesional - PPG Prajabatan)',
      nim: '95202538N',
      lptk: 'Universitas Kristen Satya Wacana',
      prodi: 'PPG Prajabatan Bidang Studi Informatika',
      sekolah_mitra: 'SMA Kristen 1 Salatiga',
      guru_pamong: 'Endro Febrianto P.C, S.Kom.',
      dosen_pembimbing: 'Rissal Efendi, M.Kom',
      email: 'jaluadhi19@gmail.com',
      whatsapp: '+62 8511-7119-032',
      linkedin: 'https://www.linkedin.com/in/jalu-adhi-wiguna-a1a1b5249/',
      foto_url: 'https://media.licdn.com/dms/image/v2/D5603AQGud8nMlIEZYw/profile-displayphoto-scale_400_400/B56Zes6mpBHoAk-/0/1750952735016?e=1791417600&v=beta&t=jwvUbCR12yUtqjgG1jg2Qow7xdG_zCqyPt5ds64QVec',
      periode_ppl: 'Semester Ganjil 2026/2027 (PPL Mandiri)',
      total_jam_praktek: 288,
      sambutan_pengantar: 'Selamat datang di E-Portfolio Calon Guru PPL Mandiri. Portofolio digital ini disusun sebagai ruang dokumentasi komprehensif, telaah kritis, dan wujud akuntabilitas profesional dalam menuntaskan Praktik Pengalaman Lapangan (PPL) Mandiri. Melalui portofolio ini, disajikan berbagai artefak bukti pembelajaran otentik, mulai dari perencanaan modul ajar berdiferensiasi, inovasi media interaktif, portofolio hasil karya siswa, hingga dokumentasi video rekaman kelas. Setiap artefak disertai analisis mendalam berlandaskan kajian teori pedagogik mutakhir serta refleksi kritis yang berorientasi pada pengembangan keprofesian berkelanjutan.',
      visi_guru: 'Mewujudkan ekosistem pembelajaran informatika yang memerdekakan, humanis, visioner, dan kontekstual, di mana setiap peserta didik dihargai keunikan kodratnya, ditumbuhkan kemampuan nalar kritisnya, serta dibimbing menjadi insan berkarakter Profil Pelajar Pancasila.'
    });

    // 2. Seed Artifak Bukti Mengajar (5 Kategori Lengkap sesuai Rubrik)
    await Artifact.bulkCreate([
      {
        judul: 'Modul Ajar Informatika - Berpikir Komputasional',
        kategori: 'rpp',
        kategori_label: 'RPP / Modul Ajar',
        tanggal_kegiatan: '2026-07-22',
        kelas_target: 'Kelas X-4 (Fase E) - 4 Pilar Berpikir Komputasional (',
        deskripsi_singkat: 'Perencanaan pembelajaran terdiferensiasi konten dan proses yang dirancang berdasarkan hasil asesmen diagnostik awal kognitif dan gaya belajar siswa.',
        konteks: 'Diterapkan pada kelas X-A dengan jumlah 36 siswa yang memiliki kesiapan belajar heterogen (12 siswa pada kategori mahir, 18 siswa pada kategori berkembang, dan 6 siswa memerlukan bimbingan khusus). Situasi pembelajaran dirancang dalam kelompok kolaboratif berbasis tingkat kesiapan (readiness level).',
        tujuan: 'Peserta didik mampu memodelkan masalah kontekstual kehidupan sehari-hari ke dalam bentuk SPLTV, menyelesaikannya dengan metode gabungan (eliminasi-substitusi), serta mengomunikasikan argumen logis solusi secara kritis dan kolaboratif.',
        kelebihan: '1. Menyediakan scaffolding bertingkat sehingga siswa yang mengalami kesulitan tetap dapat mencapai tujuan pembelajaran.\n2. Memberikan tantangan pengayaan studi kasus nyata (optimalisasi anggaran wirausaha) bagi kelompok mahir.\n3. Lembar Kerja Peserta Didik (LKPD) dirancang berjenjang (Tiered Assignment) meningkatkan partisipasi aktif kelas hingga 92%.',
        kekurangan: 'Manajemen alokasi waktu pada tahap penarikan kesimpulan antarkelompok sempat mundur 10 menit karena intensitas diskusi kelompok terbimbing membutuhkan perhatian lebih dari guru.',
        kajian_teori: 'Modul ajar ini mengintegrasikan Teori Pembelajaran Berdiferensiasi (Differentiated Instruction) yang digagas oleh Carol Ann Tomlinson (2001), khususnya diferensiasi konten dan proses berdasarkan kesiapan belajar (readiness). Selain itu, penyediaan bantuan belajar mengacu pada konsep Scaffolding dalam Zone of Proximal Development (ZPD) oleh Lev Vygotsky (1978), di mana guru dan rekan sebaya bertindak sebagai More Knowledgeable Other (MKO).',
        file_url: 'https://docs.google.com/document/d/demo-modul-ajar-fase-e',
        file_nama: 'Modul_Ajar_SPLTV_Berdiferensiasi_FaseE.pdf',
        video_url: null,
        penilai: 'Dra. Hj. Ratna Juwita, M.Pd. (Guru Pamong)',
        nilai_feedback: 'Struktur modul ajar sangat terperinci dan telah mencerminkan asesmen diagnostik yang nyata. Rubrik penilaian performa dan diferensiasi langkah kerja sangat aplikatif.',
        urutan: 1
      },
      {
        judul: 'Media Pembelajaran Interaktif GeoGebra & Lembar Kerja Berbasis Discovery Learning',
        kategori: 'media',
        kategori_label: 'Media & Bahan Ajar',
        tanggal_kegiatan: '2025-10-06',
        kelas_target: 'Kelas XI-F (Fase F) - Materi Transformasi Geometri (Rotasi & Dilatasi)',
        deskripsi_singkat: 'Applet interaktif berbasis GeoGebra dinamis yang memungkinkan siswa melakukan simulasi rotasi dan dilatasi bangun datar secara visual dan intuitif.',
        konteks: 'Siswa sering mengalami hambatan kognitif dalam mengabstraksikan perpindahan koordinat rotasi sudut arbitrary. Media digital ini digunakan di laboratorium komputer dan melalui gawai siswa dengan pendekatan eksploratif terpandu.',
        tujuan: 'Memfasilitasi siswa menemukan sendiri (discovery) formula matriks transformasi rotasi terhadap titik pusat (0,0) dan (a,b) melalui manipulasi parameter geser (slider) pada koordinat bidang Kartesius.',
        kelebihan: '1. Mengubah konsep abstrak menjadi representasi visual konkret yang dapat dimanipulasi secara real-time.\n2. Mendorong kemandirian belajar di mana siswa membuat dugaan (conjecture) dan memverifikasinya sendiri.\n3. Skor kuis pemahaman konsep pasca-pembelajaran meningkat signifikan dengan rerata 86,5.',
        kekurangan: 'Memerlukan koneksi internet stabil dan kesiapan literasi digital awal siswa; beberapa siswa sempat terdistraksi dengan fitur lanjutan software.',
        kajian_teori: 'Pengembangan media ini berlandaskan kerangka kerja TPACK (Technological Pedagogical Content Knowledge) oleh Mishra & Koehler (2006) yang memadukan pedagogi Discovery Learning dengan teknologi interaktif. Serta didasarkan pada Teori Dual Coding oleh Allan Paivio dan Tahapan Representasi Enaktif-Ikonik-Simbolik oleh Jerome Bruner (1966).',
        file_url: 'https://www.geogebra.org/m/demo-transformasi-geometri',
        file_nama: 'Applet_GeoGebra_Transformasi_Geometri.ggb',
        video_url: null,
        penilai: 'Dr. Ahmad Syarif, M.Pd. (DPL)',
        nilai_feedback: 'Inovasi media tepat sasaran. Interaktivitas slider GeoGebra berhasil menstimulasi penalaran spasial siswa secara efektif.',
        urutan: 2
      },
      {
        judul: 'Portofolio Hasil Karya Siswa: Mini Riset Aplikasi Peluang & Asesmen Autentik',
        kategori: 'hasil_siswa',
        kategori_label: 'Contoh Hasil Kerja Siswa',
        tanggal_kegiatan: '2025-10-24',
        kelas_target: 'Kelas XII MIPA 2 - Materi Peluang Kejadian Majemuk',
        deskripsi_singkat: 'Koleksi artefak laporan proyek mini riset siswa tentang estimasi peluang rekayasa lalu lintas di simpang jalan kota, dilengkapi lembar asesmen autentik dan umpan balik formatif.',
        konteks: 'Peserta didik ditugaskan dalam kelompok kecil untuk mengumpulkan data empiris lapangan lalu mengaitkannya dengan konsep teori peluang binomial dan majemuk.',
        tujuan: 'Mengukur kompetensi aplikasi matematis tingkat tinggi (HOTS: C4-Menganalisis, C5-Mengevaluasi, C6-Mencipta) serta keterampilan kolaborasi dan komunikasi sains.',
        kelebihan: '1. Hasil karya siswa menunjukkan keberagaman solusi kreatif, orisinalitas ide, dan penggunaan representasi data infografis.\n2. Disertai rubrik asesmen analitik transparan yang memungkinkan siswa melakukan penilaian antarteman (peer-assessment) dan refleksi diri.\n3. Umpan balik formatif guru diberikan secara deskriptif dan terpersonalisasi.',
        kekurangan: 'Sebagian kelompok membutuhkan bimbingan teknis ekstra dalam validasi metodologi pengambilan sampel data di lapangan.',
        kajian_teori: 'Penerapan asesmen ini mengacu pada paradigma Assessment as Learning dan Assessment for Learning oleh Paul Black & Dylan Wiliam (1998), serta prinsip Asesmen Autentik oleh Grant Wiggins (1990) yang menekankan penilaian kinerja pada konteks kehidupan nyata.',
        file_url: 'https://drive.google.com/drive/folders/demo-karya-siswa',
        file_nama: 'Dokumentasi_Karya_Proyek_Peluang_Siswa.pdf',
        video_url: null,
        penilai: 'Dra. Hj. Ratna Juwita, M.Pd. (Guru Pamong)',
        nilai_feedback: 'Sangat membanggakan melihat siswa mampu menyusun laporan riset mini dengan analisis statistik yang runtut. Umpan balik yang diberikan guru sangat mendorong pertumbuhan (growth mindset).',
        urutan: 3
      },
      {
        judul: 'Lembar Observasi & Hasil Supervisi Klinis Pembelajaran oleh GP dan DPL',
        kategori: 'penilaian_supervisi',
        kategori_label: 'Penilaian dari GP & DPL',
        tanggal_kegiatan: '2025-11-12',
        kelas_target: 'Supervisi Klinis Siklus 1 & Siklus 2 (Kelas X-A & XI-F)',
        deskripsi_singkat: 'Dokumen lembar penilaian observasi pelaksanaan pembelajaran, catatan supervisi klinis pra/pasca-observasi, serta surat rekomendasi kompetensi mengajar calon guru dari Guru Pamong dan Dosen Pembimbing Lapangan.',
        konteks: 'Dilaksanakan melalui siklus supervisi kolegial 3 tahapan: pertemuan pra-observasi untuk menelaah kesiapan modul ajar, observasi kelas secara objektif, dan konferensi pasca-observasi untuk refleksi dialogis.',
        tujuan: 'Mengevaluasi ketercapaian empat kompetensi guru (pedagogik, kepribadian, sosial, dan profesional) calon pendidik secara objektif dan akuntabel.',
        kelebihan: '1. Mendapatkan predikat "Sangat Baik" (A) dengan skor 94/100 dari Guru Pamong dan 96/100 dari Dosen Pembimbing Lapangan.\n2. Catatan supervisi mencatat keunggulan dalam penguasaan materi, keterampilan bertanya mendalam (probing questions), dan penciptaan iklim kelas yang aman dan ramah anak.\n3. Catatan umpan balik konstruktif langsung ditindaklanjuti pada siklus pembelajaran berikutnya.',
        kekurangan: 'Pada supervisi siklus 1, terdapat catatan terkait kecepatan bicara guru pada fase penjelasan awal yang perlu diperlambat untuk memastikan pemahaman merata.',
        kajian_teori: 'Pelaksanaan supervisi ini mengadopsi model Supervisi Klinis oleh Morris Cogan (1973) dan Robert Goldhammer yang menekankan bimbingan kolegial yang humanis, bukan inspektif. Serta prinsip Teori Refleksi Tindakan oleh Donald Schön (1983) mengenai refleksi atas tindakan (reflection-on-action).',
        file_url: 'https://drive.google.com/file/d/demo-lembar-supervisi-ppl',
        file_nama: 'Lembar_Penilaian_Supervisi_GP_dan_DPL.pdf',
        video_url: null,
        penilai: 'Dr. Ahmad Syarif, M.Pd. & Dra. Hj. Ratna Juwita, M.Pd.',
        nilai_feedback: 'Calon guru menunjukkan kematangan pedagogik yang luar biasa. Sangat terbuka terhadap masukan, komunikatif, dan memiliki wibawa kepemimpinan pembelajaran di dalam kelas.',
        urutan: 4
      },
      {
        judul: 'Dokumentasi Video Praktik Mengajar PPL Mandiri: Penerapan Model Problem-Based Learning',
        kategori: 'video_praktik',
        kategori_label: 'Video Praktik Mengajar',
        tanggal_kegiatan: '2025-11-20',
        kelas_target: 'Kelas X-A - Praktik Pembelajaran Terbimbing (Durasi Video: 15 Menit Efektif)',
        deskripsi_singkat: 'Video kompilasi praktik mengajar yang memperlihatkan sintaks lengkap Problem-Based Learning: orientasi masalah kontekstual, penyelidikan kelompok, presentasi hasil karya, dan evaluasi pemecahan masalah.',
        konteks: 'Perekaman kelas dilakukan secara natural selama 2 jam pelajaran (2 x 45 menit) kemudian disunting menjadi video cuplikan 15 menit esensial yang menonjolkan interaksi guru-siswa, scaffolding, dan manajemen kelas.',
        tujuan: 'Mendokumentasikan bukti visual performa mengajar, interaksi dialogis, penggunaan media pembelajaran nyata di kelas, serta implementasi profil pelajar Pancasila.',
        kelebihan: '1. Memperlihatkan secara nyata antusiasme siswa dalam adu gagasan matematika.\n2. Menampilkan keterampilan guru dalam mengelola transisi aktivitas kelas secara mulus tanpa kegaduhan.\n3. Menjadi bahan introspeksi visual mandiri melalui analisis rekaman video pembelajaran.',
        kekurangan: 'Pencahayaan pada sudut ruangan tertentu sedikit kurang optimal dan mikrofon nirkabel sempat terputus sesaat saat guru berpindah ke kelompok pojok.',
        kajian_teori: 'Landasan teoretis mengacu pada Model Pembelajaran Berbasis Masalah (Problem-Based Learning) oleh Howard Barrows (1980) yang melatih kemampuan metakognitif. Serta konsep Video-Based Self Reflection dalam pengembangan profesional guru oleh John Hattie (Visible Learning for Teachers, 2012).',
        file_url: 'https://youtube.com/watch?v=demo-video-mengajar-ppl',
        file_nama: 'Video_Praktik_Mengajar_PPL_Mandiri.mp4',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Link contoh embed
        penilai: 'Dra. Hj. Ratna Juwita, M.Pd.',
        nilai_feedback: 'Gestur, intonasi, dan artikulasi mengajar sangat prima. Terlihat jelas kedekatan yang hangat dan saling menghormati antara calon guru dengan para peserta didik.',
        urutan: 5
      }
    ]);

    // 3. Seed Refleksi Calon Guru (3 Pilar Rubrik: Model Guru, Filosofi Mengajar, Refleksi Akhir & RTL)
    await Reflection.bulkCreate([
      {
        kategori: 'model_guru_tujuan',
        judul: 'Model Guru yang Dituju: Sosok Pendidik Transformatif & Pembelajar Sepanjang Hayat',
        subjudul: 'Mewujudkan Profil Pendidik Abad ke-21 yang Berdaya dan Memberdayakan',
        kutipan_filosofis: '"Guru bukan sekadar penyampai materi, melainkan arsitek peradaban yang menyalakan pelita rasa ingin tahu anak manusia."',
        konten: 'Model guru yang saya tuju dalam perjalanan profesi ini adalah sosok Pendidik Transformatif yang memposisikan dirinya sebagai pembelajar sepanjang hayat (lifelong learner). Sebagai guru matematika, saya tidak ingin menjadi pengajar konvensional yang hanya mendikte rumus-rumus kaku dan menuntut hafalan mekanis. Sebaliknya, saya bertekad menjadi fasilitator yang menghadirkan matematika sebagai bahasa logika alam semesta yang ramah, bermakna, dan menyenangkan bagi setiap anak.\n\nSosok guru yang saya tuju memiliki 3 pilar integritas utama: (1) Kecerdasan Pedagogik yang empatik, mampu membaca kebutuhan emosional dan kognitif setiap murid; (2) Penguasaan Teknologi & Konten (TPACK) yang adaptif terhadap dinamika zaman; dan (3) Keteladanan Moral yang mencerminkan nilai-nilai luhur Pancasila. Saya ingin menjadi guru yang dirindukan kehadirannya di kelas, bukan karena tuntutan nilai, melainkan karena atmosfer belajar yang menumbuhkan rasa aman, saling percaya, dan kebebasan bereksplorasi tanpa takut berbuat salah.',
        kekuatan: '• Kemampuan mendengar aktif dan membangun relasi empati yang positif dengan peserta didik dari berbagai latar belakang.\n• Kemauan tinggi untuk terus mengadopsi perangkat digital dan inovasi pedagogik terbaru.\n• Reflektif dan terbuka terhadap kritik serta masukan sejawat.',
        kelemahan: '• Terkadang memiliki ekspektasi perfeksionis yang berpotensi memicu keletihan mental jika target pembelajaran tidak tercapai sempurna dalam sekali pertemuan.',
        rencana_tindak_lanjut: '1. Mempraktikkan mindfulness dalam mengajar untuk mengelola stres dan menjaga energi emosional positif di dalam kelas.\n2. Aktif berjejaring di Komunitas Belajar Guru Penggerak dan Forum MGMP Matematika untuk saling berbagi praktik baik.',
        poin_utama: JSON.stringify([
          'Pendidik Transformatif yang mengutamakan pertumbuhan karakter dan nalar kritis',
          'Pembelajar sepanjang hayat yang adaptif terhadap integrasi AI dan edutech',
          'Membangun kelas aman psikologis (psychological safety) di mana salah bukan aib, melainkan awal pemahaman'
        ]),
        urutan: 1
      },
      {
        kategori: 'filosofi_mengajar',
        judul: 'Filosofi Pendidikan Ki Hadjar Dewantara: Menuntun Kodrat dan Menghamba pada Murid',
        subjudul: 'Meresapi Hakikat Pengajaran sebagai Proses Humanisasi dan Kemerdekaan Berpikir',
        kutipan_filosofis: '"Ing ngarsa sung tuladha, ing madya mangun karsa, tut wuri handayani. Pendidikan adalah menuntun segala kekuatan kodrat yang ada pada anak-anak itu, agar mereka sebagai manusia dan anggota masyarakat dapat mencapai keselamatan dan kebahagiaan yang setinggi-tingginya."',
        konten: 'Filosofi mengajar saya berakar kuat pada ajaran Bapak Pendidikan Nasional, Ki Hadjar Dewantara (KHD). KHD mengibaratkan pendidik sebagai seorang petani atau tukang kebun, dan peserta didik sebagai butir-butir benih tanaman yang disemai di ladang. Padi tidak akan pernah bisa dipaksakan tumbuh menjadi jagung, demikian pula sebaliknya. Peran pendidik bukanlah mengubah hakikat benih tersebut, melainkan menyiapkan lahan yang subur, menyiram, memupuk, membasmi hama, dan memberi pencahayaan terbaik agar benih padi tersebut tumbuh menjadi bulir padi yang ranum dan unggul.\n\nDalam ruang kelas matematika saya, filosofi ini dimanifestasikan dalam penghormatan terhadap "Kodrat Alam" (bakat alami, gaya belajar, dan ritme pemikiran siswa yang unik) serta "Kodrat Zaman" (kebutuhan literasi digital dan komputasional di era kecerdasan artifisial). Menuntun berarti tidak menindas rasa ingin tahu murid; menghamba pada murid berarti menempatkan kebermanfaatan dan kesejahteraan mental murid (student well-being) sebagai episentrum dari segala keputusan pembelajaran.',
        kekuatan: '• Mampu merancang pembelajaran yang tidak seragam (diferensiasi) untuk menghargai keberagaman kodrat murid.\n• Pendekatan dialogis socrates yang menstimulasi rasa ingin tahu murid tanpa langsung memberikan jawaban jadi.',
        kelemahan: '• Masih membutuhkan pendalaman strategi asesmen diagnostik non-kognitif yang lebih terstruktur untuk memetakan latar belakang sosio-emosional murid secara holistik.',
        rencana_tindak_lanjut: '1. Mengintegrasikan instrumen Socio-Emotional Learning (SEL) ke dalam kegiatan awal pembelajaran (check-in emosi harian).\n2. Mengkaji lebih dalam naskah-naskah asli pemikiran KHD tentang Asas Trikon (Kontinuitas, Konvergensi, Konsentris) untuk diaplikasikan dalam kurikulum lokal.',
        poin_utama: JSON.stringify([
          'Pendidikan sebagai proses menuntun benih kodrat alam dan kodrat zaman anak',
          'Trilogi Kepemimpinan Guru: Ing Ngarsa Sung Tuladha, Ing Madya Mangun Karsa, Tut Wuri Handayani',
          'Pembelajaran yang Berpusat pada Murid (Student-Centered) dan memperhatikan Student Well-Being'
        ]),
        urutan: 2
      },
      {
        kategori: 'refleksi_akhir_ppl',
        judul: 'Refleksi Akhir PPL Mandiri: Analisis Kekuatan Diri, Area Perbaikan, dan Rencana Tindak Lanjut (RTL)',
        subjudul: 'Evaluasi Komprehensif Perjalanan Praktik Pengalaman Lapangan Menuju Pendidik Profesional Berkelanjutan',
        kutipan_filosofis: '"Pendidik yang hebat bukanlah mereka yang tidak pernah melakukan kesalahan di dalam kelas, melainkan mereka yang selalu bercermin dan bangkit memperbaiki diri dari setiap pengalaman."',
        konten: 'Menuntaskan 288 jam Praktik Pengalaman Lapangan (PPL) Mandiri di SMA Negeri 1 Bandung merupakan kawah candradimuka yang paling transformatif dalam perjalanan saya sebagai calon guru. Melalui interaksi nyata dengan ratusan murid, bimbingan intensif dari Guru Pamong, serta supervisi mendalam Dosen Pembimbing Lapangan, saya belajar bahwa mengajar bukan semata-mata seni mentransfer rumus matematika di papan tulis, melainkan kepiawaian mengelola ekosistem belajar manusiawi yang penuh dinamika rasa, logika, dan harapan.\n\nSelama PPL Mandiri, saya mengalami berbagai lompatan kematangan: dari yang awalnya gugup mengatur alokasi waktu dan tegang ketika siswa terlihat pasif, hingga mampu menciptakan suasana kelas interaktif berbasis pemecahan masalah nyata. Evaluasi diri ini disusun sebagai pijakan kokoh untuk melangkah ke jenjang karir guru profesional bersertifikat.',
        kekuatan: '1. Penguasaan Pedagogi Konten (PCK): Mampu menyederhanakan konsep matematika tingkat tinggi menjadi analogi sehari-hari yang mudah dicerna siswa.\n2. Integrasi Teknologi Pembelajaran: Menguasai GeoGebra, Quizizz, Desmos, dan Google Workspace for Education yang meningkatkan partisipasi kelas hingga >90%.\n3. Kemampuan Reflektif: Terbiasa membuat jurnal refleksi harian setelah setiap sesi mengajar untuk mencatat respons emosional dan kognitif siswa.\n4. Kemitraan Sejawat: Terbina komunikasi kolegial yang sangat sehat dan apresiatif dengan guru pamong, staf tata usaha, dan rekan mahasiswa PPL.',
        kelemahan: '1. Manajemen Waktu Diskusi: Cenderung memberikan kelonggaran waktu berlebih ketika siswa tampak asyik berdiskusi, sehingga fase sintesis kesimpulan akhir sering tergesa-gesa.\n2. Diferensiasi Produk: Belum seluruhnya siswa diberikan kebebasan memilih bentuk penyajian laporan tugas (sebagian besar masih berupa lembar kerja tertulis).\n3. Penanganan Siswa Introvert: Belum semua siswa dengan kepribadian pendiam mendapatkan giliran bersuara dalam forum diskusi pleno.',
        rencana_tindak_lanjut: '1. Jangka Pendek (1-3 Bulan): Menyelesaikan portofolio Uji Kinerja (UKin) PPG dengan revisi komprehensif atas seluruh catatan masukan Guru Pamong dan DPL; membagikan media GeoGebra yang telah dibuat ke repositori terbuka MGMP.\n2. Jangka Menengah (6-12 Bulan): Mengikuti pelatihan asesmen diagnostik berdiferensiasi dan bimbingan konseling dasar bagi guru mapel; menulis artikel ilmiah hasil Penelitian Tindakan Kelas (PTK) PPL di jurnal pendidikan terindeks SINTA.\n3. Jangka Panjang (1-3 Tahun): Mendaftar program Guru Penggerak Kemendikbudristek, mengikuti sertifikasi pendidik profesional, serta merancang buku panduan lembar kerja matematika kontekstual berbasis kearifan lokal.',
        poin_utama: JSON.stringify([
          'Tuntas 288 jam pengalaman mengajar terbimbing dan mandiri dengan predikat Sangat Baik',
          'Pemetaan matang atas 4 pilar kekuatan pedagogik dan 3 aspek perbaikan diri',
          'Rencana Tindak Lanjut (RTL) terukur: Jangka Pendek (UKin), Menengah (Publikasi PTK), dan Panjang (Guru Penggerak)'
        ]),
        urutan: 3
      }
    ]);

    // 4. Seed Refleksi Pengalaman Belajar Mata Kuliah 2 Semester (PPG Prajabatan)
    await CourseReflection.bulkCreate([
      // Semester 1
      {
        nama_mata_kuliah: 'Filosofi Pendidikan Indonesia',
        kode_mk: 'PPG-101',
        semester: 'Semester 1',
        sks: 2,
        dosen_pengampu: 'Prof. Dr. Sunaryo, M.Pd.',
        deskripsi_singkat: 'Mengkaji hakikat, sejarah pemikiran, dan filosofi pendidikan Ki Hadjar Dewantara serta perwujudan Profil Pelajar Pancasila.',
        pengalaman_belajar: 'Mata kuliah ini merekonstruksi cara pandang saya mengenai makna pengajaran. Saya belajar bahwa mendidik bukan menuntut melainkan menuntun benih kodrat yang telah ada pada murid, menghargai latar belakang sosio-kultural, dan membebaskan potensi nalar anak didik.',
        artefak_pembelajaran: 'Infografis & Video Presentasi: "Kontekstualisasi Pemikiran Ki Hadjar Dewantara pada Pembelajaran Abad ke-21".',
        analisis_refleksi: 'Artefak ini bermakna mendalam karena saya mengaitkan asas Trikon KHD dengan era disrupsi digital. Saya menyadari bahwa kemajuan teknologi harus tetap berpijak pada akar kebudayaan dan nilai kemanusiaan.',
        desain_pembelajaran_baru: 'Menerapkan kesepakatan belajar partisipatif di kelas dan merancang pembelajaran yang berpusat pada minat serta student well-being.',
        pdf_file_url: 'https://docs.google.com/document/d/demo-filosofi-pendidikan',
        pdf_file_nama: 'Refleksi_Filosofi_Pendidikan_Indonesia.pdf',
        urutan: 1
      },
      {
        nama_mata_kuliah: 'Pemahaman tentang Peserta Didik dan Pembelajarannya',
        kode_mk: 'PPG-102',
        semester: 'Semester 1',
        sks: 3,
        dosen_pengampu: 'Dr. Lilis Suryani, M.Psi.',
        deskripsi_singkat: 'Mempelajari teori perkembangan kognitif, sosio-emosional, profil peserta didik, dan lingkungan belajar yang aman dan nyaman.',
        pengalaman_belajar: 'Saya memahami bahwa setiap peserta didik memiliki tahapan perkembangan dan gaya belajar yang berbeda. Pendekatan Teaching at the Right Level (TaRL) dan Culturally Responsive Teaching (CRT) menjadi instrumen penting.',
        artefak_pembelajaran: 'Laporan Profiling Peserta Didik & Hasil Asesmen Diagnostik Non-Kognitif Kelas X Informatika.',
        analisis_refleksi: 'Melalui penyusunan profiling, saya menyadari pentingnya data diagnostik sebelum menyusun rancangan ajar agar materi yang diajarkan tepat sasaran.',
        desain_pembelajaran_baru: 'Selalu memulai siklus pembelajaran dengan pemetaan gaya belajar dan refleksi emosi (check-in emosi).',
        pdf_file_url: 'https://docs.google.com/document/d/demo-profiling-peserta-didik',
        pdf_file_nama: 'Laporan_Profiling_Peserta_Didik.pdf',
        urutan: 2
      },
      {
        nama_mata_kuliah: 'Prinsip Pengajaran dan Asesmen I',
        kode_mk: 'PPG-103',
        semester: 'Semester 1',
        sks: 3,
        dosen_pengampu: 'Dr. H. Mamat Supriatna, M.Pd.',
        deskripsi_singkat: 'Perancangan pembelajaran dan asesmen autentik dengan pendekatan Understanding by Design (UbD).',
        pengalaman_belajar: 'Mempelajari backward design di mana tujuan pembelajaran dan asesmen bukti kinerja dirumuskan terlebih dahulu sebelum menentukan aktivitas kelas.',
        artefak_pembelajaran: 'Modul Ajar Berbasis Understanding by Design (UbD) Topik Algoritma Pemrograman.',
        analisis_refleksi: 'Pendekatan UbD membantu saya menghindari jebakan aktivitas belajar tanpa arah yang jelas, memastikan setiap aktivitas bermakna bagi capaian akhir.',
        desain_pembelajaran_baru: 'Merancang rubrik analitik transparan yang dibagikan kepada peserta didik di awal pembelajaran.',
        pdf_file_url: 'https://docs.google.com/document/d/demo-prinsip-pengajaran-1',
        pdf_file_nama: 'Rancangan_UbD_Prinsip_Pengajaran_I.pdf',
        urutan: 3
      },
      {
        nama_mata_kuliah: 'Praktik Pengalaman Lapangan I (PPL I)',
        kode_mk: 'PPG-104',
        semester: 'Semester 1',
        sks: 6,
        dosen_pengampu: 'Rissal Efendi, M.Kom / Endro Febrianto P.C, S.Kom.',
        deskripsi_singkat: 'Orientasi sekolah, observasi manajemen kurikulum, iklim kelas, dan asistensi mengajar terbimbing.',
        pengalaman_belajar: 'Merasakan langsung dinamika atmosfer persekolahan di SMA Kristen 1 Salatiga, melakukan observasi komprehensif, dan mendampingi guru pamong dalam asistensi mengajar.',
        artefak_pembelajaran: 'Laporan Komprehensif Observasi PPL I & Jurnal Refleksi Mingguan Asistensi Mengajar.',
        analisis_refleksi: 'Menjembatani teori akademik di kampus dengan realitas keberagaman murid di ruang kelas nyata.',
        desain_pembelajaran_baru: 'Memperkuat manajemen kelas dan komunikasi empatik dengan peserta didik.',
        pdf_file_url: 'https://docs.google.com/document/d/demo-laporan-ppl-1',
        pdf_file_nama: 'Laporan_Observasi_PPL_I.pdf',
        urutan: 4
      },

      // Semester 2
      {
        nama_mata_kuliah: 'Pembelajaran Berdiferensiasi',
        kode_mk: 'PPG-201',
        semester: 'Semester 2',
        sks: 2,
        dosen_pengampu: 'Dr. Wawan Setiawan, M.Ed.',
        deskripsi_singkat: 'Teori dan implementasi diferensiasi konten, proses, produk, dan lingkungan belajar sesuai kesiapan peserta didik.',
        pengalaman_belajar: 'Belajar bagaimana mengakomodasi keberagaman kesiapan belajar (readiness), minat, dan profil belajar tanpa menurunkan standar kompetensi esensial.',
        artefak_pembelajaran: 'Rancangan Modul Ajar Berdiferensiasi Berjenjang (Tiered Assignment) Materi Struktur Data.',
        analisis_refleksi: 'Diferensiasi bukan berarti membuat tugas berbeda untuk setiap murid, melainkan menyediakan jalur belajar bertingkat dengan scaffolding yang proporsional.',
        desain_pembelajaran_baru: 'Menyediakan pilihan produk akhir (projek kode, infografis, atau presentasi video) sesuai minat siswa.',
        pdf_file_url: 'https://docs.google.com/document/d/demo-pembelajaran-berdiferensiasi',
        pdf_file_nama: 'Modul_Ajar_Pembelajaran_Berdiferensiasi.pdf',
        urutan: 5
      },
      {
        nama_mata_kuliah: 'Prinsip Pengajaran dan Asesmen II',
        kode_mk: 'PPG-202',
        semester: 'Semester 2',
        sks: 3,
        dosen_pengampu: 'Dr. H. Mamat Supriatna, M.Pd.',
        deskripsi_singkat: 'Pengembangan instrumen asesmen diagnostik, formatif, sumatif, serta refleksi evaluasi siklus PPL.',
        pengalaman_belajar: 'Mengeksplorasi asesmen sebagai proses belajar (Assessment as Learning) yang melibatkan self-assessment dan peer-assessment peserta didik.',
        artefak_pembelajaran: 'Portofolio Asesmen Autentik Berbasis Proyek Pemrograman Python.',
        analisis_refleksi: 'Memberikan umpan balik deskriptif tepat waktu jauh lebih berdampak pada kemajuan belajar murid daripada sekadar memberi skor angka.',
        desain_pembelajaran_baru: 'Mengintegrasikan rubrik penilaian diri dan refleksi formatif berkala pada setiap akhir bab pembelajaran.',
        pdf_file_url: 'https://docs.google.com/document/d/demo-prinsip-pengajaran-2',
        pdf_file_nama: 'Instrumen_Asesmen_Autentik_PPA_II.pdf',
        urutan: 6
      },
      {
        nama_mata_kuliah: 'Computational Thinking dalam Pendidikan',
        kode_mk: 'PPG-203',
        semester: 'Semester 2',
        sks: 2,
        dosen_pengampu: 'Ir. Budi Rahardjo, Ph.D.',
        deskripsi_singkat: 'Pengintegrasian 4 pilar CT (Dekomposisi, Pengenalan Pola, Abstraksi, Algoritma) dalam memecahkan masalah kompleks lintas mata pelajaran.',
        pengalaman_belajar: 'Mendalami perancangan tugas unplugged maupun plugged yang menstimulasi keterampilan berpikir komputasional sebagai bekal literasi abad 21.',
        artefak_pembelajaran: 'Lembar Kerja Peserta Didik (LKPD) CT Unplugged: Simulasi Jalur Terpendek Graf.',
        analisis_refleksi: 'Computational Thinking bukan sekadar menulis sintaks kode, melainkan proses bernalar logis, sistematis, dan efisien dalam menyelesaikan masalah.',
        desain_pembelajaran_baru: 'Menyisipkan tantangan logika dan problem solving terstruktur dalam studi kasus kontekstual.',
        pdf_file_url: 'https://docs.google.com/document/d/demo-computational-thinking',
        pdf_file_nama: 'Modul_Computational_Thinking_Pendidikan.pdf',
        urutan: 7
      },
      {
        nama_mata_kuliah: 'Seminar Pendidikan Profesi Guru',
        kode_mk: 'PPG-204',
        semester: 'Semester 2',
        sks: 1,
        dosen_pengampu: 'Tim Dosen PPG UKSW',
        deskripsi_singkat: 'Refleksi kritis menyeluruh atas seluruh pengalaman belajar PPG, penyusunan portofolio digital, dan rencana aksi guru profesional.',
        pengalaman_belajar: 'Merefleksikan transformasi identitas diri dari seorang pembelajar menjadi calon pendidik profesional yang memiliki kematangan intelektual, emosional, dan spiritual.',
        artefak_pembelajaran: 'Artikel Jurnal Refleksi Kritis: "Paradigma Baru Guru Profesional Abad 21 dalam Mewujudkan Merdeka Belajar".',
        analisis_refleksi: 'Menyadari bahwa menjadi guru adalah panggilan jiwa untuk terus belajar sepanjang hayat demi kemajuan peradaban bangsa.',
        desain_pembelajaran_baru: 'Terus aktif dalam komunitas praktisi, MGMP, dan publikasi penelitian tindakan kelas berkelanjutan.',
        pdf_file_url: 'https://docs.google.com/document/d/demo-seminar-ppg',
        pdf_file_nama: 'Artikel_Seminar_Refleksi_Kritis_PPG.pdf',
        urutan: 8
      }
    ]);

    console.log('Semua data awal (Profil, Artifak, Refleksi, dan Refleksi Mata Kuliah 2 Semester) berhasil dimasukkan ke basis data.');
  } catch (error) {
    console.error('Gagal melakukan seed data:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('Seeding selesai.');
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
