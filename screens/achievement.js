window.renderAchievementScreen = function () {
  const gs = window.gameState;
  const catalog = window.AQ_MODEL?.achievements || [];
  const unlocked = window.AQ_MODEL?.helpers?.getUnlockedAchievements(gs) || [];

  const unlockedIds = unlocked.map(function(item) {
    return item.id;
  });

  const unlockedCount = unlocked.length;
  const totalCount = catalog.length;
  const percent = totalCount ? Math.floor((unlockedCount / totalCount) * 100) : 0;

  return `
    <div class="p-6 max-w-md mx-auto fade-in">

      <div class="glass-panel mb-4 text-center">
        <h2 class="text-2xl font-bold">🏆 Achievement</h2>
        <p class="text-gray-400 text-sm">
          ${unlockedCount} dari ${totalCount} achievement terbuka
        </p>

        <div class="progress-bar mt-3">
          <div class="progress-fill" style="width:${percent}%"></div>
        </div>

        <div class="progress-text">
          Progress achievement: ${percent}%
        </div>
      </div>

      <div class="space-y-3">
        ${
          catalog.map(function(item) {
            const isUnlocked = unlockedIds.includes(item.id);

            return `
              <div class="glass-panel ${isUnlocked ? "" : "opacity-50"}">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-bold">
                      ${isUnlocked ? item.icon : "🔒"} ${item.name}
                    </div>

                    <div class="text-sm text-gray-400 mt-1">
                      ${item.description}
                    </div>
                  </div>

                  <div class="text-right text-yellow-400 font-bold">
                    +${item.bonus} DMG
                  </div>
                </div>

                <div class="text-xs mt-2 ${isUnlocked ? "text-green-400" : "text-gray-500"}">
                  ${isUnlocked ? "Terbuka" : "Belum terbuka"}
                </div>
              </div>
            `;
          }).join("")
        }
      </div>

      <button onclick="goTo('home')" class="btn btn-gray w-full mt-6">
        ⬅️ Kembali
      </button>

    </div>
  `;
};