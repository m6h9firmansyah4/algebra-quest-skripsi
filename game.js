// game.js - FIX LOGIKA TURN & HP
import { getQuestion } from "./engine/worldRouter.js";
import { getEnemy } from "./engine/enemyRouter.js";
import { validateAnswer, calculatePlayerDamage, calculateEnemyDamage, applyStreakBonus } from "./engine/battleSystem.js";
import { spawnDamage } from "./engine/damageEngine.js";


// ==========================================
// WORLD MAP SYSTEM (BARU)
// ==========================================
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

window.shopItems = {
  potion: { 
    id: 'potion', 
    name: 'Potion HP', 
    price: 50, 
    icon: '🧪', 
    desc: '+50 HP', 
    type: 'heal', 
    value: 50 
  },

  megaPotion: {
    id: 'megaPotion',
    name: 'Mega Potion',
    price: 100,
    icon: '💉',
    desc: '+100 HP',
    type: 'heal',
    value: 100
  },

  fireSkill: {
    name: "Fire Blast",
    icon: "🔥",
    unlockLevel: 2,
    type: "damage",
    value: 30,
    desc: 'Instant damage 30 HP',
    price: 150
  },

  iceSkill: {
    name: "Ice Storm",
    icon: "❄️",
    unlockLevel: 3,
    type: "freeze",
    duration: 2,
    desc: 'Freeze enemy for 2 turns',
    price: 200
  },

  windSkill: {
    name: "Windstorm",
    icon: "🌪️",
    unlockLevel: 4,
    type: "buff",
    multiplier: 2,
    duration: 1,
    desc: 'Double damage for 1 turn',
    price: 300
  },

  darkSkill: {
    name: "Dark Strike",
    icon: "🌑",
    unlockLevel: 5,
    type: "break",
    duration: 2,
    desc: 'Break enemy defense for 2 turns',
    price: 400
  },

  rainbowSkill: {
    name: "Rainbow Dash",
    icon: "🌈",
    unlockLevel: 4,
    type: "ultimate",
    desc: 'Disable enemy skills (Boss Only)',
    price: 500
  }
};

window.skillData = {

  fireSkill: {
    name: "Fire Blast",
    icon: "🔥",
    unlockLevel: 2,
    type: "damage",
    value: 30
  },

  iceSkill: {
    name: "Ice Storm",
    icon: "❄️",
    unlockLevel: 3,
    type: "freeze",
    duration: 2
  },

  windSkill: {
    name: "Windstorm",
    icon: "🌪️",
    unlockLevel: 4,
    type: "buff",
    multiplier: 2,
    duration: 1
  },

  darkSkill: {
    name: "Dark Strike",
    icon: "🌑",
    unlockLevel: 5,
    type: "break",
    duration: 2
  },

  rainbowSkill: {
    name: "Rainbow Dash",
    icon: "🌈",
    unlockLevel: 4,
    type: "ultimate"
  }

};

