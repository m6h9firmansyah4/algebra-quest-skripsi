// game.js - FIX LOGIKA TURN & HP
import { getQuestion } from "./engine/worldRouter.js";
import { getEnemy } from "./engine/enemyRouter.js";
import { validateAnswer, calculatePlayerDamage, calculateEnemyDamage, applyStreakBonus } from "./engine/battleSystem.js";

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

const shopItems = {
    potion: { id: 'potion', name: 'Potion HP', price: 50, icon: '🍷', desc: '+50 HP', type: 'heal', value: 50 },
    sword: { id: 'sword', name: 'Pedang Besi', price: 100, icon: '⚔️', desc: '+5 ATK', type: 'atk', value: 5 },
    shield: { id: 'shield', name: 'Tameng Kayu', price: 100, icon: '🛡️', desc: '+5 DEF', type: 'def', value: 5 }
};

// --- MULAI BATTLE (Hanya dipanggil SEKALI di awal stage) ---
window.startBattle = function(worldName, floorName, stageNum){

  const gs = window.gameState;

  gs.selectedWorld = worldName;
  gs.selectedArea = floorName;
  gs.selectedStage = stageNum;
  gs.enemy = getEnemy(worldName, stageNum);

  let rawQ = getQuestion(worldName, stageNum);

  // =========================
  // HANDLE BOSS PHASE
  // =========================
  if(rawQ && rawQ.phases){
    gs.bossPhases = rawQ.phases;
    gs.currentPhase = 0;

    let first = gs.bossPhases[0];
    gs.currentQuestion = adaptQuestion(first);
  }
  else{
    gs.bossPhases = null;
    gs.currentQuestion = adaptQuestion(rawQ);
  }

  goTo("battle");
  window.render();
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

    // Validasi input kosong
    if (q.type === 'input' && (gs.userAnswer === '' || gs.userAnswer === null)) {
        alert("Isi jawaban dulu!");
        return;
    }
    const isCorrect = validateAnswer(gs);

    if (isCorrect) {
    window.sfx.correct();

    let damage = calculatePlayerDamage(gs);
    damage = applyStreakBonus(gs, damage);
    gs.enemy.hp -= damage;

    gs.battleLog.push(`⚔️ Benar! Musuh kena ${damage} DMG.`);
    gs.feedback = `<span class="text-green-400 font-bold">BENAR!</span> ${q.explanation}`;
    
    if (gs.enemy.hp <= 0) {
        winBattle();
        return;
    }

} else {
    window.sfx.wrong();

    gs.streak = 0;
    const damage = calculateEnemyDamage(gs);
    gs.player.hp -= damage;

    gs.battleLog.push(`🛡️ Salah! Kamu kena ${damage} DMG.`);
    gs.feedback = `<span class="text-red-400 font-bold">SALAH!</span> ${q.explanation}`;
    
    if (gs.player.hp <= 0) {
        alert("GAME OVER! Kamu pingsan.");
        gs.player.hp = gs.player.maxHp;
        gs.screen = 'stage'; 
        window.saveProgress(gs);
        window.render();
        return;
    }
}

    // PENTING: Jangan generate soal baru disini. Biarkan user baca feedback dulu.
    // Soal baru akan digenerate saat user klik "Lanjut Soal" (nextTurn).
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
    const goldGain = 20;
    
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
    
    if (gs.player.gold >= item.price) {
        gs.player.gold -= item.price;
        if (item.type === 'heal') { gs.player.hp = Math.min(gs.player.hp + item.value, gs.player.maxHp); alert("HP Pulih!"); }
        else if (item.type === 'atk') { gs.player.attack += item.value; alert("Attack Naik!"); }
        else if (item.type === 'def') { gs.player.defense += item.value; alert("Defense Naik!"); }
        window.saveProgress(gs);
        window.render();
    } else {
        alert("Gold tidak cukup!");
    }
};

