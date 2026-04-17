let currentIslandView = null; 

const BASE_COORD_WIDTH = 2000;
const BASE_COORD_HEIGHT = 1200;

const MAP_WIDTH = 8552;
const MAP_HEIGHT = 2944;
const NODE_VISUAL_SCALE = MAP_WIDTH / BASE_COORD_WIDTH; 

const ISLAND_INITIAL_ZOOM = 1.55;
const ISLAND_VERTICAL_BIAS = -0.025;

// ===============================
// RENDER MAP SCREEN
// ===============================
window.renderMapScreen = function () {
  if (currentIslandView) {
    return renderIslandView(currentIslandView);
  }

  return `
  <h2 id="mapTitle" class="text-center text-xl font-bold text-yellow-400 mt-3">
    🌍 Pilih Dunia Petualangan
  </h2>

  <p id="mapSubtitle" class="text-center text-sm text-gray-400 mb-2">
    Geser ke kiri/kanan untuk memilih dunia
  </p>

  <div id="mapWrapper" class="map-wrapper">

    <div id="mapTopbar" class="map-topbar">
      <button id="mapBackBtn" class="btn btn-gray small-btn" onclick="goTo('home')">⬅️</button>
    </div>

    <div id="worldScroll" class="world-scroll">
      ${renderWorldCard("numbers", "🌳 Dunia Bilangan", "assets/map/ikon_island_numbers.png")}
      ${renderWorldCard("algebra", "⚖️ Dunia Aljabar", "assets/map/island_algebra.png")}
      ${renderWorldCard("geometry", "📐 Dunia Geometri", "assets/map/island_geometry.png")}
      ${renderWorldCard("data", "📊 Dunia Data & Peluang", "assets/map/island_data.png")}
    </div>

  </div>
  `;
};

function renderWorldCard(id, title, img) {
  const isActive = (id === "numbers" || id === "algebra");

  const prog = window.gameState.progress[id];
  const percent = prog ? Math.floor((prog.done / prog.total) * 100) : 0;

  return `
    <div 
      id="worldCard-${id}"
      class="world-card ${!isActive ? 'locked-world' : ''}"
      ${isActive ? `onclick="openIsland('${id}')"` : ""}
    >

      <img src="${img}" class="world-img">

      <div id="worldTitle-${id}" class="world-title">${title}</div>

      ${isActive ? `
        <div id="progressBox-${id}" class="progress-box">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${percent}%"></div>
          </div>
          <div class="progress-text">
            ${prog.done} / ${prog.total} materi
          </div>
        </div>
      ` : `
        <div id="comingSoon-${id}" class="coming-soon-badge">
          🚧 Coming Soon
        </div>
      `}

    </div>
  `;
}


