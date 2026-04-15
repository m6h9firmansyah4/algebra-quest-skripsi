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

    <!-- THEME -->
    <div class="glass-panel mb-3">
      <div class="mb-2 font-bold">🎨 Tema</div>
      <div class="grid grid-cols-3 gap-2">
        <button onclick="setTheme('default')" class="btn btn-blue">Default</button>
        <button onclick="setTheme('algebra')" class="btn btn-orange">Algebra</button>
        <button onclick="setTheme('geometry')" class="btn btn-blue">Geometry</button>
      </div>
    </div>

    <!-- MUSIC SELECT -->
    <div class="glass-panel mb-3">
      <div class="mb-2 font-bold">🎼 Musik Latar</div>
      <button onclick="window.sfx.playMusic('theme')" class="btn btn-green">
        Default
      </button>

      <button onclick="window.sfx.playMusic('battle')" class="btn btn-purple">
        Battle
      </button>
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