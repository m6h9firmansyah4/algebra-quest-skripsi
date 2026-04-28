// ======================================================
// game.js
// FIX LOGIKA TURN & HP
// VERSI RAPIH + KATEGORI
// ======================================================


// ======================================================
// 1. IMPORTS
// ======================================================
import { getQuestion } from "./engine/worldRouter.js";
import { getEnemy } from "./engine/enemyRouter.js";
import {
  validateAnswer,
  calculatePlayerDamage,
  calculateEnemyDamage,
  applyStreakBonus
} from "./engine/battleSystem.js";
import {
  getTimerHtml,
  startQuestionTimer,
  stopQuestionTimer,
  resetQuestionTimer,
  getStageTimerDuration,
} from "./engine/timerEngine.js";
import { spawnDamage } from "./engine/damageEngine.js";


// ======================================================
// 2. WORLD MAP CONFIG
// ======================================================
const worlds = {
  numbers: {
    name: "Numbers",
    zones: {
      root_floor: {
        name: "The Root Floor",
        theme: "Bilangan Bulat",
        stages: {
          1: {
            name: "Slime of Sums",
            difficulty: "easy",
            enemy: "Green Slime",
            questionType: "addition"
          },
          2: {
            name: "Minus Mites",
            difficulty: "easy",
            enemy: "Red Mite",
            questionType: "subtraction"
          },
          3: {
            name: "Multiplier Beetle",
            difficulty: "medium",
            enemy: "Beetle",
            questionType: "multiplication"
          },
          4: {
            name: "Mixed Golem",
            difficulty: "hard",
            enemy: "Golem",
            questionType: "mixed"
          }
        }
      }
    }
  }
};

// ======================================================
// 4. BATTLE SCREEN RENDERER
// ======================================================
window.renderBattleScreen = function() {
  const gs = window.gameState;
  const e = gs.enemy;
  const p = gs.player;
  const q = gs.currentQuestion;

  if (!q || !e) {
    window.goTo("map");
    return "Loading...";
  }

  let inputHtml = "";

  if (q.type === "input") {
    inputHtml = `
      <div id="battleAnswerArea" class="flex gap-2">
        <input type="number" 
          class="game-input text-center text-lg font-bold"
          value="${gs.userAnswer}" 
          oninput="window.gameState.userAnswer = this.value"
          placeholder="?" autofocus>
        <button onclick="window.checkAnswer()" class="btn btn-blue px-6">
          ⚔️ Serang
        </button>
      </div>
    `;
  } else if (q.options) {
    inputHtml = `
      <div id="battleAnswerArea" class="grid grid-cols-1 gap-2 mt-4">
        ${q.options.map((opt, idx) => `
          <button onclick="window.gameState.userAnswer='${idx}'; window.checkAnswer()" 
          class="btn btn-blue">
            ${opt}
          </button>
        `).join("")}
      </div>
    `;
  }

  if (e.hp <= 0) inputHtml = "";

  return `
  <div id="battleScreenWrap" class="fade-in">
    <div id="battleScreen" class="p-4 max-w-2xl mx-auto">

      <!-- TOP BAR -->
      <div id="battleTopBar" class="flex justify-between items-center mb-4">
        ${e.hp > 0 ? `
          <button id="battleEscapeBtn" onclick="window.escapeBattle()" 
            class="text-xs text-gray-400 border border-gray-600 px-2 py-1 rounded">
            🏳️ Kabur
          </button>
        ` : `<div></div>`}
  
        <div id="battleEnemyName" class="font-bold text-red-400">⚔️ VS ${e.name}</div>
      </div>

      <!-- ARENA -->
      <div id="battleArena" class="battle-arena">

        <div class="fighter" id="player">
          <div class="avatar">
            <div class="hp-ring" style="--hp:${(p.hp / p.maxHp) * 100}"></div>
            <div class="avatar-inner">
              <img src="assets/enemy/slime.png">
              <div class="hp-text">${p.hp}/${p.maxHp}</div>
            </div>
          </div>
          <div class="fighter-name mt-2">
            ${p.name} <span class="text-yellow-400">(Lv.${p.level})</span>
          </div>
        </div>

        <div class="vs-text">VS</div>

        <div class="fighter" id="enemy">
          <div class="avatar">
            <div class="hp-ring enemy" style="--hp:${(e.hp / e.maxHp) * 100}"></div>
            <div class="avatar-inner">
              <img src="${e.img}">
              <div class="hp-text">${e.hp}/${e.maxHp}</div>
            </div>
          </div>
          <div class="fighter-name mt-2">${e.name}</div>
        </div>

      </div>

      <!-- SOAL -->
      <div id="battleQuestionPanel" class="glass-panel text-center mt-4">
        <div class="text-xs text-blue-300 mb-2 uppercase tracking-widest">
          Misi Matematika
        </div>

        ${e.hp > 0 && !gs.feedback ? getTimerHtml(gs) : ""}

        <div id="battleQuestionText" class="text-xl font-mono font-bold mb-4 bg-slate-800 p-4 rounded-xl border border-slate-600">
          ${q.question}
        </div>

        ${gs.feedback ? `
          <div id="battleFeedback" class="mb-4 p-3 bg-slate-800 rounded-lg border border-gray-500 text-sm">
            ${gs.feedback}
          </div>

          ${e.hp > 0 ? `
            <button id="battleNextBtn" onclick="window.nextTurn()" 
            class="btn btn-green w-full py-2">
            Lanjut Soal ➡️
            </button>
          ` : ""}
        ` : inputHtml}
        
      </div>
      <!-- LOG -->
      <div id="battleLog" class="glass-panel mt-4 p-3 h-32 overflow-y-auto text-sm">
        ${gs.battleLog.slice(-5).map(entry => `<div>${entry}</div>`).join("")}
      </div>

      <div id="battleEffects"></div>

    </div>
  </div>
  `;
};


