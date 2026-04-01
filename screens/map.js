let isDragging = false;
let dragInitialized = false;
let startX, startY;
let currentX = 0;
let currentY = 0;
let scale = 1; // penting untuk zoom
let currentIslandView = null; 

const MAP_WIDTH = 2000;
const MAP_HEIGHT = 1200;
const EXTRA_ZOOM = 1.3;

// ===============================
// RENDER MAP SCREEN
// ===============================
window.renderMapScreen = function () {
  if(currentIslandView){
    return renderIslandView(currentIslandView);
  }
  return `
  <h2 class="text-center text-xl font-bold text-yellow-400 mt-3">
  🌍 Pilih Dunia Petualangan
  </h2>
  <p class="text-center text-sm text-gray-400 mb-2">
  Geser ke kiri/kanan untuk memilih dunia
  </p>
    <div class="map-wrapper">

    <!-- TOP BAR -->
    <div class="map-topbar">
      <button class="btn btn-gray small-btn" onclick="goTo('home')">⬅️</button>
      <button class="btn btn-purple small-btn" onclick="toggleMateri()">📘</button>
    </div>

    <!-- SCROLL WORLD LIST -->
    <div class="world-scroll">

      ${renderWorldCard("numbers", "🌳 Dunia Bilangan", "assets/map/island_numbers.png")}
      ${renderWorldCard("algebra", "⚖️ Dunia Aljabar", "assets/map/island_algebra.png")}
      ${renderWorldCard("geometry", "📐 Dunia Geometri", "assets/map/island_geometry.png")}
      ${renderWorldCard("data", "📊 Dunia Data & Peluang", "assets/map/island_data.png")}

    </div>

    ${renderMateriOverlay()}

  </div>
  `;
};

function renderWorldCard(id, title, img){

  const isActive = (id === "numbers" || id === "algebra");

  const prog = window.gameState.progress[id];
  const percent = prog ? Math.floor((prog.done / prog.total) * 100) : 0;

  return `
    <div class="world-card ${!isActive ? 'locked-world' : ''}"
         ${isActive ? `onclick="openIsland('${id}')"` : ""}>

      <img src="${img}" class="world-img">

      <div class="world-title">${title}</div>

      ${isActive ? `
        <div class="progress-box">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${percent}%"></div>
          </div>
          <div class="progress-text">
            ${prog.done} / ${prog.total} materi
          </div>
        </div>
      ` : `
        <div class="coming-soon-badge">
          🚧 Coming Soon
        </div>
      `}

    </div>
  `;
}


function renderIslandView(worldId){

  let islandImg = "";
  if(worldId === "numbers") islandImg = "assets/map/island_numbers.png";
  if(worldId === "algebra") islandImg = "assets/map/island_algebra.png";  
  if(worldId === "data") islandImg = "assets/map/island_data.png";
  if(worldId === "geometry") islandImg = "assets/map/island_geometry.png";
  const headerZone = `
  <div class="zone-header glass-panel text-center">
  <h2 class="text-lg font-bold text-yellow-400">
    🌿 Prime Verda
  </h2>
  <p class="text-sm text-gray-300">
    Root Floor – Bilangan Bulat
  </p>
  </div>
  `;

  setTimeout(() => {
      initCamera(); 
      initDrag();
    }, 100);

return `
  <div class="map-wrapper">
    ${headerZone}
      <div id="worldMap" class="map-full">
      <img src="${islandImg}" class="map-bg">

      <div id="stageNodes">
        ${getNodesByWorld(worldId)}
      </div>
    </div>

    <div class="bottom-bar">
      <button class="btn btn-gray small-btn" onclick="closeIsland()">⬅️</button>
      <button class="btn btn-purple materi-btn" onclick="toggleMateri()">📘 Materi</button>
    </div>

    ${renderMateriOverlay()}

  </div>
  `;
}


window.openIsland = function(worldId){
  currentIslandView = worldId;
  window.render();
};

