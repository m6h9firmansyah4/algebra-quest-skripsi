export function validateAnswer(gs) {
  const q = gs.currentQuestion;

  // INPUT (angka langsung)
  if (q.type === 'input') {
    return Math.abs(parseFloat(gs.userAnswer) - q.answer) < 0.1;
  }

  // PILIHAN GANDA
  if (q.options) {
    const selected = q.options[gs.userAnswer];
    return selected == q.answer;
  }

  return false;
}

// ===============================
// DAMAGE SYSTEM (BARU)
// ===============================

// Damage dari player ke enemy
export function calculatePlayerDamage(gs) {
  let baseDamage = gs.player.attack;

  // 🔥 BONUS: Critical hit (20%)
  if (Math.random() < 0.2) {
    baseDamage *= 2;
    gs.battleLog.push("💥 CRITICAL HIT!");
  }

  return baseDamage;
}

// Damage dari enemy ke player
export function calculateEnemyDamage(gs) {
  let baseDamage = gs.enemy.attack;

  // 🔥 BONUS: Defense system
  baseDamage -= gs.player.defense || 0;

  // minimal damage biar tidak 0
  return Math.max(3, baseDamage);
}

export function applyStreakBonus(gs, damage) {
  if (!gs.streak) gs.streak = 0;

  gs.streak++;

  if (gs.streak >= 3) {
    damage += 5;
    gs.battleLog.push("🔥 COMBO BONUS!");
  }

  return damage;
}