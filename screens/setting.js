window.renderSettingScreen = function () {
  const gs = window.gameState;

  return `
  <div class="p-6 max-w-md mx-auto fade-in">

    <div class="glass-panel text-center mb-4">
      <h2 class="text-2xl font-bold">⚙️ Pengaturan</h2>
    </div>

    <!-- AUDIO -->
    <div class="glass-panel mb-3">
      <div class="flex justify-between items-center">
        <span>🔊 Sound Effect</span>
        <button onclick="toggleSound()" class="btn btn-gray">
          ${gs.settings.sound ? "ON" : "OFF"}
        </button>
      </div>

      <div class="flex justify-between items-center mt-2">
        <span>🎵 Music</span>
        <button onclick="toggleMusic()" class="btn btn-gray">
          ${gs.settings.music ? "ON" : "OFF"}
        </button>
      </div>
    </div>

    <!-- SAVE -->
    <button onclick="saveProgress(window.gameState)" 
    class="btn btn-green w-full">
      💾 Simpan Progress
    </button>

    <!-- RESET -->
    <button onclick="resetProgress()" 
    class="btn btn-red w-full mt-2">
      🔄 Reset Progress
    </button>

    <!-- BACK -->
    <button onclick="goTo('home')" 
    class="btn btn-gray w-full mt-4">
      ⬅️ Kembali
    </button>

  </div>
  `;
};