function renderIslandView(worldId) {
  let islandImg = "";
  let zoneTitle = "🌍 Zona Petualangan";
  let zoneSubtitle = "Pilih stage untuk memulai";

  if (worldId === "numbers") {
    islandImg = "assets/map/island_numbers.png";
    zoneTitle = "🌿 Prime Verda";
    zoneSubtitle = "Bilangan";
  }

  if (worldId === "algebra") {
    islandImg = "assets/map/island_algebra.png";
    zoneTitle = "⚖️ Algebrum";
    zoneSubtitle = "Aljabar";
  }

  if (worldId === "data") {
    islandImg = "assets/map/island_data.png";
    zoneTitle = "📊 Statica";
    zoneSubtitle = "Data dan Peluang";
  }

  if (worldId === "geometry") {
    islandImg = "assets/map/island_geometry.png";
    zoneTitle = "📐 Geometria";
    zoneSubtitle = "Bangun dan Ruang";
  }

  const headerZone = `
    <div id="zoneHeader" class="zone-header glass-panel text-center">
      <h2 class="text-lg font-bold text-yellow-400">
        ${zoneTitle}
      </h2>
      <p class="text-sm text-gray-300">
        ${zoneSubtitle}
      </p>
      <button id="islandBackBtn" class="btn btn-gray small-btn back-btn" onclick="closeIsland()">⬅️</button>
    </div>
  `;

  requestAnimationFrame(() => {
  initHorizontalMap(worldId);

  });

return `
  <div id="islandWrapper" class="map-wrapper">

    <div id="islandHeaderLayer">
      ${headerZone}
    </div>

    <div id="worldMapScroller" class="world-map-scroller">
      <div id="worldMap" class="map-full">
        <img src="${islandImg}" class="map-bg">

        <div id="stageNodes">
          ${getNodesByWorld(worldId)}
        </div>
      </div>
    </div>
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

function toMapCoords(x, y) {
  return {
    x: (x / BASE_COORD_WIDTH) * MAP_WIDTH,
    y: (y / BASE_COORD_HEIGHT) * MAP_HEIGHT
  };
}

function transformNodes(nodes) {
  return nodes.map(n => {
    const p = toMapCoords(n.x, n.y);
    return {
      ...n,
      x: p.x,
      y: p.y
    };
  });
}

function getNodesByWorld(worldId){

  if (worldId === "numbers") {
  const rawNodes = [
    { level: 1,  x: 170,  y: 760 },
    { level: 2,  x: 300,  y: 680 },
    { level: 3,  x: 430,  y: 590 },
    { level: 4,  x: 560,  y: 500 },

    { level: 5,  x: 700,  y: 430 },
    { level: 6,  x: 840,  y: 500 },
    { level: 7,  x: 980,  y: 590 },
    { level: 8,  x: 1120, y: 690 },

    { level: 9,  x: 1260, y: 760 },
    { level: 10, x: 1400, y: 700 },
    { level: 11, x: 1540, y: 610 },
    { level: 12, x: 1670, y: 520 },

    { level: 13, x: 1780, y: 590 },
    { level: 14, x: 1860, y: 700 },
    { level: 15, x: 1760, y: 820 },
    { level: 16, x: 1600, y: 910 },

    { level: 17, x: 1410, y: 980, boss: true }
  ];
    const nodes = transformNodes(rawNodes);
    return renderPaths(nodes) + renderNodes(nodes, worldId);
  }

  if (worldId === "algebra") {
    const rawNodes = [
    { level: 1,  x: 170,  y: 820 },
    { level: 2,  x: 310,  y: 730 },
    { level: 3,  x: 450,  y: 640 },
    { level: 4,  x: 600,  y: 550 },

    { level: 5,  x: 760,  y: 470 },
    { level: 6,  x: 920,  y: 530 },
    { level: 7,  x: 1080, y: 620 },
    { level: 8,  x: 1240, y: 720 },

    { level: 9,  x: 1400, y: 800 },
    { level: 10, x: 1540, y: 740 },
    { level: 11, x: 1670, y: 650 },
    { level: 12, x: 1780, y: 560 },

    { level: 13, x: 1860, y: 640 },
    { level: 14, x: 1820, y: 760 },
    { level: 15, x: 1700, y: 870 },
    { level: 16, x: 1530, y: 950 },

    { level: 17, x: 1340, y: 1010, boss: true }
    ];

    const nodes = transformNodes(rawNodes);
    return renderPaths(nodes) + renderNodes(nodes, worldId);
  }

  if (worldId === "geometry") {
    const rawNodes = [
      { level: 1,  x: 220, y: 520 },
      { level: 2,  x: 280, y: 480 },
      { level: 3,  x: 340, y: 440 },
      { level: 4,  x: 400, y: 400 },

      { level: 5,  x: 480, y: 370 },
      { level: 6,  x: 560, y: 340 },
      { level: 7,  x: 640, y: 310 },
      { level: 8,  x: 720, y: 280 },

      { level: 9,  x: 800, y: 260 },
      { level: 10, x: 880, y: 280 },
      { level: 11, x: 960, y: 320 },
      { level: 12, x: 1040, y: 360 },

      { level: 13, x: 1120, y: 410 },
      { level: 14, x: 1200, y: 460 },
      { level: 15, x: 1280, y: 500 },
      { level: 16, x: 1360, y: 540 },

      { level: 17, x: 1460, y: 580, boss: true }
    ];

    const nodes = transformNodes(rawNodes);
    return renderPaths(nodes) + renderNodes(nodes, worldId);
  }

  if (worldId === "data") {
    const rawNodes = [
      { level: 1,  x: 220, y: 520 },
      { level: 2,  x: 280, y: 500 },
      { level: 3,  x: 340, y: 480 },
      { level: 4,  x: 400, y: 460 },

      { level: 5,  x: 480, y: 440 },
      { level: 6,  x: 560, y: 420 },
      { level: 7,  x: 640, y: 400 },
      { level: 8,  x: 720, y: 380 },

      { level: 9,  x: 800, y: 360 },
      { level: 10, x: 880, y: 380 },
      { level: 11, x: 960, y: 420 },
      { level: 12, x: 1040, y: 460 },

      { level: 13, x: 1120, y: 500 },
      { level: 14, x: 1200, y: 540 },
      { level: 15, x: 1280, y: 580 },
      { level: 16, x: 1360, y: 620 },

      { level: 17, x: 1480, y: 650, boss: true }
    ];

    const nodes = transformNodes(rawNodes);
    return renderPaths(nodes) + renderNodes(nodes, worldId);
  }

  return "";
}

function getNode1Coords(worldId) {
  let rawNode1 = { x: 170, y: 760 };

  if (worldId === "numbers") {
    rawNode1 = { x: 170, y: 760 };
  } else if (worldId === "algebra") {
    rawNode1 = { x: 170, y: 820 };
  } else if (worldId === "geometry") {
    rawNode1 = { x: 180, y: 780 };
  } else if (worldId === "data") {
    rawNode1 = { x: 180, y: 860 };
  }

  return toMapCoords(rawNode1.x, rawNode1.y);
}

function getNodeSize(level, isBoss) {
  if (isBoss) return 90 * NODE_VISUAL_SCALE;
  if (level % 4 === 0) return 76 * NODE_VISUAL_SCALE;
  return 70 * NODE_VISUAL_SCALE;
}

function getNodeFontSize(level, isBoss) {
  if (isBoss) return 22 * NODE_VISUAL_SCALE;
  return 14 * NODE_VISUAL_SCALE;
}

function renderNode(level, top, left, isBoss = false, worldId) {
  const unlocked = true;
  const typeClass = getNodeType(level, isBoss);

  const size = getNodeSize(level, isBoss);
  const fontSize = getNodeFontSize(level, isBoss);

  return `
    <div 
      id="node-${worldId}-${level}"
      class="node ${typeClass} ${unlocked ? '' : 'locked-node'}"
      style="
        top:${top}px; 
        left:${left}px;
        width:${size}px;
        height:${size}px;
        font-size:${fontSize}px;
      "
      onclick="startBattle('${worldId}','default', ${level})"
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
function getRadiusByLevel(level, isBoss) {
  return getNodeSize(level, isBoss) / 2;
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

function initHorizontalMap(worldId) {
  const scroller = document.getElementById("worldMapScroller");
  const map = document.getElementById("worldMap");

  if (!scroller || !map) return;

  const availableWidth = scroller.clientWidth;
  const availableHeight = scroller.clientHeight;

  const scaleX = availableWidth / MAP_WIDTH;
  const scaleY = availableHeight / MAP_HEIGHT;

  // skala dasar agar map muat
  const fitScale = Math.min(scaleX, scaleY);

  // perbesar map dari ukuran dasar
  const fixedScale = fitScale * ISLAND_INITIAL_ZOOM;

  map.style.width = `${MAP_WIDTH}px`;
  map.style.height = `${MAP_HEIGHT}px`;
  map.style.transformOrigin = "top left";
  map.style.transform = `scale(${fixedScale})`;

  const scaledWidth = MAP_WIDTH * fixedScale;
  const scaledHeight = MAP_HEIGHT * fixedScale;

  scroller.style.setProperty("--scaled-map-width", `${scaledWidth}px`);
  scroller.style.setProperty("--scaled-map-height", `${Math.max(scaledHeight, availableHeight)}px`);

  // horizontal tetap dari kiri agar scroll node aman
  map.style.left = `0px`;

  // center vertikal sungguhan + sedikit bias ke atas
  const centeredTop = (availableHeight - scaledHeight) / 2;
  const biasTop = scaledHeight * ISLAND_VERTICAL_BIAS;
  map.style.top = `${centeredTop + biasTop}px`;

  const node1 = getNode1Coords(worldId);
  if (node1) {
    const targetX = (node1.x * fixedScale) - (availableWidth * 0.18);
    scroller.scrollLeft = Math.max(0, targetX);
  } else {
    scroller.scrollLeft = 0;
  }
}

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

window.MapDragState = window.MapDragState || {
  boundMap: null,
  handlers: null,
  isDragging: false,
  startX: 0,
  startY: 0
};