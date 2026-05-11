window.renderDeveloperScreen = function () {
  const theme = window.AQ_THEME;

  return `
    <div 
      class="p-6 max-w-md mx-auto fade-in text-center"
      style="${theme.shell}"
    >

      <div 
        class="glass-panel mb-4"
        style="${theme.headerPanel}"
      >
        <h2 
          class="text-2xl font-bold mb-2"
          style="${theme.goldTitle}"
        >
          ✉️ Developer
        </h2>

        <p 
          class="text-sm"
          style="${theme.mutedText}"
        >
          Informasi pengembang Algebra Quest RPG
        </p>
      </div>

      <div 
        class="glass-panel mb-4"
        style="${theme.panel}"
      >
        <div class="text-4xl mb-3">🧙‍♂️</div>

        <p 
          class="mb-4"
          style="${theme.mutedText}"
        >
          Game edukasi ini dikembangkan untuk membantu pembelajaran matematika melalui petualangan, stage, battle, achievement, dan progress pemain.
        </p>

        <div 
          class="p-3 rounded-xl text-left"
          style="${theme.statCard("blue")}"
        >
          <div class="font-bold mb-1" style="color:#bfdbfe;">
            Fokus Pengembangan
          </div>

          <div class="text-sm" style="${theme.subText}">
            Edukasi matematika, gamifikasi, sistem progress, dan pengalaman belajar interaktif.
          </div>
        </div>
      </div>

      <a 
        href="mailto:developer@email.com"
        class="btn w-full"
        style="${theme.buttonStyle("blue")}"
      >
        Kirim Email
      </a>

      <button 
        onclick="goTo('home')" 
        class="btn w-full mt-4"
        style="${theme.buttonStyle("gray")}"
      >
        ⬅️ Kembali
      </button>

    </div>
  `;
};