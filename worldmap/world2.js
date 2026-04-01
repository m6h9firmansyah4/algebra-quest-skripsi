import { shuffle, generateOptionsNumber } from "../engine/mathUtils.js";

// ===============================
// WORLD 2: ISLE OF EQUINOX (FULL RANDOM)
// ===============================

// ---------- HELPER UTILITIES ----------

function formatConstant(num) {
  if (num === 0) return "";
  return num > 0 ? ` + ${num}` : ` - ${Math.abs(num)}`;
}

function generateOptionsText(correct, wrongList) {
  let options = new Set();
  options.add(correct);

  while (options.size < 4) {
    let rand = wrongList[Math.floor(Math.random() * wrongList.length)];
    if (rand !== correct) options.add(rand);
  }

  return shuffle([...options]);
}

// ---------- TEMPLATE ----------
function createQuestion({
  id,
  stage,
  topic,
  question,
  options,
  correct,
  damage,
  difficulty
}) {
  return { id, stage, topic, question, options, correct, damage, difficulty };
}

// ===============================
// ZONA 1 – GOLDEN COAST
// ===============================
// ===============================
// STAGE 1 – RASIO VARIATIF
// ===============================
function stage1w2() {

  const objects = [
    ["jeruk", "apel"],
    ["roti", "keju"],
    ["mangga", "pisang"],
    ["kelereng merah", "kelereng biru"],
    ["gelas jus", "botol air"],
    ["kue", "donat"]
  ];

  let pair = objects[Math.floor(Math.random() * objects.length)];

  let a = Math.floor(Math.random() * 6) + 2; // 2–7
  let b = Math.floor(Math.random() * 6) + 2;

  let multiplier = Math.floor(Math.random() * 4) + 2;

  let totalA = a * multiplier;
  let correct = b * multiplier;

  return createQuestion({
    id: "stage1w2",
    stage: 1,
    topic: "Rasio Senilai (Crab of Ratio)",
    question: `Perbandingan ${pair[0]} dan ${pair[1]} adalah ${a}:${b}. Jika terdapat ${totalA} ${pair[0]}, maka ada berapa ${pair[1]}?`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 15,
    difficulty: "easy"
  });
}

// ===============================
// STAGE 2 – SKALA VARIATIF
// ===============================
function stage2w2() {

  const contexts = [
    "denah rumah",
    "blueprint bangunan",
    "denah taman",
    "rancangan jembatan",
    "layout kelas",
    "peta lokasi wisata"
  ];

  let context = contexts[Math.floor(Math.random() * contexts.length)];

  let scale = (Math.floor(Math.random() * 9) + 1) * 100; // 100–900
  let map = Math.floor(Math.random() * 10) + 2;

  let correct = map * scale;

  return createQuestion({
    id: "stage2w2",
    stage: 2,
    topic: "Skala (Scaling Castle)",
    question: `Pada sebuah ${context}, digunakan skala 1:${scale}. Jika jarak pada gambar adalah ${map} cm, maka jarak sebenarnya adalah ? cm`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 15,
    difficulty: "easy"
  });
}

// ===============================
// STAGE 3 – KOEFISIEN VARIABEL DINAMIS
// ===============================
function stage3w2() {

  const vars = ["x", "y", "a", "b", "m", "n", "p", "q"];

  let v1 = vars[Math.floor(Math.random() * vars.length)];
  let v2 = vars[Math.floor(Math.random() * vars.length)];
  while (v2 === v1) {
    v2 = vars[Math.floor(Math.random() * vars.length)];
  }

  // koefisien bisa negatif (hindari 0)
  let coef1 = Math.floor(Math.random() * 9) - 4;
  if (coef1 === 0) coef1 = 2;

  let coef2 = Math.floor(Math.random() * 9) - 4;
  if (coef2 === 0) coef2 = -3;

  let constant = Math.floor(Math.random() * 7) - 3;

  let expr =
    formatTerm(coef1, v1, true) +
    formatTerm(coef2, v2) +
    formatConstant(constant);

  return createQuestion({
    id: "stage3w2",
    stage: 3,
    topic: "Koefisien Variabel (Variable Gull)",
    question: `Tentukan koefisien dari variabel ${v1} pada bentuk ${expr}`,
    options: generateOptionsNumber(coef1),
    correct: coef1,
    damage: 20,
    difficulty: "medium"
  });
}

