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
        <li><b>Login Page</b><br>
          Buka game lalu login dari halaman awal.
        </li>

        <li><b>Home</b><br>
          Setelah login berhasil, kamu akan masuk ke halaman utama game.
        </li>

        <li><b>Mulai Petualangan</b><br>
          Tekan tombol <b>Mulai Petualangan</b> untuk masuk ke halaman pemilihan area.
        </li>

        <li><b>Pilih Area</b><br>
          Geser daftar area yang tersedia, lalu pilih area yang aktif.
          Saat ini area utama yang bisa dimainkan adalah <b>Prime Verda World</b> dan <b>Algebrum World</b>.
        </li>

        <li><b>Map</b><br>
          Setelah area dipilih, kamu akan masuk ke map stage di dalam area tersebut.
        </li>

        <li><b>Pilih Stage</b><br>
          Klik salah satu node stage untuk memulai tantangan.
        </li>

        <li><b>Battle</b><br>
          Jawab soal di battle screen sampai HP musuh habis.
        </li>

        <li><b>Menang</b><br>
          Jika berhasil mengalahkan musuh, kamu akan mendapatkan EXP.
        </li>

        <li><b>Naik Level</b><br>
          Jika EXP sudah cukup, level karaktermu akan meningkat.
        </li>

        <li><b>Stage Selanjutnya</b><br>
          Setelah menang, kamu bisa kembali ke map lalu melanjutkan ke stage berikutnya.
        </li>
      </ol>

      <div class="tutorial-note">
        Alur singkat permainan: <b>Login Page → Home → Mulai Petualangan → Pilih Area → Map → Pilih Stage → Battle → Menang → Naik Level → Stage Selanjutnya</b>.
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
    title: "Penjelasan area yang tersedia",
    body: `
      <div class="tutorial-world-grid">
        <div class="tutorial-world-card">
          <div class="tutorial-world-name">Prime Verda World</div>
          <div class="tutorial-world-desc">
            Area ini berisi materi bilangan, mulai dari operasi dasar sampai pangkat dan akar.
          </div>
        </div>

        <div class="tutorial-world-card">
          <div class="tutorial-world-name">Algebrum World</div>
          <div class="tutorial-world-desc">
            Area ini berisi materi aljabar, mulai dari rasio sampai SPLDV.
          </div>
        </div>

        <div class="tutorial-world-card tutorial-world-card-muted">
          <div class="tutorial-world-name">Geometria</div>
          <div class="tutorial-world-desc">
            Area ini sudah muncul di map, tetapi belum aktif dimainkan.
          </div>
        </div>

        <div class="tutorial-world-card tutorial-world-card-muted">
          <div class="tutorial-world-name">Statica</div>
          <div class="tutorial-world-desc">
            Area ini juga sudah tampil di map, tetapi masih menunggu pengembangan lebih lanjut.
          </div>
        </div>
      </div>
    `
  },
  {
    title: "Penjabaran soal pada Prime Verda World",
    body: `
      <p>
        Prime Verda World berisi materi bilangan. Susunannya dimulai dari bilangan bulat,
        lalu pecahan dan desimal, kemudian FPB-KPK dan bilangan prima, lalu pangkat, akar,
        dan diakhiri dengan final boss.
      </p>

      <div class="tutorial-stage-grid">

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 1–4</div>
          <div class="tutorial-stage-topic">Bilangan bulat</div>
          <div class="tutorial-stage-desc">
            Soal berisi penjumlahan, pengurangan, perkalian, pembagian,
            dan operasi campuran bilangan bulat.
          </div>
        </div>

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 5–8</div>
          <div class="tutorial-stage-topic">Pecahan dan desimal</div>
          <div class="tutorial-stage-desc">
            Soal berisi penyederhanaan pecahan, perubahan ke desimal,
            perbandingan nilai, dan mengurutkan bilangan.
          </div>
        </div>

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 9–12</div>
          <div class="tutorial-stage-topic">Bilangan prima, faktorisasi, FPB, dan KPK</div>
          <div class="tutorial-stage-desc">
            Soal berisi bilangan prima, faktorisasi prima, FPB, KPK,
            dan soal cerita yang berkaitan dengan FPB atau KPK.
          </div>
        </div>

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 13–16</div>
          <div class="tutorial-stage-topic">Pangkat dan akar</div>
          <div class="tutorial-stage-desc">
            Soal berisi konsep pangkat, sifat pangkat, akar kuadrat,
            dan operasi campuran pangkat dan akar.
          </div>
        </div>

        <div class="tutorial-stage-card tutorial-stage-card-boss">
          <div class="tutorial-stage-name">Final Boss</div>
          <div class="tutorial-stage-topic">Akarion</div>
          <div class="tutorial-stage-desc">
            Final boss di Prime Verda World terdiri dari 4 phase:
            <ul class="tutorial-list">
              <li>Phase 1: bilangan bulat</li>
              <li>Phase 2: pecahan dan desimal</li>
              <li>Phase 3: FPB, KPK, dan bilangan prima</li>
              <li>Phase 4: pangkat dan akar</li>
            </ul>
          </div>
        </div>

      </div>
    `
  },
  {
    title: "Penjabaran soal pada Algebrum World",
    body: `
      <p>
        Algebrum World berisi materi aljabar. Susunannya dimulai dari rasio dan skala,
        lalu bentuk aljabar, PLSV dan pertidaksamaan, kemudian relasi, fungsi,
        garis lurus, SPLDV, dan diakhiri dengan final boss.
      </p>

      <div class="tutorial-stage-grid">

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 1–2</div>
          <div class="tutorial-stage-topic">Rasio dan skala</div>
          <div class="tutorial-stage-desc">
            Soal berisi perbandingan senilai dan skala gambar.
          </div>
        </div>

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 3–4</div>
          <div class="tutorial-stage-topic">Bentuk aljabar</div>
          <div class="tutorial-stage-desc">
            Soal berisi koefisien variabel dan penyederhanaan aljabar.
          </div>
        </div>

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 5–8</div>
          <div class="tutorial-stage-topic">PLSV dan pertidaksamaan</div>
          <div class="tutorial-stage-desc">
            Soal berisi persamaan linear satu variabel, pertidaksamaan,
            dan soal cerita berbentuk aljabar sederhana.
          </div>
        </div>

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 9–10</div>
          <div class="tutorial-stage-topic">Relasi dan fungsi</div>
          <div class="tutorial-stage-desc">
            Soal berisi domain, range, dan nilai fungsi.
          </div>
        </div>

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 11–12</div>
          <div class="tutorial-stage-topic">Garis lurus</div>
          <div class="tutorial-stage-desc">
            Soal berisi kemiringan garis dan persamaan garis lurus.
          </div>
        </div>

        <div class="tutorial-stage-card">
          <div class="tutorial-stage-name">Stage 13–16</div>
          <div class="tutorial-stage-topic">SPLDV</div>
          <div class="tutorial-stage-desc">
            Soal berisi substitusi, eliminasi, model matematika,
            dan soal cerita SPLDV.
          </div>
        </div>

        <div class="tutorial-stage-card tutorial-stage-card-boss">
          <div class="tutorial-stage-name">Final Boss</div>
          <div class="tutorial-stage-topic">Solarius the Equinox</div>
          <div class="tutorial-stage-desc">
            Final boss di Algebrum World terdiri dari 4 phase:
            <ul class="tutorial-list">
              <li>Phase 1: PLSV dan soal cerita</li>
              <li>Phase 2: relasi, fungsi, dan kemiringan garis</li>
              <li>Phase 3: persamaan garis lurus</li>
              <li>Phase 4: SPLDV</li>
            </ul>
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
    <details 
      id="tutorialSection-${index}"
      class="tutorial-accordion glass-panel" 
      ${index === 0 ? "open" : ""}
    >
      <summary id="tutorialSummary-${index}" class="tutorial-summary">
        <div class="tutorial-summary-text">
          <div class="tutorial-section-label">Bagian ${index + 1}</div>
          <div class="tutorial-section-title">${section.title}</div>
        </div>
      </summary>

      <div id="tutorialBody-${index}" class="tutorial-body">
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

      <button id="tutorialBackBtn" onclick="goTo('home')" class="btn btn-gray w-full mt-5">
        Kembali ke Home
      </button>
    </div>
  `;
};