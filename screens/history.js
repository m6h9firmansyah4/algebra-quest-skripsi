window.renderHistoryScreen = function () {
  const gs = window.gameState;
  const history = window.AQ_MODEL?.helpers?.getRecentHistory(gs) || [];

  return `
    <div class="p-6 max-w-md mx-auto fade-in">

      <div class="glass-panel mb-4 text-center">
        <h2 class="text-2xl font-bold">📜 Riwayat</h2>
        <p class="text-gray-400 text-sm">
          Catatan aktivitas permainanmu
        </p>
      </div>

      ${
        history.length === 0
          ? `
            <div class="glass-panel text-center text-gray-400">
              <div class="text-3xl mb-2">📝</div>
              <div>Belum ada data riwayat</div>
              <p class="text-xs mt-2">
                Riwayat akan muncul setelah battle system memanggil fungsi addGameHistory().
              </p>
            </div>
          `
          : `
            <div class="space-y-3">
              ${
                history.map(function(item) {
                  const world = window.AQ_MODEL?.helpers?.getWorld(item.world);
                  const worldName = world?.shortTitle || item.world || "Unknown World";
                  const time = window.AQ_MODEL?.helpers?.formatDateTime(item.time);

                  return `
                    <div class="glass-panel">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="font-bold text-yellow-400">
                            ${worldName} - Stage ${item.stage}
                          </div>

                          <div class="text-sm text-gray-400 mt-1">
                            ${time}
                          </div>
                        </div>

                        <div class="text-sm font-bold ${
                          item.result === "Menang" ? "text-green-400" : "text-red-400"
                        }">
                          ${item.result}
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-2 mt-3">
                        <div class="p-2 rounded-lg bg-slate-900/60 text-center">
                          <div class="text-xs text-gray-400">Poin</div>
                          <div class="font-bold text-yellow-400">💎 ${item.points || 0}</div>
                        </div>

                        <div class="p-2 rounded-lg bg-slate-900/60 text-center">
                          <div class="text-xs text-gray-400">EXP</div>
                          <div class="font-bold text-blue-400">⭐ ${item.exp || 0}</div>
                        </div>
                      </div>

                      ${
                        item.note
                          ? `<div class="text-xs text-gray-400 mt-2">${item.note}</div>`
                          : ""
                      }
                    </div>
                  `;
                }).join("")
              }
            </div>
          `
      }

      <button onclick="goTo('home')" class="btn btn-gray w-full mt-6">
        ⬅️ Kembali
      </button>

    </div>
  `;
};