window.renderSettingScreen = function () {
  const gs = window.gameState;
  const theme = window.AQ_THEME;

  const soundActive = gs.settings.sound;
  const musicActive = gs.settings.music;

  return `
  <div 
    class="p-6 max-w-md mx-auto fade-in"
    style="${theme.shell}"
  >

    <div 
      id="settingHeader" 
      class="glass-panel text-center mb-4"
      style="${theme.headerPanel}"
    >
      <h2 
        class="text-2xl font-bold"
        style="${theme.goldTitle}"
      >
        ⚙️ Pengaturan
      </h2>

      <p 
        class="text-sm mt-1"
        style="${theme.mutedText}"
      >
        Atur suara, musik, dan progress permainan
      </p>
    </div>

    <!-- AUDIO -->
    <div 
      id="audioSettingPanel" 
      class="glass-panel mb-3"
      style="${theme.panel}"
    >
      <div class="flex justify-between items-center">
        <div>
          <div class="font-bold" style="color:#bfdbfe;">🔊 Sound Effect</div>
          <div class="text-xs" style="${theme.subText}">
            Efek suara saat battle dan navigasi
          </div>
        </div>

        <button 
          id="soundToggleBtn" 
          onclick="toggleSound()" 
          class="btn"
          style="${theme.buttonStyle(soundActive ? "green" : "gray")}"
        >
          ${soundActive ? "ON" : "OFF"}
        </button>
      </div>

      <div class="flex justify-between items-center mt-3">
        <div>
          <div class="font-bold" style="color:#bfdbfe;">🎵 Music</div>
          <div class="text-xs" style="${theme.subText}">
            Musik latar selama permainan
          </div>
        </div>

        <button 
          id="musicToggleBtn" 
          onclick="toggleMusic()" 
          class="btn"
          style="${theme.buttonStyle(musicActive ? "purple" : "gray")}"
        >
          ${musicActive ? "ON" : "OFF"}
        </button>
      </div>
    </div>

    <div 
      class="glass-panel mb-3"
      style="${theme.softPanel}"
    >
      <button 
        id="saveProgressBtn" 
        onclick="saveProgress(window.gameState)" 
        class="btn w-full"
        style="${theme.buttonStyle("green")}"
      >
        💾 Simpan Progress
      </button>

      <button 
        id="resetProgressBtn" 
        onclick="resetProgress()" 
        class="btn w-full mt-2"
        style="${theme.buttonStyle("red")}"
      >
        🔄 Reset Progress
      </button>
    </div>

    <button 
      id="settingBackBtn" 
      onclick="goTo('home')" 
      class="btn w-full mt-4"
      style="${theme.buttonStyle("gray")}"
    >
      ⬅️ Kembali
    </button>

  </div>
  `;
};