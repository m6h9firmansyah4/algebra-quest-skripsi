window.renderSettingScreen = function () {
  return `
    <div class="p-6 max-w-md mx-auto fade-in">

      <div class="glass-panel mb-4 text-center">
        <h2 class="text-2xl font-bold">⚙️ Pengaturan</h2>
      </div>

      <div class="glass-panel space-y-2">
        <label><input type="checkbox" checked> 🔊 Sound</label>
        <label><input type="checkbox" checked> 🎵 Musik</label>
      </div>

      <button onclick="goTo('home')" class="btn btn-gray w-full mt-6">
        ⬅️ Kembali
      </button>

    </div>
  `;
};
