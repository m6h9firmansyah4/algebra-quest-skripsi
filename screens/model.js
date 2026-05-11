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
window.addGameHistory = function(entry) {
  if (!window.gameState) return;

  if (!Array.isArray(window.gameState.history)) {
    window.gameState.history = [];
  }

  window.gameState.history.push({
    id: Date.now(),
    time: new Date().toISOString(),
    world: entry.world || window.gameState.selectedWorld || "unknown",
    stage: entry.stage || "-",
    result: entry.result || "Selesai",
    points: entry.points || 0,
    exp: entry.exp || 0,
    note: entry.note || ""
  });

  if (window.saveProgress) {
    window.saveProgress(window.gameState);
  }
};