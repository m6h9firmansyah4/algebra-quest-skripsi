// ======================================================
// main.js
// VERSI RAPIH + KATEGORI
// ======================================================

// ======================================================
// 1. IMPORTS
// ======================================================
import { auth, provider, db } from "./firebase-config.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { gameState, defaultPlayerStats } from "./engine/gameState.js";
import "./screens/profile.js";
import "./engine/guideSystem.js";


// ======================================================
// 2. GLOBAL BINDING
// ======================================================
window.gameState = gameState;
const defaultProgress = {
  numbers: {
    done: 0,
    total: 17,
    completedStage: 0,
    highestUnlockedStage: 1
  },

  algebra: {
    done: 0,
    total: 17,
    completedStage: 0,
    highestUnlockedStage: 0
  },

  geometry: {
    done: 0,
    total: 17,
    completedStage: 0,
    highestUnlockedStage: 0
  },

  data: {
    done: 0,
    total: 17,
    completedStage: 0,
    highestUnlockedStage: 0
  }
};

function cloneDefaultProgress() {
  return JSON.parse(JSON.stringify(defaultProgress));
}

const defaultSettings = {
  sound: true,
  music: true,
  theme: "default",
  musicTrack: "default"
};

const defaultScoreStats = {
  points: 0,
  totalScore: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  totalWrong: 0,
  totalBasePoints: 0,
  totalSpeedBonus: 0,
  totalStreakBonus: 0
};

// ======================================================
// 3. AUDIO ENGINE
// ======================================================
window.sfx = {
  sounds: {},
  currentMusic: null,

  init: function() {
    this.sounds = {
      click: new Audio("assets/sfx/click1.mp3"),
      click2: new Audio("assets/sfx/click2.mp3"),
      win: new Audio("assets/sfx/win.mp3"),
      lose: new Audio("assets/sfx/lose.mp3"),
      battle: new Audio("assets/sfx/battlesfx.mp3"),
      theme: new Audio("assets/sfx/themesfx.mp3"),
    };

    this.sounds.theme.loop = true;
    this.sounds.battle.loop = true;
  },

  playMusic: function(name) {
    if (!window.gameState.settings.music) return;

    // 🔥 CEK: kalau sudah diputar, jangan ulang
    if (this.currentMusic === name) return;

    this.currentMusic = name;

    Object.values(this.sounds).forEach(s => {
      if (s.loop) s.pause();
    });

    const music = this.sounds[name];
    if (music) {
      music.currentTime = 0;
      music.play().catch(() => {}); // Cegah error autoplay
    }
  },

  stopMusic: function() {
    Object.values(this.sounds).forEach(s => {
      if (s.loop) s.pause();
    });

    this.currentMusic = null;
  },

  correct: function() {
    window.sfx.sounds.click.currentTime = 0;
    window.sfx.sounds.click.play();
  },

  wrong: function() {
    window.sfx.sounds.lose.currentTime = 0;
    window.sfx.sounds.lose.play();
  },

  win: function() {
    window.sfx.sounds.win.currentTime = 0;
    window.sfx.sounds.win.play();
  },

  click: function() {
    window.sfx.sounds.click2.currentTime = 0;
    window.sfx.sounds.click2.play();
  },

  stopMusic: function() {
    Object.values(this.sounds).forEach(s => {
      if (s.loop) s.pause();
    });
  }
};

window.sfx.init();

document.addEventListener("click", () => {
  if (window.gameState.settings.music) {
    window.sfx.playMusic(
      window.gameState.screen === "battle" ? "battle" : "theme"
    );
  }
}, { once: true });


// ======================================================
// 4. ICONS
// ======================================================
window.Icons = {
  BookOpen: () => '📖',
  Star: () => '⭐',
  Heart: () => '❤️',
  Sword: () => '⚔️',
  Shield: () => '🛡️',
  Trophy: () => '🏆',
  ArrowLeft: () => '⬅️',
  Save: () => '💾',
  LogOut: () => '🚪',
  Zap: () => '⚡',
  Lock: () => '🔒'
};


