// ===============================
// DATA STRUKTUR MATERI
// ===============================
const worlds = [
  {
    id: "numbers",
    title: "🌳 Dunia Bilangan",
    areas: [
      { id: "bilangan_bulat", title: "Bilangan Bulat" },
      { id: "rasional", title: "Bilangan Rasional" },
      { id: "eksponen", title: "Bilangan Berpangkat" }
    ]
  },

  {
    id: "algebra",
    title: "⚖️ Dunia Aljabar",
    areas: [
      { id: "rasio", title: "Rasio & Perbandingan" },
      { id: "aljabar", title: "Bentuk Aljabar" },
      { id: "fungsi", title: "Relasi & Fungsi" },
      { id: "spldv", title: "SPLDV" }
    ]
  },

  {
    id: "geometry",
    title: "📐 Dunia Geometri",
    areas: [
      { id: "kesebangunan", title: "Kesebangunan" },
      { id: "pythagoras", title: "Pythagoras" },
      { id: "bangun_ruang", title: "Bangun Ruang" },
      { id: "transformasi", title: "Transformasi" }
    ]
  },

  {
    id: "data",
    title: "📊 Dunia Data & Peluang",
    areas: [
      { id: "data", title: "Pengumpulan Data" },
      { id: "statistika", title: "Statistika" },
      { id: "peluang", title: "Peluang" }
    ]
  }

]

// ===============================
// RENDER STAGE SCREEN
// ===============================
window.renderStageScreen = function () {
  const gs = window.gameState;

  const world = worlds.find(w => w.id === gs.selectedWorld);
  const area = world?.areas.find(a => a.id === gs.selectedArea);
  //const stage = area?.stages?.find(s => s.id === gs.selectedStage);

  // ====== PHASE PEMBELAJARAN ======
  if (gs.learningPhase === 'pemantik') return renderPemantik(stage);
  if (gs.learningPhase === 'eksplorasi') return renderEksplorasi(stage);
  if (gs.learningPhase === 'tantangan') return renderTantangan(stage);
  if (gs.learningPhase === 'refleksi') return renderRefleksi(stage);


  // ===============================
  // MODE 1: PILIH WORLD
  // ===============================
  if (!gs.selectedWorld) {
    return `
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Pilih Dunia</h2>
        ${worlds.map(w => `
          <button onclick="selectWorld('${w.id}')" class="btn btn-blue w-full mb-2">
            ${w.title}
          </button>
        `).join("")}
      </div>
    `;
  }

  // ===============================
  // MODE 2: PILIH AREA
  // ===============================
  if (!gs.selectedArea) {
    return `
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">${world.title}</h2>
        ${world.areas.map(a => `
          <button onclick="selectArea('${a.id}')" class="btn btn-green w-full mb-2">
            ${a.title}
          </button>
        `).join("")}
        <button onclick="backToWorld()" class="btn btn-gray mt-4">⬅️ Kembali</button>
      </div>
    `;
  }

  // ===============================
  // MODE 3: PILIH STAGE
  // ===============================
  if (!gs.selectedStage) {
    return `
      <div class="p-6 text-center">
        <h2 class="text-xl font-bold mb-4">${area.title}</h2>
        <button onclick="startLearning('${area.id}')" class="btn btn-purple w-full">
          ▶️ Mulai Materi
        </button>
        <button onclick="backToArea()" class="btn btn-gray mt-4">⬅️ Kembali</button>
      </div>
    `;
  }

  // ===============================
  // MODE 4: DETAIL STAGE
  // ===============================
if (!gs.learningPhase) {
  return renderPemantik(stage);
}

return `
<div class="p-6 max-w-md mx-auto fade-in">  

  <div class="glass-panel mb-4 text-center">
    <h2 class="text-2xl font-bold">📘 ${stage.title}</h2>
    <p class="text-gray-400 text-sm">
      Selesaikan 5 soal dalam waktu terbatas
    </p>
  </div>

  <button onclick="startBattle('numbers','bilangan_bulat',${gs.selectedStage})" 
    class="btn btn-blue w-full">
    ▶️ Mulai Battle
  </button>

  <button onclick="backToStage()" 
    class="btn btn-gray w-full mt-4">
    ⬅️ Kembali
  </button>

</div>
`;
};

function renderPemantik(stage){
  return `
  <div class="p-6">
    <h2 class="text-xl font-bold mb-2">🌟 Pemantik</h2>
    <p>Pernahkah kamu menemukan masalah terkait <b>${stage.title}</b>?</p>

    <button onclick="nextPhase('eksplorasi')" class="btn btn-blue mt-4">
      Lanjut Eksplorasi 🔍
    </button>

    <button onclick="backToStage()" class="btn btn-gray mt-2">
      ⬅️ Kembali
    </button>
  </div>
  `;
}


function renderEksplorasi(stage){
  return `
  <div class="p-6">
    <h2 class="text-xl font-bold mb-2">📘 Eksplorasi</h2>
    <p>Di sini kamu mempelajari konsep <b>${stage.title}</b>.</p>

    <button onclick="nextPhase('tantangan')" class="btn btn-blue mt-4">
      Lanjut Tantangan ⚔️
    </button>
  </div>
  `;
}

function renderTantangan(stage){
  startQuest(stage.id); // pakai sistem quest kamu

  return `
  <div class="p-6 text-center">
    <h2 class="text-xl font-bold">⚔️ Tantangan</h2>
    <p>Jawab soal berikut</p>

    <button onclick="goTo('game')" class="btn btn-green mt-4">
      Mulai Soal 🚀
    </button>
  </div>
  `;
}

function renderRefleksi(stage){
  return `
  <div class="p-6 text-center">
    <h2 class="text-xl font-bold">🧠 Refleksi</h2>
    <p>Apa yang kamu pelajari dari ${stage.title}?</p>

    <button onclick="goTo('map')" class="btn btn-purple mt-4">
      Kembali ke Map 🌍
    </button>
  </div>
  `;
}

// ===============================
// NAVIGATION FUNCTION
// ===============================


window.selectWorld = function(id) {
  window.gameState.selectedWorld = id;
  window.render();
};

window.selectArea = function(id) {
  window.gameState.selectedArea = id;
  window.render();
};

window.selectStage = function(id) {
  window.gameState.selectedStage = id;
  window.render();
};

window.backToWorld = function() {
  window.gameState.selectedWorld = null;
  window.render();
};

window.backToArea = function() {
  window.gameState.selectedArea = null;
  window.render();
};

window.backToStage = function() {
  window.gameState.selectedStage = null;
  window.render();
};

window.nextPhase = function(phase){
  window.gameState.learningPhase = phase;
  window.render();
}

window.handleSubmit = function () {
  const val = document.getElementById("jawabanInput").value;
  submitAnswer(Number(val));
  nextQuestion();
  const worldId = window.gameState.selectedWorld;
  if (worldId && window.gameState.progress[worldId]) {
  window.gameState.progress[worldId].done += 1;
  }
  window.render();
};

window.startLearning = function(id){
  window.gameState.selectedStage = id;
  window.gameState.learningPhase = 'pemantik';
  window.render();
};

window.renderMateriList = function(){
  return worlds.map(w => `
    <div class="glass-panel mb-2">
      <div class="font-bold text-yellow-400">${w.title}</div>
      ${w.areas.map(a => `
        <div style="margin-left:10px" class="text-sm text-gray-300">
          • ${a.title}
        </div>
      `).join("")}
    </div>
  `).join("");
}; 
