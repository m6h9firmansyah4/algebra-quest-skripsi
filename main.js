// ======================================================
// main.js
// VERSI RAPIH + KATEGORI
// ======================================================

// ======================================================
// 1. IMPORTS
// ======================================================
import { auth, provider, db } from "./firebase-config.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
  GuideSystem.init();

  if (document.getElementById("guideBtn")) return;

  if (!window.gameState.hasSeenGuide) {
    GuideSystem.start(GuideSystem.getStepsByScreen());
    window.gameState.hasSeenGuide = true;
  }

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
        nextLifeAt: null
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
window.saveProgress = async function(gs) {
  if (!auth.currentUser) {
    alert("Kamu belum login!");
    return;
  }

  try {
    // Update LifePoints sebelum data disimpan
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

      lastSaved: serverTimestamp()
    };

    await setDoc(userRef, saveData, { merge: true });

    gs.feedback = "💾 Progress berhasil disimpan!";
    window.render();

  } catch (e) {
    console.error("Gagal save:", e);
    gs.feedback = "❌ Gagal menyimpan progress";
    window.render();
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
    nextLifeAt: null
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
        lastReset: serverTimestamp(),
        lastSaved: serverTimestamp()
      }, { merge: true });

      gs.feedback = "✅ Progress berhasil direset dan disimpan!";
    } catch (e) {
      console.error("Reset gagal:", e);
      gs.feedback = "❌ Reset gagal disimpan ke Firebase!";
    }
  }

  window.render();
};


// ======================================================
// 9. NAVIGATION & THEME
// ======================================================

// HELPER NAVIGASI SCREEN
window.goTo = function(screen) {
  window.gameState.screen = screen;

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
        nextLifeAt: null
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
};