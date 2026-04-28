window.renderSettingScreen = function () {
  const gs = window.gameState;

  return `
  <div class="p-6 max-w-md mx-auto fade-in">

    <div id="settingHeader" class="glass-panel text-center mb-4">
      <h2 class="text-2xl font-bold">⚙️ Pengaturan</h2>
    </div>

    <!-- AUDIO -->
    <div id="audioSettingPanel" class="glass-panel mb-3">
      <div class="flex justify-between items-center">
        <span>🔊 Sound Effect</span>
        <button id="soundToggleBtn" onclick="toggleSound()" class="btn btn-gray">
          ${gs.settings.sound ? "ON" : "OFF"}
        </button>
      </div>

      <div class="flex justify-between items-center mt-2">
        <span>🎵 Music</span>
      <button id="musicToggleBtn" onclick="toggleMusic()" class="btn btn-gray">
        ${gs.settings.music ? "ON" : "OFF"}
      </button>
      </div>
    </div>

    <button id="saveProgressBtn" onclick="saveProgress(window.gameState)" 
    class="btn btn-green w-full">
      💾 Simpan Progress
    </button>

    <button id="resetProgressBtn" onclick="resetProgress()" 
    class="btn btn-red w-full mt-2">
      🔄 Reset Progress
    </button>

    <button id="settingBackBtn" onclick="goTo('home')" 
    class="btn btn-gray w-full mt-4">
      ⬅️ Kembali
    </button>

  </div>
  `;
};