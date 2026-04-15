window.renderShopScreen = function(){
  const gs = window.gameState;
  const inv = gs.inventory || { items:{}, skills:{} };

  return `
  <div class="p-4 max-w-md mx-auto">

    <div class="glass-panel mb-3">

  <div class="font-bold mb-2">🎒 Inventory</div>

  <div class="text-sm">
    🧪 Potion: ${inv.items.potion || 0}
  </div>

  <div class="text-sm">
    💉 Mega Potion: ${inv.items.megaPotion || 0}
  </div>

  <div class="text-sm mt-2 font-bold">⚡ Skill</div>

  <div class="text-sm">
    🔥 Fire Skill: ${inv.skills.fireSkill || 0}
  </div>

</div>

    <div class="glass-panel text-center mb-3">
      <h2 class="text-xl font-bold">🏪 Shop</h2>
      <div>💰 Gold: ${gs.player.gold}</div>
    </div>

    ${Object.values(shopItems).map(item => `
      <div class="glass-panel mb-2">

        <div class="flex justify-between">
          <span>${item.icon} ${item.name}</span>
          <span>${item.price}💰</span>
        </div>

        <div class="text-sm text-gray-400 mb-2">
          ${item.desc}
        </div>

        <button onclick="buyItem('${item.id}')" 
        class="btn btn-green w-full">
          Beli
        </button>

      </div>
    `).join("")}

    <button onclick="goTo('home')" class="btn btn-gray w-full mt-3">
      ⬅️ Kembali
    </button>

  </div>
  `;
};