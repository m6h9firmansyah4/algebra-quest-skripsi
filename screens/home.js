window.renderHomeScreen = function () {
  const gs = window.gameState;

  if (window.updateLifePoints) {
    window.updateLifePoints(gs);
  }

  const lifePoints = gs.player.lifePoints ?? 5;
  const maxLifePoints = gs.player.maxLifePoints ?? 5;
  const lifePercent = Math.min(100, (lifePoints / maxLifePoints) * 100);

  const lifeTimerText = window.getLifePointTimerText
    ? window.getLifePointTimerText(gs)
    : lifePoints >= maxLifePoints
      ? "Penuh"
      : "Memulihkan...";

  const points = gs.player.points ?? gs.player.totalScore ?? 0;
  const bestStreak = gs.player.bestStreak ?? 0;

  const rank = window.AQ_MODEL?.helpers?.getPlayerRank(gs) || "New Adventurer";
  const unlockedAchievements = window.AQ_MODEL?.helpers?.getUnlockedAchievements(gs) || [];
  const worlds = window.AQ_MODEL?.helpers?.getWorldList() || [];

  const menuButtons = window.AQ_MODEL?.homeMenus || [
    {
      id: "mapBtn",
      label: "🌍 Mulai Petualangan",
      screen: "map",
      className: "btn btn-green"
    }
  ];

  function getMenuButtonStyle(menuId) {
    const styles = {
      mapBtn: `
        background: linear-gradient(135deg, #10b981, #047857);
        color: #ecfdf5;
        box-shadow: 0 0 18px rgba(16,185,129,0.28);
      `,

      tutorialBtn: `
        background: linear-gradient(135deg, #2563eb, #1e40af);
        color: #eff6ff;
        box-shadow: 0 0 18px rgba(37,99,235,0.28);
      `,

      historyBtn: `
        background: linear-gradient(135deg, #0f766e, #115e59);
        color: #f0fdfa;
        box-shadow: 0 0 18px rgba(20,184,166,0.22);
      `,

      achievementBtn: `
        background: linear-gradient(135deg, #9333ea, #6b21a8);
        color: #faf5ff;
        box-shadow: 0 0 18px rgba(147,51,234,0.28);
      `,

      leaderboardBtn: `
        background: linear-gradient(135deg, #f59e0b, #b45309);
        color: #fff7ed;
        box-shadow: 0 0 18px rgba(245,158,11,0.28);
      `,

      settingBtn: `
        background: linear-gradient(135deg, #475569, #1e293b);
        color: #f8fafc;
        box-shadow: 0 0 18px rgba(148,163,184,0.18);
      `
    };

    return styles[menuId] || `
      background: linear-gradient(135deg, #334155, #0f172a);
      color: #f8fafc;
      box-shadow: 0 0 18px rgba(148,163,184,0.18);
    `;
  }

  function getWorldColor(worldId) {
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

  return `

    <div 
      class="p-6 max-w-md mx-auto fade-in"
      style="
        min-height: 100dvh;
        background:
          radial-gradient(circle at top, rgba(37,99,235,0.18), transparent 35%),
          radial-gradient(circle at bottom, rgba(147,51,234,0.16), transparent 38%);
      "
    >

      <!-- GAME TITLE -->
      <div 
        class="glass-panel mb-4 text-center"
        style="
          background:
            linear-gradient(180deg, rgba(30,41,59,0.88), rgba(15,23,42,0.86));
          border: 1px solid rgba(250,204,21,0.30);
          box-shadow: 0 0 25px rgba(250,204,21,0.12);
        "
      >
        <h1 
          class="text-2xl font-bold"
          style="
            color: #facc15;
            text-shadow: 0 0 14px rgba(250,204,21,0.35);
          "
        >
          🏰 Algebra Quest RPG
        </h1>

        <p 
          class="text-sm"
          style="color: #cbd5e1;"
        >
          Petualangan belajar matematika
        </p>
      </div>

      <!-- PLAYER CARD -->
      <div 
        id="playerCard" 
        class="glass-panel mb-4 p-4"
        style="
          background:
            linear-gradient(145deg, rgba(15,23,42,0.92), rgba(30,41,59,0.82));
          border: 1px solid rgba(96,165,250,0.28);
          box-shadow: 0 0 26px rgba(59,130,246,0.14);
        "
      >

        <div id="profileBtn" onclick="goTo('profile')" class="cursor-pointer">

          <div class="flex justify-between items-center">

            <div>
              <h2 
                class="text-xl font-bold"
                style="
                  color: #fde68a;
                  text-shadow: 0 0 10px rgba(253,230,138,0.25);
                "
              >
                ${gs.player.name}
              </h2>

              <p 
                class="text-sm"
                style="color: #93c5fd;"
              >
                Lv.${gs.player.level} • ${rank}
              </p>
            </div>

            <div 
              class="text-right text-sm font-bold"
              style="color: #facc15;"
            >
              ⭐ ${gs.player.exp}/${gs.player.expToNext}
            </div>

          </div>

          <!-- SCORE SUMMARY -->
          <div id="scoreSummary" class="grid grid-cols-3 gap-2 mt-3">

            <div 
              class="p-2 rounded-lg text-center"
              style="
                background: rgba(120,53,15,0.35);
                border: 1px solid rgba(250,204,21,0.32);
                box-shadow: 0 0 12px rgba(250,204,21,0.12);
              "
            >
              <div class="text-xs" style="color:#fde68a;">Poin</div>
              <div class="font-bold" style="color:#facc15;">💎 ${points}</div>
            </div>

            <div 
              class="p-2 rounded-lg text-center"
              style="
                background: rgba(124,45,18,0.35);
                border: 1px solid rgba(251,146,60,0.32);
                box-shadow: 0 0 12px rgba(251,146,60,0.12);
              "
            >
              <div class="text-xs" style="color:#fed7aa;">Streak</div>
              <div class="font-bold" style="color:#fb923c;">🔥 ${bestStreak}</div>
            </div>

            <div 
              class="p-2 rounded-lg text-center"
              style="
                background: rgba(88,28,135,0.35);
                border: 1px solid rgba(192,132,252,0.32);
                box-shadow: 0 0 12px rgba(192,132,252,0.12);
              "
            >
              <div class="text-xs" style="color:#e9d5ff;">Achv</div>
              <div class="font-bold" style="color:#c084fc;">🏆 ${unlockedAchievements.length}</div>
            </div>

          </div>

          <!-- LIFEPOINTS -->
          <div 
            id="lifePointsCard" 
            class="mt-4 p-3 rounded-xl"
            style="
              background: rgba(127,29,29,0.28);
              border: 1px solid rgba(248,113,113,0.35);
              box-shadow: 0 0 16px rgba(248,113,113,0.13);
            "
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
              style="color:#cbd5e1;"
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
        style="
          background:
            linear-gradient(180deg, rgba(15,23,42,0.90), rgba(30,41,59,0.78));
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 0 22px rgba(15,23,42,0.55);
        "
      >
        <div 
          class="font-bold mb-3"
          style="color:#bfdbfe;"
        >
          🌍 Progress Area
        </div>

        <div class="space-y-3">
          ${
            worlds.map(function(world) {
              const percent = window.AQ_MODEL.helpers.getWorldPercent(gs, world.id);
              const progress = window.AQ_MODEL.helpers.getProgress(gs, world.id);
              const unlocked = window.isWorldUnlocked
                ? window.isWorldUnlocked(gs, world.id)
                : window.AQ_MODEL.helpers.isWorldUnlockedByModel(gs, world.id);

              const color = getWorldColor(world.id);

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
                    class="flex justify-between text-sm mb-1"
                    style="color:#e2e8f0;"
                  >
                    <span class="font-bold">${world.title}</span>
                    <span>${progress.done || 0}/${progress.total || world.totalStages}</span>
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
                      ? `<div class="text-xs mt-1" style="color:#94a3b8;">${world.subtitle}</div>`
                      : `<div class="text-xs mt-1" style="color:#64748b;">${world.unlockMessage}</div>`
                  }
                </div>
              `;
            }).join("")
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
                style="${getMenuButtonStyle(menu.id)}"
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