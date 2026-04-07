// main.js - VERSI FINAL + AUDIO ENGINE + DASHBOARD GURU
import { auth, provider, db } from "./firebase-config.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { gameState, defaultPlayerStats } from "./engine/gameState.js"; 
import "./screens/profile.js";


window.gameState = gameState;
// ==========================================
// 1. AUDIO ENGINE (DITARUH PALING ATAS) 🎵
// ==========================================
window.sfx = {
    ctx: null,
    init: function() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    playTone: function(freq, type, duration, vol = 0.1) {
        if (!this.ctx) this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = type; 
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) { console.log("Audio error:", e); }
    },
    correct: function() {
        if(!window.gameState.settings.sound) return;
        this.playTone(600, 'sine', 0.1);
        },
    wrong: function() { 
        this.playTone(150, 'sawtooth', 0.3); 
        setTimeout(() => this.playTone(100, 'sawtooth', 0.3), 150); 
    },
    click: function() { 
        this.playTone(400, 'triangle', 0.05, 0.05); 
    },
    win: function() {
        [440, 554, 659, 880].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'square', 0.2, 0.1), i * 150);
        });
    }
};

// Aktifkan Audio Context saat klik pertama
document.addEventListener('click', () => {
    if (!window.sfx.ctx) {
    window.sfx.init();
    }
    if (window.sfx.ctx.state === 'suspended') {
    window.sfx.ctx.resume();
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
    window.bgm.play(gs.settings.musicTrack);
  } else {
    window.bgm.stop();
  }

  window.render();
};

window.toggleSound = function(){
  window.gameState.settings.sound = !window.gameState.settings.sound;
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
                <h1 class="text-4xl font-bold mb-2 text-yellow-400">Algebra Quest RPG</h1>
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
    
    app.innerHTML = html;
};  