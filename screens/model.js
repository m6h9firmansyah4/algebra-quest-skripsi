/* =========================================================
   ALGEBRA QUEST - SCREEN DATA MODEL
   File ini digunakan sebagai pusat data untuk screen.
   Tujuannya agar world, achievement, menu, dan riwayat
   lebih mudah dikembangkan tanpa mengubah banyak file.
========================================================= */

window.AQ_MODEL = window.AQ_MODEL || {};

/* ===============================
   WORLD MODEL
=============================== */
window.AQ_MODEL.worlds = {
  numbers: {
    id: "numbers",
    title: "🌳 Prime Verba",
    shortTitle: "Prime Verba",
    subtitle: "Bilangan",
    description: "Area petualangan yang berisi materi bilangan, mulai dari bilangan bulat, pecahan, desimal, FPB, KPK, pangkat, dan akar.",
    cardImg: "assets/map/ikon_island_numbers.png",
    islandImg: "assets/map/island_numbers.png",
    status: "active",
    totalStages: 17,
    unlockType: "always",
    unlockMessage: "Area awal yang langsung terbuka.",
    bossName: "Akarion",
    themeClass: "numbers-theme",

    stageGroups: [
      {
        range: "Stage 1–4",
        topic: "Bilangan Bulat",
        description: "Penjumlahan, pengurangan, perkalian, pembagian, dan operasi campuran bilangan bulat."
      },
      {
        range: "Stage 5–8",
        topic: "Pecahan dan Desimal",
        description: "Penyederhanaan pecahan, konversi pecahan ke desimal, perbandingan nilai, dan pengurutan bilangan."
      },
      {
        range: "Stage 9–12",
        topic: "Bilangan Prima, FPB, dan KPK",
        description: "Bilangan prima, faktorisasi prima, FPB, KPK, serta soal cerita terkait kelipatan dan faktor."
      },
      {
        range: "Stage 13–16",
        topic: "Pangkat dan Akar",
        description: "Konsep pangkat, sifat pangkat, akar kuadrat, dan operasi campuran pangkat serta akar."
      },
      {
        range: "Final Boss",
        topic: "Review Bilangan",
        description: "Pertarungan akhir yang menggabungkan seluruh materi pada Prime Verba."
      }
    ]
  },

  algebra: {
    id: "algebra",
    title: "⚖️ Algebrum",
    shortTitle: "Algebrum",
    subtitle: "Aljabar",
    description: "Area petualangan aljabar yang berisi rasio, skala, bentuk aljabar, PLSV, pertidaksamaan, relasi, fungsi, garis lurus, dan SPLDV.",
    cardImg: "assets/map/island_algebra.png",
    islandImg: "assets/map/island_algebra.png",
    status: "active",
    totalStages: 17,
    unlockType: "worldStage",
    unlockWorld: "numbers",
    unlockStage: 8,
    unlockMessage: "Terbuka setelah Prime Verba mencapai Stage 8.",
    bossName: "Solarius the Equinox",
    themeClass: "algebra-theme",

    stageGroups: [
      {
        range: "Stage 1–2",
        topic: "Rasio dan Skala",
        description: "Perbandingan senilai, rasio sederhana, dan skala gambar."
      },
      {
        range: "Stage 3–4",
        topic: "Bentuk Aljabar",
        description: "Koefisien, variabel, konstanta, suku sejenis, dan penyederhanaan bentuk aljabar."
      },
      {
        range: "Stage 5–8",
        topic: "PLSV dan Pertidaksamaan",
        description: "Persamaan linear satu variabel, pertidaksamaan, dan soal cerita sederhana."
      },
      {
        range: "Stage 9–10",
        topic: "Relasi dan Fungsi",
        description: "Domain, range, pasangan berurutan, dan nilai fungsi."
      },
      {
        range: "Stage 11–12",
        topic: "Garis Lurus",
        description: "Gradien, persamaan garis, dan hubungan antarvariabel."
      },
      {
        range: "Stage 13–16",
        topic: "SPLDV",
        description: "Substitusi, eliminasi, model matematika, dan soal cerita SPLDV."
      },
      {
        range: "Final Boss",
        topic: "Review Aljabar",
        description: "Pertarungan akhir yang menggabungkan materi utama pada Algebrum."
      }
    ]
  },

  geometry: {
    id: "geometry",
    title: "📐 Geometria",
    shortTitle: "Geometria",
    subtitle: "Bangun dan Ruang",
    description: "Area geometri yang disiapkan untuk materi sudut, bangun datar, bangun ruang, dan pengukuran.",
    cardImg: "assets/map/island_geometry.png",
    islandImg: "assets/map/island_geometry.png",
    status: "comingSoon",
    totalStages: 17,
    unlockType: "comingSoon",
    unlockMessage: "Area ini masih dalam pengembangan.",
    bossName: "Geometrion",
    themeClass: "geometry-theme",

    stageGroups: [
      {
        range: "Coming Soon",
        topic: "Geometri",
        description: "Materi akan dikembangkan pada tahap berikutnya."
      }
    ]
  },

  data: {
    id: "data",
    title: "📊 Statica",
    shortTitle: "Statica",
    subtitle: "Data dan Peluang",
    description: "Area yang disiapkan untuk materi statistika, penyajian data, ukuran pemusatan data, dan peluang.",
    cardImg: "assets/map/island_data.png",
    islandImg: "assets/map/island_data.png",
    status: "comingSoon",
    totalStages: 17,
    unlockType: "comingSoon",
    unlockMessage: "Area ini masih dalam pengembangan.",
    bossName: "Statisticus",
    themeClass: "data-theme",

    stageGroups: [
      {
        range: "Coming Soon",
        topic: "Data dan Peluang",
        description: "Materi akan dikembangkan pada tahap berikutnya."
      }
    ]
  }
};