window.closeIsland = function(){
  currentIslandView = null;
  window.render();
};

function renderMateriOverlay(){
  return `
    <div id="materiOverlay" class="materi-overlay hidden">
      <div class="materi-content">
        
        <div class="materi-header">
          <span>📘 Materi</span>
          <button onclick="toggleMateri()">✖</button>
        </div>

        <div class="materi-body">
          ${window.renderMateriList ? window.renderMateriList() : "<p>Materi belum tersedia</p>"}
        </div>

      </div>
    </div>
  `;
}

function getNodesByWorld(worldId){

  if(worldId === "numbers"){

    const nodes = [
      { level: 1,  x: 260, y: 380 },
      { level: 2,  x: 320, y: 330 },
      { level: 3,  x: 380, y: 280 },
      { level: 4,  x: 440, y: 230 }, // mini boss

      { level: 5,  x: 520, y: 210 },
      { level: 6,  x: 600, y: 190 },
      { level: 7,  x: 680, y: 170 },
      { level: 8,  x: 760, y: 150 }, // mini boss

      { level: 9,  x: 840, y: 160 },
      { level: 10, x: 920, y: 190 },
      { level: 11, x: 1000,y: 230 },
      { level: 12, x: 1080,y: 280 }, // mini boss

      { level: 13, x: 1160,y: 330 },
      { level: 14, x: 1240,y: 380 },
      { level: 15, x: 1320,y: 420 },
      { level: 16, x: 1400,y: 460 }, // mini boss

      { level: 17, x: 1500,y: 500, boss: true } // BOSS FINAL
    ];
    return renderPaths(nodes) + renderNodes(nodes, worldId);
  }
  if(worldId === "algebra"){

  const nodes = [
    { level: 1,  x: 200, y: 500 },
    { level: 2,  x: 260, y: 460 },
    { level: 3,  x: 320, y: 420 },
    { level: 4,  x: 380, y: 380 }, // mini boss

    { level: 5,  x: 460, y: 350 },
    { level: 6,  x: 540, y: 320 },
    { level: 7,  x: 620, y: 290 },
    { level: 8,  x: 700, y: 260 }, // mini boss

    { level: 9,  x: 780, y: 240 },
    { level: 10, x: 860, y: 260 },
    { level: 11, x: 940, y: 300 },
    { level: 12, x: 1020,y: 350 }, // mini boss

    { level: 13, x: 1100,y: 400 },
    { level: 14, x: 1180,y: 440 },
    { level: 15, x: 1260,y: 470 },
    { level: 16, x: 1340,y: 500 }, // mini boss

    { level: 17, x: 1450,y: 520, boss: true }
  ];

  return renderPaths(nodes) + renderNodes(nodes);
  }
  if (worldId === "geometry") {

  const nodes = [
    { level: 1,  x: 220, y: 520 },
    { level: 2,  x: 280, y: 480 },
    { level: 3,  x: 340, y: 440 },
    { level: 4,  x: 400, y: 400 }, // mini boss

    { level: 5,  x: 480, y: 370 },
    { level: 6,  x: 560, y: 340 },
    { level: 7,  x: 640, y: 310 },
    { level: 8,  x: 720, y: 280 }, // mini boss

    { level: 9,  x: 800, y: 260 },
    { level: 10, x: 880, y: 280 },
    { level: 11, x: 960, y: 320 },
    { level: 12, x: 1040,y: 360 }, // mini boss

    { level: 13, x: 1120,y: 410 },
    { level: 14, x: 1200,y: 460 },
    { level: 15, x: 1280,y: 500 },
    { level: 16, x: 1360,y: 540 }, // mini boss

    { level: 17, x: 1460,y: 580, boss: true } // boss final
  ];

  return renderPaths(nodes) + renderNodes(nodes);
  }
  if (worldId === "data") {

  const nodes = [
    { level: 1,  x: 220, y: 520 },
    { level: 2,  x: 280, y: 500 },
    { level: 3,  x: 340, y: 480 },
    { level: 4,  x: 400, y: 460 }, // mini boss

    { level: 5,  x: 480, y: 440 },
    { level: 6,  x: 560, y: 420 },
    { level: 7,  x: 640, y: 400 },
    { level: 8,  x: 720, y: 380 }, // mini boss

    { level: 9,  x: 800, y: 360 },
    { level: 10, x: 880, y: 380 },
    { level: 11, x: 960, y: 420 },
    { level: 12, x: 1040,y: 460 }, // mini boss

    { level: 13, x: 1120,y: 500 },
    { level: 14, x: 1200,y: 540 },
    { level: 15, x: 1280,y: 580 },
    { level: 16, x: 1360,y: 620 }, // mini boss

    { level: 17, x: 1480,y: 650, boss: true } // boss final
  ];

  return renderPaths(nodes) + renderNodes(nodes, worldId);
  }
}