// ======================================================
// 5. HELPER FUNCTIONS
// ======================================================

// Fungsi Helper: Load Data Aman
function safeLoadUserData(dbStats) {
  if (!dbStats) return { ...defaultPlayerStats };

  return {
    ...defaultPlayerStats,
    ...dbStats,

    hp: dbStats.hp ?? defaultPlayerStats.hp,
    maxHp: dbStats.maxHp ?? defaultPlayerStats.maxHp,
    attack: dbStats.attack ?? defaultPlayerStats.attack,
    defense: dbStats.defense ?? defaultPlayerStats.defense,
    exp: dbStats.exp ?? defaultPlayerStats.exp,
    expToNext: dbStats.expToNext ?? defaultPlayerStats.expToNext,
    level: dbStats.level ?? defaultPlayerStats.level,

    // Score fallback
    points: dbStats.points ?? dbStats.totalScore ?? defaultPlayerStats.points ?? 0,
    totalScore: dbStats.totalScore ?? dbStats.points ?? defaultPlayerStats.totalScore ?? 0,
    bestStreak: dbStats.bestStreak ?? defaultPlayerStats.bestStreak ?? 0,
    totalAnswered: dbStats.totalAnswered ?? defaultPlayerStats.totalAnswered ?? 0,
    totalCorrect: dbStats.totalCorrect ?? defaultPlayerStats.totalCorrect ?? 0,
    totalWrong: dbStats.totalWrong ?? defaultPlayerStats.totalWrong ?? 0,
    totalBasePoints: dbStats.totalBasePoints ?? defaultPlayerStats.totalBasePoints ?? 0,
    totalSpeedBonus: dbStats.totalSpeedBonus ?? defaultPlayerStats.totalSpeedBonus ?? 0,
    totalStreakBonus: dbStats.totalStreakBonus ?? defaultPlayerStats.totalStreakBonus ?? 0,

    // LifePoints fallback
    lifePoints: dbStats.lifePoints ?? 5,
    maxLifePoints: dbStats.maxLifePoints ?? 5,
    lifePointRegenMs: dbStats.lifePointRegenMs ?? (3 * 60 * 60 * 1000),
    nextLifeAt: dbStats.nextLifeAt ?? null
  };
}

function safeLoadProgress(dbProgress) {
  const progress = {
    numbers: {
      ...defaultProgress.numbers,
      ...(dbProgress?.numbers || {})
    },

    algebra: {
      ...defaultProgress.algebra,
      ...(dbProgress?.algebra || {})
    },

    geometry: {
      ...defaultProgress.geometry,
      ...(dbProgress?.geometry || {})
    },

    data: {
      ...defaultProgress.data,
      ...(dbProgress?.data || {})
    }
  };

  // Kompatibilitas data lama
  Object.keys(progress).forEach(world => {
    const p = progress[world];

    if (p.completedStage === undefined) {
      p.completedStage = p.done || 0;
    }

    if (p.highestUnlockedStage === undefined) {
      if (world === "numbers") {
        p.highestUnlockedStage = Math.max(1, p.completedStage + 1);
      } else {
        p.highestUnlockedStage = 0;
      }
    }

    p.done = p.completedStage;
    p.total = 17;
  });

  // Algebrum terbuka ketika Prime Verba sudah mencapai stage 8
  if (progress.numbers.highestUnlockedStage >= 8) {
    progress.algebra.highestUnlockedStage = Math.max(
      progress.algebra.highestUnlockedStage,
      1
    );
  }

  return progress;
}

function safeLoadSettings(dbSettings) {
  return {
    ...defaultSettings,
    ...(dbSettings || {})
  };
}

function applyLoadedUserData(data, user) {
  window.gameState.currentUser = data?.username || user.displayName;
  window.gameState.player = safeLoadUserData(data?.stats);
  window.gameState.progress = safeLoadProgress(data?.progress);
  window.gameState.settings = safeLoadSettings(data?.settings);
  window.gameState.title = data?.title || "Pemula";

  window.gameState.history = Array.isArray(data?.history)
    ? data.history
    : [];

  window.gameState.lastPlayed = data?.lastPlayed || null;
}

