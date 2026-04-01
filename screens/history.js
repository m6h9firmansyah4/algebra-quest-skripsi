window.renderHistoryScreen = function () {
  return `
    <div class="p-6 max-w-md mx-auto fade-in">

      <div class="glass-panel mb-4 text-center">
        <h2 class="text-2xl font-bold">📜 Riwayat</h2>
        <p class="text-gray-400 text-sm">Riwayat permainanmu</p>
      </div>

      <div class="glass-panel text-center text-gray-400">
        Belum ada data riwayat
      </div>

      <button onclick="goTo('home')" class="btn btn-gray w-full mt-6">
        ⬅️ Kembali
      </button>

    </div>
  `;
};