function renderNode(level, top, left, isBoss = false, worldId){

  const unlocked = true;
  const typeClass = getNodeType(level, isBoss);

  return `
    <div 
      class="node ${typeClass} ${unlocked ? '' : 'locked-node'}"
      style="top:${top}px; left:${left}px;"
      onclick="startBattle('${worldId}','bilangan_bulat', ${level})"
    >
      ${isBoss ? "👑" : level}
    </div>
  `;
}

function getNodeType(level, isBoss){
  if(isBoss) return "boss-node";
  if(level % 4 === 0) return "mini-node";
  return "normal-node";
}

function renderNodes(nodes, worldId){
  return nodes.map(n => 
    renderNode(n.level, n.y, n.x, n.boss, worldId)
  ).join("");
}

function renderPaths(nodes){
  let html = "";

  for(let i=0; i<nodes.length-1; i++){
    const a = nodes[i];
    const b = nodes[i+1];

    html += renderPathLine(
      a.x, a.y, b.x, b.y,
      a.level, b.level,
      a.boss, b.boss
    );
  }

  return html;
}
function getRadiusByLevel(level, isBoss){
  if(isBoss) return 45;        // boss (90px)
  if(level % 4 === 0) return 38; // mini boss (76px)
  return 35;                   // normal (70px)
}

function renderPathLine(x1, y1, x2, y2, lvl1, lvl2, boss1, boss2){

  const r1 = getRadiusByLevel(lvl1, boss1);
  const r2 = getRadiusByLevel(lvl2, boss2);

  // ubah ke pusat node
  const cx1 = x1 + r1;
  const cy1 = y1 + r1;

  const cx2 = x2 + r2;
  const cy2 = y2 + r2;

  const dx = cx2 - cx1;
  const dy = cy2 - cy1;

  const angle = Math.atan2(dy, dx);

  const startX = cx1 + Math.cos(angle) * r1;
  const startY = cy1 + Math.sin(angle) * r1;

  const endX = cx2 - Math.cos(angle) * r2;
  const endY = cy2 - Math.sin(angle) * r2;

  const newDx = endX - startX;
  const newDy = endY - startY;

  const length = Math.sqrt(newDx*newDx + newDy*newDy);
  const deg = angle * 180 / Math.PI;

  return `
    <div class="path-line"
      style="
        top:${startY}px;
        left:${startX}px;
        width:${length}px;
        transform: rotate(${deg}deg);
      ">
    </div>
  `;
}

  // lanjutkan untuk geometry & data

// ===============================
// HANDLE BACK BUTTON
// ===============================
window.handleBackMap = function(){

  const map = document.getElementById("worldMap");
  const nodes = document.getElementById("stageNodes");

  if (scale > 1.05) {
    scale = getInitialScale() * EXTRA_ZOOM;

    currentX = 0;
    currentY = 0;

    map.style.transition = "transform 0.5s ease";
    initCamera();

    nodes.classList.add("hidden");
    window.gameState.selectedWorld = null;

  } else {
    window.goTo('home');
  }
};