window.renderBattleScreen = function() {
    const gs = window.gameState;
    const e = gs.enemy;
    const p = gs.player;
    const q = gs.currentQuestion;

    if (!q || !e) { window.goTo('map'); return "Loading..."; }

    // Logic Tombol Pilihan Ganda
    let inputHtml = '';
    if (q.type === 'input') {
        inputHtml = `
            <div class="flex gap-2">
                <input type="number" class="game-input mb-0 text-center text-lg font-bold" 
                       value="${gs.userAnswer}" 
                       oninput="window.gameState.userAnswer = this.value"
                       placeholder="?" autofocus>
                <button onclick="window.checkAnswer()" class="btn btn-blue px-6">SERANG!</button>
            </div>
        `;
    } else if (q.options) {
        inputHtml = `<div class="grid grid-cols-1 gap-2 mt-4">
            ${q.options.map((opt, idx) => `
                <button onclick="window.gameState.userAnswer='${idx}'; window.checkAnswer()" class="btn btn-blue text-left py-3 border border-blue-400">
                    <span class="font-bold mr-2">${String.fromCharCode(65+idx)}.</span> ${opt}
                </button>
            `).join('')}
        </div>`;
    }
    if (e.hp <= 0) {
        inputHtml = '';
        }

    return `
        <div class="p-4 max-w-2xl mx-auto fade-in">
            <div class="glass-panel flex justify-between items-center mb-4">
                ${e.hp > 0 ? `
  <button onclick="window.goTo('map')" 
    class="text-xs text-gray-400 border border-gray-600 px-2 py-1 rounded">
    🏳️ Kabur
  </button>
` : ''}
                <div class="font-bold text-red-400">VS ${e.name}</div>
            </div>

            <div class="glass-panel mb-4">
                <div class="flex justify-between mb-1 text-sm font-bold">
                    <span>${p.name} <span class="text-yellow-400">(Lv.${p.level})</span></span>
                    <span class="text-green-400">❤️ ${p.hp}/${p.maxHp}</span>
                </div>
                <div class="bar-container mb-4"><div class="bar-fill hp bg-green-500" style="width: ${(p.hp/p.maxHp)*100}%"></div></div>
                
                <div class="flex items-end justify-between mb-1">
                    <div class="text-sm font-bold text-red-300">${e.name}</div>
                    <img src="${e.img}" class="w-16 h-16 bg-slate-700 rounded-full border-2 border-red-500 mb-[-10px] z-10">
                </div>
                <div class="flex justify-between text-xs mb-1">
                    <span>HP Musuh</span>
                    <span class="text-red-400">${e.hp}/${e.maxHp}</span>
                </div>
                <div class="bar-container"><div class="bar-fill hp" style="width: ${(e.hp/e.maxHp)*100}%"></div></div>
            </div>

            <div class="glass-panel text-center relative">
                <div class="text-xs text-blue-300 mb-2 uppercase tracking-widest">Misi Matematika</div>
                <h2 class="text-xl font-mono font-bold mb-6 bg-slate-800 p-4 rounded-xl border border-slate-600">${q.question}</h2>
                    ${gs.feedback ? `
                    <div class="mb-4 p-3 bg-slate-800 rounded-lg border border-gray-500 text-sm animate-pulse">
                        ${gs.feedback}
                    </div>

                    ${e.hp > 0 ? `
                        <button onclick="window.nextTurn()" 
                        class="btn btn-green w-full py-2 mb-2">
                        Lanjut Soal Berikutnya ➡️
                        </button>
                    ` : ''}
                    ` : inputHtml}
            </div>
            
            <div class="mt-4 p-2 rounded bg-black/30 text-xs text-gray-400 font-mono h-24 overflow-y-auto border border-white/5">
                        ${(gs.battleLog || []).slice().reverse().map(log => `
                            <div class="py-0.5 border-b border-white/5">> ${log}</div>
                        `).join('')}
            </div>
        </div>
    `;
};