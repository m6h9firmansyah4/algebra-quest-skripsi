// main.js - VERSI FINAL + AUDIO ENGINE + DASHBOARD GURU
import { auth, provider, db } from "./firebase-config.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { gameState, defaultPlayerStats } from "./engine/gameState.js"; 


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
        this.playTone(600, 'sine', 0.1); 
        setTimeout(() => this.playTone(1200, 'sine', 0.2), 100); 
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

// ==========================================
// 3. DATA DEFAULT (WAJIB SEBELUM GAMESTATE) ⚠️
// ==========================================

// ==========================================
// 4. GAME STATE UTAMA
// ==========================================

// ==========================================
// 5. FUNGSI HELPER & LOGIC
// ==========================================

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