// ======================================================
// 5. BATTLE HELPERS
// ======================================================
function adaptQuestion(q) {
  return {
    question: q.question,
    answer: q.correct,
    options: q.options || null,
    explanation: "Jawaban yang benar adalah " + q.correct,
    type: q.options ? "choice" : "input",

    // Untuk timer final stage / final boss
    sourceStage: q.sourceStage ?? q.timerStage ?? q.fromStage ?? q.stage ?? null
  };
}

window.escapeBattle = function() {
  const gs = window.gameState;

  const confirmEscape = confirm(
    "Kabur dari battle akan mengurangi 1 LifePoint. Apakah kamu yakin ingin kabur?"
  );

  if (!confirmEscape) {
    return;
  }

  stopQuestionTimer(gs);

  const consumed = consumeLifePoint(gs);

  if (consumed) {
    gs.battleLog.push("🏳️ Kamu kabur dari battle. LifePoints berkurang 1.");
  }

  gs.player.hp = gs.player.maxHp;
  gs.screen = "map";

  window.saveProgress?.(gs);
  window.render();
};

// ======================================================
// BALANCE SYSTEM
// Target: monster kalah dalam 6–7 serangan benar
// ======================================================

function getTitleBonus(gs) {
  const titleData = gs.achievements?.find(a => a.name === gs.title);
  return titleData ? titleData.bonus : 0;
}

function estimatePlayerDamageForHits(gs, targetHits = 7) {
  let totalDamage = 0;

  for (let hit = 1; hit <= targetHits; hit++) {
    let damage = gs.player.attack;

    // Combo aktif mulai serangan benar ke-3
    if (hit >= 3) {
      damage += 5;
    }

    damage += getTitleBonus(gs);

    totalDamage += damage;
  }

  return totalDamage;
}

