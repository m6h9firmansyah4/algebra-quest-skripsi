window.renderAchievementScreen = function () {
  return `
    <div class="p-6 max-w-md mx-auto fade-in">

      <div class="glass-panel mb-4 text-center">
        <h2 class="text-2xl font-bold">🏆 Achievement</h2>
      </div>

      <div class="space-y-3">
        <div class="glass-panel">🥉 Pemula Aljabar</div>
        <div class="glass-panel opacity-50">🥈 Penakluk PLSV</div>
        <div class="glass-panel opacity-50">🥇 Master SPLDV</div>
      </div>

      <button onclick="goTo('home')" class="btn btn-gray w-full mt-6">
        ⬅️ Kembali
      </button>

    </div>
  `;
};