// ======================================================
// 6. AUTHENTICATION
// ======================================================

// LOGIN
window.handleLogin = async function() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Login sukses:", user.displayName);

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      applyLoadedUserData(data, user);
    } else {
      window.gameState.currentUser = user.displayName;
      window.gameState.player = {
        ...defaultPlayerStats,
        name: user.displayName,
        lifePoints: 5,
        maxLifePoints: 5,
        lifePointRegenMs: 3 * 60 * 60 * 1000,
        nextLifeAt: null,
        ...defaultScoreStats
      };

      window.gameState.progress = cloneDefaultProgress();
      window.gameState.settings = { ...defaultSettings };
      window.gameState.title = "Pemula";

      await window.saveProgress(window.gameState);
    }

    window.gameState.screen = 'home';
    window.gameState.error = '';
    window.render();

  } catch (error) {
    console.error(error);
    window.gameState.error = "Gagal Login: " + error.message;
    window.render();
  }
};

// LOGOUT
window.handleLogout = async function() {
  await signOut(auth);
  window.location.reload();
};


// ======================================================
// 7. SAVE / RESET PROGRESS
// ======================================================

// SAVE GAME
window.saveProgress = async function(gs, options = {}) {
  const silent = options?.silent === true;

  if (!auth.currentUser) {
    if (!silent) alert("Kamu belum login!");
    return;
  }

  try {
    if (window.updateLifePoints) {
      window.updateLifePoints(gs);
    }

    const userRef = doc(db, "users", auth.currentUser.uid);

    const saveData = {
      username: gs.currentUser || auth.currentUser.displayName,
      email: auth.currentUser.email,

      stats: {
        ...gs.player
      },

      progress: {
        ...gs.progress
      },

      settings: {
        ...gs.settings
      },

      title: gs.title || "Pemula",

      history: Array.isArray(gs.history)
        ? gs.history.slice(-100)
        : [],

      lastPlayed: gs.lastPlayed || null,

      lastSaved: serverTimestamp()
    };

    await setDoc(userRef, saveData, { merge: true });

    if (!silent) {
      gs.feedback = "💾 Progress berhasil disimpan!";
      window.render();
    }

  } catch (e) {
    console.error("Gagal save:", e);

    if (!silent) {
      gs.feedback = "❌ Gagal menyimpan progress";
      window.render();
    }
  }
};

window.resetProgress = async function() {
  if (!confirm("Yakin ingin menghapus semua progress?")) return;

  const gs = window.gameState;

  const resetPlayer = {
    ...defaultPlayerStats,
    name: gs.currentUser || auth.currentUser?.displayName || "Hero",

    // Pastikan LifePoints kembali penuh
    lifePoints: 5,
    maxLifePoints: 5,
    lifePointRegenMs: 3 * 60 * 60 * 1000,
    nextLifeAt: null,

    ...defaultScoreStats
  };

  gs.player = resetPlayer;
  gs.progress = cloneDefaultProgress();
  gs.settings = { ...defaultSettings };
  gs.title = "Pemula";

    gs.enemy = null;
    gs.currentQuestion = null;
    gs.userAnswer = "";
    gs.feedback = "";
    gs.battleLog = [];
    gs.history = [];
    gs.lastPlayed = null;
    gs.screen = "home";
  if (auth.currentUser) {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);

      await setDoc(userRef, {
        username: gs.currentUser || auth.currentUser.displayName,
        email: auth.currentUser.email,
        stats: gs.player,
        progress: gs.progress,
        settings: gs.settings,
        title: gs.title,

        history: [],
        lastPlayed: null,

        lastReset: serverTimestamp(),
        lastSaved: serverTimestamp()
      }, { merge: true });

      try {
          localStorage.removeItem("AQ_HISTORY");
          localStorage.removeItem("AQ_LAST_PLAYED");
        } catch (error) {
          console.warn("Gagal menghapus backup history localStorage:", error);
        }

      gs.feedback = "✅ Progress berhasil direset dan disimpan!";
    } catch (e) {
      console.error("Reset gagal:", e);
      gs.feedback = "❌ Reset gagal disimpan ke Firebase!";
    }
  }

  window.render();
};