function balanceEnemyForBattle(enemy, gs) {
  const targetHitsToDefeat = 7;
  const targetMistakesToLose = 7;

  // HP monster dibuat berdasarkan estimasi 7 serangan player
  const balancedHp = estimatePlayerDamageForHits(gs, targetHitsToDefeat);

  // Damage monster dibuat agar player tidak langsung kalah
  const enemyRealDamage = Math.ceil(gs.player.maxHp / targetMistakesToLose);

  return {
    ...enemy,

    // HP monster baru
    hp: balancedHp,
    maxHp: balancedHp,

    // attack tetap melewati defense system di battleSystem.js
    attack: enemyRealDamage + (gs.player.defense || 0),

    // penanda agar mudah dicek/debug
    targetHitsToDefeat,
    realDamageToPlayer: enemyRealDamage
  };
}

// ======================================================
// LIFEPOINT SYSTEM
// ======================================================

function updateLifePoints(gs) {
  const p = gs.player;

  if (p.lifePoints === undefined) p.lifePoints = 5;
  if (p.maxLifePoints === undefined) p.maxLifePoints = 5;
  if (p.lifePointRegenMs === undefined) {
    p.lifePointRegenMs = 3 * 60 * 60 * 1000;
  }

  // Jika LifePoints sudah penuh, timer tidak berjalan
  if (p.lifePoints >= p.maxLifePoints) {
    p.lifePoints = p.maxLifePoints;
    p.nextLifeAt = null;
    return;
  }

  const now = Date.now();

  // Jika belum penuh tapi timer belum ada, mulai timer
  if (!p.nextLifeAt) {
    p.nextLifeAt = now + p.lifePointRegenMs;
    return;
  }

  // Jika belum waktunya regen
  if (now < p.nextLifeAt) return;

  // Hitung berapa LifePoints yang harus dipulihkan
  const gainedLifePoints =
    Math.floor((now - p.nextLifeAt) / p.lifePointRegenMs) + 1;

  p.lifePoints = Math.min(
    p.maxLifePoints,
    p.lifePoints + gainedLifePoints
  );

  // Jika sudah penuh, hentikan timer
  if (p.lifePoints >= p.maxLifePoints) {
    p.lifePoints = p.maxLifePoints;
    p.nextLifeAt = null;
  } else {
    p.nextLifeAt =
      p.nextLifeAt + gainedLifePoints * p.lifePointRegenMs;
  }
}

function consumeLifePoint(gs) {
  updateLifePoints(gs);

  const p = gs.player;

  if (p.lifePoints <= 0) {
    p.lifePoints = 0;
    return false;
  }

  p.lifePoints -= 1;

  // Jika LifePoints berkurang dari kondisi penuh, mulai timer regen
  if (p.lifePoints < p.maxLifePoints && !p.nextLifeAt) {
    p.nextLifeAt = Date.now() + p.lifePointRegenMs;
  }

  return true;
}

function getLifePointTimerText(gs) {
  updateLifePoints(gs);

  const p = gs.player;

  if (p.lifePoints >= p.maxLifePoints || !p.nextLifeAt) {
    return "Penuh";
  }

  const remaining = Math.max(0, p.nextLifeAt - Date.now());
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.ceil(
    (remaining % (1000 * 60 * 60)) / (1000 * 60)
  );

  if (hours <= 0) return `${minutes} menit lagi`;

  return `${hours} jam ${minutes} menit lagi`;
}

window.updateLifePoints = updateLifePoints;
window.getLifePointTimerText = getLifePointTimerText;

function startBattleTimer(gs) {
  const timerDuration = getStageTimerDuration(
    gs.selectedWorld,
    gs.selectedStage,
    gs.currentQuestion
  );

  resetQuestionTimer(gs, timerDuration);

  setTimeout(() => {
    startQuestionTimer(gs, window.handleTimeOut, timerDuration);
  }, 0);
}
// ======================================================
// STAGE LOCK SYSTEM
// ======================================================

const WORLD_TOTAL_STAGE = {
  numbers: 17,
  algebra: 17,
  geometry: 17,
  data: 17
};

