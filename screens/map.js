let currentIslandView = null;

const BASE_COORD_WIDTH = 2000;
const BASE_COORD_HEIGHT = 1200;

const MAP_WIDTH = 8552;
const MAP_HEIGHT = 2944;
const NODE_VISUAL_SCALE = MAP_WIDTH / BASE_COORD_WIDTH;

const ISLAND_INITIAL_ZOOM = 1.40;
const ISLAND_VERTICAL_BIAS = -0.020;

/* =========================================================
   MAP THEME FALLBACK
   Digunakan agar map.js tetap aman walaupun AQ_THEME belum terbaca.
========================================================= */
function getMapTheme() {
  return window.AQ_THEME || {
    shell: `
      min-height: 100dvh;
      background:
        radial-gradient(circle at top, rgba(37,99,235,0.18), transparent 35%),
        radial-gradient(circle at bottom, rgba(147,51,234,0.16), transparent 38%);
    `,

    headerPanel: `
      background:
        linear-gradient(180deg, rgba(30,41,59,0.88), rgba(15,23,42,0.86));
      border: 1px solid rgba(250,204,21,0.30);
      box-shadow: 0 0 25px rgba(250,204,21,0.12);
    `,

    goldTitle: `
      color: #facc15;
      text-shadow: 0 0 14px rgba(250,204,21,0.35);
    `,

    mutedText: `
      color: #cbd5e1;
    `,

    buttonStyle: function () {
      return `
        background: linear-gradient(135deg, #475569, #1e293b);
        color: #f8fafc;
        box-shadow: 0 0 18px rgba(148,163,184,0.18);
      `;
    },

    worldColor: function () {
      return {
        border: "rgba(148,163,184,0.25)",
        glow: "rgba(148,163,184,0.12)",
        fill: "linear-gradient(to right, #94a3b8, #475569)"
      };
    }
  };
}

function getMapWorldColor(worldId) {
  const theme = getMapTheme();

  return theme.worldColor
    ? theme.worldColor(worldId)
    : {
        border: "rgba(148,163,184,0.25)",
        glow: "rgba(148,163,184,0.12)",
        fill: "linear-gradient(to right, #94a3b8, #475569)"
      };
}

/* =========================================================
   WORLD DATA HELPERS
========================================================= */
function getMapWorldList() {
  if (window.AQ_MODEL?.helpers?.getWorldList) {
    return window.AQ_MODEL.helpers.getWorldList();
  }

  return [
    {
      id: "numbers",
      title: "🌳 Prime Verba",
      shortTitle: "Prime Verba",
      subtitle: "Bilangan",
      cardImg: "assets/map/ikon_island_numbers.png",
      islandImg: "assets/map/island_numbers.png",
      totalStages: 17,
      unlockType: "always",
      unlockMessage: "Area awal yang langsung terbuka."
    },
    {
      id: "algebra",
      title: "⚖️ Algebrum",
      shortTitle: "Algebrum",
      subtitle: "Aljabar",
      cardImg: "assets/map/island_algebra.png",
      islandImg: "assets/map/island_algebra.png",
      totalStages: 17,
      unlockType: "worldStage",
      unlockWorld: "numbers",
      unlockStage: 8,
      unlockMessage: "Terbuka setelah Prime Verba mencapai Stage 8."
    },
    {
      id: "geometry",
      title: "📐 Geometria",
      shortTitle: "Geometria",
      subtitle: "Bangun dan Ruang",
      cardImg: "assets/map/island_geometry.png",
      islandImg: "assets/map/island_geometry.png",
      totalStages: 17,
      unlockType: "comingSoon",
      unlockMessage: "Area ini masih dalam pengembangan."
    },
    {
      id: "data",
      title: "📊 Statica",
      shortTitle: "Statica",
      subtitle: "Data dan Peluang",
      cardImg: "assets/map/island_data.png",
      islandImg: "assets/map/island_data.png",
      totalStages: 17,
      unlockType: "comingSoon",
      unlockMessage: "Area ini masih dalam pengembangan."
    }
  ];
}

function getMapWorld(worldId) {
  if (window.AQ_MODEL?.helpers?.getWorld) {
    const world = window.AQ_MODEL.helpers.getWorld(worldId);
    if (world) return world;
  }

  return getMapWorldList().find(function (world) {
    return world.id === worldId;
  }) || null;
}

function getMapProgress(worldId) {
  const gs = window.gameState || {};
  const world = getMapWorld(worldId);
  const total = world?.totalStages || 17;

  if (window.AQ_MODEL?.helpers?.getProgress) {
    return window.AQ_MODEL.helpers.getProgress(gs, worldId);
  }

  return gs.progress?.[worldId] || {
    done: 0,
    total: total,
    completedStage: 0,
    highestUnlockedStage: worldId === "numbers" ? 1 : 0
  };
}