/* ===============================
   HOME MENU MODEL
=============================== */
window.AQ_MODEL.homeMenus = [
  {
    id: "mapBtn",
    label: "🌍 Mulai Petualangan",
    screen: "map",
    className: "btn btn-green"
  },
  {
    id: "tutorialBtn",
    label: "📘 Tutorial Bermain",
    screen: "tutorial",
    className: "btn btn-blue"
  },
  {
    id: "historyBtn",
    label: "📜 Riwayat",
    screen: "history",
    className: "btn btn-blue"
  },
  {
    id: "achievementBtn",
    label: "🏆 Achievement",
    screen: "achievement",
    className: "btn btn-purple"
  },
  {
    id: "leaderboardBtn",
    label: "🥇 Leaderboard",
    screen: "leaderboard",
    className: "btn btn-purple"
  },
  {
    id: "settingBtn",
    label: "⚙️ Pengaturan",
    screen: "setting",
    className: "btn btn-gray"
  }
];

/* ===============================
   ACHIEVEMENT MODEL
=============================== */
window.AQ_MODEL.achievements = [
  {
    id: "first_step",
    name: "Pemula Petualangan",
    icon: "🥉",
    bonus: 1,
    description: "Menyelesaikan minimal 1 stage.",
    condition: function(gs) {
      return AQ_MODEL.helpers.getTotalCompletedStages(gs) >= 1;
    }
  },
  {
    id: "prime_verba_4",
    name: "Penjelajah Bilangan",
    icon: "🌳",
    bonus: 2,
    description: "Menyelesaikan minimal 4 stage di Prime Verba.",
    condition: function(gs) {
      return AQ_MODEL.helpers.getWorldCompletedStages(gs, "numbers") >= 4;
    }
  },
  {
    id: "prime_verba_8",
    name: "Pembuka Algebrum",
    icon: "⚖️",
    bonus: 3,
    description: "Mencapai minimal Stage 8 di Prime Verba.",
    condition: function(gs) {
      return AQ_MODEL.helpers.getHighestUnlockedStage(gs, "numbers") >= 8;
    }
  },
  {
    id: "prime_verba_clear",
    name: "Penakluk Prime Verba",
    icon: "👑",
    bonus: 5,
    description: "Menyelesaikan seluruh stage di Prime Verba.",
    condition: function(gs) {
      return AQ_MODEL.helpers.getWorldCompletedStages(gs, "numbers") >= 17;
    }
  },
  {
    id: "algebra_4",
    name: "Pemula Aljabar",
    icon: "🥈",
    bonus: 2,
    description: "Menyelesaikan minimal 4 stage di Algebrum.",
    condition: function(gs) {
      return AQ_MODEL.helpers.getWorldCompletedStages(gs, "algebra") >= 4;
    }
  },
  {
    id: "algebra_8",
    name: "Penakluk PLSV",
    icon: "🔥",
    bonus: 4,
    description: "Menyelesaikan minimal 8 stage di Algebrum.",
    condition: function(gs) {
      return AQ_MODEL.helpers.getWorldCompletedStages(gs, "algebra") >= 8;
    }
  },
  {
    id: "algebra_clear",
    name: "Master SPLDV",
    icon: "🥇",
    bonus: 6,
    description: "Menyelesaikan seluruh stage di Algebrum.",
    condition: function(gs) {
      return AQ_MODEL.helpers.getWorldCompletedStages(gs, "algebra") >= 17;
    }
  },
  {
    id: "point_collector",
    name: "Pengumpul Poin",
    icon: "💎",
    bonus: 3,
    description: "Mengumpulkan minimal 500 poin.",
    condition: function(gs) {
      const points = gs?.player?.points ?? gs?.player?.totalScore ?? 0;
      return points >= 500;
    }
  },
  {
    id: "streak_master",
    name: "Streak Master",
    icon: "🔥",
    bonus: 3,
    description: "Mencapai best streak minimal 10.",
    condition: function(gs) {
      return (gs?.player?.bestStreak ?? 0) >= 10;
    }
  }
];