function ensureStageProgress(gs) {
  if (!gs.progress) gs.progress = {};

  Object.keys(WORLD_TOTAL_STAGE).forEach(world => {
    if (!gs.progress[world]) {
      gs.progress[world] = {
        done: 0,
        total: WORLD_TOTAL_STAGE[world],
        completedStage: 0,
        highestUnlockedStage: world === "numbers" ? 1 : 0
      };
    }

    const p = gs.progress[world];

    p.total = WORLD_TOTAL_STAGE[world];

    if (p.completedStage === undefined) {
      p.completedStage = p.done || 0;
    }

    if (p.highestUnlockedStage === undefined) {
      p.highestUnlockedStage =
        world === "numbers"
          ? Math.max(1, p.completedStage + 1)
          : 0;
    }

    p.done = p.completedStage;
  });

  // Algebrum terbuka saat Prime Verba mencapai stage 8
  if (gs.progress.numbers.highestUnlockedStage >= 8) {
    gs.progress.algebra.highestUnlockedStage = Math.max(
      gs.progress.algebra.highestUnlockedStage,
      1
    );
  }
}

function isWorldUnlocked(gs, world) {
  ensureStageProgress(gs);

  if (world === "numbers") return true;

  if (world === "algebra") {
    return gs.progress.numbers.highestUnlockedStage >= 8;
  }

  return false;
}

function isStageUnlocked(gs, world, stage) {
  ensureStageProgress(gs);

  if (!isWorldUnlocked(gs, world)) return false;

  const p = gs.progress[world];
  return Number(stage) <= p.highestUnlockedStage;
}

function unlockNextStage(gs, world, stage) {
  ensureStageProgress(gs);

  const currentStage = Number(stage);
  const p = gs.progress[world];
  const totalStage = WORLD_TOTAL_STAGE[world] || 17;

  if (currentStage > p.completedStage) {
    p.completedStage = currentStage;
  }

  p.done = p.completedStage;

  p.highestUnlockedStage = Math.max(
    p.highestUnlockedStage,
    Math.min(currentStage + 1, totalStage)
  );

  // Jika Prime Verba sudah mencapai stage 8, buka Algebrum stage 1
  if (world === "numbers" && p.highestUnlockedStage >= 8) {
    gs.progress.algebra.highestUnlockedStage = Math.max(
      gs.progress.algebra.highestUnlockedStage,
      1
    );
  }
}

window.ensureStageProgress = ensureStageProgress;
window.isWorldUnlocked = isWorldUnlocked;
window.isStageUnlocked = isStageUnlocked;

// ======================================================
// 6. BATTLE START / TURN CONTROL
// ======================================================
window.startBattle = function(world, area, stage) {
  const gs = window.gameState;

  ensureStageProgress(gs);

  if (!isWorldUnlocked(gs, world)) {
    alert("Area ini masih terkunci. Algebrum akan terbuka setelah Prime Verba mencapai stage 8.");
    window.render();
    return;
  }

  if (!isStageUnlocked(gs, world, stage)) {
    alert("Stage ini masih terkunci. Selesaikan stage sebelumnya terlebih dahulu.");
    window.render();
    return;
  }

  updateLifePoints(gs);

  if (gs.player.lifePoints <= 0) {
    alert("LifePoints habis. Tunggu pemulihan otomatis setiap 3 jam.");
    window.render();
    return;
  }

  gs.selectedWorld = world;
  gs.selectedArea = area;
  gs.selectedStage = stage;

  const rawEnemy = getEnemy(world, stage);
  gs.enemy = balanceEnemyForBattle(rawEnemy, gs);

  const rawQ = getQuestion(world, stage);

  // Jika stage adalah Final Boss dan punya phases
  if (rawQ?.phases) {
    gs.bossPhases = rawQ.phases;
    gs.currentPhase = 0;
    gs.currentQuestion = adaptQuestion(gs.bossPhases[0]);
  } else {
    gs.bossPhases = null;
    gs.currentPhase = 0;
    gs.currentQuestion = adaptQuestion(rawQ);
  }

  gs.userAnswer = "";
  gs.feedback = "";
  gs.streak = 0;
  gs.battleLog = [];

  gs.screen = "battle";

  startBattleTimer(gs);
  window.render();
};