function getMapProgressPercent(worldId) {
  const gs = window.gameState || {};

  if (window.AQ_MODEL?.helpers?.getWorldPercent) {
    return window.AQ_MODEL.helpers.getWorldPercent(gs, worldId);
  }

  const progress = getMapProgress(worldId);
  const world = getMapWorld(worldId);
  const done = progress.done ?? progress.completedStage ?? 0;
  const total = progress.total || world?.totalStages || 17;

  return total ? Math.min(100, Math.floor((done / total) * 100)) : 0;
}

function isMapWorldUnlocked(worldId) {
  const gs = window.gameState || {};
  const world = getMapWorld(worldId);

  if (window.isWorldUnlocked) {
    return window.isWorldUnlocked(gs, worldId);
  }

  if (window.AQ_MODEL?.helpers?.isWorldUnlockedByModel) {
    return window.AQ_MODEL.helpers.isWorldUnlockedByModel(gs, worldId);
  }

  if (!world) return false;

  if (world.unlockType === "always") return true;
  if (world.unlockType === "comingSoon") return false;

  if (world.unlockType === "worldStage") {
    const requiredWorld = world.unlockWorld;
    const requiredStage = world.unlockStage;
    const progress = getMapProgress(requiredWorld);

    return (progress.highestUnlockedStage || 0) >= requiredStage;
  }

  return worldId === "numbers";
}

function getWorldLockedText(worldId) {
  const world = getMapWorld(worldId);

  if (world?.unlockMessage) {
    if (world.unlockType === "comingSoon") {
      return "🚧 Coming Soon";
    }

    return `🔒 ${world.unlockMessage}`;
  }

  if (worldId === "algebra") {
    return "🔒 Terbuka setelah Prime Verba mencapai Stage 8";
  }

  if (worldId === "geometry" || worldId === "data") {
    return "🚧 Coming Soon";
  }

  return "🔒 Terkunci";
}

/* =========================================================
   RENDER MAP SCREEN
========================================================= */
window.renderMapScreen = function () {
  const theme = getMapTheme();

  if (currentIslandView) {
    return renderIslandView(currentIslandView);
  }

  const worlds = getMapWorldList();

  return `
    <div 
      class="p-4 fade-in"
      style="${theme.shell}"
    >
      <div 
        class="glass-panel text-center mb-3"
        style="${theme.headerPanel}"
      >
        <h2 
          id="mapTitle" 
          class="text-xl font-bold"
          style="${theme.goldTitle}"
        >
          🌍 Pilih Area Petualangan
        </h2>

        <p 
          id="mapSubtitle" 
          class="text-sm"
          style="${theme.mutedText}"
        >
          Geser ke kiri atau kanan untuk memilih area
        </p>
      </div>

      <div id="mapWrapper" class="map-wrapper">

        <div 
          id="mapTopbar" 
          class="map-topbar"
          style="
            background: rgba(15,23,42,0.78);
            border-bottom: 1px solid rgba(96,165,250,0.16);
            backdrop-filter: blur(10px);
          "
        >
          <button 
            id="mapBackBtn" 
            class="btn small-btn" 
            style="${theme.buttonStyle("gray")}"
            onclick="goTo('home')"
          >
            ⬅️
          </button>
        </div>

        <div id="worldScroll" class="world-scroll">
          ${
            worlds.map(function (world) {
              return renderWorldCard(world);
            }).join("")
          }
        </div>

      </div>
    </div>
  `;
};

