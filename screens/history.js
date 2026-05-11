window.renderHistoryScreen = function () {
  const gs = window.gameState;
  const theme = window.AQ_THEME;
  const history = window.AQ_MODEL?.helpers?.getRecentHistory(gs) || [];

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
          📜 Riwayat
        </h2>

        <p 
          class="text-sm"
          style="${theme.mutedText}"
        >
          Catatan aktivitas permainanmu
        </p>
      </div>

      ${
        history.length === 0
          ? `
            <div 
              class="glass-panel text-center"
              style="${theme.panel}"
            >
              <div class="text-3xl mb-2">📝</div>

              <div 
                class="font-bold"
                style="color:#bfdbfe;"
              >
                Belum ada data riwayat
              </div>

              <p 
                class="text-xs mt-2"
                style="${theme.subText}"
              >
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
                  const resultColor = item.result === "Menang" ? "#34d399" : "#f87171";

                  return `
                    <div 
                      class="glass-panel"
                      style="${theme.panel}"
                    >
                      <div class="flex justify-between items-start gap-3">
                        <div>
                          <div 
                            class="font-bold"
                            style="color:#fde68a;"
                          >
                            ${worldName} - Stage ${item.stage}
                          </div>

                          <div 
                            class="text-sm mt-1"
                            style="${theme.subText}"
                          >
                            ${time}
                          </div>
                        </div>

                        <div 
                          class="text-sm font-bold"
                          style="color:${resultColor};"
                        >
                          ${item.result}
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-2 mt-3">
                        <div 
                          class="p-2 rounded-lg text-center"
                          style="${theme.statCard("gold")}"
                        >
                          <div class="text-xs" style="color:#fde68a;">Poin</div>
                          <div class="font-bold" style="color:#facc15;">💎 ${item.points || 0}</div>
                        </div>

                        <div 
                          class="p-2 rounded-lg text-center"
                          style="${theme.statCard("blue")}"
                        >
                          <div class="text-xs" style="color:#bfdbfe;">EXP</div>
                          <div class="font-bold" style="color:#60a5fa;">⭐ ${item.exp || 0}</div>
                        </div>
                      </div>

                      ${
                        item.note
                          ? `<div class="text-xs mt-2" style="${theme.subText}">${item.note}</div>`
                          : ""
                      }
                    </div>
                  `;
                }).join("")
              }
            </div>
          `
      }

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