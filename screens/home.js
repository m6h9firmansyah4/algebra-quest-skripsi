

window.renderHomeScreen = function () {
  const gs = window.gameState;

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

          <p class="text-sm text-gray-300">
            ❤️ ${gs.player.hp} / ${gs.player.maxHp}
          </p>

          <p class="text-sm text-gray-400">
            Lv.${gs.player.level}
          </p>
        </div>

        <!-- KANAN -->
        <div class="text-right text-sm">
          💰 ${gs.player.gold} Gold <br>
          ⭐ ${gs.player.exp}/${gs.player.expToNext}
        </div>

      </div>

      <!-- HP BAR -->
      <div class="hp-bar mt-3">
        <div class="hp-fill" style="width:${(gs.player.hp/gs.player.maxHp)*100}%"></div>
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