// ======================================================
// 8. LEADERBOARD SYSTEM
// ======================================================
window.leaderboardState = {
  loading: false,
  loaded: false,
  rows: [],
  error: ""
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCompletedStageTotal(progress = {}) {
  return Object.values(progress || {}).reduce((total, worldProgress) => {
    return total + Number(
      worldProgress?.completedStage ??
      worldProgress?.done ??
      0
    );
  }, 0);
}

window.loadLeaderboard = async function(force = false) {
  const state = window.leaderboardState;

  if (state.loading) return;
  if (state.loaded && !force) return;

  state.loading = true;
  state.error = "";

  try {
    const snap = await getDocs(collection(db, "users"));

    const rows = snap.docs.map(docSnap => {
      const data = docSnap.data() || {};
      const stats = data.stats || {};
      const progress = data.progress || {};

      return {
        uid: docSnap.id,
        username: data.username || stats.name || "Player",
        title: data.title || "Pemula",
        points: Number(stats.points ?? stats.totalScore ?? 0),
        level: Number(stats.level ?? 1),
        bestStreak: Number(stats.bestStreak ?? 0),
        totalCorrect: Number(stats.totalCorrect ?? 0),
        completedStage: getCompletedStageTotal(progress)
      };
    });

    state.rows = rows
      .sort((a, b) =>
        b.points - a.points ||
        b.completedStage - a.completedStage ||
        b.level - a.level ||
        b.bestStreak - a.bestStreak
      )
      .map((row, index) => ({
        ...row,
        rank: index + 1
      }));

    state.loaded = true;

  } catch (error) {
    console.error("Gagal mengambil leaderboard:", error);
    state.error = "Leaderboard belum bisa dimuat. Pastikan Firestore Rules mengizinkan user login membaca koleksi users.";
  } finally {
    state.loading = false;
    window.render();
  }
};

window.renderLeaderboardScreen = function() {
  const state = window.leaderboardState;
  const currentUid = auth.currentUser?.uid;

  if (!state.loaded && !state.loading) {
    setTimeout(() => window.loadLeaderboard(), 0);
  }

  const rowsHtml = state.rows.length
    ? state.rows.map(row => {
      const isCurrentUser = row.uid === currentUid;
      const medal =
        row.rank === 1 ? "🥇" :
        row.rank === 2 ? "🥈" :
        row.rank === 3 ? "🥉" :
        `#${row.rank}`;

      return `
        <div class="p-3 rounded-xl border ${
          isCurrentUser
            ? "border-yellow-400 bg-yellow-400/10"
            : "border-slate-700 bg-slate-900/50"
        }">
          <div class="flex justify-between gap-3 items-center">

            <div class="flex items-center gap-3 min-w-0">
              <div class="text-xl font-bold w-10 text-center">
                ${medal}
              </div>

              <div class="min-w-0">
                <div class="font-bold text-yellow-300 truncate">
                  ${escapeHtml(row.username)}
                  ${isCurrentUser ? "<span class='text-xs text-green-300'>(Kamu)</span>" : ""}
                </div>

                <div class="text-xs text-gray-400">
                  ${escapeHtml(row.title)} • Lv.${row.level} • Stage selesai: ${row.completedStage}
                </div>
              </div>
            </div>

            <div class="text-right shrink-0">
              <div class="font-bold text-yellow-400">
                💎 ${row.points}
              </div>
              <div class="text-xs text-gray-400">
                🔥 Best ${row.bestStreak} • ✅ ${row.totalCorrect}
              </div>
            </div>

          </div>
        </div>
      `;
    }).join("")
    : `
      <div class="text-center text-gray-400 p-6">
        Belum ada data peringkat. Mainkan battle dan simpan progress terlebih dahulu.
      </div>
    `;

  return `
    <div class="p-6 max-w-2xl mx-auto fade-in">

      <div class="glass-panel mb-4 p-4 text-center">
        <h1 class="text-2xl font-bold text-yellow-400">
          🏆 Leaderboard
        </h1>
        <p class="text-sm text-gray-300 mt-1">
          Peringkat siswa berdasarkan total poin Algebra Quest.
        </p>
      </div>

      <div class="flex gap-2 mb-4">
        <button onclick="goTo('home')" class="btn btn-gray flex-1">
          ⬅️ Home
        </button>

        <button onclick="loadLeaderboard(true)" class="btn btn-blue flex-1">
          🔄 Refresh
        </button>
      </div>

      <div class="glass-panel p-4">
        ${
          state.loading
            ? `<div class="text-center text-gray-300 p-6">Memuat leaderboard...</div>`
            : state.error
              ? `<div class="text-center text-red-300 p-6">${escapeHtml(state.error)}</div>`
              : `<div class="space-y-3">${rowsHtml}</div>`
        }
      </div>

    </div>
  `;
};

// ======================================================
// 9. NAVIGATION & THEME
// ======================================================

// HELPER NAVIGASI SCREEN
window.goTo = function(screen) {
  window.gameState.screen = screen;

    if (screen === "leaderboard" && window.leaderboardState) {
        window.leaderboardState.loaded = false;
      }

    if (screen === "stage") {
        window.gameState.selectedWorld = null;
        window.gameState.selectedArea = null;
        window.gameState.selectedStage = null;
        window.gameState.quest = null;
        window.gameState.learningPhase = null;
      }

  window.render();
};

window.setTheme = function(theme) {
  const gs = window.gameState;
  gs.settings.theme = theme;

  document.body.className = theme + "-theme";

  window.render();
};


// ======================================================
// 10. BACKGROUND MUSIC MANAGER
// ======================================================
window.bgm = {
  audio: null,

  play(track) {
    if (this.audio) this.audio.pause();

    this.audio = new Audio(`assets/music/${track}.mp3`);
    this.audio.loop = true;

    if (window.gameState.settings.music) {
      this.audio.play();
    }
  },

  stop() {
    if (this.audio) this.audio.pause();
  }
};

window.toggleMusic = function() {
  const gs = window.gameState;

  gs.settings.music = !gs.settings.music;

  if (gs.settings.music) {
    // 🔥 reset supaya bisa play ulang
    window.sfx.currentMusic = null;

    if (gs.screen === "battle") {
      window.sfx.playMusic("battle");
    } else {
      window.sfx.playMusic("theme");
    }
  } else {
    window.sfx.stopMusic();
  }

  window.render();
};

window.toggleSound = function() {
  const gs = window.gameState;

  gs.settings.sound = !gs.settings.sound;

  if (gs.settings.sound) {
    window.sfx.click();
  }

  window.render();
};


// ======================================================
// 11. WELCOME SCREEN & INFO MODAL
// ======================================================
window.renderWelcomeScreen = function() {
  return `
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="glass-panel text-center max-w-md w-full fade-in">
        <div class="text-6xl mb-4 animate-bounce">🏰</div>
        <h1 class="text-4xl font-bold mb-2 text-yellow-400">Algebra Quest</h1>
        <p class="text-gray-300 mb-8">Jelajahi dunia matematika & kalahkan monster!</p>
        
        ${window.gameState.error ? `<div class="bg-red-500/80 text-white p-3 rounded mb-4 text-sm">${window.gameState.error}</div>` : ''}

        <div class="space-y-4">
          <button onclick="handleLogin()" class="btn btn-blue w-full py-3 text-lg shadow-lg flex items-center justify-center gap-2">
            <span>🚀</span> Mulai Petualangan (Google)
          </button>

          <button class="info-btn" onclick="openGameInfo()">
            ℹ️ Tentang Game
          </button>

          <div id="gameInfoModal" class="game-info-modal hidden" onclick="closeGameInfo()">
            <div class="game-info-box" onclick="event.stopPropagation()">
              <h2>📘 Tentang Algebra Quest</h2>

              <div class="game-info-content">
                <p>
                  Algebra Quest adalah game edukasi matematika untuk membantu siswa belajar
                  sambil bermain.
                </p>

                <h3>🌍 Isi Game</h3>
                <ul>
                  <li><b>Dunia Bilangan</b>: bilangan bulat, pecahan, FPB, KPK, pangkat, dan akar.</li>
                  <li><b>Dunia Aljabar</b>: rasio, skala, bentuk aljabar, PLSV, fungsi, gradien, dan SPLDV.</li>
                </ul>

                <h3>🎮 Cara Bermain</h3>
                <ul>
                  <li>Pilih dunia yang ingin dimainkan.</li>
                  <li>Pilih stage pada peta.</li>
                  <li>Jawab soal dengan benar untuk menyerang musuh.</li>
                  <li>Selesaikan stage untuk melanjutkan petualangan.</li>
                </ul>

                <h3>🎯 Tujuan</h3>
                <p>
                  Game ini dirancang agar belajar matematika menjadi lebih menarik,
                  menantang, dan menyenangkan.
                </p>
              </div>

              <button class="close-info-btn" onclick="closeGameInfo()">Tutup</button>
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-4">Versi Skripsi v1.0 • Universitas Negeri Malang</p>
        </div>
      </div>
    </div>
  `;
};

window.openGameInfo = function() {
  document.getElementById("gameInfoModal").classList.remove("hidden");
};

window.closeGameInfo = function() {
  document.getElementById("gameInfoModal").classList.add("hidden");
};


// ======================================================
// 12. SYSTEM STARTUP
// ======================================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      applyLoadedUserData(data, user);
    } else {
      window.gameState.currentUser = user.displayName;
      window.gameState.player = {
        ...defaultPlayerStats,
        name: user.displayName,
        lifePoints: 5,
        maxLifePoints: 5,
        lifePointRegenMs: 3 * 60 * 60 * 1000,
        nextLifeAt: null,
        ...defaultScoreStats
      };

      window.gameState.progress = cloneDefaultProgress();
      window.gameState.settings = { ...defaultSettings };
      window.gameState.title = "Pemula";

      await window.saveProgress(window.gameState);
    }

    window.gameState.screen = 'home';
  } else {
    window.gameState.screen = 'welcome';
  }

  window.render();
});


