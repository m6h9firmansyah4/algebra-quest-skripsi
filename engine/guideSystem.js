// ==========================================
// GUIDE SYSTEM (Overlay Tutorial)
// ==========================================

window.GuideSystem = {
  steps: [],
  index: 0,
  active: false,

  init() {
    if(document.getElementById("guideBtn")) return;
    const btn = document.createElement("button");
    btn.innerHTML = "❓";
    btn.id = "guideBtn";

    btn.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      border: none;
      cursor: pointer;
    `;

    btn.onclick = () => this.start(this.getStepsByScreen());

    document.body.appendChild(btn);
  },

  // =========================
  // STEP DATA PER SCREEN
  // =========================
  getStepsByScreen() {
    const screen = window.gameState.screen;

    if (screen === "home") {
    return [
        {
        target: "#playerCard",
        text: "Ini adalah informasi karaktermu. Di sini kamu bisa melihat HP, level, dan gold."
        },
        {
        target: "#profileBtn",
        text: "Klik di sini untuk melihat profil dan perkembangan karaktermu."
        },
        {
        target: "#mapBtn",
        text: "Klik tombol ini untuk memulai petualangan dan menjelajahi dunia matematika!"
        },
        {
        target: "#shopBtn",
        text: "Di Shop, kamu bisa membeli potion dan skill untuk membantu bertarung."
        },
        {
        target: "#historyBtn",
        text: "Menu ini berisi riwayat permainanmu."
        },
        {
        target: "#achievementBtn",
        text: "Di sini kamu bisa melihat pencapaian yang sudah kamu raih."
        },
        {
        target: "#settingBtn",
        text: "Gunakan pengaturan untuk mengatur suara dan tampilan game."
        },
        {
        target: "body",
        text: "Sekarang kamu sudah siap bermain! Selamat belajar dan bertualang 🎉"
        }
    ];
    }
    
    if (screen === "map") {
    const isIslandView = !!document.querySelector("#worldMap");

    // =========================
    // MAP LIST / PILIH DUNIA
    // =========================
    if (!isIslandView) {
        return [
        {
            target: "#mapTitle",
            text: "Di halaman ini kamu memilih dunia yang ingin dijelajahi."
        },
        {
            target: "#worldScroll",
            text: "Geser bagian ini ke kiri atau ke kanan untuk melihat semua dunia."
        },
        {
            target: "#worldCard-numbers",
            text: "Ini adalah Dunia Bilangan. Klik untuk masuk dan mulai petualangan."
        },
        {
            target: "#worldCard-algebra",
            text: "Ini adalah Dunia Aljabar. Di sini kamu akan belajar bentuk dan persamaan aljabar."
        },
        {
            target: "#worldCard-geometry",
            text: "Dunia ini masih terkunci, jadi belum bisa dimainkan."
        },
        {
            target: "#mapBackBtn",
            text: "Tekan tombol ini kalau kamu ingin kembali ke halaman utama."
        },
        {
            target: "body",
            text: "Sekarang pilih dunia yang ingin kamu jelajahi ya. Selamat bertualang! 🎉"
        }
        ];
    }

    // =========================
    // ISLAND VIEW / DALAM DUNIA
    // =========================
    return [
        {
        target: "#zoneHeader",
        text: "Bagian ini menunjukkan nama zona dan materi yang sedang kamu masuki."
        },
        {
        target: "#stageNodes .node",
        text: "Lingkaran ini adalah stage. Klik salah satu stage untuk memulai soal dan pertarungan."
        },
        {
        target: "#islandBackBtn",
        text: "Tekan tombol ini untuk kembali ke daftar dunia."
        },
        {
        target: "body",
        text: "Sekarang kamu bisa memilih stage yang ingin dimainkan. Semangat belajar! 🚀"
        }
    ];
    }

    if (screen === "battle") {
      return [
        {
          target: ".glass-panel",
          text: "Ini adalah soal matematika. Jawablah dengan benar!"
        },
        {
          target: ".action-bar",
          text: "Gunakan skill atau potion di sini."
        }
      ];
    }

    return [
      {
        target: "body",
        text: "Gunakan game ini untuk belajar matematika dengan seru!"
      }
    ];
  },

  // =========================
  // START GUIDE
  // =========================
  start(steps) {
    this.steps = steps;
    this.index = 0;
    this.active = true;
    window.stopMapDrag?.();

    setTimeout(() => this.showStep(), 200);
  },

  // =========================
  // TAMPILKAN STEP
  // =========================
  showStep() {
    this.clear();

    if (!this.active) return;

    const step = this.steps[this.index];
    const el = document.querySelector(step.target);

    if (!el) {
        this.index++;
        if (this.index >= this.steps.length) return this.end();
        this.showStep();
        return;
    }

    const rect = el.getBoundingClientRect();
    

    // 🔥 SCROLL SMOOTH
    const isMapScreen = window.gameState.screen === "map";

    // map pakai transform + drag, jadi jangan pakai scrollIntoView
    if (!isMapScreen && step.target !== "body") {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    let top = rect.bottom + 10;
    let left = rect.left;

    if (left + 260 > window.innerWidth) {
        left = window.innerWidth - 270;
    }

    if (top + 120 > window.innerHeight) {
        top = rect.top - 120;
    }
    const isLastStep = (this.index === this.steps.length - 1);

    // OVERLAY
    const overlay = document.createElement("div");
    overlay.className = "guide-overlay";

    // HIGHLIGHT
    const highlight = document.createElement("div");
    highlight.className = "guide-highlight";
    highlight.style.top = `${rect.top - 5}px`;
    highlight.style.left = `${rect.left - 5}px`;
    highlight.style.width = `${rect.width + 10}px`;
    highlight.style.height = `${rect.height + 10}px`;

    // TOOLTIP
    const tooltip = document.createElement("div");
    tooltip.className = "guide-tooltip";
    if (isLastStep) {
    highlight.style.display = "none";
    tooltip.style.top = "50%";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translate(-50%, -50%) scale(1.05)";
    } else {
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    }

    tooltip.innerHTML = `
        <div class="guide-step">
        Step ${this.index + 1} / ${this.steps.length}
        </div>

        <div class="guide-text">
        ${step.text}
        </div>

        <div class="guide-buttons">
        <button class="guide-btn guide-next" onclick="GuideSystem.next()">Next ➡️</button>
        <button class="guide-btn guide-end" onclick="GuideSystem.end()">Selesai ✖️</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(highlight);
    document.body.appendChild(tooltip);
    },

  // =========================
  // NEXT STEP
  // =========================
    next() {
    const overlay = document.querySelector(".guide-overlay");
    const tooltip = document.querySelector(".guide-tooltip");
    const highlight = document.querySelector(".guide-highlight");

    [overlay, tooltip, highlight].forEach(el => {
        if (el) el.classList.add("guide-fade-out");
    });

    setTimeout(() => {
        this.clear(); // 🔥 ini kunci utama

        this.index++;

        if (this.index >= this.steps.length) {
        this.end();
        return;
        }

        this.showStep();
    }, 250);
    },
  // =========================
  // END GUIDE
  // =========================
    end() {
    const overlay = document.querySelector(".guide-overlay");
    const tooltip = document.querySelector(".guide-tooltip");
    const highlight = document.querySelector(".guide-highlight");

    [overlay, tooltip, highlight].forEach(el => {
        if (el) el.classList.add("guide-fade-out");
    });

    setTimeout(() => {
        this.active = false;
        this.clear();
        window.stopMapDrag?.();
    }, 250);
    },
  // =========================
  // CLEAR ELEMENT
  // =========================
    clear() {
    document.querySelectorAll(".guide-overlay").forEach(e => e.remove());
    document.querySelectorAll(".guide-highlight").forEach(e => e.remove());
    document.querySelectorAll(".guide-tooltip").forEach(e => e.remove());
    }
};