// ===============================
// ZOOM + SHOW NODE
// ===============================
window.zoomToIsland = function(x, y, worldId){
  const map = document.getElementById("worldMap");

  scale = 2.2; // simpan scale

  map.style.transition = "transform 0.8s ease";
  currentX = -x;
  currentY = -y;

  map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;

  const nodes = document.getElementById("stageNodes");
  nodes.innerHTML = getNodesByWorld(worldId);
  nodes.classList.remove("hidden");

  window.gameState.selectedWorld = worldId;
};

// ===============================
// START STAGE → QUEST SYSTEM
// ===============================
window.startStage = function(stageId){
  window.sfx.click();

  // kirim ke quest system kamu (sudah ada di stage.js)
  window.startQuest(stageId);

  // pindah ke battle screen
  window.goTo('game');
};


// ===============================
// TOGGLE MATERI OVERLAY
// ===============================
window.toggleMateri = function(){
  const el = document.getElementById("materiOverlay");
  el.classList.toggle("hidden");
};

window.returnToMapWithWorld = function() {
  const gs = window.gameState;

  // set island aktif (INI KUNCI)
  currentIslandView = gs.selectedWorld;

  // pindah ke map
  window.goTo('map');
};

// ===============================
// UTILITY
// ===============================
function clamp(value, min, max){
  return Math.max(min, Math.min(max, value));
}

// ===============================
// DRAG TO PAN MAP
// ===============================
function initDrag(){
  if (dragInitialized) return; // 🔥 TAMBAHKAN INI
  dragInitialized = true;      // 🔥 TAMBAHKAN INI

  const map = document.getElementById("worldMap");

  map.addEventListener("touchstart", (e)=>{
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    map.style.transition = "none";
  });

  // touchmove untuk panning
  map.addEventListener("touchmove", (e)=>{
    if(!isDragging) return;

    e.preventDefault(); 

    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    const scaledWidth = MAP_WIDTH * scale;
    const scaledHeight = MAP_HEIGHT * scale;

    const minX = viewWidth - scaledWidth;
    const minY = viewHeight - scaledHeight;

    currentX = clamp(currentX + dx, minX, 0);
    currentY = clamp(currentY + dy, minY, 0);

   map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    }, 
    { passive: false }
    );

    // touchend untuk berhenti panning
    window.addEventListener("touchend", ()=>{
        isDragging = false;
    });


  map.addEventListener("mousedown", (e)=>{
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    map.style.transition = "none";
  });

  window.addEventListener("mouseup", ()=>{
    isDragging = false;
  });

  window.addEventListener("mousemove", (e)=>{
    if(!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    startX = e.clientX;
    startY = e.clientY;

    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    const scaledWidth = MAP_WIDTH * scale;
    const scaledHeight = MAP_HEIGHT * scale;

    // batas minimal (kanan & bawah)
    const minX = viewWidth - scaledWidth;
    const minY = viewHeight - scaledHeight;

    // clamp supaya tidak keluar layar
    currentX = clamp(currentX + dx, minX, 0);
    currentY = clamp(currentY + dy, minY, 0);

    map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
  });
}

function getInitialScale(){
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  const scaleX = viewWidth / MAP_WIDTH;
  const scaleY = viewHeight / MAP_HEIGHT;

  return Math.min(scaleX, scaleY); // 🔥 INI WAJIB
}

// ===============================
// INIT CAMERA (POSISI + SCALE)
// ===============================
function initCamera(){

  const map = document.getElementById("worldMap");

  const fitScale = getInitialScale();
  scale = Math.max(fitScale * EXTRA_ZOOM, 1.2);

  // hitung center
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  const scaledWidth = MAP_WIDTH * scale;
  const scaledHeight = MAP_HEIGHT * scale;

  // posisi tengah
  currentX = (viewWidth - scaledWidth) / 2;
  currentY = (viewHeight - scaledHeight) / 2;

  map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}