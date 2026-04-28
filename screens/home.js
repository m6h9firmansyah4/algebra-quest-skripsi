window.renderHomeScreen = function () {
  const gs = window.gameState;

    // Update LifePoints jika function-nya tersedia dari game.js
  if (window.updateLifePoints) {
    window.updateLifePoints(gs);
  }

  // Fallback agar UI tidak error kalau data lama belum punya LifePoints
  const lifePoints = gs.player.lifePoints ?? 5;
  const maxLifePoints = gs.player.maxLifePoints ?? 5;
  const lifePercent = (lifePoints / maxLifePoints) * 100;

  const lifeTimerText = window.getLifePointTimerText
    ? window.getLifePointTimerText(gs)
    : lifePoints >= maxLifePoints
      ? "Penuh"
      : "Memulihkan...";

  return `

    <!-- GAME TITLE -->
        <div class="glass-panel mb-4 text-center">
          <h1 class="text-2xl font-bold text-yellow-400">
            🏰 Algebra Quest RPG
          </h1>
          <p class="text-gray-300 text-sm">
            Petualangan belajar matematika
          </p>
        </div>

  <div  class="p-6 max-w-md mx-auto fade-in">

    <!-- PLAYER CARD -->
    <div id="playerCard" class="glass-panel mb-4 p-4">

    <div id="profileBtn" onclick="goTo('profile')" class="cursor-pointer">

      <div class="flex justify-between items-center">

        <!-- KIRI -->
        <div>
          <h2 class="text-xl font-bold text-yellow-400">
            ${gs.player.name}
          </h2>

          <p class="text-sm text-gray-400">
            Lv.${gs.player.level}
          </p>
        </div>

        <!-- KANAN -->
        <div class="text-right text-sm">
          ⭐ ${gs.player.exp}/${gs.player.expToNext}
        </div>

      </div>

      <!-- LIFEPOINTS -->
      <div id="lifePointsCard" class="mt-4 p-3 rounded-xl bg-slate-900/60 border border-red-400/30">

        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-bold text-red-300">
            ❤️ LifePoints
          </div>

          <div class="text-sm font-bold text-red-400">
            ${lifePoints}/${maxLifePoints}
          </div>
        </div>

        <div class="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-red-500 rounded-full transition-all duration-500"
            style="width:${lifePercent}%">
          </div>
        </div>

        <div class="text-xs text-gray-400 mt-2 text-center">
          ${
            lifePoints >= maxLifePoints
              ? "LifePoints penuh"
              : `LifePoint berikutnya: ${lifeTimerText}`
          }
        </div>

      </div>

    </div>

  </div>

    <!-- MENU -->
    <div class="space-y-3">

      <button id="mapBtn" onclick="goTo('map')" class="btn btn-green">
        🌍 Mulai Petualangan
      </button>

      <button id="tutorialBtn" onclick="goTo('tutorial')" class="btn btn-blue">
        📘 Tutorial Bermain
      </button>

      <button id="historyBtn" onclick="goTo('history')" class="btn btn-blue">
        📜 Riwayat
      </button>

      <button id="achievementBtn" onclick="goTo('achievement')" class="btn btn-purple">
        🏆 Achievement
      </button>

      <button id="settingBtn" onclick="goTo('setting')" class="btn btn-gray">
        ⚙️ Pengaturan
      </button>

    </div>

  </div>
  `;
};