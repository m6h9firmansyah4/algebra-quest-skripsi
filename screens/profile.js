window.getTitleBonus = function(gs) {
  if (window.AQ_MODEL?.helpers?.getTitleBonus) {
    return window.AQ_MODEL.helpers.getTitleBonus(gs);
  }

  const found = gs.achievements?.find(function(a) {
    return a.name === gs.title;
  });

  return found ? found.bonus : 0;
};

window.setTitle = function(title) {
  window.gameState.title = title;

  if (window.saveProgress) {
    window.saveProgress(window.gameState);
  }

  window.render();
};

window.renderProfileScreen = function() {
  const gs = window.gameState;
  const p = gs.player;

  const unlockedAchievements = window.AQ_MODEL?.helpers?.getUnlockedAchievements(gs) || [];
  const titleBonus = window.getTitleBonus(gs);
  const rank = window.AQ_MODEL?.helpers?.getPlayerRank(gs) || "New Adventurer";

  const points = p.points ?? p.totalScore ?? 0;
  const bestStreak = p.bestStreak ?? 0;
  const lifePoints = p.lifePoints ?? 5;
  const maxLifePoints = p.maxLifePoints ?? 5;

  const safeTitle = gs.title || "Pemula";

  return `
  <div class="p-4 max-w-md mx-auto fade-in">

    <!-- HEADER -->
    <div id="profileHeader" class="glass-panel text-center">
      <div class="text-3xl mb-2">👤</div>

      <div class="font-bold text-xl">
        ${p.name}
      </div>

      <div class="text-yellow-400 font-bold mt-1">
        ${safeTitle}
      </div>

      <div class="text-sm text-gray-400 mt-1">
        ${rank}
      </div>
    </div>

    <!-- STATUS UTAMA -->
    <div id="profileStatusPanel" class="glass-panel mt-3">
      <div class="font-bold mb-3">📊 Status Pemain</div>

      <div class="grid grid-cols-2 gap-2">
        <div class="p-2 rounded-lg bg-slate-900/60">
          <div class="text-xs text-gray-400">HP</div>
          <div class="font-bold text-red-300">❤️ ${p.hp}/${p.maxHp}</div>
        </div>

        <div class="p-2 rounded-lg bg-slate-900/60">
          <div class="text-xs text-gray-400">LifePoints</div>
          <div class="font-bold text-red-400">❤️ ${lifePoints}/${maxLifePoints}</div>
        </div>

        <div class="p-2 rounded-lg bg-slate-900/60">
          <div class="text-xs text-gray-400">Attack</div>
          <div class="font-bold text-orange-300">⚔️ ${p.attack}</div>
        </div>

        <div class="p-2 rounded-lg bg-slate-900/60">
          <div class="text-xs text-gray-400">Defense</div>
          <div class="font-bold text-blue-300">🛡️ ${p.defense}</div>
        </div>

        <div class="p-2 rounded-lg bg-slate-900/60">
          <div class="text-xs text-gray-400">Level</div>
          <div class="font-bold text-yellow-400">⭐ ${p.level}</div>
        </div>

        <div class="p-2 rounded-lg bg-slate-900/60">
          <div class="text-xs text-gray-400">Bonus Gelar</div>
          <div class="font-bold text-green-400">+${titleBonus} DMG</div>
        </div>
      </div>
    </div>

    <!-- EXP -->
    <div class="glass-panel mt-3">
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold">⭐ EXP</div>
        <div class="text-sm text-yellow-400">
          ${p.exp}/${p.expToNext}
        </div>
      </div>

      <div class="progress-bar">
        <div 
          class="progress-fill" 
          style="width:${Math.min(100, Math.floor((p.exp / p.expToNext) * 100))}%">
        </div>
      </div>
    </div>

    <!-- POIN DAN STREAK -->
    <div class="glass-panel mt-3">
      <div class="font-bold mb-3">🎮 Rekap Permainan</div>

      <div class="grid grid-cols-2 gap-2">
        <div class="p-2 rounded-lg bg-slate-900/60 text-center">
          <div class="text-xs text-gray-400">Total Poin</div>
          <div class="font-bold text-yellow-400">💎 ${points}</div>
        </div>

        <div class="p-2 rounded-lg bg-slate-900/60 text-center">
          <div class="text-xs text-gray-400">Best Streak</div>
          <div class="font-bold text-orange-300">🔥 ${bestStreak}</div>
        </div>
      </div>
    </div>

    <!-- ACHIEVEMENT -->
    <div id="profileAchievementPanel" class="glass-panel mt-3">
      <div class="font-bold mb-2">🏆 Achievement Terbuka</div>

      ${
        unlockedAchievements.length
          ? unlockedAchievements.map(function(a) {
              return `
                <div class="flex justify-between border-b border-white/10 py-2">
                  <span>${a.icon} ${a.name}</span>
                  <span class="text-yellow-400">+${a.bonus} DMG</span>
                </div>
              `;
            }).join("")
          : "<div class='text-gray-400'>Belum ada achievement</div>"
      }
    </div>

    <!-- PILIH GELAR -->
    <div id="profileTitlePanel" class="glass-panel mt-3">
      <div class="font-bold mb-2">🎖 Pilih Gelar</div>

      ${
        unlockedAchievements.length
          ? unlockedAchievements.map(function(a) {
              const activeClass = gs.title === a.name ? "btn-yellow" : "btn-gray";

              return `
                <button onclick="setTitle('${a.name}')" class="btn ${activeClass}">
                  ${a.icon} ${a.name}
                </button>
              `;
            }).join("")
          : "<div class='text-gray-400'>Selesaikan stage untuk membuka gelar.</div>"
      }
    </div>

    <button id="profileBackBtn" onclick="goTo('home')" class="btn btn-gray mt-4 w-full">
      ⬅️ Kembali
    </button>

  </div>
  `;
};