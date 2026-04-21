window.renderTutorialScreen = function () {
  return `
    <div class="p-6 max-w-3xl mx-auto fade-in">

      <div class="glass-panel mb-4 text-center">
        <h2 class="text-2xl font-bold text-yellow-400">📘 Tutorial Bermain</h2>
        <p class="text-gray-300 text-sm">
          Panduan langkah demi langkah untuk memainkan Algebra Quest
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">1. Masuk ke Game</h3>
        <p class="text-sm text-gray-300 leading-6">
          Saat pertama membuka game, kamu akan melihat halaman pembuka.
          Tekan tombol <b>Mulai Petualangan (Google)</b> untuk login.
          Setelah login berhasil, kamu akan masuk ke halaman utama game.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">2. Kenali Halaman Utama</h3>
        <p class="text-sm text-gray-300 leading-6">
          Di halaman utama, kamu akan melihat kartu karakter yang berisi nama, HP,
          level, EXP, dan informasi perkembangan lainnya. Dari halaman ini kamu bisa
          membuka beberapa menu utama game.
        </p>
        <ul class="text-sm text-gray-300 leading-6 list-disc pl-5 mt-2 space-y-1">
          <li><b>Mulai Petualangan</b> untuk masuk ke map dunia.</li>
          <li><b>Tutorial Bermain</b> untuk membuka halaman panduan ini.</li>
          <li><b>Riwayat</b> untuk melihat catatan permainan.</li>
          <li><b>Achievement</b> untuk melihat pencapaian.</li>
          <li><b>Pengaturan</b> untuk mengatur suara, musik, dan progress.</li>
          <li><b>Profil</b> untuk melihat status karakter dan gelar.</li>
        </ul>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">3. Buka Map Dunia</h3>
        <p class="text-sm text-gray-300 leading-6">
          Tekan tombol <b>Mulai Petualangan</b> untuk masuk ke halaman map.
          Di sana kamu bisa melihat daftar dunia matematika yang tersedia.
          Geser ke kiri atau ke kanan untuk melihat semua dunia.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">4. Pilih Dunia</h3>
        <p class="text-sm text-gray-300 leading-6">
          Setiap dunia berisi materi yang berbeda.
          Pilih salah satu dunia yang aktif untuk masuk ke area stage.
          Dunia yang masih terkunci atau belum tersedia belum bisa dimainkan.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">5. Masuk ke Area Stage</h3>
        <p class="text-sm text-gray-300 leading-6">
          Setelah masuk ke dunia, kamu akan melihat peta area dengan node-node stage.
          Setiap node adalah satu tantangan.
          Geser area map jika ingin melihat node lain yang ada di bagian kanan atau kiri.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">6. Pilih Stage</h3>
        <p class="text-sm text-gray-300 leading-6">
          Klik salah satu node stage untuk memulai permainan.
          Setelah stage dipilih, game akan menyiapkan musuh dan soal matematika
          yang sesuai dengan stage tersebut.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">7. Memahami Battle Screen</h3>
        <p class="text-sm text-gray-300 leading-6">
          Saat battle dimulai, layar akan terbagi menjadi beberapa bagian penting:
        </p>
        <ul class="text-sm text-gray-300 leading-6 list-disc pl-5 mt-2 space-y-1">
          <li><b>Bagian atas</b> menampilkan nama musuh dan tombol kabur.</li>
          <li><b>Arena</b> menampilkan karakter pemain di kiri dan musuh di kanan.</li>
          <li><b>Panel soal</b> menampilkan soal matematika.</li>
          <li><b>Battle log</b> menampilkan riwayat serangan dan hasil jawaban.</li>
        </ul>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">8. Membaca Soal</h3>
        <p class="text-sm text-gray-300 leading-6">
          Soal akan muncul di panel utama battle.
          Bacalah soal dengan teliti sebelum menjawab.
          Jangan terburu-buru, karena jawaban yang salah akan membuat karaktermu menerima serangan.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">9. Menjawab Soal</h3>
        <p class="text-sm text-gray-300 leading-6">
          Bentuk jawaban bisa berbeda tergantung stage:
        </p>
        <ul class="text-sm text-gray-300 leading-6 list-disc pl-5 mt-2 space-y-1">
          <li><b>Pilihan jawaban</b>, yaitu memilih salah satu tombol jawaban.</li>
          <li><b>Input angka</b>, yaitu mengetik jawaban sendiri lalu menekan tombol serang.</li>
        </ul>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">10. Jika Jawaban Benar</h3>
        <p class="text-sm text-gray-300 leading-6">
          Jika jawabanmu benar, musuh akan menerima damage.
          HP musuh akan berkurang dan battle log akan mencatat serangan yang berhasil.
          Setelah itu akan muncul feedback bahwa jawabanmu benar.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">11. Jika Jawaban Salah</h3>
        <p class="text-sm text-gray-300 leading-6">
          Jika jawabanmu salah, musuh akan menyerang balik.
          HP karaktermu akan berkurang.
          Kalau HP pemain habis, kamu akan kalah dan kembali ke map.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">12. Lanjut ke Soal Berikutnya</h3>
        <p class="text-sm text-gray-300 leading-6">
          Setelah satu soal selesai, tekan tombol <b>Lanjut Soal</b> untuk masuk ke soal berikutnya.
          Musuh yang sama akan terus dilawan sampai HP musuh habis.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">13. Tombol Kabur</h3>
        <p class="text-sm text-gray-300 leading-6">
          Di bagian atas battle ada tombol <b>Kabur</b>.
          Tombol ini digunakan jika kamu ingin keluar dari battle dan kembali ke map
          tanpa melanjutkan pertarungan.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">14. Menang dalam Battle</h3>
        <p class="text-sm text-gray-300 leading-6">
          Jika HP musuh habis, kamu akan menang.
          Setelah menang, kamu akan mendapatkan <b>EXP</b> dan hadiah permainan.
          Lalu akan muncul pilihan untuk kembali ke map atau mencoba stage itu lagi.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">15. Naik Level</h3>
        <p class="text-sm text-gray-300 leading-6">
          EXP yang kamu peroleh dari battle digunakan untuk naik level.
          Saat level naik, kemampuan karakter akan meningkat sehingga kamu bisa menghadapi
          stage yang lebih sulit.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">16. Membuka Profil</h3>
        <p class="text-sm text-gray-300 leading-6">
          Di halaman utama, klik kartu karakter untuk membuka profil.
          Di sana kamu bisa melihat status pemain seperti HP, attack, defense, level,
          achievement, dan gelar yang sedang dipakai.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">17. Melihat Achievement</h3>
        <p class="text-sm text-gray-300 leading-6">
          Buka menu <b>Achievement</b> untuk melihat pencapaian yang sudah terbuka
          maupun yang masih belum tercapai.
          Achievement menunjukkan perkembanganmu selama bermain.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">18. Melihat Riwayat</h3>
        <p class="text-sm text-gray-300 leading-6">
          Menu <b>Riwayat</b> digunakan untuk melihat catatan permainanmu.
          Jika belum ada data, berarti riwayat permainan masih kosong.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">19. Mengatur Game</h3>
        <p class="text-sm text-gray-300 leading-6">
          Masuk ke menu <b>Pengaturan</b> jika ingin menyalakan atau mematikan
          sound effect dan music.
          Di menu ini juga tersedia tombol untuk menyimpan progress dan mereset permainan.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">20. Gunakan Tombol Petunjuk</h3>
        <p class="text-sm text-gray-300 leading-6">
          Di beberapa halaman ada tombol petunjuk berbentuk tanda tanya.
          Tombol ini bisa kamu gunakan untuk melihat panduan singkat langsung di layar
          sesuai halaman yang sedang dibuka.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">21. Ringkasan Alur Bermain</h3>
        <p class="text-sm text-gray-300 leading-6">
          Login → masuk ke Home → pilih <b>Mulai Petualangan</b> → pilih dunia →
          pilih stage → jawab soal di battle → kalahkan musuh → dapat EXP →
          kembali ke map atau ulangi stage.
        </p>
      </div>

      <div class="glass-panel">
        <h3 class="font-bold text-blue-300 mb-2">22. Tips Bermain</h3>
        <ul class="text-sm text-gray-300 leading-6 list-disc pl-5 mt-2 space-y-1">
          <li>Baca soal dengan teliti sebelum menjawab.</li>
          <li>Jangan terburu-buru saat memilih jawaban.</li>
          <li>Gunakan menu profil untuk memantau perkembangan karaktermu.</li>
          <li>Periksa achievement untuk melihat target pencapaian.</li>
          <li>Gunakan pengaturan untuk menyimpan progress secara berkala.</li>
        </ul>
      </div>

      <button onclick="goTo('home')" class="btn btn-gray w-full mt-4">
        ⬅️ Kembali
      </button>
    </div>
  `;
};