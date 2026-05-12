window.renderHistoryScreen = function () {
  const gs = window.gameState || {};

  const fallbackTheme = {
    shell: "min-height:100vh;background:#020617;color:#f8fafc;",
    panel: `
      background:rgba(15,23,42,0.72);
      border:1px solid rgba(148,163,184,0.20);
      border-radius:18px;
      padding:16px;
      box-shadow:0 12px 30px rgba(0,0,0,0.25);
    `,
    headerPanel: `
      background:linear-gradient(135deg,rgba(15,23,42,0.86),rgba(30,41,59,0.72));
      border:1px solid rgba(96,165,250,0.25);
      border-radius:20px;
      padding:18px;
      box-shadow:0 12px 30px rgba(0,0,0,0.25);
    `,
    goldTitle: "color:#fde68a;",
    mutedText: "color:#cbd5e1;",
    subText: "color:#94a3b8;",
    buttonStyle: () => `
      background:rgba(30,41,59,0.9);
      color:#f8fafc;
      border:1px solid rgba(148,163,184,0.25);
      border-radius:14px;
      padding:12px 14px;
      font-weight:700;
    `,
    statCard: () => `
      background:rgba(15,23,42,0.55);
      border:1px solid rgba(148,163,184,0.18);
    `
  };

  const theme = window.AQ_THEME || fallbackTheme;

  let localHistory = [];

  try {
    localHistory = JSON.parse(localStorage.getItem("AQ_HISTORY") || "[]");
  } catch (error) {
    localHistory = [];
  }

  const rawHistory = window.AQ_MODEL?.helpers?.getRecentHistory
    ? window.AQ_MODEL.helpers.getRecentHistory(gs)
    : gs.history || [];

  const history = Array.isArray(rawHistory) && rawHistory.length > 0
    ? rawHistory
    : localHistory.slice().reverse();

  const escapeHtml = window.AQ_MODEL?.helpers?.escapeHtml || function (value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  function getWorldName(worldId) {
    const world = window.AQ_MODEL?.helpers?.getWorld
      ? window.AQ_MODEL.helpers.getWorld(worldId)
      : null;

    return world?.shortTitle || world?.title || worldId || "Unknown World";
  }

  function formatDateTime(value) {
    if (!value) return "-";

    if (window.AQ_MODEL?.helpers?.formatDateTime) {
      return window.AQ_MODEL.helpers.formatDateTime(value);
    }

    try {
      return new Date(value).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "-";
    }
  }

  function getResultText(item) {
    if (item?.result) return item.result;
    if (item?.isCorrect === true) return "Benar";
    if (item?.isCorrect === false) return "Salah";
    return "Selesai";
  }

  function getResultColor(result, isCorrect) {
    if (result === "Menang") return "#34d399";
    if (result === "Benar" || isCorrect) return "#34d399";
    if (result === "Salah") return "#f87171";
    if (result === "Waktu Habis") return "#f59e0b";
    if (result === "Kabur") return "#94a3b8";
    return "#bfdbfe";
  }

  function getResultIcon(result, isCorrect) {
    if (result === "Menang") return "🏆";
    if (result === "Benar" || isCorrect) return "✅";
    if (result === "Salah") return "❌";
    if (result === "Waktu Habis") return "⏰";
    if (result === "Kabur") return "🏳️";
    return "📌";
  }

  function formatAnswer(value) {
    if (value === undefined || value === null || value === "") return "-";
    return escapeHtml(value);
  }

  function normalizeAnswer(value) {
    if (value === undefined || value === null) return "";
    return String(value).trim();
  }

  function renderOptions(options = [], correctAnswer, userAnswer) {
    if (!Array.isArray(options) || options.length === 0) return "";

    const correctText = normalizeAnswer(correctAnswer);
    const userText = normalizeAnswer(userAnswer);

    return `
      <div class="mt-3">
        <div 
          class="text-xs font-bold mb-2"
          style="color:#bfdbfe;"
        >
          Pilihan Jawaban
        </div>

        <div class="space-y-1">
          ${
            options.map(function (opt, index) {
              const optionText = normalizeAnswer(opt);
              const isCorrectOption = optionText === correctText;
              const isUserOption = optionText === userText;

              let border = "rgba(148,163,184,0.18)";
              let bg = "rgba(15,23,42,0.45)";
              let label = "";

              if (isCorrectOption) {
                border = "rgba(52,211,153,0.55)";
                bg = "rgba(6,95,70,0.24)";
                label = "Jawaban benar";
              }

              if (isUserOption && !isCorrectOption) {
                border = "rgba(248,113,113,0.55)";
                bg = "rgba(127,29,29,0.24)";
                label = "Jawaban siswa";
              }

              if (isUserOption && isCorrectOption) {
                label = "Jawaban siswa benar";
              }

              return `
                <div 
                  class="text-xs px-3 py-2 rounded-lg"
                  style="
                    border:1px solid ${border};
                    background:${bg};
                    color:#e5e7eb;
                  "
                >
                  <div class="flex justify-between gap-2">
                    <div>
                      <b>${String.fromCharCode(65 + index)}.</b>
                      ${escapeHtml(opt)}
                    </div>

                    ${
                      label
                        ? `
                          <div 
                            class="text-[10px] font-bold"
                            style="color:${isCorrectOption ? "#bbf7d0" : "#fecaca"};"
                          >
                            ${label}
                          </div>
                        `
                        : ""
                    }
                  </div>
                </div>
              `;
            }).join("")
          }
        </div>
      </div>
    `;
  }

  function renderMistakeNote(item) {
    const result = getResultText(item);

    if (item.isCorrect) {
      return `
        <div 
          class="text-xs mt-3 p-3 rounded-lg"
          style="
            background:rgba(6,95,70,0.22);
            border:1px solid rgba(52,211,153,0.35);
            color:#bbf7d0;
          "
        >
          ✅ Jawaban siswa sudah benar.
        </div>
      `;
    }

    if (result === "Kabur") {
      return `
        <div 
          class="text-xs mt-3 p-3 rounded-lg"
          style="
            background:rgba(71,85,105,0.24);
            border:1px solid rgba(148,163,184,0.30);
            color:#cbd5e1;
          "
        >
          🏳️ Battle ditinggalkan sebelum soal diselesaikan.
        </div>
      `;
    }

    if (result === "Waktu Habis") {
      return `
        <div 
          class="text-xs mt-3 p-3 rounded-lg"
          style="
            background:rgba(120,53,15,0.24);
            border:1px solid rgba(245,158,11,0.35);
            color:#fde68a;
          "
        >
          ⏰ Siswa belum menjawab sampai waktu habis. Jawaban yang benar adalah 
          <b>${formatAnswer(item.correctAnswer)}</b>.
        </div>
      `;
    }

    if (item.questionText || item.correctAnswer || item.userAnswer) {
      return `
        <div 
          class="text-xs mt-3 p-3 rounded-lg"
          style="
            background:rgba(127,29,29,0.24);
            border:1px solid rgba(248,113,113,0.35);
            color:#fecaca;
          "
        >
          ❌ Letak kesalahan: siswa menjawab 
          <b>${formatAnswer(item.userAnswer)}</b>, sedangkan jawaban yang benar adalah 
          <b>${formatAnswer(item.correctAnswer)}</b>.
        </div>
      `;
    }

    return `
      <div 
        class="text-xs mt-3 p-3 rounded-lg"
        style="
          background:rgba(30,41,59,0.35);
          border:1px solid rgba(148,163,184,0.20);
          color:#cbd5e1;
        "
      >
        Detail soal belum tersedia untuk riwayat ini.
      </div>
    `;
  }

  function renderHistoryCard(item, index) {
    const worldName = getWorldName(item.world);
    const time = formatDateTime(item.time);
    const result = getResultText(item);
    const resultColor = getResultColor(result, item.isCorrect);
    const resultIcon = getResultIcon(result, item.isCorrect);

    const sourceStageInfo =
      item.sourceStage && String(item.sourceStage) !== String(item.stage)
        ? `<span style="color:#93c5fd;"> • Soal dari Stage ${escapeHtml(item.sourceStage)}</span>`
        : "";

    const pointValue = Number(item.points || 0);
    const expValue = Number(item.exp || 0);

    return `
      <details 
        class="glass-panel history-card"
        style="
          ${theme.panel};
          overflow:hidden;
          padding:0;
        "
        ${index === 0 ? "" : ""}
      >
        <summary 
          class="cursor-pointer history-summary"
          style="
            list-style:none;
            outline:none;
            padding:14px 16px;
            background:rgba(15,23,42,0.45);
          "
        >
          <div class="flex justify-between items-start gap-3">
            <div class="min-w-0">
              <div 
                class="text-[10px] uppercase tracking-widest mb-1"
                style="color:#93c5fd;"
              >
                Riwayat ${index + 1}
              </div>

              <div 
                class="font-bold"
                style="color:#fde68a;"
              >
                ${escapeHtml(worldName)} - Stage ${escapeHtml(item.stage || "-")}
                ${sourceStageInfo}
              </div>

              <div 
                class="text-xs mt-1"
                style="${theme.subText}"
              >
                ${escapeHtml(time)}
              </div>

              ${
                item.topic
                  ? `
                    <div 
                      class="text-xs mt-1"
                      style="color:#bfdbfe;"
                    >
                      Materi: ${escapeHtml(item.topic)}
                    </div>
                  `
                  : ""
              }
            </div>

            <div class="text-right shrink-0">
              <div 
                class="text-xs font-bold px-2 py-1 rounded-lg mb-1"
                style="
                  color:${resultColor};
                  background:rgba(15,23,42,0.6);
                  border:1px solid rgba(148,163,184,0.18);
                  white-space:nowrap;
                "
              >
                ${resultIcon} ${escapeHtml(result)}
              </div>

              <div 
                class="text-xs history-open-label"
                style="color:#93c5fd;"
              >
                Buka detail ⌄
              </div>
            </div>
          </div>
        </summary>

        <div 
          class="history-detail"
          style="
            padding:16px;
            border-top:1px solid rgba(148,163,184,0.18);
            background:rgba(2,6,23,0.28);
          "
        >
          ${
            item.enemyName
              ? `
                <div 
                  class="text-xs mb-3"
                  style="${theme.subText}"
                >
                  Musuh: ${escapeHtml(item.enemyName)}
                </div>
              `
              : ""
          }

          <div 
            class="p-3 rounded-xl"
            style="
              background:rgba(15,23,42,0.55);
              border:1px solid rgba(96,165,250,0.20);
            "
          >
            <div 
              class="text-xs font-bold mb-1"
              style="color:#bfdbfe;"
            >
              Soal yang Didapatkan
            </div>

            <div 
              class="text-sm font-bold leading-relaxed"
              style="color:#f8fafc;"
            >
              ${escapeHtml(item.questionText || "-")}
            </div>
          </div>

          ${renderOptions(item.options, item.correctAnswer, item.userAnswer)}

          <div class="grid grid-cols-2 gap-2 mt-3">
            <div 
              class="p-2 rounded-lg"
              style="${theme.statCard(item.isCorrect ? "green" : "red")}"
            >
              <div 
                class="text-xs"
                style="color:#cbd5e1;"
              >
                Jawaban Siswa
              </div>

              <div 
                class="font-bold text-sm break-words"
                style="color:#f8fafc;"
              >
                ${formatAnswer(item.userAnswer)}
              </div>
            </div>

            <div 
              class="p-2 rounded-lg"
              style="${theme.statCard("green")}"
            >
              <div 
                class="text-xs"
                style="color:#cbd5e1;"
              >
                Jawaban Benar
              </div>

              <div 
                class="font-bold text-sm break-words"
                style="color:#bbf7d0;"
              >
                ${formatAnswer(item.correctAnswer)}
              </div>
            </div>
          </div>

          ${renderMistakeNote(item)}

          <div class="grid grid-cols-2 gap-2 mt-3">
            <div 
              class="p-2 rounded-lg text-center"
              style="${theme.statCard("gold")}"
            >
              <div 
                class="text-xs"
                style="color:#fde68a;"
              >
                Poin
              </div>

              <div 
                class="font-bold"
                style="color:#facc15;"
              >
                💎 ${pointValue}
              </div>
            </div>

            <div 
              class="p-2 rounded-lg text-center"
              style="${theme.statCard("blue")}"
            >
              <div 
                class="text-xs"
                style="color:#bfdbfe;"
              >
                EXP
              </div>

              <div 
                class="font-bold"
                style="color:#60a5fa;"
              >
                ⭐ ${expValue}
              </div>
            </div>
          </div>

          ${
            item.note
              ? `
                <div 
                  class="text-xs mt-3 p-3 rounded-lg"
                  style="
                    ${theme.subText};
                    background:rgba(15,23,42,0.45);
                    border:1px solid rgba(148,163,184,0.16);
                  "
                >
                  ${escapeHtml(item.note)}
                </div>
              `
              : ""
          }
        </div>
      </details>
    `;
  }

  function renderLatestBox(latest) {
    if (!latest) return "";

    const worldName = getWorldName(latest.world);
    const result = getResultText(latest);
    const resultColor = getResultColor(result, latest.isCorrect);
    const resultIcon = getResultIcon(result, latest.isCorrect);

    return `
      <div 
        class="glass-panel mb-4"
        style="${theme.panel}"
      >
        <div 
          class="text-xs uppercase tracking-widest mb-1"
          style="color:#93c5fd;"
        >
          Stage Terakhir Dimainkan
        </div>

        <div 
          class="font-bold"
          style="color:#fde68a;"
        >
          ${escapeHtml(worldName)} - Stage ${escapeHtml(latest.stage || "-")}
        </div>

        ${
          latest.topic
            ? `
              <div 
                class="text-xs mt-1"
                style="color:#bfdbfe;"
              >
                ${escapeHtml(latest.topic)}
              </div>
            `
            : ""
        }

        <div 
          class="text-xs mt-1"
          style="${theme.subText}"
        >
          ${escapeHtml(formatDateTime(latest.time))}
        </div>

        <div 
          class="text-xs mt-2"
          style="color:${resultColor};"
        >
          Status terakhir: <b>${resultIcon} ${escapeHtml(result)}</b>
        </div>
      </div>
    `;
  }

  const latest = history[0];

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
          class="text-sm mt-1"
          style="${theme.mutedText}"
        >
          Catatan stage, soal, jawaban, dan hasil permainan siswa
        </p>
      </div>
      <button 
        onclick="goTo('home')" 
        class="btn w-full mt-6"
        style="${theme.buttonStyle("gray")}"
      >
        ⬅️ Kembali
      </button>

      ${renderLatestBox(latest)}

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
                Riwayat akan muncul setelah siswa mulai menjawab soal di battle.
              </p>
            </div>
          `
          : `
            <div class="space-y-3">
              ${history.map(renderHistoryCard).join("")}
            </div>
          `
      }
    </div>
  `;
};