// ===============================
// STAGE 4 – PENYEDERHANAAN ALJABAR VARIATIF
// ===============================
function stage4w2() {

  const vars = ["x", "y", "a", "b", "m", "n", "p", "q"];

  let v1 = vars[Math.floor(Math.random() * vars.length)];
  let v2 = vars[Math.floor(Math.random() * vars.length)];
  while (v2 === v1) {
    v2 = vars[Math.floor(Math.random() * vars.length)];
  }

  let a = Math.floor(Math.random() * 7) - 3;
  let b = Math.floor(Math.random() * 7) - 3;
  let c = Math.floor(Math.random() * 7) - 3;
  let d = Math.floor(Math.random() * 7) - 3;

  if (a === 0) a = 2;
  if (c === 0) c = -1;

  let e = Math.floor(Math.random() * 7) - 3;

  let expr =
    formatTerm(a, v1, true) +
    formatTerm(b, v2) +
    formatTerm(c, v1) +
    formatTerm(-d, v2) +
    formatConstant(e);

  let coefV1 = a + c;
  let coefV2 = b - d;

  let correct =
    formatTerm(coefV1, v1, true) +
    formatTerm(coefV2, v2) +
    formatConstant(e);

  let wrong1 = formatTerm(a + b + c + d, v1, true);
  let wrong2 =
    formatTerm(coefV1, v1, true) +
    formatTerm(-coefV2, v2) +
    formatConstant(e);

  let wrong3 =
    formatTerm(coefV1, v1, true) +
    formatTerm(coefV2, v2);

  let options = shuffle([correct, wrong1, wrong2, wrong3]);

  return createQuestion({
    id: "stage4w2",
    stage: 4,
    topic: "Penyederhanaan Aljabar (Coconut King)",
    question: `Sederhanakan bentuk berikut: ${expr}`,
    options,
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// ===============================
// ZONA 2 – BALANCING RUINS
// ===============================

function stage5w2() {

  const vars = ["x","y","a","b","m","n","p","q"];
  let v = vars[Math.floor(Math.random()*vars.length)];

  // solusi yang kita targetkan
  let sol = Math.floor(Math.random()*10) + 1;

  // koefisien a (hindari 0)
  let a = Math.floor(Math.random()*7) - 3;
  if (a === 0) a = 2;

  // konstanta b
  let b = Math.floor(Math.random()*11) - 5;

  // bentuk kanan
  let right = a * sol + b;

  // variasi susunan
  let forms = [
    `${formatTerm(a, v, true)}${formatConstant(b)} = ${right}`,
    `${formatConstant(b).trim()} ${formatTerm(a, v, true)} = ${right}`,
    `${right} = ${formatTerm(a, v, true)}${formatConstant(b)}`
  ];

  let question = forms[Math.floor(Math.random()*forms.length)];

  return createQuestion({
    id: "stage5w2",
    stage: 5,
    topic: "PLSV Dasar (Mummy of Equality)",
    question: `Tentukan nilai ${v} dari persamaan: ${question}`,
    options: generateOptionsNumber(sol),
    correct: sol,
    damage: 25,
    difficulty: "medium"
  });
}

function stage6w2() {

  const vars = ["x","y","a","b","m","n","p","q"];
  let v = vars[Math.floor(Math.random()*vars.length)];

  let sol = Math.floor(Math.random()*10) + 1;

  // pilih tipe bentuk
  let type = Math.floor(Math.random()*2);

  let question;
  let correct = sol;

  if (type === 0) {
    // bentuk ax + b = c
    let a = Math.floor(Math.random()*6) + 2;
    let b = Math.floor(Math.random()*11) - 5;
    let c = a*sol + b;

    question = `${formatTerm(a, v, true)}${formatConstant(b)} = ${c}`;

  } else {
    // bentuk a(v + b) = c
    let a = Math.floor(Math.random()*6) + 2;
    let b = Math.floor(Math.random()*6) - 3;
    let c = a*(sol + b);

    let inside = `${v} ${b>=0?"+ "+b:"- "+Math.abs(b)}`;
    question = `${a}(${inside}) = ${c}`;
  }

  return createQuestion({
    id: "stage6w2",
    stage: 6,
    topic: "PLSV Lanjutan (Scorpion Solver)",
    question: `Tentukan nilai ${v} dari persamaan: ${question}`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 30,
    difficulty: "medium"
  });
}

function stage7w2() {

  const vars = ["x","y","a","b","m","n","p","q"];
  let v = vars[Math.floor(Math.random()*vars.length)];

  let threshold = Math.floor(Math.random()*10) + 3;

  let signType = Math.random() < 0.5 ? ">" : "<";

  let isAskingTrue = Math.random() < 0.5; // memenuhi atau tidak memenuhi

  // fungsi cek
  function check(val) {
    return signType === ">" ? val > threshold : val < threshold;
  }

  // generate satu himpunan
  function generateSet(forceTrue) {
    let set = new Set();
    while (set.size < 5) {
      let val = Math.floor(Math.random()*20) - 5;
      if (check(val) === forceTrue) set.add(val);
    }
    return [...set];
  }

  // satu benar
  let correctSet = generateSet(isAskingTrue);

  // tiga salah
  let wrong1 = generateSet(!isAskingTrue);
  let wrong2 = shuffle([...correctSet]).map(x=>x+1);
  let wrong3 = shuffle([...correctSet]).map(x=>x-1);

  let options = shuffle([
    `{${correctSet.join(", ")}}`,
    `{${wrong1.join(", ")}}`,
    `{${wrong2.join(", ")}}`,
    `{${wrong3.join(", ")}}`
  ]);

  let correct = `{${correctSet.join(", ")}}`;

  return createQuestion({
    id: "stage7w2",
    stage: 7,
    topic: "Pertidaksamaan (Cactus Trap)",
    question: `Pertidaksamaan ${v} ${signType} ${threshold}. Manakah himpunan nilai ${isAskingTrue ? "yang memenuhi" : "yang TIDAK memenuhi"}?`,
    options,
    correct,
    damage: 30,
    difficulty: "medium"
  });
}
function stage8w2() {

  const contexts = [
    "umur",
    "harga buku dan pensil",
    "jumlah kelereng",
    "jumlah siswa",
    "jumlah buah"
  ];

  let type = Math.floor(Math.random()*3); // jumlah / selisih / perbandingan
  let context = contexts[Math.floor(Math.random()*contexts.length)];

  let sol = Math.floor(Math.random()*10) + 3; // nilai yang ditanya

  let question;
  let correct = sol;

  if (type === 0) {
    // jumlah
    let other = Math.floor(Math.random()*10) + 2;
    let total = sol + other;

    question = `Jumlah dua ${context} adalah ${total}. Salah satunya bernilai ${other}. Berapakah nilai yang lain?`;

  } else if (type === 1) {
    // selisih
    let diff = Math.floor(Math.random()*5) + 2;
    let bigger = sol + diff;

    question = `Selisih dua ${context} adalah ${diff}. Yang lebih besar bernilai ${bigger}. Berapakah nilai yang lebih kecil?`;

  } else {
    // perbandingan
    let ratioA = Math.floor(Math.random()*4) + 1;
    let ratioB = Math.floor(Math.random()*4) + 1;
    let total = (ratioA + ratioB) * sol;

    question = `Perbandingan dua ${context} adalah ${ratioA}:${ratioB}. Jumlah keduanya ${total}. Berapakah nilai bagian pertama?`;
  }

  return createQuestion({
    id: "stage8w2",
    stage: 8,
    topic: "Soal Cerita PLSV (Sphinx)",
    question,
    options: generateOptionsNumber(correct),
    correct,
    damage: 35,
    difficulty: "medium"
  });
}

// ===============================
// ZONA 3 – SLOPE CANYON
// ===============================

function stage9w2() {

  let size = Math.floor(Math.random()*2) + 3; // 3 atau 4 pasangan

  let pairs = [];
  let xSet = new Set();
  let ySet = new Set();

  while (pairs.length < size) {
    let x = Math.floor(Math.random()*7)+1;
    let y = Math.floor(Math.random()*7)+1;

    if (!pairs.some(p => p[0]===x && p[1]===y)) {
      pairs.push([x,y]);
      xSet.add(x);
      ySet.add(y);
    }
  }

  let askDomain = Math.random() < 0.5;

  let correctSet = askDomain ? [...xSet] : [...ySet];
  let correct = `{${correctSet.join(", ")}}`;

  let wrong1 = `{${[...ySet].join(", ")}}`;
  let wrong2 = `{${pairs.map(p=>p[0]+p[1]).join(", ")}}`;
  let wrong3 = `{${correctSet.slice(0,2).join(", ")}}`;

  let options = shuffle([correct, wrong1, wrong2, wrong3]);

  return createQuestion({
    id: "stage9w2",
    stage: 9,
    topic: "Relasi & Domain/Range (Lizard of Domain)",
    question: `Diberikan relasi: ${pairs.map(p=>`(${p[0]},${p[1]})`).join(", ")}. Tentukan ${askDomain?"domain":"range"}.`,
    options,
    correct,
    damage: 30,
    difficulty: "medium"
  });
}

function stage10w2() {

  let type = Math.floor(Math.random()*3);

  let a = Math.floor(Math.random()*5)+1;
  let b = Math.floor(Math.random()*7)-3;
  let input = Math.floor(Math.random()*6)+1;

  let expr;
  let correct;

  if (type === 0) {
    expr = `${a}x`;
    correct = a * input;
  } else if (type === 1) {
    expr = `${a}x ${b>=0?"+ "+b:"- "+Math.abs(b)}`;
    correct = a*input + b;
  } else {
    expr = `${b>=0?b+" + ":"- "+Math.abs(b)+" + "}${a}x`;
    correct = a*input + b;
  }

  return createQuestion({
    id: "stage10w2",
    stage: 10,
    topic: "Nilai Fungsi (Vulture Function)",
    question: `Jika f(x) = ${expr}, tentukan f(${input}).`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 30,
    difficulty: "medium"
  });
}

function stage11w2() {

  let type = Math.floor(Math.random()*3);
  let m = Math.floor(Math.random()*4)+1;

  let question;

  if (type === 0) {
    let x1 = 1;
    let y1 = Math.floor(Math.random()*5)+1;
    let x2 = x1 + 2;
    let y2 = y1 + m*2;

    question = `Gradien garis melalui (${x1},${y1}) dan (${x2},${y2}) adalah?`;

  } else if (type === 1) {
    let x1 = 2;
    let y1 = Math.floor(Math.random()*5)+1;
    let x2 = x1 + 1;
    let y2 = y1 + m;

    question = `Jika x berubah dari ${x1} ke ${x2} dan y dari ${y1} ke ${y2}, maka gradien garis adalah?`;

  } else {
    let x = Math.floor(Math.random()*5)+1;
    let y = m * x;

    question = `Gradien garis yang melalui titik (0,0) dan (${x},${y}) adalah?`;
  }

  return createQuestion({
    id: "stage11w2",
    stage: 11,
    topic: "Gradien Garis (Gradient Goat)",
    question,
    options: generateOptionsNumber(m),
    correct: m,
    damage: 35,
    difficulty: "hard"
  });
}

function stage12w2() {

  let type = Math.floor(Math.random()*3);

  let m = Math.floor(Math.random()*4)+1;
  let c = Math.floor(Math.random()*6)-2;

  let correct;
  let question;

  if (type === 0) {
    // gradien + potong Y
    correct = `y = ${m}x ${c>=0?"+ "+c:"- "+Math.abs(c)}`;
    question = `Tentukan persamaan garis dengan gradien ${m} dan memotong sumbu Y di ${c}.`;

  } else if (type === 1) {
    // gradien + satu titik
    let x = Math.floor(Math.random()*4)+1;
    let y = m*x + c;

    correct = `y = ${m}x ${c>=0?"+ "+c:"- "+Math.abs(c)}`;
    question = `Tentukan persamaan garis dengan gradien ${m} yang melalui titik (${x},${y}).`;

  } else {
    // dua titik
    let x1 = 1;
    let y1 = m*x1 + c;
    let x2 = 3;
    let y2 = m*x2 + c;

    correct = `y = ${m}x ${c>=0?"+ "+c:"- "+Math.abs(c)}`;
    question = `Tentukan persamaan garis melalui titik (${x1},${y1}) dan (${x2},${y2}).`;
  }

  let wrong1 = `y = ${c}x + ${m}`;
  let wrong2 = `y = ${m}x ${c>=0?"+ "+(-c):"+ "+Math.abs(c)}`;
  let wrong3 = `y = x + ${c}`;

  let options = shuffle([correct, wrong1, wrong2, wrong3]);

  return createQuestion({
    id: "stage12w2",
    stage: 12,
    topic: "Persamaan Garis Lurus (Rock Golem)",
    question,
    options,
    correct,
    damage: 40,
    difficulty: "hard"
  });
}

// ===============================
// ZONA 4 – SPLDV
// ===============================

function stage13w2() {

  const vars = ["x","y","a","b","m","n","p","q"];
  let v1 = vars[Math.floor(Math.random()*vars.length)];
  let v2 = vars[Math.floor(Math.random()*vars.length)];
  while (v2 === v1) v2 = vars[Math.floor(Math.random()*vars.length)];

  let sol1 = Math.floor(Math.random()*6)+1;
  let sol2 = Math.floor(Math.random()*6)+1;

  // bentuk persamaan 1
  let a = Math.floor(Math.random()*3)+1;
  let b = Math.floor(Math.random()*3)+1;
  let c = a*sol1 + b*sol2;

  // bentuk persamaan 2 (substitusi)
  let type = Math.floor(Math.random()*2);
  let eq2, target, correct;

  if (type === 0) {
    eq2 = `${v2} = ${sol2}`;
    target = v1;
    correct = sol1;
  } else {
    eq2 = `${v1} = ${sol1}`;
    target = v2;
    correct = sol2;
  }

  return createQuestion({
    id: "stage13w2",
    stage: 13,
    topic: "SPLDV Substitusi (Magma Slime)",
    question: `Diketahui:\n${a}${v1} + ${b}${v2} = ${c}\n${eq2}\nTentukan nilai ${target}.`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 40,
    difficulty: "hard"
  });
}

function stage14w2() {

  const vars = ["x","y","a","b","m","n","p","q"];
  let v1 = vars[Math.floor(Math.random()*vars.length)];
  let v2 = vars[Math.floor(Math.random()*vars.length)];
  while (v2 === v1) v2 = vars[Math.floor(Math.random()*vars.length)];

  let sol1 = Math.floor(Math.random()*6)+1;
  let sol2 = Math.floor(Math.random()*6)+1;

  let a1 = Math.floor(Math.random()*3)+1;
  let b1 = Math.floor(Math.random()*3)+1;
  let a2 = Math.floor(Math.random()*3)+1;
  let b2 = Math.floor(Math.random()*3)+1;

  let c1 = a1*sol1 + b1*sol2;
  let c2 = a2*sol1 + b2*sol2;

  let ask = Math.random() < 0.5 ? v1 : v2;
  let correct = ask === v1 ? sol1 : sol2;

  return createQuestion({
    id: "stage14w2",
    stage: 14,
    topic: "SPLDV Eliminasi (Ash Phantom)",
    question: `Selesaikan sistem:\n${a1}${v1} + ${b1}${v2} = ${c1}\n${a2}${v1} + ${b2}${v2} = ${c2}\nNilai ${ask} adalah?`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 40,
    difficulty: "hard"
  });
}

function stage15w2() {

  const vars = ["x","y","a","b","m","n","p","q"];
  let v1 = vars[Math.floor(Math.random()*vars.length)];
  let v2 = vars[Math.floor(Math.random()*vars.length)];
  while (v2 === v1) v2 = vars[Math.floor(Math.random()*vars.length)];

  let sol1 = Math.floor(Math.random()*6)+1;
  let sol2 = Math.floor(Math.random()*6)+1;

  let eq1 = sol1 + sol2;
  let eq2 = sol1 - sol2;

  let type = Math.floor(Math.random()*2);

  let question, ask, correct;

  if (type === 0) {
    question = `${v1} + ${v2} = ${eq1}\n${v1} - ${v2} = ${eq2}`;
  } else {
    question = `${v2} + ${v1} = ${eq1}\n${v2} - ${v1} = ${-eq2}`;
  }

  ask = Math.random() < 0.5 ? v1 : v2;
  correct = ask === v1 ? sol1 : sol2;

  return createQuestion({
    id: "stage15w2",
    stage: 15,
    topic: "SPLDV Campuran (Lava Elemental)",
    question: `Diketahui sistem:\n${question}\nNilai ${ask} adalah?`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 45,
    difficulty: "very hard"
  });
}

function stage16w2() {

  let type = Math.floor(Math.random()*3);

  let correct, question;

  if (type === 0) {
    // harga barang
    let pensil = Math.floor(Math.random()*5)+1;
    let buku = Math.floor(Math.random()*5)+2;

    let eq1 = 2*pensil + buku;
    let eq2 = pensil + buku;

    correct = pensil;

    question = `2 pensil dan 1 buku seharga ${eq1}. 1 pensil dan 1 buku seharga ${eq2}. Berapakah harga 1 pensil?`;

  } else if (type === 1) {
    // kaki hewan
    let ayam = Math.floor(Math.random()*5)+1;
    let kambing = Math.floor(Math.random()*5)+1;

    let kepala = ayam + kambing;
    let kaki = 2*ayam + 4*kambing;

    correct = ayam;

    question = `Jumlah kepala hewan adalah ${kepala} dan jumlah kaki ${kaki}. Jika terdiri dari ayam dan kambing, berapa jumlah ayam?`;

  } else {
    // umur
    let a = Math.floor(Math.random()*10)+10;
    let b = Math.floor(Math.random()*10)+5;

    let total = a + b;
    let diff = a - b;

    correct = b;

    question = `Jumlah umur dua orang ${total} dan selisihnya ${diff}. Berapakah umur yang lebih muda?`;
  }

  return createQuestion({
    id: "stage16w2",
    stage: 16,
    topic: "Soal Cerita SPLDV (Twin Cerberus)",
    question,
    options: generateOptionsNumber(correct),
    correct,
    damage: 50,
    difficulty: "very hard"
  });
}

// ===============================
// FINAL BOSS – MULTI PHASE
// ===============================

function bossStageW2() {

  // =====================
  // PHASE 1 — PLSV
  // =====================
  const phase1Pool = [stage5w2, stage6w2, stage8w2];
  let phase1Func = phase1Pool[Math.floor(Math.random()*phase1Pool.length)];
  let phase1 = phase1Func();
  phase1.id = "boss_p1";
  phase1.stage = 17;
  phase1.damage = 50;
  phase1.difficulty = "boss";

  // =====================
  // PHASE 2 — FUNCTION & SLOPE
  // =====================
  const phase2Pool = [stage10w2, stage11w2, stage12w2];
  let phase2Func = phase2Pool[Math.floor(Math.random()*phase2Pool.length)];
  let phase2 = phase2Func();
  phase2.id = "boss_p2";
  phase2.stage = 17;
  phase2.damage = 55;
  phase2.difficulty = "boss";

  // =====================
  // PHASE 3 — SPLDV
  // =====================
  const phase3Pool = [stage13w2, stage14w2, stage15w2, stage16w2];
  let phase3Func = phase3Pool[Math.floor(Math.random()*phase3Pool.length)];
  let phase3 = phase3Func();
  phase3.id = "boss_p3";
  phase3.stage = 17;
  phase3.damage = 60;
  phase3.difficulty = "boss";

  // =====================
  // FINAL OBJECT
  // =====================
  return {
    id: "bossW2",
    stage: 17,
    topic: "Solarius the Equinox",
    difficulty: "boss",
    phases: [phase1, phase2, phase3]
  };
}

// ===============================
// ROUTER WORLD 2 (ALGEBRA)
// ===============================
export function generateQuestionW2(stageNum){

  const map = {
    1: stage1w2,
    2: stage2w2,
    3: stage3w2,
    4: stage4w2,
    5: stage5w2,
    6: stage6w2,
    7: stage7w2,
    8: stage8w2,
    9: stage9w2,
    10: stage10w2,
    11: stage11w2,
    12: stage12w2,
    13: stage13w2,
    14: stage14w2,
    15: stage15w2,
    16: stage16w2,
    17: bossStageW2   // kalau boss sudah kamu buat
  };

  const generator = map[stageNum];

  if(!generator){
    console.error("Stage World 2 tidak ditemukan:", stageNum);
    return null;
  }

  return generator();
}