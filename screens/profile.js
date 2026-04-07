window.getTitleBonus = function(gs){
  const found = gs.achievements?.find(a => a.name === gs.title);
  return found ? found.bonus : 0;
};

window.setTitle = function(title){
  window.gameState.title = title;
  window.render();
};

window.renderProfileScreen = function(){
  const gs = window.gameState;
  const p = gs.player;

  return `
  <div class="p-4 max-w-md mx-auto fade-in">

    <!-- HEADER -->
    <div class="glass-panel text-center">
      <div class="text-3xl mb-2">👤</div>
      <div class="font-bold text-xl">${p.name}</div>
      <div class="text-yellow-400">${gs.title || "Pemula"}</div>
    </div>

    <!-- STATUS -->
    <div class="glass-panel mt-3">
      <div class="font-bold mb-2">📊 Status</div>
      <div>❤️ HP: ${p.hp}/${p.maxHp}</div>
      <div>⚔️ Attack: ${p.attack}</div>
      <div>🛡️ Defense: ${p.defense}</div>
      <div>⭐ Level: ${p.level}</div>
    </div>

    <!-- SKILL -->
    <div class="glass-panel mt-3">
      <div class="font-bold mb-2">⚡ Skill</div>

      ${(gs.skills || []).map(s => `
        <div class="flex justify-between">
          <span>${s.name}</span>
          <span>Power ${s.power}</span>
        </div>
      `).join("") || "<div class='text-gray-400'>Belum ada skill</div>"}
    </div>

    <!-- ACHIEVEMENT -->
    <div class="glass-panel mt-3">
      <div class="font-bold mb-2">🏆 Achievement</div>

      ${(gs.achievements || []).map(a => `
        <div class="flex justify-between">
          <span>${a.name}</span>
          <span>+${a.bonus} DMG</span>
        </div>
      `).join("") || "<div class='text-gray-400'>Belum ada achievement</div>"}
    </div>

    <!-- PILIH GELAR -->
    <div class="glass-panel mt-3">
      <div class="font-bold mb-2">🎖 Pilih Gelar</div>

      ${(gs.achievements || []).map(a => `
        <button onclick="setTitle('${a.name}')" 
        class="btn btn-gray">
          ${a.name}
        </button>
      `).join("")}
    </div>

    <button onclick="goTo('home')" class="btn btn-gray mt-4 w-full">
      ⬅️ Kembali
    </button>

  </div>
  `;
};