// --- LANJUT GILIRAN (Dipanggil tombol "Lanjut Soal") ---
// INI PERBAIKAN UTAMANYA: Kita tidak me-reset musuh, cuma ganti soal.
window.nextTurn = function() {
  const gs = window.gameState;

  gs.feedback = "";
  gs.userAnswer = "";

  // === JIKA BOSS ===
  if (gs.bossPhases) {
    gs.currentPhase++;

    if (gs.currentPhase >= gs.bossPhases.length) {
      winBattle();
      return;
    }

    let nextQ = gs.bossPhases[gs.currentPhase];
    gs.currentQuestion = adaptQuestion(nextQ);
  } else {
    const rawQ = getQuestion(gs.selectedWorld, gs.selectedStage);
    gs.currentQuestion = adaptQuestion(rawQ);
  }
  startBattleTimer(gs);
  window.render();
};


// ======================================================
// 7. BATTLE ANSWER CHECK
// ======================================================
window.checkAnswer = function() {
  const gs = window.gameState;
  const q = gs.currentQuestion;

  if (q.type === "input" && (gs.userAnswer === "" || gs.userAnswer === null)) {
    alert("Isi jawaban dulu!");
    return;
  }

  stopQuestionTimer(gs);

  const isCorrect = validateAnswer(gs);

  // =========================
  // JAWABAN BENAR
  // =========================
  if (isCorrect) {
    window.sfx.correct();

    let damage = calculatePlayerDamage(gs);
    damage = applyStreakBonus(gs, damage);
    damage += getTitleBonus(gs);

    gs.enemy.hp = Math.max(0, gs.enemy.hp - damage);

    spawnDamage("circle", damage, "player");

    gs.battleLog.push(`⚔️ Benar! Musuh kena ${damage} DMG.`);
    gs.feedback = `<span class="text-green-400 font-bold">BENAR!</span> ${q.explanation}`;

    if (gs.enemy.hp <= 0) {
      winBattle();
      return;
    }
  } 
  
  // =========================
  // JAWABAN SALAH
  // =========================
  else {
    window.sfx.wrong();

    gs.streak = 0;

    let damage = calculateEnemyDamage(gs);
    gs.player.hp = Math.max(0, gs.player.hp - damage);

    spawnDamage("circle", damage, "enemy");

    gs.battleLog.push(`🛡️ Salah! Kamu kena ${damage} DMG.`);
    gs.feedback = `<span class="text-red-400 font-bold">SALAH!</span> ${q.explanation}`;

      if (gs.player.hp <= 0) {
        consumeLifePoint(gs);

        alert("Kamu kalah! LifePoints berkurang 1.");

        gs.player.hp = gs.player.maxHp;
        gs.screen = "map";

        window.saveProgress?.(gs);
        window.render();
        return;
      }
  }
  window.render();
};

window.handleTimeOut = function() {
  const gs = window.gameState;

  // Kalau sudah tidak di battle, jangan lanjut
  if (gs.screen !== "battle") return;

  // Kalau enemy sudah kalah, jangan lanjut
  if (!gs.enemy || gs.enemy.hp <= 0) return;

  // Kalau feedback sedang muncul, jangan hitung timeout lagi
  if (gs.feedback) return;

  gs.streak = 0;

  let damage = calculateEnemyDamage(gs);
  gs.player.hp = Math.max(0, gs.player.hp - damage);

  spawnDamage("circle", damage, "enemy");

  gs.battleLog.push(`⏰ Waktu habis! Kamu kena ${damage} DMG.`);
  gs.feedback = `
    <span class="text-red-400 font-bold">WAKTU HABIS!</span>
    Kamu terlalu lama menjawab. Jawaban yang benar adalah ${gs.currentQuestion.answer}
  `;

  if (gs.player.hp <= 0) {
    consumeLifePoint(gs);

    alert("Kamu kalah! LifePoints berkurang 1.");

    gs.player.hp = gs.player.maxHp;
    gs.screen = "map";

    window.saveProgress?.(gs);
    window.render();
    return;
  }

  window.render();
};