function renderWorldCard(world) {
  if (window.ensureStageProgress) {
    window.ensureStageProgress(window.gameState);
  }

  const worldId = world.id;
  const color = getMapWorldColor(worldId);
  const isActive = isMapWorldUnlocked(worldId);
  const progress = getMapProgress(worldId);
  const percent = getMapProgressPercent(worldId);

  const done = progress.done ?? progress.completedStage ?? 0;
  const total = progress.total || world.totalStages || 17;
  const lockedText = getWorldLockedText(worldId);

  const cardVisualStyle = isActive
    ? `
      border: 1px solid ${color.border};
      box-shadow: 0 0 24px ${color.glow};
      cursor: pointer;
    `
    : `
      border: 1px solid rgba(148,163,184,0.20);
      box-shadow: 0 0 16px rgba(15,23,42,0.45);
      filter: grayscale(0.80);
      opacity: 0.62;
      cursor: not-allowed;
    `;

  return `
    <div 
      id="worldCard-${worldId}"
      class="world-card"
      style="${cardVisualStyle}"
      ${isActive 
        ? `onclick="openIsland('${worldId}')"` 
        : `onclick="showLockedWorldMessage('${worldId}')"`} 
    >

      <img 
        src="${world.cardImg}" 
        class="world-img"
        alt="${world.shortTitle || world.title}"
      >

      <div 
        id="worldTitle-${worldId}" 
        class="world-title"
        style="
          color:#f8fafc;
          text-shadow: 0 0 12px rgba(0,0,0,0.9);
        "
      >
        ${world.title}
      </div>

      ${
        isActive
          ? `
            <div id="progressBox-${worldId}" class="progress-box">
              <div 
                class="progress-bar"
                style="background: rgba(15,23,42,0.85); height: 10px;"
              >
                <div 
                  class="progress-fill" 
                  style="
                    width:${percent}%;
                    background: ${color.fill};
                    box-shadow: 0 0 10px ${color.border};
                  ">
                </div>
              </div>

              <div 
                class="progress-text"
                style="color:#e2e8f0;"
              >
                ${done} / ${total} stage
              </div>
            </div>
          `
          : `
            <div 
              id="comingSoon-${worldId}" 
              class="coming-soon-badge"
              style="
                background: linear-gradient(135deg, #475569, #1e293b);
                color: #f8fafc;
                border: 1px solid rgba(148,163,184,0.25);
              "
            >
              ${lockedText}
            </div>
          `
      }

    </div>
  `;
}

/* =========================================================
   RENDER ISLAND VIEW
========================================================= */
function renderIslandView(worldId) {
  const theme = getMapTheme();
  const world = getMapWorld(worldId);

  const islandImg = world?.islandImg || "";
  const zoneTitle = world?.title || "🌍 Zona Petualangan";
  const zoneSubtitle = world?.subtitle || "Pilih stage untuk memulai";

  const color = getMapWorldColor(worldId);

  const headerZone = `
    <div 
      id="zoneHeader" 
      class="zone-header glass-panel text-center"
      style="
        ${theme.headerPanel}
        border-color: ${color.border};
        box-shadow: 0 0 24px ${color.glow};
      "
    >
      <h2 
        class="text-lg font-bold"
        style="${theme.goldTitle}"
      >
        ${zoneTitle}
      </h2>

      <p 
        class="text-sm"
        style="${theme.mutedText}"
      >
        ${zoneSubtitle}
      </p>

      <button 
        id="islandBackBtn" 
        class="btn small-btn back-btn" 
        style="${theme.buttonStyle("gray")}"
        onclick="closeIsland()"
      >
        ⬅️
      </button>
    </div>
  `;

  requestAnimationFrame(function () {
    initHorizontalMap(worldId);
  });

  return `
    <div 
      id="islandWrapper" 
      class="map-wrapper"
      style="${theme.shell}"
    >

      <div id="islandHeaderLayer">
        ${headerZone}
      </div>

      <div id="worldMapScroller" class="world-map-scroller">
        <div id="worldMap" class="map-full">
          <img 
            src="${islandImg}" 
            class="map-bg"
            alt="${world?.shortTitle || zoneTitle}"
          >

          <div id="stageNodes">
            ${getNodesByWorld(worldId)}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   WORLD NAVIGATION
========================================================= */
window.openIsland = function (worldId) {
  if (window.ensureStageProgress) {
    window.ensureStageProgress(window.gameState);
  }

  if (!isMapWorldUnlocked(worldId)) {
    showLockedWorldMessage(worldId);
    return;
  }

  currentIslandView = worldId;

  if (window.gameState) {
    window.gameState.selectedWorld = worldId;
  }

  window.render();
};

window.closeIsland = function () {
  currentIslandView = null;
  window.render();
};

window.showLockedWorldMessage = function (worldId) {
  const world = getMapWorld(worldId);

  if (world?.unlockType === "comingSoon") {
    alert(`${world.shortTitle || world.title} belum tersedia. Area ini masih dalam pengembangan.`);
    return;
  }

  if (world?.unlockMessage) {
    alert(world.unlockMessage);
    return;
  }

  if (worldId === "algebra") {
    alert("Algebrum masih terkunci. Selesaikan Prime Verba hingga mencapai Stage 8 terlebih dahulu.");
    return;
  }

  alert("Area ini masih terkunci.");
};

window.showLockedStageMessage = function (worldId, level) {
  const world = getMapWorld(worldId);
  const worldName = world?.shortTitle || worldId;

  alert(`Stage ${level} masih terkunci. Selesaikan stage sebelumnya di ${worldName} terlebih dahulu.`);
};

window.returnToMapWithWorld = function () {
  const gs = window.gameState || {};

  currentIslandView = gs.selectedWorld || "numbers";

  window.goTo("map");
};

/* =========================================================
   NODE COORDINATE SYSTEM
========================================================= */
function toMapCoords(x, y) {
  return {
    x: (x / BASE_COORD_WIDTH) * MAP_WIDTH,
    y: (y / BASE_COORD_HEIGHT) * MAP_HEIGHT
  };
}

function transformNodes(nodes) {
  return nodes.map(function (node) {
    const point = toMapCoords(node.x, node.y);

    return {
      ...node,
      x: point.x,
      y: point.y
    };
  });
}

function getNodesByWorld(worldId) {
  const nodeSets = {
    numbers: [
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
    ],

    algebra: [
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
    ],

    geometry: [
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
    ],

    data: [
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
    ]
  };

  const rawNodes = nodeSets[worldId] || [];

  if (!rawNodes.length) return "";

  const nodes = transformNodes(rawNodes);

  return renderPaths(nodes) + renderNodes(nodes, worldId);
}

function getNode1Coords(worldId) {
  const node1Coords = {
    numbers: { x: 170, y: 760 },
    algebra: { x: 170, y: 820 },
    geometry: { x: 220, y: 520 },
    data: { x: 220, y: 520 }
  };

  const rawNode1 = node1Coords[worldId] || node1Coords.numbers;

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

function getNodeType(level, isBoss) {
  if (isBoss) return "boss-node";
  if (level % 4 === 0) return "mini-node";
  return "normal-node";
}

function renderNode(level, top, left, isBoss = false, worldId) {
  const unlocked = window.isStageUnlocked
    ? window.isStageUnlocked(window.gameState, worldId, level)
    : (worldId === "numbers" && level === 1);

  const typeClass = getNodeType(level, isBoss);
  const size = getNodeSize(level, isBoss);
  const fontSize = getNodeFontSize(level, isBoss);

  return `
    <div 
      id="node-${worldId}-${level}"
      class="node ${typeClass} ${unlocked ? "" : "locked-node"}"
      style="
        top:${top}px; 
        left:${left}px;
        width:${size}px;
        height:${size}px;
        font-size:${fontSize}px;
      "
      ${unlocked 
        ? `onclick="startBattle('${worldId}','default', ${level})"` 
        : `onclick="showLockedStageMessage('${worldId}', ${level})"`} 
    >
      ${unlocked ? (isBoss ? "👑" : level) : "🔒"}
    </div>
  `;
}

function renderNodes(nodes, worldId) {
  return nodes.map(function (node) {
    return renderNode(node.level, node.y, node.x, node.boss, worldId);
  }).join("");
}

/* =========================================================
   PATH LINE SYSTEM
========================================================= */
function renderPaths(nodes) {
  let html = "";

  for (let i = 0; i < nodes.length - 1; i++) {
    const currentNode = nodes[i];
    const nextNode = nodes[i + 1];

    html += renderPathLine(
      currentNode.x,
      currentNode.y,
      nextNode.x,
      nextNode.y,
      currentNode.level,
      nextNode.level,
      currentNode.boss,
      nextNode.boss
    );
  }

  return html;
}

function getRadiusByLevel(level, isBoss) {
  return getNodeSize(level, isBoss) / 2;
}

function renderPathLine(x1, y1, x2, y2, lvl1, lvl2, boss1, boss2) {
  const r1 = getRadiusByLevel(lvl1, boss1);
  const r2 = getRadiusByLevel(lvl2, boss2);

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

  const length = Math.sqrt(newDx * newDx + newDy * newDy);
  const deg = angle * 180 / Math.PI;

  return `
    <div 
      class="path-line"
      style="
        top:${startY}px;
        left:${startX}px;
        width:${length}px;
        transform: rotate(${deg}deg);
      ">
    </div>
  `;
}

/* =========================================================
   MAP SCROLL AND SCALE SYSTEM
========================================================= */
function initHorizontalMap(worldId) {
  const scroller = document.getElementById("worldMapScroller");
  const map = document.getElementById("worldMap");

  if (!scroller || !map) return;

  const availableWidth = scroller.clientWidth;
  const availableHeight = scroller.clientHeight;

  const scaleX = availableWidth / MAP_WIDTH;
  const scaleY = availableHeight / MAP_HEIGHT;

  const fitScale = Math.min(scaleX, scaleY);
  const fixedScale = fitScale * ISLAND_INITIAL_ZOOM;

  map.style.width = `${MAP_WIDTH}px`;
  map.style.height = `${MAP_HEIGHT}px`;
  map.style.transformOrigin = "top left";
  map.style.transform = `scale(${fixedScale})`;

  const scaledWidth = MAP_WIDTH * fixedScale;
  const scaledHeight = MAP_HEIGHT * fixedScale;

  scroller.style.setProperty("--scaled-map-width", `${scaledWidth}px`);
  scroller.style.setProperty("--scaled-map-height", `${Math.max(scaledHeight, availableHeight)}px`);

  map.style.left = "0px";

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

/* =========================================================
   UTILITY
========================================================= */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

window.MapDragState = window.MapDragState || {
  boundMap: null,
  handlers: null,
  isDragging: false,
  startX: 0,
  startY: 0
};