const tutorialSections = [
  {
    title: "Apa itu Algebra Quest?",
    body: `
      <p>
        Algebra Quest adalah game edukasi matematika yang menggabungkan belajar dan petualangan.
        Pemain belajar melalui world, stage, dan battle. Setiap stage berisi soal yang berbeda
        sesuai materi yang sedang dipelajari.
      </p>

      <div class="tutorial-note">
        Game ini dirancang agar pemain tidak hanya menjawab soal, tetapi juga memahami urutan materi
        secara bertahap dari yang lebih dasar ke yang lebih menantang.
      </div>
    `
  },

  {
    title: "Cara memainkan Algebra Quest",
    body: `
      <ol class="tutorial-list tutorial-list-numbered">
        <li>Buka game lalu login dari halaman awal.</li>
        <li>Masuk ke halaman utama atau home.</li>
        <li>Tekan tombol <b>Mulai Petualangan</b>.</li>
        <li>Geser daftar world dan pilih world yang aktif.</li>
        <li>Masuk ke area stage di dalam world.</li>
        <li>Klik salah satu node stage untuk memulai battle.</li>
        <li>Baca soal, jawab dengan teliti, lalu lanjutkan sampai musuh kalah.</li>
        <li>Dapatkan EXP, lalu lanjut ke stage berikutnya atau kembali ke map.</li>
      </ol>

      <div class="tutorial-note">
        Alur singkat permainan: <b>Login → Home → Map → World → Stage → Battle → EXP → lanjut stage berikutnya</b>.
      </div>
    `
  },

  {
    title: "Cara menjawab soal di Battle Screen",
    body: `
      <p>
        Saat battle dimulai, soal akan muncul di panel utama. Jawabanmu dipakai untuk menentukan
        apakah serangan berhasil atau tidak.
      </p>

      <ol class="tutorial-list tutorial-list-numbered">
        <li>Baca soal dengan teliti.</li>
        <li>Perhatikan bentuk jawaban yang diminta.</li>
        <li>Pilih jawaban atau ketik jawaban jika stage meminta input.</li>
        <li>Kalau jawaban benar, musuh menerima damage.</li>
        <li>Kalau jawaban salah, pemain menerima serangan balasan.</li>
        <li>Tekan tombol <b>Lanjut Soal</b> untuk masuk ke soal berikutnya.</li>
      </ol>

      <div class="tutorial-subtitle">Contoh ragam soal yang bisa muncul</div>

      <div class="tutorial-example-box">
        <div class="tutorial-example-title">Contoh bentuk soal bilangan</div>
        <ul class="tutorial-list">
          <li>-12 + 7 = ...</li>
          <li>18 ÷ (-3) = ...</li>
          <li>12 ÷ 3 + 4 × 2 = ...</li>
          <li>Sederhanakan 18/24</li>
          <li>Ubah 1 2/5 ke bentuk desimal</li>
          <li>Urutkan dari terkecil ke terbesar: 0.50, 2/3, 1 1/4</li>
          <li>Bilangan 37 adalah bilangan prima. Pernyataan tersebut ...</li>
        </ul>
      </div>

      <div class="tutorial-example-box">
        <div class="tutorial-example-title">Contoh bentuk soal aljabar</div>
        <ul class="tutorial-list">
          <li>Perbandingan apel dan jeruk adalah 2:3. Jika apel 8, maka jeruk ...</li>
          <li>Pada skala 1:300, jarak 4 cm mewakili jarak sebenarnya ...</li>
          <li>Tentukan koefisien dari x pada bentuk 3x - 2y + 4</li>
          <li>Sederhanakan 3x + 2y - x + 4</li>
          <li>Tentukan nilai x dari 2x + 3 = 11</li>
          <li>Pada himpunan bilangan bulat dari -10 sampai 10, banyak nilai x yang memenuhi x &gt; 2 adalah ...</li>
          <li>Jika f(x) = 2x + 3, tentukan f(4)</li>
          <li>Tentukan persamaan garis dengan kemiringan 2 dan memotong sumbu Y di 3</li>
          <li>Diketahui x + y = 10 dan x - y = 2. Nilai x adalah ...</li>
        </ul>
      </div>

      <div class="tutorial-note">
        Saat ini sebagian besar soal pada battle muncul sebagai pilihan jawaban. Sistem battle juga
        sudah mendukung jawaban input angka jika nanti dipakai pada stage tertentu.
      </div>
    `
  },

  {
    title: "Penjelasan world yang tersedia",
    body: `
      <div class="tutorial-world-grid">
        <div class="tutorial-world-card">
          <div class="tutorial-world-name">Dunia Bilangan</div>
          <div class="tutorial-world-desc">
            World ini berisi materi bilangan dan menjadi dasar sebelum masuk ke materi yang lebih abstrak.
          </div>
        </div>

        <div class="tutorial-world-card">
          <div class="tutorial-world-name">Dunia Aljabar</div>
          <div class="tutorial-world-desc">
            World ini berisi materi rasio, bentuk aljabar, fungsi, persamaan garis, dan SPLDV.
          </div>
        </div>

        <div class="tutorial-world-card tutorial-world-card-muted">
          <div class="tutorial-world-name">Dunia Geometri</div>
          <div class="tutorial-world-desc">
            World ini sudah muncul di map, tetapi belum aktif dimainkan.
          </div>
        </div>

        <div class="tutorial-world-card tutorial-world-card-muted">
          <div class="tutorial-world-name">Dunia Data dan Peluang</div>
          <div class="tutorial-world-desc">
            World ini juga sudah tampil di map, tetapi masih menunggu pengembangan lebih lanjut.
          </div>
        </div>
      </div>
    `
  },
  {
  title: "Penjabaran soal yang terdapat pada world 1",
    body: `
        <p>
        World 1 berisi materi bilangan. Susunannya bergerak dari operasi dasar, lalu pecahan dan desimal,
        kemudian FPB-KPK dan bilangan prima, lalu ditutup dengan pangkat, akar, dan final boss.
        </p>

        <div class="tutorial-subtitle">Rincian stage World 1</div>

        <div class="tutorial-stage-grid">

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 1</div>
            <div class="tutorial-stage-topic">Penjumlahan dan pengurangan bilangan bulat</div>
            <div class="tutorial-stage-desc">
            Soal berisi operasi tambah atau kurang dengan bilangan bulat positif dan negatif.
            Contoh bentuk: -12 + 7, 18 - (-5).
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 2</div>
            <div class="tutorial-stage-topic">Perkalian bilangan bulat</div>
            <div class="tutorial-stage-desc">
            Soal berisi perkalian dua bilangan bulat, termasuk yang bernilai negatif.
            Contoh bentuk: (-4) × 6.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 3</div>
            <div class="tutorial-stage-topic">Pembagian bilangan bulat</div>
            <div class="tutorial-stage-desc">
            Soal berisi pembagian bilangan bulat dengan hasil tetap bilangan bulat.
            Contoh bentuk: -24 ÷ 6.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 4</div>
            <div class="tutorial-stage-topic">Operasi campuran bilangan bulat</div>
            <div class="tutorial-stage-desc">
            Soal menggabungkan tambah, kurang, kali, dan bagi. Kadang memakai tanda kurung.
            Contoh bentuk: 12 ÷ 3 + 4 × 2 atau operasi campuran yang lebih panjang.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 5</div>
            <div class="tutorial-stage-topic">Penyederhanaan pecahan</div>
            <div class="tutorial-stage-desc">
            Soal meminta pemain menyederhanakan pecahan biasa atau pecahan campuran.
            Contoh bentuk: sederhanakan 18/24 atau 2 4/8.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 6</div>
            <div class="tutorial-stage-topic">Pecahan ke desimal</div>
            <div class="tutorial-stage-desc">
            Soal meminta mengubah pecahan biasa atau pecahan campuran ke bentuk desimal.
            Contoh bentuk: ubah 3/4 atau 1 2/5 ke desimal.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 7</div>
            <div class="tutorial-stage-topic">Perbandingan nilai</div>
            <div class="tutorial-stage-desc">
            Soal meminta membandingkan dua nilai dengan tanda lebih besar, lebih kecil, atau sama dengan.
            Nilainya bisa berupa pecahan, pecahan campuran, atau desimal.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 8</div>
            <div class="tutorial-stage-topic">Mengurutkan bilangan</div>
            <div class="tutorial-stage-desc">
            Soal meminta mengurutkan beberapa bilangan dari kecil ke besar atau dari besar ke kecil.
            Bentuk bilangannya dapat berupa pecahan, pecahan campuran, dan desimal.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 9</div>
            <div class="tutorial-stage-topic">Bilangan prima</div>
            <div class="tutorial-stage-desc">
            Soal berbentuk pernyataan benar atau salah tentang apakah suatu bilangan termasuk bilangan prima.
            Contoh bentuk: “Bilangan 37 adalah bilangan prima.”
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 10</div>
            <div class="tutorial-stage-topic">Faktorisasi prima</div>
            <div class="tutorial-stage-desc">
            Soal meminta menentukan faktorisasi prima dari suatu bilangan, biasanya bilangan ratusan.
            Contoh bentuk: faktorisasi prima dari 180 adalah ...
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 11</div>
            <div class="tutorial-stage-topic">FPB dan KPK</div>
            <div class="tutorial-stage-desc">
            Soal meminta mencari FPB atau KPK dari dua atau tiga bilangan.
            Contoh bentuk: FPB dari 12, 18, dan 24 atau KPK dari 8 dan 12.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 12</div>
            <div class="tutorial-stage-topic">Soal cerita FPB dan KPK</div>
            <div class="tutorial-stage-desc">
            Soal berbentuk cerita, misalnya pembagian barang ke kelompok, jadwal kegiatan berulang,
            atau kejadian yang muncul bersamaan lagi setelah beberapa waktu.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 13</div>
            <div class="tutorial-stage-topic">Konsep pangkat</div>
            <div class="tutorial-stage-desc">
            Soal melatih pemahaman bentuk pangkat dan hubungan pangkat dengan perkalian berulang.
            Contoh bentuk: 2³ = ..., atau 3 × 3 × 3 dapat ditulis sebagai ...
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 14</div>
            <div class="tutorial-stage-topic">Sifat pangkat</div>
            <div class="tutorial-stage-desc">
            Soal membahas operasi pangkat dengan basis sama, terutama perkalian dan pembagian.
            Contoh bentuk: 2³ × 2² atau 5⁴ ÷ 5².
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 15</div>
            <div class="tutorial-stage-topic">Akar kuadrat</div>
            <div class="tutorial-stage-desc">
            Soal meminta menentukan hasil akar kuadrat dari bilangan kuadrat sempurna.
            Contoh bentuk: √49 = ...
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 16</div>
            <div class="tutorial-stage-topic">Operasi campuran pangkat dan akar</div>
            <div class="tutorial-stage-desc">
            Soal menggabungkan pangkat dan akar dalam satu ekspresi.
            Contoh bentuk: 3² + √16, √36 + 5, atau bentuk campuran sejenis.
            </div>
        </div>

        <div class="tutorial-stage-card tutorial-stage-card-boss">
            <div class="tutorial-stage-name">Final Boss</div>
            <div class="tutorial-stage-topic">Akarion, Penjaga The Root Floor</div>
            <div class="tutorial-stage-desc">
            Boss world 1 terdiri dari 4 phase:
            <ul class="tutorial-list">
                <li>Phase 1: operasi campuran bilangan bulat</li>
                <li>Phase 2: pecahan dan desimal</li>
                <li>Phase 3: FPB, KPK, dan bilangan prima</li>
                <li>Phase 4: pangkat dan akar</li>
            </ul>
            Jadi final boss di world ini benar-benar menguji semua materi utama world 1.
            </div>
        </div>

        </div>
    `
    },
  {
  title: "Penjabaran soal yang terdapat pada world 2",
    body: `
        <p>
        World 2 berisi materi aljabar. Urutannya dimulai dari rasio dan skala, lalu bentuk aljabar,
        kemudian PLSV dan pertidaksamaan, dilanjutkan relasi, fungsi, garis lurus, lalu SPLDV,
        dan diakhiri dengan final boss.
        </p>

        <div class="tutorial-subtitle">Rincian stage World 2</div>

        <div class="tutorial-stage-grid">

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 1</div>
            <div class="tutorial-stage-topic">Rasio senilai</div>
            <div class="tutorial-stage-desc">
            Soal membahas perbandingan dua objek dengan rasio tertentu.
            Contoh bentuk: perbandingan apel dan jeruk 2:3, jika apel 8 maka jeruk ...
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 2</div>
            <div class="tutorial-stage-topic">Skala</div>
            <div class="tutorial-stage-desc">
            Soal membahas hubungan antara ukuran pada gambar dan ukuran sebenarnya.
            Contoh bentuk: pada skala 1:300, jarak 4 cm mewakili jarak sebenarnya ...
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 3</div>
            <div class="tutorial-stage-topic">Koefisien variabel</div>
            <div class="tutorial-stage-desc">
            Soal meminta menentukan koefisien dari suatu variabel pada bentuk aljabar.
            Contoh bentuk: tentukan koefisien x pada 3x - 2y + 4.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 4</div>
            <div class="tutorial-stage-topic">Penyederhanaan aljabar</div>
            <div class="tutorial-stage-desc">
            Soal meminta menyederhanakan bentuk aljabar dengan menggabungkan suku sejenis.
            Contoh bentuk: 3x + 2y - x - y + 4.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 5</div>
            <div class="tutorial-stage-topic">PLSV dasar</div>
            <div class="tutorial-stage-desc">
            Soal meminta menentukan nilai variabel dari persamaan linear satu variabel bentuk dasar.
            Contoh bentuk: 2x + 3 = 11.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 6</div>
            <div class="tutorial-stage-topic">PLSV lanjutan</div>
            <div class="tutorial-stage-desc">
            Soal masih tentang PLSV, tetapi bentuknya lebih bervariasi,
            misalnya memakai tanda kurung atau susunan persamaan yang berbeda.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 7</div>
            <div class="tutorial-stage-topic">Pertidaksamaan</div>
            <div class="tutorial-stage-desc">
            Soal meminta menentukan banyak nilai bilangan bulat yang memenuhi suatu pertidaksamaan
            pada rentang tertentu.
            Contoh bentuk: banyak nilai x dari -10 sampai 10 yang memenuhi x > 2.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 8</div>
            <div class="tutorial-stage-topic">Soal cerita PLSV</div>
            <div class="tutorial-stage-desc">
            Soal berbentuk cerita, misalnya tentang jumlah barang, selisih umur,
            atau rasio dua kelompok, lalu pemain menentukan nilai yang ditanyakan.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 9</div>
            <div class="tutorial-stage-topic">Relasi, domain, dan range</div>
            <div class="tutorial-stage-desc">
            Soal menampilkan pasangan berurutan, lalu pemain menentukan domain atau range.
            Contoh bentuk: dari relasi {(1,2), (3,4), ...}, tentukan domain.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 10</div>
            <div class="tutorial-stage-topic">Nilai fungsi</div>
            <div class="tutorial-stage-desc">
            Soal meminta menghitung nilai fungsi untuk input tertentu.
            Contoh bentuk: jika f(x) = 2x + 3, tentukan f(4).
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 11</div>
            <div class="tutorial-stage-topic">Kemiringan garis</div>
            <div class="tutorial-stage-desc">
            Soal membahas slope atau kemiringan garis dari dua titik atau perubahan x dan y.
            Contoh bentuk: kemiringan garis melalui (1,2) dan (3,6).
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 12</div>
            <div class="tutorial-stage-topic">Persamaan garis lurus</div>
            <div class="tutorial-stage-desc">
            Soal meminta menentukan persamaan garis dari kemiringan dan titik potong,
            atau dari dua titik yang diketahui.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 13</div>
            <div class="tutorial-stage-topic">SPLDV substitusi</div>
            <div class="tutorial-stage-desc">
            Soal meminta menentukan salah satu nilai variabel dalam SPLDV menggunakan substitusi.
            Contoh bentuk: diketahui satu persamaan dan satu nilai variabel, lalu tentukan variabel lain.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 14</div>
            <div class="tutorial-stage-topic">SPLDV eliminasi dan campuran</div>
            <div class="tutorial-stage-desc">
            Soal meminta menyelesaikan SPLDV dengan bentuk eliminasi umum
            atau bentuk jumlah-selisih.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 15</div>
            <div class="tutorial-stage-topic">Model matematika SPLDV</div>
            <div class="tutorial-stage-desc">
            Soal meminta menyusun model matematika dari cerita,
            misalnya cerita harga barang atau jumlah dan selisih dua nilai.
            </div>
        </div>

        <div class="tutorial-stage-card">
            <div class="tutorial-stage-name">Stage 16</div>
            <div class="tutorial-stage-topic">Soal cerita SPLDV</div>
            <div class="tutorial-stage-desc">
            Soal cerita meminta penyelesaian SPLDV dalam konteks nyata,
            misalnya harga barang, jumlah kaki hewan, atau umur dua orang.
            </div>
        </div>

        <div class="tutorial-stage-card tutorial-stage-card-boss">
            <div class="tutorial-stage-name">Final Boss</div>
            <div class="tutorial-stage-topic">Solarius the Equinox</div>
            <div class="tutorial-stage-desc">
            Boss world 2 terdiri dari 4 phase:
            <ul class="tutorial-list">
                <li>Phase 1: PLSV dan soal cerita PLSV</li>
                <li>Phase 2: relasi, fungsi, dan kemiringan garis</li>
                <li>Phase 3: persamaan garis lurus</li>
                <li>Phase 4: SPLDV</li>
            </ul>
            Jadi final boss world 2 menutup seluruh rangkaian materi aljabar yang sudah dipelajari.
            </div>
        </div>

        </div>
    `
    },
  {
    title: "Hal penting lain yang perlu diketahui",
    body: `
      <div class="tutorial-subtitle">Profil</div>
      <p>
        Profil berisi status pemain seperti HP, attack, defense, level, achievement, dan gelar yang sedang dipakai.
      </p>

      <div class="tutorial-subtitle">Achievement</div>
      <p>
        Achievement menunjukkan perkembanganmu. Bagian ini membantu pemain melihat pencapaian yang sudah terbuka.
      </p>

      <div class="tutorial-subtitle">Riwayat</div>
      <p>
        Riwayat digunakan untuk melihat catatan permainan. Jika masih kosong, berarti belum ada data yang tersimpan di sana.
      </p>

      <div class="tutorial-subtitle">Pengaturan</div>
      <p>
        Pengaturan dipakai untuk menyalakan atau mematikan sound effect dan music, menyimpan progress, dan mereset permainan.
      </p>

      <div class="tutorial-subtitle">Tombol petunjuk</div>
      <p>
        Pada beberapa halaman ada tombol petunjuk. Tombol itu bisa dipakai untuk melihat penjelasan singkat langsung di halaman yang sedang dibuka.
      </p>
    `
  },

  {
    title: "Tips bermain",
    body: `
      <ul class="tutorial-list">
        <li>Baca soal dengan teliti sebelum menjawab.</li>
        <li>Jangan terlalu cepat menekan jawaban.</li>
        <li>Biasakan mengenali jenis soal terlebih dahulu sebelum menghitung.</li>
        <li>Periksa profil dan achievement secara berkala untuk melihat perkembanganmu.</li>
        <li>Gunakan menu pengaturan untuk menyimpan progress secara rutin.</li>
        <li>Kalau masih bingung, buka tombol petunjuk pada halaman yang sedang aktif.</li>
      </ul>
    `
  }
];

function renderTutorialAccordion() {
  return tutorialSections.map((section, index) => `
    <details class="tutorial-accordion glass-panel" ${index === 0 ? "open" : ""}>
      <summary class="tutorial-summary">
        <div class="tutorial-summary-text">
          <div class="tutorial-section-label">Bagian ${index + 1}</div>
          <div class="tutorial-section-title">${section.title}</div>
        </div>
      </summary>

      <div class="tutorial-body">
        ${section.body}
      </div>
    </details>
  `).join("");
}

window.renderTutorialScreen = function () {
  return `
    <div id="tutorialScreen" class="tutorial-shell p-6 max-w-3xl mx-auto fade-in">

      <div class="tutorial-hero glass-panel">
        <h2 class="tutorial-main-title">Tutorial Bermain</h2>
        <p class="tutorial-main-subtitle">
          Tekan salah satu bagian di bawah ini untuk membuka penjelasannya.
        </p>
      </div>

      <div class="tutorial-stack">
        ${renderTutorialAccordion()}
      </div>

      <button onclick="goTo('home')" class="btn btn-gray w-full mt-5">
        Kembali ke Home
      </button>
    </div>
  `;
};