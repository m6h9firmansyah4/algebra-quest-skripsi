window.renderAchievementScreen = function () {
  const gs = window.gameState;
  const theme = window.AQ_THEME;

  const catalog = window.AQ_MODEL?.achievements || [];
  const unlocked = window.AQ_MODEL?.helpers?.getUnlockedAchievements(gs) || [];

  const unlockedIds = unlocked.map(function(item) {
    return item.id;
  });

  const unlockedCount = unlocked.length;
  const totalCount = catalog.length;
  const percent = totalCount ? Math.floor((unlockedCount / totalCount) * 100) : 0;

  return `
    <div 
      class="p-6 max-w-md mx-auto fade-in"
      style="${theme.shell}"
    >

      <div 
        class="glass-panel mb-4 text-center"
        style="${theme.headerPanel}"
      >
        <h2 
          class="text-2xl font-bold"
          style="${theme.goldTitle}"
        >
          🏆 Achievement
        </h2>

        <p 
          class="text-sm"
          style="${theme.mutedText}"
        >
          ${unlockedCount} dari ${totalCount} achievement terbuka
        </p>

        <div 
          class="progress-bar mt-3"
          style="background: rgba(15,23,42,0.85); height: 10px;"
        >
          <div 
            class="progress-fill" 
            style="
              width:${percent}%;
              background: linear-gradient(to right, #facc15, #f97316);
              box-shadow: 0 0 12px rgba(250,204,21,0.35);
            ">
          </div>
        </div>

        <div 
          class="progress-text"
          style="color:#fde68a;"
        >
          Progress achievement: ${percent}%
        </div>
      </div>

      <div class="space-y-3">
        ${
          catalog.map(function(item) {
            const isUnlocked = unlockedIds.includes(item.id);

            return `
              <div 
                class="glass-panel ${isUnlocked ? "" : "opacity-50"}"
                style="${isUnlocked ? theme.panel : theme.softPanel}"
              >
                <div class="flex justify-between items-center gap-3">
                  <div>
                    <div 
                      class="font-bold"
                      style="color:${isUnlocked ? "#fde68a" : "#94a3b8"};"
                    >
                      ${isUnlocked ? item.icon : "🔒"} ${item.name}
                    </div>

                    <div 
                      class="text-sm mt-1"
                      style="${theme.subText}"
                    >
                      ${item.description}
                    </div>
                  </div>

                  <div 
                    class="text-right font-bold"
                    style="color:${isUnlocked ? "#facc15" : "#64748b"};"
                  >
                    +${item.bonus} DMG
                  </div>
                </div>

                <div 
                  class="text-xs mt-2"
                  style="color:${isUnlocked ? "#34d399" : "#64748b"};"
                >
                  ${isUnlocked ? "Terbuka" : "Belum terbuka"}
                </div>
              </div>
            `;
          }).join("")
        }
      </div>

      <button 
        onclick="goTo('home')" 
        class="btn w-full mt-6"
        style="${theme.buttonStyle("gray")}"
      >
        ⬅️ Kembali
      </button>

    </div>
  `;
};