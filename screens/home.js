window.renderHomeScreen = function () {
  const gs = window.gameState;

  return `
  <div class="p-6 max-w-md mx-auto fade-in">

    <!-- PLAYER CARD -->
    <div class="glass-panel mb-4">

      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-yellow-400">
            ${gs.player.name}
          </h2>
          <p class="text-sm text-gray-400">
            Lv.${gs.player.level}
          </p>
        </div>

        <div class="text-right text-sm">
          💰 ${gs.player.gold} Gold <br>
          ⭐ ${gs.player.exp}/${gs.player.expToNext}
        </div>
      </div>

      <div class="hp-bar mt-2">
        <div class="hp-fill" style="width:${(gs.player.hp/gs.player.maxHp)*100}%"></div>
      </div>

    </div>

    <!-- GAME TITLE -->
    <div class="glass-panel mb-4 text-center">
      <h1 class="text-2xl font-bold text-yellow-400">
        🏰 Algebra Quest RPG
      </h1>
      <p class="text-gray-300 text-sm">
        Petualangan belajar matematika
      </p>
    </div>

    <!-- MENU -->
    <div class="space-y-3">

      <button onclick="goTo('map')" class="btn btn-green">
        🌍 Mulai Petualangan
      </button>

      <button onclick="goTo('history')" class="btn btn-blue">
        📜 Riwayat
      </button>

      <button onclick="goTo('achievement')" class="btn btn-purple">
        🏆 Achievement
      </button>

      <button onclick="goTo('setting')" class="btn btn-gray">
        ⚙️ Pengaturan
      </button>

    </div>

  </div>
  `;
};