// ======================================================
// 9. BATTLE NAVIGATION / RESULT
// ======================================================
window.handleBack = async function() {
  if (window._saving) return;

  window._saving = true;

  await window.saveProgress(window.gameState);
  window.returnToMapWithWorld();

  window._saving = false;
};

window.handleRetry = function() {
  if (window._saving) return;

  window._saving = true;

  const gs = window.gameState;

  window.saveProgress(gs);
  window.startBattle(gs.selectedWorld, gs.selectedArea, gs.selectedStage);

  setTimeout(() => window._saving = false, 500);
};

window.handleNextStage = async function() {
  if (window._saving) return;

  window._saving = true;

  const gs = window.gameState;
  const nextStage = getNextStageRoute(gs);

  if (!nextStage) {
    alert("Semua stage pada area ini sudah selesai.");
    window._saving = false;
    return;
  }

  await window.saveProgress(gs);

  window.startBattle(
    nextStage.world,
    nextStage.area,
    nextStage.stage
  );

  window._saving = false;
};

function getNextStageRoute(gs) {
  const currentWorld = gs.selectedWorld;
  const currentStage = Number(gs.selectedStage);
  const totalStage = WORLD_TOTAL_STAGE[currentWorld] || 17;

  // Jika masih ada stage berikutnya di world yang sama
  if (currentStage < totalStage) {
    return {
      world: currentWorld,
      area: "default",
      stage: currentStage + 1,
      label: `Stage ${currentStage + 1}`
    };
  }

  // Jika Prime Verba selesai, lanjut ke Algebrum Stage 1
  if (currentWorld === "numbers" && isWorldUnlocked(gs, "algebra")) {
    return {
      world: "algebra",
      area: "default",
      stage: 1,
      label: "Algebrum Stage 1"
    };
  }

  // Jika sudah tidak ada lanjutan
  return null;
}

function winBattle() {
  window.sfx.win();
  const gs = window.gameState;

  stopQuestionTimer(gs);

  const expGain = 50;

  gs.player.exp += expGain;
  gs.player.hp = gs.player.maxHp;

  unlockNextStage(gs, gs.selectedWorld, gs.selectedStage);

  const nextStage = getNextStageRoute(gs);

  if (gs.player.exp >= gs.player.expToNext) {
    gs.player.level++;
    gs.player.exp -= gs.player.expToNext;
    gs.player.expToNext = Math.round(gs.player.expToNext * 1.5);
    gs.player.maxHp += 20;
    gs.player.hp = gs.player.maxHp;
    gs.player.attack += 2;
    alert(`LEVEL UP! Sekarang Level ${gs.player.level}`);
  }

  // Pesan Menang
  gs.feedback = `
    <div class="text-yellow-400 font-bold text-xl mb-2">VICTORY! 🏆</div>
    <div class="mb-4">+${expGain} XP</div>
    <div class="text-3xl animate-bounce mb-2">🎉</div>

    ${nextStage ? `
      <button onclick="handleNextStage()" class="btn btn-green w-full py-2 mb-2">
        ➡️ Lanjut ke ${nextStage.label}
      </button>
    ` : `
      <div class="text-sm text-gray-300 mb-2">
        Semua stage pada area ini sudah selesai.
      </div>
    `}

    <button onclick="handleBack()" class="btn btn-blue w-full py-2 mb-2">
      ⬅️ Kembali ke Map
    </button>

    <button onclick="handleRetry()" class="btn btn-gray w-full py-2">
      🔁 Coba Lagi
    </button>
  `;

  // Hapus musuh biar render ga error
  gs.enemy.hp = 0;
  window.render();
}