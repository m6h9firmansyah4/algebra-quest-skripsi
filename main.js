// main.js - VERSI FINAL + AUDIO ENGINE + DASHBOARD GURU
import { auth, provider, db } from "./firebase-config.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { gameState, defaultPlayerStats } from "./engine/gameState.js"; 
import "./screens/profile.js";
import "./screens/shop.js";
import "./engine/guideSystem.js";



window.gameState = gameState;
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
  GuideSystem.init() 
  if(document.getElementById("guideBtn")) return;

  if(!window.gameState.hasSeenGuide){
    GuideSystem.start(GuideSystem.getStepsByScreen());
    window.gameState.hasSeenGuide = true;
  }

  if(window.gameState.settings.music){
    window.sfx.playMusic(
      window.gameState.screen === "battle" ? "battle" : "theme"
    );
  }
}, { once: true });


// ==========================================
// 2. DEFINISI ICONS
// ==========================================
window.Icons = {
    BookOpen: () => '📖', Star: () => '⭐', Heart: () => '❤️', 
    Sword: () => '⚔️', Shield: () => '🛡️', Trophy: () => '🏆', 
    ArrowLeft: () => '⬅️', Save: () => '💾', LogOut: () => '🚪', 
    Zap: () => '⚡', Lock: () => '🔒'
};


// Fungsi Helper: Load Data Aman
function safeLoadUserData(dbStats) {
    if (!dbStats) return { ...defaultPlayerStats };

    return {
        ...defaultPlayerStats, 
        ...dbStats,            
        hp: dbStats.hp || 100, 
        maxHp: dbStats.maxHp || 100,
        attack: dbStats.attack || 10,
        defense: dbStats.defense || 5
    };
}

window.resetProgress = async function(){
  if(!confirm("Yakin ingin menghapus semua progress?")) return;

  const gs = window.gameState;

  // reset local
  gs.player = {
    ...defaultPlayerStats
  };

    gs.progress = {
    numbers: { done: 0 },
    algebra: { done: 0 },
    geometry: { done: 0 }
    };
    gs.battleLog = [];

  // 🔥 reset ke Firebase juga
  if (auth.currentUser) {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);

      await setDoc(userRef, {
        username: gs.currentUser,
        stats: gs.player,
        lastSaved: new Date()
      }, { merge: true });

      gs.feedback = "✅ Progress berhasil direset & disimpan!";
    } catch (e) {
      console.error(e);
      gs.feedback = "❌ Reset gagal disimpan ke server!";
    }
  }

  window.render();
};

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
            window.gameState.player = safeLoadUserData(data?.stats || {});
            window.gameState.currentUser = data.username || user.displayName;
        } else {
            window.gameState.currentUser = user.displayName;
            window.gameState.player.name = user.displayName;
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

// SAVE GAME
window.saveProgress = async function(gs) {
    if (!auth.currentUser) {
        alert("Kamu belum login!");
        return;
    }
    try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, {
            username: gs.currentUser,
            stats: gs.player, 
            lastSaved: new Date()
        }, { merge: true });
        
        window.gameState.feedback = "💾 Progress berhasil disimpan!";
        window.render();
    } catch (e) {
        console.error("Gagal save:", e);
        window.gameState.feedback = "❌ Gagal menyimpan progress";
        window.render();
    }
};

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

window.setTheme = function(theme){
  const gs = window.gameState;
  gs.settings.theme = theme;

  document.body.className = theme + "-theme";

  window.render();
};

window.bgm = {
  audio: null,

  play(track){
    if(this.audio) this.audio.pause();

    this.audio = new Audio(`assets/music/${track}.mp3`);
    this.audio.loop = true;

    if(window.gameState.settings.music){
      this.audio.play();
    }
  },

  stop(){
    if(this.audio) this.audio.pause();
  }
};

window.toggleMusic = function(){
  const gs = window.gameState;

  gs.settings.music = !gs.settings.music;

  if(gs.settings.music){

    // 🔥 reset supaya bisa play ulang
    window.sfx.currentMusic = null;

    if(gs.screen === "battle"){
      window.sfx.playMusic("battle");
    } else {
      window.sfx.playMusic("theme");
    }

  } else {
    window.sfx.stopMusic();
  }

  window.render();
};

window.toggleSound = function(){
  const gs = window.gameState;

  gs.settings.sound = !gs.settings.sound;

  if(gs.settings.sound){
    window.sfx.click();
  }

  window.render();
};
// ==========================================
// 6. RENDER FUNCTIONS (TAMPILAN)
// ==========================================

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
                    <p class="text-xs text-gray-500 mt-4">Versi Skripsi v1.0 • Universitas Negeri Malang</p>
                </div>
            </div>
        </div>
    `;
};

// ==========================================
// 7. SYSTEM STARTUP
// ==========================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            window.gameState.player = safeLoadUserData(data.stats);
        }
        
        window.gameState.currentUser = user.displayName;
        window.gameState.screen = 'home';
    } else {
        window.gameState.screen = 'welcome';
    }
    window.render();
});

// MAIN RENDER SWITCH
window.render = function() {
    const app = document.getElementById('app');
    let html = '';
    
    try {
        switch (window.gameState.screen) {
            case 'home':
                html = window.renderHomeScreen();
                break;
            case 'map':
                html = window.renderMapScreen ();
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
            case 'shop':
                html = window.renderShopScreen();
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
    if(window.gameState.screen === "battle"){
        window.sfx.playMusic("battle");
        } else {
        window.sfx.playMusic("theme");
        }

    app.innerHTML = html;
};  