/* ===============================
   HELPER FUNCTIONS
=============================== */
window.AQ_MODEL.helpers = {
  getWorldList: function() {
    return Object.values(window.AQ_MODEL.worlds);
  },

  getWorld: function(worldId) {
    return window.AQ_MODEL.worlds[worldId] || null;
  },

  getProgress: function(gs, worldId) {
    const world = this.getWorld(worldId);
    const total = world?.totalStages || 17;

    return gs?.progress?.[worldId] || {
      done: 0,
      total: total,
      completedStage: 0,
      highestUnlockedStage: worldId === "numbers" ? 1 : 0
    };
  },

  getWorldCompletedStages: function(gs, worldId) {
    const progress = this.getProgress(gs, worldId);
    return progress.done ?? progress.completedStage ?? 0;
  },

  getHighestUnlockedStage: function(gs, worldId) {
    const progress = this.getProgress(gs, worldId);
    return progress.highestUnlockedStage ?? 0;
  },

  getTotalCompletedStages: function(gs) {
    if (!gs?.progress) return 0;

    return Object.values(gs.progress).reduce(function(total, item) {
      return total + (item?.done ?? item?.completedStage ?? 0);
    }, 0);
  },

  getWorldPercent: function(gs, worldId) {
    const world = this.getWorld(worldId);
    const progress = this.getProgress(gs, worldId);
    const total = progress.total || world?.totalStages || 17;

    if (!total) return 0;

    return Math.min(100, Math.floor(((progress.done || 0) / total) * 100));
  },

  isWorldUnlockedByModel: function(gs, worldId) {
    const world = this.getWorld(worldId);

    if (!world) return false;

    if (world.unlockType === "always") return true;

    if (world.unlockType === "comingSoon") return false;

    if (world.unlockType === "worldStage") {
      const requiredWorld = world.unlockWorld;
      const requiredStage = world.unlockStage;
      return this.getHighestUnlockedStage(gs, requiredWorld) >= requiredStage;
    }

    return false;
  },

  getUnlockedAchievements: function(gs) {
    return window.AQ_MODEL.achievements.filter(function(item) {
      try {
        return item.condition(gs);
      } catch (error) {
        return false;
      }
    });
  },

  getAchievementByName: function(name) {
    return window.AQ_MODEL.achievements.find(function(item) {
      return item.name === name;
    }) || null;
  },

  getTitleBonus: function(gs) {
    const selectedTitle = gs?.title;
    const achievement = this.getAchievementByName(selectedTitle);
    const unlocked = this.getUnlockedAchievements(gs).some(function(item) {
      return item.name === selectedTitle;
    });

    if (!achievement || !unlocked) return 0;

    return achievement.bonus || 0;
  },

  getPlayerRank: function(gs) {
    const level = gs?.player?.level ?? 1;
    const totalDone = this.getTotalCompletedStages(gs);

    if (level >= 20 || totalDone >= 34) return "Legendary Learner";
    if (level >= 15 || totalDone >= 24) return "Master Quest";
    if (level >= 10 || totalDone >= 14) return "Advanced Adventurer";
    if (level >= 5 || totalDone >= 6) return "Rising Hero";

    return "New Adventurer";
  },

  getRecentHistory: function(gs) {
    const history = gs?.history || gs?.battleHistory || [];
    return Array.isArray(history) ? history.slice().reverse() : [];
  },

  formatDateTime: function(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  },

  escapeHtml: function(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
};

/* ===============================
   OPTIONAL: HISTORY WRITER
   Bisa dipanggil dari battle system setelah menang/kalah.
=============================== */
window.addGameHistory = function(entry = {}) {
  if (!window.gameState) return;

  const gs = window.gameState;

  if (!Array.isArray(gs.history)) {
    gs.history = [];
  }

  const historyEntry = {
    id: `${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    time: new Date().toISOString(),

    // Lokasi soal
    type: entry.type || "question",
    world: entry.world || gs.selectedWorld || "unknown",
    stage: entry.stage || gs.selectedStage || "-",
    sourceStage: entry.sourceStage || entry.stage || gs.selectedStage || "-",
    topic: entry.topic || "",
    enemyName: entry.enemyName || gs.enemy?.name || "",

    // Detail soal
    questionText: entry.questionText || "",
    options: Array.isArray(entry.options) ? entry.options : [],
    userAnswer: entry.userAnswer ?? "",
    correctAnswer: entry.correctAnswer ?? "",
    isCorrect: entry.isCorrect === true,

    // Hasil
    result: entry.result || "Selesai",
    points: Number(entry.points || 0),
    exp: Number(entry.exp || 0),
    note: entry.note || ""
  };

  gs.history.push(historyEntry);

  // Batasi agar data Firebase tidak terlalu besar.
  gs.history = gs.history.slice(-100);

  // Data ringkas untuk menampilkan stage terakhir dimainkan.
  gs.lastPlayed = {
    time: historyEntry.time,
    world: historyEntry.world,
    stage: historyEntry.stage,
    result: historyEntry.result,
    topic: historyEntry.topic
  };

  // Simpan diam-diam agar tidak mengganggu battle.
  if (window.saveProgress) {
    window.saveProgress(gs, { silent: true });
  }
};

/* =========================================================
   ALGEBRA QUEST - GLOBAL THEME
   Tema ini menyamakan warna seluruh screen dengan Home Screen.
========================================================= */

window.AQ_THEME = window.AQ_THEME || {
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

  panel: `
    background:
      linear-gradient(145deg, rgba(15,23,42,0.92), rgba(30,41,59,0.82));
    border: 1px solid rgba(96,165,250,0.28);
    box-shadow: 0 0 26px rgba(59,130,246,0.14);
  `,

  softPanel: `
    background:
      linear-gradient(180deg, rgba(15,23,42,0.90), rgba(30,41,59,0.78));
    border: 1px solid rgba(148,163,184,0.18);
    box-shadow: 0 0 22px rgba(15,23,42,0.55);
  `,

  goldTitle: `
    color: #facc15;
    text-shadow: 0 0 14px rgba(250,204,21,0.35);
  `,

  blueTitle: `
    color: #bfdbfe;
    text-shadow: 0 0 12px rgba(96,165,250,0.20);
  `,

  mutedText: `
    color: #cbd5e1;
  `,

  subText: `
    color: #94a3b8;
  `,

  buttonStyle: function(type) {
    const styles = {
      green: `
        background: linear-gradient(135deg, #10b981, #047857);
        color: #ecfdf5;
        box-shadow: 0 0 18px rgba(16,185,129,0.28);
      `,

      blue: `
        background: linear-gradient(135deg, #2563eb, #1e40af);
        color: #eff6ff;
        box-shadow: 0 0 18px rgba(37,99,235,0.28);
      `,

      teal: `
        background: linear-gradient(135deg, #0f766e, #115e59);
        color: #f0fdfa;
        box-shadow: 0 0 18px rgba(20,184,166,0.22);
      `,

      purple: `
        background: linear-gradient(135deg, #9333ea, #6b21a8);
        color: #faf5ff;
        box-shadow: 0 0 18px rgba(147,51,234,0.28);
      `,

      gold: `
        background: linear-gradient(135deg, #f59e0b, #b45309);
        color: #fff7ed;
        box-shadow: 0 0 18px rgba(245,158,11,0.28);
      `,

      red: `
        background: linear-gradient(135deg, #ef4444, #991b1b);
        color: #fef2f2;
        box-shadow: 0 0 18px rgba(239,68,68,0.28);
      `,

      gray: `
        background: linear-gradient(135deg, #475569, #1e293b);
        color: #f8fafc;
        box-shadow: 0 0 18px rgba(148,163,184,0.18);
      `
    };

    return styles[type] || styles.gray;
  },

  statCard: function(type) {
    const styles = {
      gold: `
        background: rgba(120,53,15,0.35);
        border: 1px solid rgba(250,204,21,0.32);
        box-shadow: 0 0 12px rgba(250,204,21,0.12);
      `,

      orange: `
        background: rgba(124,45,18,0.35);
        border: 1px solid rgba(251,146,60,0.32);
        box-shadow: 0 0 12px rgba(251,146,60,0.12);
      `,

      purple: `
        background: rgba(88,28,135,0.35);
        border: 1px solid rgba(192,132,252,0.32);
        box-shadow: 0 0 12px rgba(192,132,252,0.12);
      `,

      red: `
        background: rgba(127,29,29,0.28);
        border: 1px solid rgba(248,113,113,0.35);
        box-shadow: 0 0 16px rgba(248,113,113,0.13);
      `,

      blue: `
        background: rgba(30,64,175,0.25);
        border: 1px solid rgba(96,165,250,0.30);
        box-shadow: 0 0 14px rgba(96,165,250,0.12);
      `,

      green: `
        background: rgba(6,95,70,0.28);
        border: 1px solid rgba(52,211,153,0.32);
        box-shadow: 0 0 14px rgba(52,211,153,0.12);
      `
    };

    return styles[type] || styles.blue;
  },

  worldColor: function(worldId) {
    const colors = {
      numbers: {
        border: "rgba(16,185,129,0.35)",
        glow: "rgba(16,185,129,0.18)",
        fill: "linear-gradient(to right, #34d399, #10b981)"
      },

      algebra: {
        border: "rgba(245,158,11,0.35)",
        glow: "rgba(245,158,11,0.18)",
        fill: "linear-gradient(to right, #fbbf24, #f97316)"
      },

      geometry: {
        border: "rgba(56,189,248,0.35)",
        glow: "rgba(56,189,248,0.18)",
        fill: "linear-gradient(to right, #38bdf8, #2563eb)"
      },

      data: {
        border: "rgba(168,85,247,0.35)",
        glow: "rgba(168,85,247,0.18)",
        fill: "linear-gradient(to right, #a855f7, #7c3aed)"
      }
    };

    return colors[worldId] || {
      border: "rgba(148,163,184,0.25)",
      glow: "rgba(148,163,184,0.12)",
      fill: "linear-gradient(to right, #94a3b8, #475569)"
    };
  }
};