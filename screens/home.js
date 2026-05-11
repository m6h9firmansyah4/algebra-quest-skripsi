window.renderHomeScreen = function () {
  const gs = window.gameState || {};
  const player = gs.player || {};

  const theme = window.AQ_THEME || {
    shell: `
      min-height: 100dvh;
      background:
        radial-gradient(circle at top, rgba(37,99,235,0.18), transparent 35%),
        radial-gradient(circle at bottom, rgba(147,51,234,0.16), transparent 38%);
    `,

    headerPanel: `
      background:
        linear-gradient(180deg, rgba(30,41,59,0.88), rgba(15,23,42,0.86));
      border: 1px solid rgba(250,204,21,0.30);
      box-shadow: 0 0 25px rgba(250,204,21,0.12);
    `,

    panel: `
      background:
        linear-gradient(145deg, rgba(15,23,42,0.92), rgba(30,41,59,0.82));
      border: 1px solid rgba(96,165,250,0.28);
      box-shadow: 0 0 26px rgba(59,130,246,0.14);
    `,

    softPanel: `
      background:
        linear-gradient(180deg, rgba(15,23,42,0.90), rgba(30,41,59,0.78));
      border: 1px solid rgba(148,163,184,0.18);
      box-shadow: 0 0 22px rgba(15,23,42,0.55);
    `,

    goldTitle: `
      color: #facc15;
      text-shadow: 0 0 14px rgba(250,204,21,0.35);
    `,

    blueTitle: `
      color: #bfdbfe;
      text-shadow: 0 0 12px rgba(96,165,250,0.20);
    `,

    mutedText: `color: #cbd5e1;`,
    subText: `color: #94a3b8;`,

    buttonStyle: function(type) {
      const styles = {
        green: `
          background: linear-gradient(135deg, #10b981, #047857);
          color: #ecfdf5;
          box-shadow: 0 0 18px rgba(16,185,129,0.28);
        `,
        blue: `
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: #eff6ff;
          box-shadow: 0 0 18px rgba(37,99,235,0.28);
        `,
        teal: `
          background: linear-gradient(135deg, #0f766e, #115e59);
          color: #f0fdfa;
          box-shadow: 0 0 18px rgba(20,184,166,0.22);
        `,
        purple: `
          background: linear-gradient(135deg, #9333ea, #6b21a8);
          color: #faf5ff;
          box-shadow: 0 0 18px rgba(147,51,234,0.28);
        `,
        gold: `
          background: linear-gradient(135deg, #f59e0b, #b45309);
          color: #fff7ed;
          box-shadow: 0 0 18px rgba(245,158,11,0.28);
        `,
        red: `
          background: linear-gradient(135deg, #ef4444, #991b1b);
          color: #fef2f2;
          box-shadow: 0 0 18px rgba(239,68,68,0.28);
        `,
        gray: `
          background: linear-gradient(135deg, #475569, #1e293b);
          color: #f8fafc;
          box-shadow: 0 0 18px rgba(148,163,184,0.18);
        `
      };

      return styles[type] || styles.gray;
    },

    statCard: function(type) {
      const styles = {
        gold: `
          background: rgba(120,53,15,0.35);
          border: 1px solid rgba(250,204,21,0.32);
          box-shadow: 0 0 12px rgba(250,204,21,0.12);
        `,
        orange: `
          background: rgba(124,45,18,0.35);
          border: 1px solid rgba(251,146,60,0.32);
          box-shadow: 0 0 12px rgba(251,146,60,0.12);
        `,
        purple: `
          background: rgba(88,28,135,0.35);
          border: 1px solid rgba(192,132,252,0.32);
          box-shadow: 0 0 12px rgba(192,132,252,0.12);
        `,
        red: `
          background: rgba(127,29,29,0.28);
          border: 1px solid rgba(248,113,113,0.35);
          box-shadow: 0 0 16px rgba(248,113,113,0.13);
        `,
        blue: `
          background: rgba(30,64,175,0.25);
          border: 1px solid rgba(96,165,250,0.30);
          box-shadow: 0 0 14px rgba(96,165,250,0.12);
        `,
        green: `
          background: rgba(6,95,70,0.28);
          border: 1px solid rgba(52,211,153,0.32);
          box-shadow: 0 0 14px rgba(52,211,153,0.12);
        `
      };

      return styles[type] || styles.blue;
    },

    worldColor: function(worldId) {
      const colors = {
        numbers: {
          border: "rgba(16,185,129,0.35)",
          glow: "rgba(16,185,129,0.18)",
          fill: "linear-gradient(to right, #34d399, #10b981)"
        },
        algebra: {
          border: "rgba(245,158,11,0.35)",
          glow: "rgba(245,158,11,0.18)",
          fill: "linear-gradient(to right, #fbbf24, #f97316)"
        },
        geometry: {
          border: "rgba(56,189,248,0.35)",
          glow: "rgba(56,189,248,0.18)",
          fill: "linear-gradient(to right, #38bdf8, #2563eb)"
        },
        data: {
          border: "rgba(168,85,247,0.35)",
          glow: "rgba(168,85,247,0.18)",
          fill: "linear-gradient(to right, #a855f7, #7c3aed)"
        }
      };

      return colors[worldId] || {
        border: "rgba(148,163,184,0.25)",
        glow: "rgba(148,163,184,0.12)",
        fill: "linear-gradient(to right, #94a3b8, #475569)"
      };
    }
  };

  if (window.updateLifePoints) {
    window.updateLifePoints(gs);
  }

  const lifePoints = player.lifePoints ?? 5;
  const maxLifePoints = player.maxLifePoints ?? 5;
  const lifePercent = Math.min(100, Math.floor((lifePoints / maxLifePoints) * 100));

  const lifeTimerText = window.getLifePointTimerText
    ? window.getLifePointTimerText(gs)
    : lifePoints >= maxLifePoints
      ? "Penuh"
      : "Memulihkan...";

  const points = player.points ?? player.totalScore ?? 0;
  const bestStreak = player.bestStreak ?? 0;

  const exp = player.exp ?? 0;
  const expToNext = player.expToNext || 1;
  const expPercent = Math.min(100, Math.floor((exp / expToNext) * 100));

  const rank = window.AQ_MODEL?.helpers?.getPlayerRank
    ? window.AQ_MODEL.helpers.getPlayerRank(gs)
    : "New Adventurer";

  const unlockedAchievements = window.AQ_MODEL?.helpers?.getUnlockedAchievements
    ? window.AQ_MODEL.helpers.getUnlockedAchievements(gs)
    : [];

  const worlds = window.AQ_MODEL?.helpers?.getWorldList
    ? window.AQ_MODEL.helpers.getWorldList()
    : [];

  const menuButtons = window.AQ_MODEL?.homeMenus || [
    {
      id: "mapBtn",
      label: "🌍 Mulai Petualangan",
      screen: "map"
    },
    {
      id: "tutorialBtn",
      label: "📘 Tutorial Bermain",
      screen: "tutorial"
    },
    {
      id: "historyBtn",
      label: "📜 Riwayat",
      screen: "history"
    },
    {
      id: "achievementBtn",
      label: "🏆 Achievement",
      screen: "achievement"
    },
    {
      id: "leaderboardBtn",
      label: "🥇 Leaderboard",
      screen: "leaderboard"
    },
    {
      id: "settingBtn",
      label: "⚙️ Pengaturan",
      screen: "setting"
    }
  ];

  function getMenuThemeType(menuId) {
    const types = {
      mapBtn: "green",
      tutorialBtn: "blue",
      historyBtn: "teal",
      achievementBtn: "purple",
      leaderboardBtn: "gold",
      settingBtn: "gray"
    };

    return types[menuId] || "gray";
  }

  function getWorldProgress(world) {
    if (window.AQ_MODEL?.helpers?.getProgress) {
      return window.AQ_MODEL.helpers.getProgress(gs, world.id);
    }

    return gs.progress?.[world.id] || {
      done: 0,
      total: world.totalStages || 17,
      completedStage: 0,
      highestUnlockedStage: world.id === "numbers" ? 1 : 0
    };
  }

  function getWorldPercent(world, progress) {
    if (window.AQ_MODEL?.helpers?.getWorldPercent) {
      return window.AQ_MODEL.helpers.getWorldPercent(gs, world.id);
    }

    const done = progress.done ?? progress.completedStage ?? 0;
    const total = progress.total || world.totalStages || 17;

    return total ? Math.min(100, Math.floor((done / total) * 100)) : 0;
  }

  function isWorldUnlocked(world) {
    if (window.isWorldUnlocked) {
      return window.isWorldUnlocked(gs, world.id);
    }

    if (window.AQ_MODEL?.helpers?.isWorldUnlockedByModel) {
      return window.AQ_MODEL.helpers.isWorldUnlockedByModel(gs, world.id);
    }

    return world.id === "numbers";
  }

  return `
    <div 
      class="p-6 max-w-md mx-auto fade-in"
      style="${theme.shell}"
    >

      <!-- GAME TITLE -->
      <div 
        class="glass-panel mb-4 text-center"
        style="${theme.headerPanel}"
      >
        <h1 
          class="text-2xl font-bold"
          style="${theme.goldTitle}"
        >
          🏰 Algebra Quest RPG
        </h1>

        <p 
          class="text-sm"
          style="${theme.mutedText}"
        >
          Petualangan belajar matematika
        </p>
      </div>

      <!-- PLAYER CARD -->
      <div 
        id="playerCard" 
        class="glass-panel mb-4 p-4"
        style="${theme.panel}"
      >

        <div id="profileBtn" onclick="goTo('profile')" class="cursor-pointer">

          <div class="flex justify-between items-center gap-3">

            <div>
              <h2 
                class="text-xl font-bold"
                style="
                  color: #fde68a;
                  text-shadow: 0 0 10px rgba(253,230,138,0.25);
                "
              >
                ${player.name || "Player"}
              </h2>

              <p 
                class="text-sm"
                style="color: #93c5fd;"
              >
                Lv.${player.level ?? 1} • ${rank}
              </p>
            </div>

            <div 
              class="text-right text-sm font-bold"
              style="color: #facc15;"
            >
              ⭐ ${exp}/${expToNext}
            </div>

          </div>

          <!-- EXP BAR -->
          <div class="mt-3">
            <div 
              class="progress-bar"
              style="background: rgba(15,23,42,0.85); height: 9px;"
            >
              <div 
                class="progress-fill" 
                style="
                  width:${expPercent}%;
                  background: linear-gradient(to right, #facc15, #f97316);
                  box-shadow: 0 0 12px rgba(250,204,21,0.35);
                ">
              </div>
            </div>
          </div>

          <!-- SCORE SUMMARY -->
          <div id="scoreSummary" class="grid grid-cols-3 gap-2 mt-3">

            <div 
              class="p-2 rounded-lg text-center"
              style="${theme.statCard("gold")}"
            >
              <div class="text-xs" style="color:#fde68a;">Poin</div>
              <div class="font-bold" style="color:#facc15;">💎 ${points}</div>
            </div>

            <div 
              class="p-2 rounded-lg text-center"
              style="${theme.statCard("orange")}"
            >
              <div class="text-xs" style="color:#fed7aa;">Streak</div>
              <div class="font-bold" style="color:#fb923c;">🔥 ${bestStreak}</div>
            </div>

            <div 
              class="p-2 rounded-lg text-center"
              style="${theme.statCard("purple")}"
            >
              <div class="text-xs" style="color:#e9d5ff;">Achv</div>
              <div class="font-bold" style="color:#c084fc;">🏆 ${unlockedAchievements.length}</div>
            </div>

          </div>

          <!-- LIFEPOINTS -->
          <div 
            id="lifePointsCard" 
            class="mt-4 p-3 rounded-xl"
            style="${theme.statCard("red")}"
          >

            <div class="flex justify-between items-center mb-2">
              <div 
                class="text-sm font-bold"
                style="color:#fecaca;"
              >
                ❤️ LifePoints
              </div>

              <div 
                class="text-sm font-bold"
                style="color:#f87171;"
              >
                ${lifePoints}/${maxLifePoints}
              </div>
            </div>

            <div 
              class="w-full h-3 rounded-full overflow-hidden"
              style="background: rgba(51,65,85,0.95);"
            >
              <div 
                class="h-full rounded-full transition-all duration-500"
                style="
                  width:${lifePercent}%;
                  background: linear-gradient(to right, #fb7185, #ef4444);
                  box-shadow: 0 0 12px rgba(239,68,68,0.45);
                ">
              </div>
            </div>

            <div 
              class="text-xs mt-2 text-center"
              style="${theme.mutedText}"
            >
              ${
                lifePoints >= maxLifePoints
                  ? "LifePoints penuh"
                  : `LifePoint berikutnya: ${lifeTimerText}`
              }
            </div>

          </div>

        </div>

      </div>

      <!-- WORLD SUMMARY -->
      <div 
        class="glass-panel mb-4"
        style="${theme.softPanel}"
      >
        <div 
          class="font-bold mb-3"
          style="${theme.blueTitle}"
        >
          🌍 Progress Area
        </div>

        <div class="space-y-3">
          ${
            worlds.length
              ? worlds.map(function(world) {
                  const progress = getWorldProgress(world);
                  const percent = getWorldPercent(world, progress);
                  const unlocked = isWorldUnlocked(world);
                  const color = theme.worldColor(world.id);
                  const done = progress.done ?? progress.completedStage ?? 0;
                  const total = progress.total || world.totalStages || 17;

                  return `
                    <div 
                      class="${unlocked ? "" : "opacity-60"}"
                      style="
                        padding: 10px;
                        border-radius: 12px;
                        background: ${color.glow};
                        border: 1px solid ${color.border};
                      "
                    >
                      <div 
                        class="flex justify-between text-sm mb-1 gap-3"
                        style="color:#e2e8f0;"
                      >
                        <span class="font-bold">${world.title}</span>
                        <span>${done}/${total}</span>
                      </div>

                      <div 
                        class="progress-bar"
                        style="
                          background: rgba(15,23,42,0.85);
                          height: 10px;
                        "
                      >
                        <div 
                          class="progress-fill" 
                          style="
                            width:${percent}%;
                            background: ${color.fill};
                            box-shadow: 0 0 10px ${color.border};
                          ">
                        </div>
                      </div>

                      ${
                        unlocked
                          ? `<div class="text-xs mt-1" style="${theme.subText}">${world.subtitle}</div>`
                          : `<div class="text-xs mt-1" style="color:#64748b;">${world.unlockMessage || "Area masih terkunci"}</div>`
                      }
                    </div>
                  `;
                }).join("")
              : `
                <div 
                  class="p-3 rounded-xl text-center"
                  style="${theme.statCard("blue")}"
                >
                  <div class="font-bold" style="color:#bfdbfe;">
                    Data world belum tersedia
                  </div>
                  <div class="text-xs mt-1" style="${theme.subText}">
                    Pastikan model.js sudah dipanggil sebelum home.js.
                  </div>
                </div>
              `
          }
        </div>
      </div>

      <!-- MENU -->
      <div class="space-y-3">
        ${
          menuButtons.map(function(menu) {
            return `
              <button 
                id="${menu.id}" 
                onclick="goTo('${menu.screen}')" 
                class="btn"
                style="${theme.buttonStyle(getMenuThemeType(menu.id))}"
              >
                ${menu.label}
              </button>
            `;
          }).join("")
        }
      </div>

    </div>
  `;
};