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
  const theme = window.AQ_THEME;

  const unlockedAchievements = window.AQ_MODEL?.helpers?.getUnlockedAchievements(gs) || [];
  const titleBonus = window.getTitleBonus(gs);
  const rank = window.AQ_MODEL?.helpers?.getPlayerRank(gs) || "New Adventurer";

  const points = p.points ?? p.totalScore ?? 0;
  const bestStreak = p.bestStreak ?? 0;
  const lifePoints = p.lifePoints ?? 5;
  const maxLifePoints = p.maxLifePoints ?? 5;

  const safeTitle = gs.title || "Pemula";

  return `
  <div 
    class="p-4 max-w-md mx-auto fade-in"
    style="${theme.shell}"
  >

    <!-- HEADER -->
    <div 
      id="profileHeader" 
      class="glass-panel text-center"
      style="${theme.headerPanel}"
    >
      <div class="text-3xl mb-2">👤</div>

      <div 
        class="font-bold text-xl"
        style="${theme.goldTitle}"
      >
        ${p.name}
      </div>

      <div 
        class="font-bold mt-1"
        style="color:#fde68a;"
      >
        ${safeTitle}
      </div>

      <div 
        class="text-sm mt-1"
        style="color:#93c5fd;"
      >
        ${rank}
      </div>
    </div>

    <!-- STATUS UTAMA -->
    <div 
      id="profileStatusPanel" 
      class="glass-panel mt-3"
      style="${theme.panel}"
    >
      <div 
        class="font-bold mb-3"
        style="${theme.blueTitle}"
      >
        📊 Status Pemain
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="p-2 rounded-lg" style="${theme.statCard("red")}">
          <div class="text-xs" style="color:#fecaca;">HP</div>
          <div class="font-bold" style="color:#f87171;">❤️ ${p.hp}/${p.maxHp}</div>
        </div>

        <div class="p-2 rounded-lg" style="${theme.statCard("red")}">
          <div class="text-xs" style="color:#fecaca;">LifePoints</div>
          <div class="font-bold" style="color:#fb7185;">❤️ ${lifePoints}/${maxLifePoints}</div>
        </div>

        <div class="p-2 rounded-lg" style="${theme.statCard("orange")}">
          <div class="text-xs" style="color:#fed7aa;">Attack</div>
          <div class="font-bold" style="color:#fb923c;">⚔️ ${p.attack}</div>
        </div>

        <div class="p-2 rounded-lg" style="${theme.statCard("blue")}">
          <div class="text-xs" style="color:#bfdbfe;">Defense</div>
          <div class="font-bold" style="color:#60a5fa;">🛡️ ${p.defense}</div>
        </div>

        <div class="p-2 rounded-lg" style="${theme.statCard("gold")}">
          <div class="text-xs" style="color:#fde68a;">Level</div>
          <div class="font-bold" style="color:#facc15;">⭐ ${p.level}</div>
        </div>

        <div class="p-2 rounded-lg" style="${theme.statCard("green")}">
          <div class="text-xs" style="color:#bbf7d0;">Bonus Gelar</div>
          <div class="font-bold" style="color:#34d399;">+${titleBonus} DMG</div>
        </div>
      </div>
    </div>

    <!-- EXP -->
    <div 
      class="glass-panel mt-3"
      style="${theme.softPanel}"
    >
      <div class="flex justify-between items-center mb-2">
        <div 
          class="font-bold"
          style="color:#bfdbfe;"
        >
          ⭐ EXP
        </div>

        <div 
          class="text-sm font-bold"
          style="color:#facc15;"
        >
          ${p.exp}/${p.expToNext}
        </div>
      </div>

      <div 
        class="progress-bar"
        style="background: rgba(15,23,42,0.85); height: 10px;"
      >
        <div 
          class="progress-fill" 
          style="
            width:${Math.min(100, Math.floor((p.exp / p.expToNext) * 100))}%;
            background: linear-gradient(to right, #facc15, #f97316);
            box-shadow: 0 0 12px rgba(250,204,21,0.35);
          ">
        </div>
      </div>
    </div>

    <!-- POIN DAN STREAK -->
    <div 
      class="glass-panel mt-3"
      style="${theme.panel}"
    >
      <div 
        class="font-bold mb-3"
        style="${theme.blueTitle}"
      >
        🎮 Rekap Permainan
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="p-2 rounded-lg text-center" style="${theme.statCard("gold")}">
          <div class="text-xs" style="color:#fde68a;">Total Poin</div>
          <div class="font-bold" style="color:#facc15;">💎 ${points}</div>
        </div>

        <div class="p-2 rounded-lg text-center" style="${theme.statCard("orange")}">
          <div class="text-xs" style="color:#fed7aa;">Best Streak</div>
          <div class="font-bold" style="color:#fb923c;">🔥 ${bestStreak}</div>
        </div>
      </div>
    </div>

    <!-- ACHIEVEMENT -->
    <div 
      id="profileAchievementPanel" 
      class="glass-panel mt-3"
      style="${theme.panel}"
    >
      <div 
        class="font-bold mb-2"
        style="${theme.blueTitle}"
      >
        🏆 Achievement Terbuka
      </div>

      ${
        unlockedAchievements.length
          ? unlockedAchievements.map(function(a) {
              return `
                <div 
                  class="flex justify-between py-2"
                  style="border-bottom: 1px solid rgba(255,255,255,0.10);"
                >
                  <span style="color:#e2e8f0;">${a.icon} ${a.name}</span>
                  <span style="color:#facc15;">+${a.bonus} DMG</span>
                </div>
              `;
            }).join("")
          : "<div style='color:#94a3b8;'>Belum ada achievement</div>"
      }
    </div>

    <!-- PILIH GELAR -->
    <div 
      id="profileTitlePanel" 
      class="glass-panel mt-3"
      style="${theme.softPanel}"
    >
      <div 
        class="font-bold mb-2"
        style="${theme.blueTitle}"
      >
        🎖 Pilih Gelar
      </div>

      ${
        unlockedAchievements.length
          ? unlockedAchievements.map(function(a) {
              const buttonType = gs.title === a.name ? "gold" : "gray";

              return `
                <button 
                  onclick="setTitle('${a.name}')" 
                  class="btn"
                  style="${theme.buttonStyle(buttonType)}"
                >
                  ${a.icon} ${a.name}
                </button>
              `;
            }).join("")
          : "<div style='color:#94a3b8;'>Selesaikan stage untuk membuka gelar.</div>"
      }
    </div>

    <button 
      id="profileBackBtn" 
      onclick="goTo('home')" 
      class="btn mt-4 w-full"
      style="${theme.buttonStyle("gray")}"
    >
      ⬅️ Kembali
    </button>

  </div>
  `;
};