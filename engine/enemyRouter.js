const enemyData = {
numbers: {
  1: { name: "Green Slime", hp: 80, attack: 8, img: "assets/enemy/slime.png" },
  2: { name: "Red Mite", hp: 100, attack: 10, img: "assets/enemy/mite.png" },
  3: { name: "Beetle", hp: 130, attack: 12, img: "assets/enemy/beetle.png" },
  4: { name: "Stone Golem", hp: 180, attack: 15, img: "assets/enemy/golem.png" },

  5: { name: "Fraction Frog", hp: 200, attack: 18, img: "assets/enemy/frog.png" },
  6: { name: "Decimal Wolf", hp: 220, attack: 20, img: "assets/enemy/wolf.png" },
  7: { name: "Compare Owl", hp: 240, attack: 22, img: "assets/enemy/owl.png" },
  8: { name: "Order Sprite", hp: 260, attack: 24, img: "assets/enemy/spirit1.png" },

  9: { name: "Prime Spirit", hp: 280, attack: 26, img: "assets/enemy/spirit2.png" },
  10:{ name: "Factor Bunny", hp: 300, attack: 28, img: "assets/enemy/bunny.png" },
  11:{ name: "Guardian Snake", hp: 330, attack: 30, img: "assets/enemy/snake.png" },
  12:{ name: "Titan Monkey", hp: 360, attack: 32, img: "assets/enemy/monkey.png" },

  13:{ name: "Fox Mage", hp: 400, attack: 35, img: "assets/enemy/fox.png" },
  14:{ name: "Tiger Knight", hp: 430, attack: 38, img: "assets/enemy/tiger.png" },
  15:{ name: "Phantom Rat", hp: 470, attack: 40, img: "assets/enemy/rat.png" },
  16:{ name: "Radical Bat", hp: 520, attack: 45, img: "assets/enemy/bat.png" },

  17:{ name: "Titan Griffin 👑", hp: 700, attack: 50, img: "assets/enemy/griffin.png" }
},

algebra: {
  1: { name: "Ratio Crab 🦀", hp: 90, attack: 9, img: "assets/enemy/crab.png" },
  2: { name: "Linear Clownfish 🐠", hp: 110, attack: 11, img: "assets/enemy/fish.png" },
  3: { name: "Variable Octopus 🐙", hp: 130, attack: 13, img: "assets/enemy/octopus.png" },
  4: { name: "Equation Turtle 🐢", hp: 160, attack: 15, img: "assets/enemy/turtle.png" },

  5: { name: "Inequality Eel ⚡", hp: 190, attack: 18, img: "assets/enemy/eel.png" },
  6: { name: "Graph Seagull 🕊️", hp: 210, attack: 20, img: "assets/enemy/seagull.png" },
  7: { name: "Slope Seahorse 🐚", hp: 230, attack: 22, img: "assets/enemy/seahorse.png" },
  8: { name: "Function Jellyfish 🪼", hp: 250, attack: 24, img: "assets/enemy/jellyfish.png" },

  9: { name: "System Shark 🦈", hp: 280, attack: 27, img: "assets/enemy/shark.png" },
  10:{ name: "Matrix Crab King 🦀👑", hp: 310, attack: 30, img: "assets/enemy/lobster.png" },
  11:{ name: "Algebra Stingray 🐋", hp: 340, attack: 32, img: "assets/enemy/stingray.png" },
  12:{ name: "Polynomial Whale 🐳", hp: 370, attack: 35, img: "assets/enemy/whale.png" },

  13:{ name: "Quadratic Dolphin 🐬", hp: 410, attack: 38, img: "assets/enemy/dolphin.png" },
  14:{ name: "Factor Lobster 🦞", hp: 450, attack: 40, img: "assets/enemy/lobster.png" },
  15:{ name: "Graph Phantom Squid 🦑", hp: 480, attack: 42, img: "assets/enemy/squid.png" },
  16:{ name: "Algebra Leviathan 🌊", hp: 520, attack: 45, img: "assets/enemy/leviathan.png" },

  17:{ name: "Poseidon, King of Tides 👑🌊", hp: 850, attack: 55, img: "assets/enemy/poseidon.png" }
}

};

export function getEnemy(world, stage) {

  const worldData = enemyData[world];

  if (!worldData) {
    throw new Error("World enemy tidak ditemukan: " + world);
  }

  const enemy = worldData[stage];

  if (!enemy) {
    throw new Error("Stage enemy tidak ditemukan: " + stage);
  }

  return {
    ...enemy,
    maxHp: enemy.hp
  };
}