// ======================================================
// 13. MAIN RENDERER
// ======================================================
window.render = function() {
  const app = document.getElementById('app');
  let html = '';

  try {
    switch (window.gameState.screen) {
      case 'home':
        html = window.renderHomeScreen();
        break;
      case 'tutorial':
        html = window.renderTutorialScreen();
        break;
      case 'map':
        html = window.renderMapScreen();
        break;
      case 'stage':
        html = window.renderStageScreen();
        break;
      case 'history':
        html = window.renderHistoryScreen();
        break;
      case 'achievement':
        html = window.renderAchievementScreen();
        break;
      case 'leaderboard':
        html = window.renderLeaderboardScreen
        ? window.renderLeaderboardScreen()
        : "Loading Leaderboard...";
        break;
      case 'setting':
        html = window.renderSettingScreen();
        break;
      case 'profile':
        html = window.renderProfileScreen();
        break;
      case 'developer':
        html = window.renderDeveloperScreen();
        break;
      case 'welcome':
        html = window.renderWelcomeScreen();
        break;
      case 'battle':
        html = window.renderBattleScreen ? window.renderBattleScreen() : "Loading Battle...";
        break;
      default:
        console.warn("Screen tidak dikenal:", window.gameState.screen);
        html = window.renderWelcomeScreen();
    }
  } catch (e) {
    console.error("Render Error:", e);
    html = `<div class='text-red-500 p-10 bg-slate-900'>Error Tampilan: ${e.message}<br>Cek Console (F12)</div>`;
  }

  if (window.gameState.screen === "battle") {
    window.sfx.playMusic("battle");
  } else {
    window.sfx.playMusic("theme");
  }

  app.innerHTML = html;

  setTimeout(() => {
      window.GuideSystem?.init();
    }, 0);
};