// --- MULAI BATTLE (Hanya dipanggil SEKALI di awal stage) ---
window.renderBattleScreen = function() {
  const gs = window.gameState;
  const e = gs.enemy;
  const p = gs.player;
  const q = gs.currentQuestion;

  if (!q || !e) { window.goTo('map'); return "Loading..."; }

  // =========================
  // INPUT SYSTEM
  // =========================
  let inputHtml = "";

  if (q.type === "input") {
    inputHtml = `
      <div class="flex gap-2">
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
      <div class="grid grid-cols-1 gap-2 mt-4">
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
  <div class="p-4 max-w-2xl mx-auto fade-in">

    <!-- TOP BAR -->
    <div class="flex justify-between items-center mb-4">
      ${e.hp > 0 ? `
        <button onclick="window.goTo('map')" 
        class="text-xs text-gray-400 border border-gray-600 px-2 py-1 rounded">
        🏳️ Kabur
        </button>
      ` : `<div></div>`}
      <div class="font-bold text-red-400">⚔️ VS ${e.name}</div>
    </div>

    <!-- ARENA -->
    <div class="battle-arena">

      <!-- PLAYER -->
      <div class="fighter" id="player">
            <div class="avatar">
            <div class="hp-ring" style="--hp:${(p.hp/p.maxHp)*100}"></div>
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

      <!-- ENEMY -->
      <div class="fighter" id="enemy">
        <div class="avatar">
            <div class="hp-ring enemy" style="--hp:${(e.hp/e.maxHp)*100}"></div>
            <div class="avatar-inner">
            <img src="${e.img}">
            <div class="hp-text">${e.hp}/${e.maxHp}</div>
        </div>
        </div>
        <div class="fighter-name mt-2">${e.name}</div>
      </div>

    </div>

    <!-- SOAL -->
    <div class="glass-panel text-center mt-4">
      <div class="text-xs text-blue-300 mb-2 uppercase tracking-widest">
        Misi Matematika
      </div>

      <div class="text-xl font-mono font-bold mb-4 bg-slate-800 p-4 rounded-xl border border-slate-600">
        ${q.question}
      </div>

      ${gs.feedback ? `
        <div class="mb-4 p-3 bg-slate-800 rounded-lg border border-gray-500 text-sm">
          ${gs.feedback}
        </div>

        ${e.hp > 0 ? `
          <button onclick="window.nextTurn()" 
          class="btn btn-green w-full py-2">
          Lanjut Soal ➡️
          </button>
        ` : ""}
      ` : inputHtml}
    </div>

    <!-- ACTION BAR -->
    ${e.hp > 0 ? `
    <div class="action-bar mt-3">
      <button onclick="usePotion()" class="btn btn-green">
        Potion 
        (🧪 ${gs.inventory.items.potion || 0} / 💉 ${gs.inventory.items.megaPotion || 0})
      </button>
      <button onclick="setMode('defend')" class="btn btn-gray">🛡️ Defend</button>
      <div class="flex gap-2 flex-wrap">
          ${Object.keys(gs.inventory.skills || {}).map(id => {
            const skill = window.skillData[id];
            const count = gs.inventory.skills[id];

            if (!skill || count <= 0) return "";

            // 🔒 LOCK LEVEL
            if (gs.player.level < skill.unlockLevel) {
              return `
                <button class="btn btn-gray">
                  🔒 Lv.${skill.unlockLevel}
                </button>
              `;
            }
            return `
              <button onclick="useSkill('${id}')" class="btn btn-purple">
                ${skill.icon} (${count})
              </button>
            `;
          }).join("")}
      </div>
    </div>
    ` : ""}

    <!-- EFFECT LAYER -->
    <div id="battleEffects"></div>

    <!-- LOG -->
    <div class="mt-4 p-2 rounded bg-black/30 text-xs text-gray-400 font-mono h-24 overflow-y-auto border border-white/5">
      ${(gs.battleLog || []).slice().reverse().map(log => `
        <div class="py-0.5 border-b border-white/5">> ${log}</div>
      `).join('')}
    </div>

  </div>
  `;
};

window.startBattle = function(world, area, stage){
  const gs = window.gameState;

  gs.selectedWorld = world;
  gs.selectedArea = area;
  gs.selectedStage = stage;

  gs.enemy = getEnemy(world, stage);

  const rawQ = getQuestion(world, stage);
  gs.currentQuestion = adaptQuestion(rawQ);

  gs.userAnswer = '';
  gs.feedback = '';
  gs.mode = "attack";
  gs.streak = 0;

  gs.screen = 'battle';

  window.render();
};

window.setMode = function(mode){
  window.gameState.mode = mode;
};

function adaptQuestion(q) {
  return {
    question: q.question,
    answer: q.correct,
    options: q.options || null, // 🔥 INI KUNCI
    explanation: "Jawaban yang benar adalah " + q.correct,
    type: q.options ? "choice" : "input"
  };
}

// --- LANJUT GILIRAN (Dipanggil tombol "Lanjut Soal") ---
// INI PERBAIKAN UTAMANYA: Kita tidak me-reset musuh, cuma ganti soal.
window.nextTurn = function() {
    const gs = window.gameState;

    gs.feedback = '';
    gs.userAnswer = '';

    // === JIKA BOSS ===
    if(gs.bossPhases){

        gs.currentPhase++;

        if(gs.currentPhase >= gs.bossPhases.length){
            winBattle();
            return;
        }

        let nextQ = gs.bossPhases[gs.currentPhase];
        gs.currentQuestion = adaptQuestion(nextQ);

    } else {

        const rawQ = getQuestion(gs.selectedWorld, gs.selectedStage);
        gs.currentQuestion = adaptQuestion(rawQ);

    }

    window.render();
};

// --- CEK JAWABAN ---
window.checkAnswer = function() {
  const gs = window.gameState;
  const q = gs.currentQuestion;

  if (q.type === 'input' && (gs.userAnswer === '' || gs.userAnswer === null)) {
    alert("Isi jawaban dulu!");
    return;
  }

  const isCorrect = validateAnswer(gs);

  // =========================
  // JAWABAN BENAR
  // =========================
  if (isCorrect) {

    window.sfx.correct();

    let damage = calculatePlayerDamage(gs);
    damage = applyStreakBonus(gs, damage);
    damage += getTitleBonus(gs);

    if(gs.status.buffAttack > 0){
      damage *= 2;
      gs.status.buffAttack--;
    }

    gs.enemy.hp -= damage;

    spawnDamage(type, damage, "player"); // ✔ dari player ke enemy

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
    if (gs.status.freezeEnemy > 0) {
      gs.status.freezeEnemy--;
      gs.battleLog.push("❄️ Enemy masih beku!");
      window.render();
      return;
    }

    if(gs.status.breakDefense > 0){
      damage += 10;
      gs.status.breakDefense--;
    }

    window.sfx.wrong();

    gs.streak = 0;

    let damage = calculateEnemyDamage(gs);
    gs.player.hp -= damage;

    spawnDamage("circle", damage, "enemy"); // ✔ dari enemy ke player

    gs.battleLog.push(`🛡️ Salah! Kamu kena ${damage} DMG.`);
    gs.feedback = `<span class="text-red-400 font-bold">SALAH!</span> ${q.explanation}`;

    if (gs.player.hp <= 0) {
      alert("GAME OVER! Kamu pingsan.");
      gs.player.hp = gs.player.maxHp;
      gs.screen = 'map';
      window.render();
      return;
    }
  }

  // 🔥 RESET MODE
  gs.mode = "attack";

  window.render();
};

window.usePotion = function(){
  const gs = window.gameState;

  const inv = gs.inventory?.items || {};

  // 🔥 PRIORITAS 1: MEGA POTION
  if (inv.megaPotion && inv.megaPotion > 0) {

    inv.megaPotion--;

    gs.player.hp = Math.min(gs.player.hp + 100, gs.player.maxHp);

    gs.battleLog.push("💉 Mega Potion digunakan! (+100 HP)");

    window.sfx.correct?.();

    window.render();
    return;
  }

  // 🔥 PRIORITAS 2: POTION BIASA
  if (inv.potion && inv.potion > 0) {

    inv.potion--;

    gs.player.hp = Math.min(gs.player.hp + 50, gs.player.maxHp);

    gs.battleLog.push("🧪 Potion digunakan! (+50 HP)");

    window.sfx.correct?.();

    window.render();
    return;
  }

  // ❌ TIDAK ADA POTION
  alert("Potion habis!");
};

window.useSkill = function(skillId){
  const gs = window.gameState;
  const skill = window.skillData[skillId];

  if (gs.player.level < skill.unlockLevel) {
    alert("Level belum cukup!");
    return;
  }

  if (!gs.inventory.skills[skillId] || gs.inventory.skills[skillId] <= 0) {
    alert("Skill tidak tersedia!");
    return;
  }

  gs.inventory.skills[skillId]--;

  // =====================
  // FIRE (DAMAGE)
  // =====================
  if(skill.type === "damage"){
    gs.enemy.hp -= skill.value;
    gs.battleLog.push(`🔥 Fire Blast! Damage ${skill.value}`);
  }

  // =====================
  // ICE (FREEZE)
  // =====================
  if(skill.type === "freeze"){
    gs.status.freezeEnemy = skill.duration;
    gs.battleLog.push(`❄️ Enemy beku ${skill.duration} ronde!`);
  }

  // =====================
  // WIND (BUFF)
  // =====================
  if(skill.type === "buff"){
    gs.status.buffAttack = skill.duration;
    gs.battleLog.push(`🌪️ Attack x2 aktif!`);
  }

  // =====================
  // DARK (BREAK DEFENSE)
  // =====================
  if(skill.type === "break"){
    gs.status.breakDefense = skill.duration;
    gs.battleLog.push(`🌑 Defense musuh hancur!`);
  }

  // =====================
  // RAINBOW (ULTIMATE)
  // =====================
  if(skill.type === "ultimate"){

    if(!gs.enemy.isBoss){
      gs.battleLog.push("🌈 Hanya bisa digunakan pada Boss!");
      return;
    }

    gs.enemy.skillDisabled = true;
    gs.battleLog.push("🌈 Skill musuh dinonaktifkan!");
  }

  window.render();
};

window.handleBack = async function(){
  if(window._saving) return;

  window._saving = true;

  await window.saveProgress(window.gameState);
  window.returnToMapWithWorld();

  window._saving = false;
};

window.handleRetry = function(){
  if(window._saving) return;

  window._saving = true;

  const gs = window.gameState;

  window.saveProgress(gs);
  window.startBattle(gs.selectedWorld, gs.selectedArea, gs.selectedStage);

  setTimeout(()=> window._saving = false, 500);
};

function winBattle() {
    window.sfx.win();
    const gs = window.gameState;
    const expGain = 50;
    const goldGain = 2000;
    
    gs.player.exp += expGain;
    gs.player.gold += goldGain;
    
    if (gs.player.exp >= gs.player.expToNext) {
        gs.player.level++;
        gs.player.exp -= gs.player.expToNext;
        gs.player.expToNext *= 1.5;
        gs.player.maxHp += 20;
        gs.player.hp = gs.player.maxHp;
        gs.player.attack += 2;
        alert(`LEVEL UP! Sekarang Level ${gs.player.level}`);
    }

    // Pesan Menang
    gs.feedback = `
        <div class="text-yellow-400 font-bold text-xl mb-2">VICTORY! 🏆</div>
        <div class="mb-4">+${expGain} XP | +${goldGain} Gold</div>
        <div class="text-3xl animate-bounce mb-2">🎉</div>

        <button onclick="handleBack()" class="btn btn-blue w-full py-2 mb-2">
        ⬅️ Kembali
        </button>

        <button onclick="handleRetry()" class="btn btn-green w-full py-2">
        🔁 Coba Lagi
        </button>
    `;
    
    // Hapus musuh biar render ga error  
    gs.enemy.hp = 0; 
    window.render();
}

window.buyItem = function(itemId) {
  const gs = window.gameState;
  const item = shopItems[itemId];

  if (gs.player.gold < item.price) {
    alert("Gold tidak cukup!");
    return;
  }

  gs.player.gold -= item.price;

  if (item.type === 'heal') {
    if (!gs.inventory.items[item.id]) gs.inventory.items[item.id] = 0;
    gs.inventory.items[item.id]++;

    alert(`${item.name} masuk inventory!`);
  }

  if (item.type === 'skill') {
    if (!gs.inventory.skills[item.id]) gs.inventory.skills[item.id] = 0;
    gs.inventory.skills[item.id]++;

    alert(`Skill ${item.name} diperoleh!`);
  }

  window.saveProgress(gs);
  window.render();
};