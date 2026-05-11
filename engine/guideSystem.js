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

  // =========================
  // WELCOME SCREEN
  // =========================
  if (screen === "welcome") {
    return [
      {
        target: ".glass-panel",
        text: "Ini adalah halaman pembuka Algebra Quest. Dari sini kamu bisa mulai masuk ke game."
      },
      {
        target: ".btn.btn-blue",
        text: "Tekan tombol ini untuk login dengan akun Google dan memulai petualanganmu."
      },
      {
        target: ".info-btn",
        text: "Tombol ini berisi penjelasan singkat tentang isi dan tujuan game."
      },
      {
        target: "body",
        text: "Kalau sudah siap, login dulu lalu mulai belajar sambil bertualang! 🚀"
      }
    ];
  }

  // =========================
  // HOME SCREEN
  // =========================
  if (screen === "home") {
    return [
      {
        target: "#playerCard",
        text: "Ini adalah kartu karaktermu. Di sini kamu bisa melihat nama, HP, level, dan EXP."
      },
      {
        target: "#scoreSummary",
        text: "Bagian ini menampilkan total poin dan best streak. Poin diperoleh dari jawaban benar, bonus kecepatan menjawab, dan streak jawaban benar berturut-turut."
      },
      {
        target: "#lifePointsCard",
        text: "Ini adalah LifePoints. Jika kamu kalah atau kabur dari battle, LifePoints akan berkurang. LifePoints akan pulih otomatis setiap 3 jam sampai maksimal 5."
      },
      {
        target: "#profileBtn",
        text: "Klik bagian ini untuk membuka profil karakter dan melihat perkembanganmu."
      },
      {
        target: "#mapBtn",
        text: "Tombol ini digunakan untuk masuk ke peta dunia dan memulai petualangan matematika."
      },
      {
        target: "#tutorialBtn",
        text: "Kalau tombol ini ada, kamu bisa membukanya untuk melihat tutorial bermain secara khusus."
      },
      {
        target: "#historyBtn",
        text: "Bagian ini menampilkan riwayat permainanmu."
      },
      {
        target: "#achievementBtn",
        text: "Di sini kamu bisa melihat achievement atau pencapaian yang sudah berhasil diraih."
      },
      {
        target: "#leaderboardBtn",
        text: "Tombol ini digunakan untuk membuka leaderboard. Di sana kamu bisa melihat peringkat berdasarkan total poin siswa."
      },
      {
        target: "#settingBtn",
        text: "Gunakan menu ini untuk mengatur suara, musik, dan pengaturan lainnya."
      },
      {
        target: "body",
        text: "Sekarang kamu sudah paham menu utama. Pilih petualanganmu dan mulai belajar! 🎉"
      }
    ];
  }

  // =========================
  // TUTORIAL SCREEN
  // =========================
  if (screen === "tutorial") {
    return [
      {
        target: "#tutorialScreen",
        text: "Ini adalah halaman tutorial utama. Di sini kamu bisa membaca panduan bermain Algebra Quest."
      },
      {
        target: ".tutorial-hero",
        text: "Bagian ini berisi judul dan penjelasan singkat tentang cara menggunakan tutorial."
      },
      {
        target: ".tutorial-stack",
        text: "Bagian ini berisi daftar tutorial yang bisa dibuka satu per satu."
      },
      {
        target: "#tutorialSection-0",
        text: "Bagian pertama menjelaskan apa itu Algebra Quest dan tujuan permainannya."
      },
      {
        target: "#tutorialSection-1",
        text: "Bagian ini menjelaskan alur bermain mulai dari login, home, memilih area, map, stage, battle, menang, sampai naik level."
      },
      {
        target: "#tutorialSection-2",
        text: "Bagian ini menjelaskan cara menjawab soal pada battle screen, termasuk contoh bentuk soal."
      },
      {
        target: "#tutorialSection-3",
        text: "Bagian ini menjelaskan area atau world yang tersedia di dalam game."
      },
      {
        target: "#tutorialSection-4",
        text: "Bagian ini menjelaskan susunan materi pada Prime Verda World."
      },
      {
        target: "#tutorialSection-5",
        text: "Bagian ini menjelaskan susunan materi pada Algebrum World."
      },
      {
        target: "#tutorialBackBtn",
        text: "Gunakan tombol ini untuk kembali ke halaman Home."
      },
      {
        target: "body",
        text: "Tutorial ini bisa dibuka kapan saja jika kamu lupa alur permainan atau ingin membaca penjelasan materi. 📘"
      }
    ];
  }

  // =========================
  // LEADERBOARD SCREEN
  // =========================
  if (screen === "leaderboard") {
    return [
      {
        target: ".glass-panel",
        text: "Ini adalah halaman leaderboard. Di sini kamu bisa melihat peringkat siswa berdasarkan total poin."
      },
      {
        target: ".space-y-3",
        text: "Daftar ini menampilkan urutan pemain. Peringkat dihitung dari total poin, lalu stage selesai, level, dan best streak sebagai pembanding."
      },
      {
        target: ".btn.btn-blue",
        text: "Gunakan tombol Refresh untuk memuat ulang data leaderboard dari database."
      },
      {
        target: ".btn.btn-gray",
        text: "Gunakan tombol ini untuk kembali ke halaman Home."
      },
      {
        target: "body",
        text: "Semakin banyak poin yang kamu kumpulkan dari battle, semakin tinggi posisi kamu di leaderboard. 🏆"
      }
    ];
  }


  // =========================
  // MAP SCREEN
  // =========================
  if (screen === "map") {
    const isIslandView = !!document.querySelector("#worldMap");

    // LIST AREA
    if (!isIslandView) {
      return [
        {
          target: "#mapTitle",
          text: "Di halaman ini kamu memilih area petualangan yang ingin dijelajahi."
        },
        {
          target: "#mapSubtitle",
          text: "Geser ke kiri atau ke kanan untuk melihat semua area yang tersedia."
        },
        {
          target: "#worldScroll",
          text: "Bagian ini berisi daftar area petualangan. Area yang masih terkunci belum bisa dimainkan."
        },
        {
          target: "#worldCard-numbers",
          text: "Ini adalah Prime Verba. Area ini terbuka sejak awal dan Stage 1 bisa langsung dimainkan."
        },
        {
          target: "#worldCard-algebra",
          text: "Ini adalah Algebrum. Area ini akan terbuka setelah Prime Verba mencapai Stage 8."
        },
        {
          target: "#worldCard-geometry",
          text: "Ini adalah Geometria. Area ini masih dalam pengembangan."
        },
        {
          target: "#worldCard-data",
          text: "Ini adalah Statica. Area ini juga masih dalam pengembangan."
        },
        {
          target: "#mapBackBtn",
          text: "Tombol ini membawamu kembali ke halaman Home."
        },
        {
          target: "body",
          text: "Mulailah dari Prime Verba, selesaikan stage secara berurutan, lalu buka area berikutnya. 🌍"
        }
      ];
    }

    // DALAM AREA / ISLAND VIEW
    return [
      {
        target: "#zoneHeader",
        text: "Bagian ini menunjukkan nama area dan materi yang sedang kamu masuki."
      },
      {
        target: "#stageNodes .node:not(.locked-node)",
        text: "Stage yang terbuka bisa diklik untuk memulai battle."
      },
      {
        target: "#stageNodes .locked-node",
        text: "Stage dengan ikon kunci belum bisa dimainkan. Selesaikan stage sebelumnya untuk membukanya."
      },
      {
        target: "#worldMapScroller",
        text: "Geser area map ke kiri atau kanan untuk melihat stage lain dalam area ini."
      },
      {
        target: "#islandBackBtn",
        text: "Tombol ini digunakan untuk kembali ke daftar area."
      },
      {
        target: "body",
        text: "Setiap kali kamu menang battle, stage berikutnya akan terbuka secara otomatis. 🚀"
      }
    ];
  }

  // =========================
  // BATTLE SCREEN
  // =========================
  if (screen === "battle") {
    const gs = window.gameState;
    const hasFeedback = !!gs.feedback;
    const enemyAlive = gs.enemy && gs.enemy.hp > 0;

    return [
      {
        target: "#battleTopBar",
        text: "Bagian ini menampilkan nama musuh yang sedang kamu lawan. Tombol Kabur bisa dipakai untuk kembali ke map."
      },
      {
        target: "#battleScoreBar",
        text: "Bagian ini menampilkan total poin, poin yang diperoleh selama battle ini, dan streak jawaban benar. Semakin cepat dan konsisten menjawab benar, semakin besar poin yang diperoleh."
      },
      {
        target: "#battleArena",
        text: "Ini adalah arena pertarungan. Sebelah kiri adalah karaktermu, sebelah kanan adalah musuh."
      },
      {
        target: "#battleQuestionPanel",
        text: "Di panel ini akan muncul soal matematika yang harus kamu selesaikan."
      },
      {
        target: hasFeedback ? "#battleFeedback" : "#battleQuestionText",
        text: hasFeedback
          ? "Bagian ini menampilkan hasil jawabanmu, apakah benar atau salah, beserta penjelasannya."
          : "Bacalah soal ini dengan teliti sebelum menjawab."
      },
      {
        target: hasFeedback && enemyAlive ? "#battleNextBtn" : "#battleAnswerArea",
        text: hasFeedback && enemyAlive
          ? "Tekan tombol ini untuk lanjut ke soal berikutnya."
          : "Jawabanmu diisi atau dipilih di bagian ini. Setelah itu serangan akan dilakukan."
      },
      {
        target: "#battleLog",
        text: "Log battle mencatat apa yang terjadi selama pertarungan, seperti damage, dan hasil jawaban."
      },
      {
        target: "body",
        text: "Jawab soal dengan benar untuk mengalahkan musuh dan memenangkan battle! ⚔️"
      }
    ];
  }

  // =========================
  // PROFILE SCREEN
  // =========================
  if (screen === "profile") {
    return [
      {
        target: "#profileHeader",
        text: "Ini adalah identitas karaktermu. Di sini terlihat nama dan gelar yang sedang digunakan."
      },
      {
        target: "#profileStatusPanel",
        text: "Bagian ini menampilkan status utama karakter, seperti HP, attack, defense, dan level."
      },
      {
        target: "#profileAchievementPanel",
        text: "Bagian ini menampilkan achievement yang sudah tersedia beserta bonus damage-nya."
      },
      {
        target: "#profileTitlePanel",
        text: "Di sini kamu bisa memilih gelar. Gelar tertentu dapat memberikan bonus damage saat battle."
      },
      {
        target: "#profileBackBtn",
        text: "Gunakan tombol ini untuk kembali ke halaman Home."
      },
      {
        target: "body",
        text: "Halaman profil membantu kamu melihat perkembangan karakter selama bermain. 👤"
      }
    ];
  }

  // =========================
  // ACHIEVEMENT SCREEN
  // =========================
  if (screen === "achievement") {
    return [
      {
        target: ".glass-panel",
        text: "Di sini kamu bisa melihat achievement yang sudah terbuka maupun yang belum tercapai."
      },
      {
        target: "body",
        text: "Semakin banyak achievement yang diraih, semakin terasa perkembangan petualanganmu."
      }
    ];
  }

  // =========================
  // HISTORY SCREEN
  // =========================
  if (screen === "history") {
    return [
      {
        target: ".glass-panel",
        text: "Halaman ini menampilkan riwayat permainanmu."
      },
      {
        target: "body",
        text: "Kalau belum ada data, berarti riwayat permainan masih kosong."
      }
    ];
  }

  // =========================
  // SETTING SCREEN
  // =========================
  if (screen === "setting") {
    return [
      {
        target: "#settingHeader",
        text: "Ini adalah halaman pengaturan game."
      },
      {
        target: "#audioSettingPanel",
        text: "Bagian ini digunakan untuk mengatur suara dan musik dalam game."
      },
      {
        target: "#soundToggleBtn",
        text: "Tombol ini digunakan untuk menyalakan atau mematikan sound effect."
      },
      {
        target: "#musicToggleBtn",
        text: "Tombol ini digunakan untuk menyalakan atau mematikan musik latar."
      },
      {
        target: "#saveProgressBtn",
        text: "Gunakan tombol ini untuk menyimpan progress permainan ke Firebase."
      },
      {
        target: "#resetProgressBtn",
        text: "Tombol ini digunakan untuk mereset progress permainan. Gunakan dengan hati-hati karena data akan dikembalikan ke awal."
      },
      {
        target: "#settingBackBtn",
        text: "Gunakan tombol ini untuk kembali ke halaman Home."
      },
      {
        target: "body",
        text: "Pengaturan membantu kamu mengontrol audio, menyimpan progress, dan mengatur ulang permainan. ⚙️"
      }
    ];
  }

  // =========================
  // DEVELOPER SCREEN
  // =========================
  if (screen === "developer") {
    return [
      {
        target: "body",
        text: "Halaman ini berisi informasi tentang pengembang game dan kontak yang bisa dihubungi."
      }
    ];
  }

  // =========================
  // DEFAULT
  // =========================
  return [
    {
      target: "body",
      text: "Gunakan game ini untuk belajar matematika dengan cara yang lebih seru dan interaktif!"
    }
  ];
},

  // =========================
  // START GUIDE
  // =========================
  start(steps) {
    const safeSteps = Array.isArray(steps) && steps.length
      ? steps
      : [
          {
            target: "body",
            text: "Belum ada panduan khusus untuk halaman ini."
          }
        ];

    this.steps = safeSteps;
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

    const isMapScreen = window.gameState.screen === "map";

    // Untuk map jangan auto-scroll, karena posisi map punya sistem sendiri
    if (!isMapScreen && step.target !== "body") {
      el.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "nearest"
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.renderStepUI(step, el);
        });
      });
      return;
    }

    this.renderStepUI(step, el);
  },

  renderStepUI(step, el) {
    if (!this.active) return;

    const rect = el.getBoundingClientRect();
    const isLastStep = (this.index === this.steps.length - 1);
    const isBodyTarget = step.target === "body";

    let top = rect.bottom + 10;
    let left = rect.left;

    if (left + 260 > window.innerWidth) {
      left = window.innerWidth - 270;
    }

    if (left < 10) {
      left = 10;
    }

    if (top + 140 > window.innerHeight) {
      top = rect.top - 140;
    }

    if (top < 10) {
      top = 10;
    }

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

    if (isLastStep || isBodyTarget) {
      highlight.style.display = "none";
      tooltip.style.top = "50%";
      tooltip.style.left = "50%";
      tooltip.style.transform = "translate(-50%, -50%) scale(1.05)";
    } else {
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }

    const isFirstStep = (this.index === 0);

    tooltip.innerHTML = `
      <div class="guide-step">
        Step ${this.index + 1} / ${this.steps.length}
      </div>

      <div class="guide-text">
        ${step.text}
      </div>

      <div class="guide-buttons">
        <button 
          class="guide-btn guide-back ${isFirstStep ? 'guide-disabled' : ''}" 
          onclick="GuideSystem.back()"
          ${isFirstStep ? "disabled" : ""}
        >
          ⬅️ Back
        </button>

        <button class="guide-btn guide-next" onclick="GuideSystem.next()">
          Next ➡️
        </button>

        <button class="guide-btn guide-end" onclick="GuideSystem.end()">
          Selesai ✖️
        </button>
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

    back() {
     if (this.index <= 0) return;
      const overlay = document.querySelector(".guide-overlay");
      const tooltip = document.querySelector(".guide-tooltip");
      const highlight = document.querySelector(".guide-highlight");

      [overlay, tooltip, highlight].forEach(el => {
        if (el) el.classList.add("guide-fade-out");
      });

      setTimeout(() => {
        this.clear();

        this.index--;

        if (this.index < 0) {
          this.index = 0;
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