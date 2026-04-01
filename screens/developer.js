window.renderDeveloperScreen = function () {
  return `
    <div class="p-6 max-w-md mx-auto fade-in text-center">

      <h2 class="text-2xl font-bold mb-4">
        ✉️ Developer
      </h2>

      <p class="text-gray-300 mb-4">
        Game edukasi ini dikembangkan untuk pembelajaran matematika.
      </p>

      <a href="mailto:developer@email.com"
         class="btn btn-blue w-full">
        Kirim Email
      </a>

      <button onclick="goTo('home')" class="btn btn-gray w-full mt-4">
        ⬅️ Kembali
      </button>

    </div>
  `;
};
