import { shuffle, generateOptionsNumber } from "../engine/mathUtils.js";

// ===============================
// WORLD 2: ISLE OF EQUINOX (FULL RANDOM)
// ===============================

// ---------- HELPER UTILITIES ----------

function formatConstant(num) {
  if (num === 0) return "";
  return num > 0 ? ` + ${num}` : ` - ${Math.abs(num)}`;
}

function formatTerm(coef, variable, isFirst = false) {
  if (coef === 0) return "";

  const absCoef = Math.abs(coef);
  const core = absCoef === 1 ? `${variable}` : `${absCoef}${variable}`;

  if (isFirst) {
    return coef < 0 ? `-${core}` : core;
  }

  return coef < 0 ? ` - ${core}` : ` + ${core}`;
}

function buildAlgebraExpression(terms, constant = 0) {
  let result = "";
  let hasTerm = false;

  for (const [coef, variable] of terms) {
    if (coef === 0) continue;
    result += formatTerm(coef, variable, !hasTerm);
    hasTerm = true;
  }

  if (!hasTerm) {
    return `${constant}`;
  }

  if (constant !== 0) {
    result += formatConstant(constant);
  }

  return result.trim();
}

function formatConstantFirstEquation(coef, variable, constant) {
  const absCoef = Math.abs(coef);
  const core = absCoef === 1 ? `${variable}` : `${absCoef}${variable}`;

  if (constant === 0) {
    return formatTerm(coef, variable, true);
  }

  if (coef > 0) {
    return `${constant} + ${core}`;
  }

  return `${constant} - ${core}`;
}

function formatInsideBracket(variable, constant) {
  if (constant === 0) return variable;
  return `${variable} ${constant >= 0 ? "+ " + constant : "- " + Math.abs(constant)}`;
}

function compareInequality(left, sign, right) {
  if (sign === ">") return left > right;
  if (sign === "<") return left < right;
  if (sign === "≥") return left >= right;
  if (sign === "≤") return left <= right;
  return false;
}

function countIntegerSolutionsInRange(minVal, maxVal, checkFn) {
  let count = 0;
  for (let x = minVal; x <= maxVal; x++) {
    if (checkFn(x)) count++;
  }
  return count;
}

function formatSet(arr) {
  return `{${[...new Set(arr)].sort((a, b) => a - b).join(", ")}}`;
}

function formatLinearExpression(m, c, variable = "x") {
  let first;

  if (m === 1) first = `${variable}`;
  else if (m === -1) first = `-${variable}`;
  else first = `${m}${variable}`;

  if (c === 0) return first;
  return c > 0 ? `${first} + ${c}` : `${first} - ${Math.abs(c)}`;
}

function formatLinearEquation(m, c, variable = "x") {
  return `y = ${formatLinearExpression(m, c, variable)}`;
}

function generateOptionsText(correct, wrongList) {
  let pool = [...new Set((wrongList || []).filter(opt => opt !== correct && opt !== ""))];
  return shuffle([correct, ...pool]).slice(0, 4);
}

function makeBossPhaseW2(questionObj, phaseId, damage) {
  const originalStage = questionObj.stage;

  return {
    ...questionObj,
    id: phaseId,
    sourceStage: originalStage,
    timerStage: originalStage,
    stage: 17,
    damage,
    difficulty: "boss"
  };
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
    question: `Pada sebuah ${context}, digunakan skala 1:${scale}. Jika jarak pada gambar adalah ${map} cm, maka jarak sebenarnya adalah ... cm`,
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

  let correct = buildAlgebraExpression([
    [coefV1, v1],
    [coefV2, v2]
  ], e);

  let wrongCandidates = [
    buildAlgebraExpression([[a - c, v1], [b + d, v2]], e),
    buildAlgebraExpression([[coefV1, v1], [-coefV2, v2]], e),
    buildAlgebraExpression([[coefV1, v1], [coefV2, v2]], 0),
    buildAlgebraExpression([[coefV1 + 1, v1], [coefV2, v2]], e)
  ];

  let options = [correct, ...new Set(wrongCandidates.filter(opt => opt !== correct))];

  while (options.length < 4) {
    const extra = buildAlgebraExpression([[coefV1 + options.length, v1], [coefV2, v2]], e);
    if (!options.includes(extra)) options.push(extra);
  }

  options = shuffle(options.slice(0, 4));

  return createQuestion({
    id: "stage4w2",
    stage: 4,
    topic: "Penyederhanaan Aljabar (Coconut King)",
    question: `Sederhanakan bentuk berikut: <br> ${expr}`,
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
  let v = vars[Math.floor(Math.random() * vars.length)];

  let sol = Math.floor(Math.random() * 10) + 1;

  let a = Math.floor(Math.random() * 7) - 3;
  if (a === 0) a = 2;

  let b = Math.floor(Math.random() * 11) - 5;
  let right = a * sol + b;

  let leftStandard = buildAlgebraExpression([[a, v]], b);
  let leftConstantFirst = formatConstantFirstEquation(a, v, b);
  let isolatedTerm = formatTerm(a, v, true);
  let rightIsolated = right - b;

  let forms = [
    `${leftStandard} = ${right}`,
    `${leftConstantFirst} = ${right}`,
    `${right} = ${leftStandard}`,
    `${isolatedTerm} = ${rightIsolated}`
  ];

  forms = [...new Set(forms)];
  let question = forms[Math.floor(Math.random() * forms.length)];

  return createQuestion({
    id: "stage5w2",
    stage: 5,
    topic: "PLSV Dasar (Mummy of Equality)",
    question: `Tentukan nilai ${v} dari persamaan: <br> ${question}`,
    options: generateOptionsNumber(sol),
    correct: sol,
    damage: 25,
    difficulty: "medium"
  });
}

function stage6w2() {
  const vars = ["x","y","a","b","m","n","p","q"];
  let v = vars[Math.floor(Math.random() * vars.length)];

  let sol = Math.floor(Math.random() * 10) + 1;
  let type = Math.floor(Math.random() * 2);

  let question;
  let correct = sol;

  if (type === 0) {
    let a = Math.floor(Math.random() * 6) + 2;
    let b = Math.floor(Math.random() * 11) - 5;
    let c = a * sol + b;

    question = `${buildAlgebraExpression([[a, v]], b)} = ${c}`;
  } else {
    let a = Math.floor(Math.random() * 6) + 2;
    let b = Math.floor(Math.random() * 7) - 3;
    let c = a * (sol + b);

    question = `${a}(${formatInsideBracket(v, b)}) = ${c}`;
  }

  return createQuestion({
    id: "stage6w2",
    stage: 6,
    topic: "PLSV Lanjutan (Scorpion Solver)",
    question: `Tentukan nilai ${v} dari persamaan berikut:<br>${question}`,   
    options: generateOptionsNumber(correct),
    correct,
    damage: 30,
    difficulty: "medium"
  });
}

function stage7w2() {
  const vars = ["x","y","a","b","m","n","p","q"];
  let v = vars[Math.floor(Math.random() * vars.length)];

  const minRange = -10;
  const maxRange = 10;
  const signs = [">", "<", "≥", "≤"];

  for (let attempt = 0; attempt < 50; attempt++) {
    let type = Math.floor(Math.random() * 3);
    let sign = signs[Math.floor(Math.random() * signs.length)];

    let expr;
    let correct;

    if (type === 0) {
      // Bentuk: x > k, x ≤ k, dst.
      let k = Math.floor(Math.random() * 17) - 8; // -8 s.d. 8

      expr = `${v} ${sign} ${k}`;
      correct = countIntegerSolutionsInRange(minRange, maxRange, x =>
        compareInequality(x, sign, k)
      );
    }

    else if (type === 1) {
      // Bentuk: ax + b > c
      let a = Math.floor(Math.random() * 4) + 2; // 2..5
      let b = Math.floor(Math.random() * 11) - 5; // -5..5
      let c = Math.floor(Math.random() * 21) - 10; // -10..10

      expr = `${buildAlgebraExpression([[a, v]], b)} ${sign} ${c}`;
      correct = countIntegerSolutionsInRange(minRange, maxRange, x =>
        compareInequality(a * x + b, sign, c)
      );
    }

    else {
      // Bentuk: a(x + b) ≤ c
      let a = Math.floor(Math.random() * 3) + 2; // 2..4
      let b = Math.floor(Math.random() * 9) - 4; // -4..4
      let c = Math.floor(Math.random() * 25) - 12; // -12..12

      expr = `${a}(${formatInsideBracket(v, b)}) ${sign} ${c}`;
      correct = countIntegerSolutionsInRange(minRange, maxRange, x =>
        compareInequality(a * (x + b), sign, c)
      );
    }

    // Hindari soal yang terlalu ekstrem: semua benar / semua salah
    if (correct <= 0 || correct >= (maxRange - minRange + 1)) continue;

    return createQuestion({
      id: "stage7w2",
      stage: 7,
      topic: "Pertidaksamaan (Cactus Trap)",
      question: `Perhatikan pertidaksamaan berikut:<br>${expr}<br>Pada himpunan bilangan bulat dari ${minRange} sampai ${maxRange}, banyak nilai ${v} yang memenuhi adalah ...`,
      options: generateOptionsNumber(correct),
      correct,
      damage: 30,
      difficulty: "medium"
    });
  }

  // fallback aman
  return createQuestion({
    id: "stage7w2",
    stage: 7,
    topic: "Pertidaksamaan (Cactus Trap)",
    question: `Perhatikan pertidaksamaan berikut:<br>x > 2<br>Pada himpunan bilangan bulat dari -10 sampai 10, banyak nilai x yang memenuhi adalah ...`,
    options: generateOptionsNumber(8),
    correct: 8,
    damage: 30,
    difficulty: "medium"
  });
}

function stage8w2() {
  const sumContexts = [
    ["apel", "jeruk"],
    ["buku", "pensil"],
    ["kelereng merah", "kelereng biru"],
    ["siswa putra", "siswa putri"],
    ["mangga", "pisang"]
  ];

  const diffContexts = [
    ["umur Ali", "umur Budi"],
    ["tinggi Andi", "tinggi Beni"],
    ["jumlah buku Rina", "jumlah buku Sinta"],
    ["jumlah permen Tono", "jumlah permen Toni"]
  ];

  const ratioContexts = [
    ["buku", "pensil"],
    ["kelereng merah", "kelereng biru"],
    ["apel", "jeruk"],
    ["siswa putra", "siswa putri"],
    ["mangga", "pisang"]
  ];

  let type = Math.floor(Math.random() * 3);
  let question, correct;

  if (type === 0) {
    let [itemA, itemB] = sumContexts[Math.floor(Math.random() * sumContexts.length)];
    let other = Math.floor(Math.random() * 10) + 2;
    let target = Math.floor(Math.random() * 10) + 3;
    let total = target + other;

    correct = target;
    question = `Jumlah ${itemA} dan ${itemB} adalah ${total}. Jika ${itemB} berjumlah ${other}, berapakah jumlah ${itemA}?`;
  }

  else if (type === 1) {
    let [itemBig, itemSmall] = diffContexts[Math.floor(Math.random() * diffContexts.length)];
    let small = Math.floor(Math.random() * 10) + 3;
    let diff = Math.floor(Math.random() * 5) + 2;
    let big = small + diff;

    correct = small;
    question = `Selisih ${itemBig} dan ${itemSmall} adalah ${diff}. Jika nilai yang lebih besar adalah ${big}, berapakah nilai yang lebih kecil?`;
  }

  else {
    let [itemA, itemB] = ratioContexts[Math.floor(Math.random() * ratioContexts.length)];
    let ratioA = Math.floor(Math.random() * 4) + 1;
    let ratioB = Math.floor(Math.random() * 4) + 1;
    let unit = Math.floor(Math.random() * 5) + 2;

    let partA = ratioA * unit;
    let partB = ratioB * unit;
    let total = partA + partB;

    correct = partA;
    question = `Perbandingan ${itemA} dan ${itemB} adalah ${ratioA}:${ratioB}. Jumlah keduanya ${total}. Berapakah banyak ${itemA}?`;
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
  let size = Math.floor(Math.random() * 2) + 3; // 3 atau 4 pasangan

  let pairs = [];
  let xSet = new Set();
  let ySet = new Set();

  while (pairs.length < size) {
    let x = Math.floor(Math.random() * 7) + 1;
    let y = Math.floor(Math.random() * 7) + 1;

    if (!pairs.some(p => p[0] === x && p[1] === y)) {
      pairs.push([x, y]);
      xSet.add(x);
      ySet.add(y);
    }
  }

  let askDomain = Math.random() < 0.5;

  let correctArr = askDomain ? [...xSet] : [...ySet];
  let oppositeArr = askDomain ? [...ySet] : [...xSet];
  let sumArr = [...new Set(pairs.map(p => p[0] + p[1]))];
  let subsetArr = correctArr.slice(0, Math.max(1, correctArr.length - 1));

  let correct = formatSet(correctArr);

  let wrongCandidates = [
    formatSet(oppositeArr),
    formatSet(sumArr),
    formatSet(subsetArr),
    formatSet([...correctArr, Math.max(...correctArr) + 1])
  ];

  let options = [correct, ...new Set(wrongCandidates.filter(opt => opt !== correct))];

  while (options.length < 4) {
    let extraArr = [...correctArr];
    extraArr[0] = extraArr[0] + options.length;
    let extra = formatSet(extraArr);
    if (!options.includes(extra)) options.push(extra);
  }

  options = shuffle(options.slice(0, 4));

  return createQuestion({
    id: "stage9w2",
    stage: 9,
    topic: "Relasi & Domain/Range (Lizard of Domain)",
    question: `Diberikan relasi berikut:<br>${pairs.map(p => `(${p[0]},${p[1]})`).join(", ")}<br>Tentukan ${askDomain ? "domain" : "range"}.`,
    options,
    correct,
    damage: 30,
    difficulty: "medium"
  });
}
function stage10w2() {
  let type = Math.floor(Math.random() * 3);

  let a = Math.floor(Math.random() * 5) + 1;
  let b = Math.floor(Math.random() * 7) - 3;
  let input = Math.floor(Math.random() * 6) + 1;

  let expr;
  let correct;

  if (type === 0) {
    expr = `${a}x`;
    correct = a * input;
  } else if (type === 1) {
    expr = buildAlgebraExpression([[a, "x"]], b);
    correct = a * input + b;
  } else {
    expr = formatConstantFirstEquation(a, "x", b);
    correct = a * input + b;
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
  let type = Math.floor(Math.random() * 3);
  let m = Math.floor(Math.random() * 4) + 1;

  let question;

  if (type === 0) {
    let x1 = 1;
    let y1 = Math.floor(Math.random() * 5) + 1;
    let x2 = x1 + 2;
    let y2 = y1 + m * 2;

    question = `Kemiringan garis melalui (${x1},${y1}) dan (${x2},${y2}) adalah ...`;
  } 
  else if (type === 1) {
    let x1 = 2;
    let y1 = Math.floor(Math.random() * 5) + 1;
    let x2 = x1 + 1;
    let y2 = y1 + m;

    question = `Jika x berubah dari ${x1} ke ${x2} dan y dari ${y1} ke ${y2}, maka kemiringan garis adalah ...`;
  } 
  else {
    let x = Math.floor(Math.random() * 5) + 1;
    let y = m * x;

    question = `Kemiringan garis yang melalui titik (0,0) dan (${x},${y}) adalah ...`;
  }

  return createQuestion({
    id: "stage11w2",
    stage: 11,
    topic: "Kemiringan Garis (Slope Goat)",
    question,
    options: generateOptionsNumber(m),
    correct: m,
    damage: 35,
    difficulty: "hard"
  });
}

function stage12w2() {
  let type = Math.floor(Math.random() * 3);

  let m = Math.floor(Math.random() * 4) + 1;
  let c = Math.floor(Math.random() * 6) - 2;

  let correct;
  let question;

  correct = formatLinearEquation(m, c);

  if (type === 0) {
    question = `Tentukan persamaan garis dengan kemiringan ${m} dan memotong sumbu Y di ${c}.`; 
  } 
  else if (type === 1) {
    let x = Math.floor(Math.random() * 4) + 1;
    let y = m * x + c;

    question = `Tentukan persamaan garis dengan kemiringan ${m} yang melalui titik (${x},${y}).`;
  } 
  else {
    let x1 = 1;
    let y1 = m * x1 + c;
    let x2 = 3;
    let y2 = m * x2 + c;

    question = `Tentukan persamaan garis melalui titik (${x1},${y1}) dan (${x2},${y2}).`;
  }

  let wrongCandidates = [
    formatLinearEquation(c === 0 ? 2 : c, m),                 // tukar kemiringan dan konstanta
    formatLinearEquation(m, c === 0 ? 1 : -c),                // balik tanda konstanta
    formatLinearEquation(m + 1, c),                           // kemiringan salah
    formatLinearEquation(Math.max(1, m - 1), c + 1)           // kombinasi salah lain
  ];

  let options = [correct, ...new Set(wrongCandidates.filter(opt => opt !== correct))];

  while (options.length < 4) {
    let extra = formatLinearEquation(m + options.length, c);
    if (!options.includes(extra)) options.push(extra);
  }

  options = shuffle(options.slice(0, 4));

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
  let v1 = vars[Math.floor(Math.random() * vars.length)];
  let v2 = vars[Math.floor(Math.random() * vars.length)];
  while (v2 === v1) v2 = vars[Math.floor(Math.random() * vars.length)];

  let sol1 = Math.floor(Math.random() * 6) + 1;
  let sol2 = Math.floor(Math.random() * 6) + 1;

  let a = Math.floor(Math.random() * 3) + 1;
  let b = Math.floor(Math.random() * 3) + 1;
  let c = a * sol1 + b * sol2;

  let type = Math.floor(Math.random() * 2);
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

  let expr1 = buildAlgebraExpression([
    [a, v1],
    [b, v2]
  ]);

  return createQuestion({
    id: "stage13w2",
    stage: 13,
    topic: "SPLDV Substitusi (Magma Slime)",
    question: `Diketahui:<br>${expr1} = ${c}<br>${eq2}<br>Tentukan nilai ${target}.`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 40,
    difficulty: "hard"
  });
}

function stage14w2() {
  const vars = ["x","y","a","b","m","n","p","q"];
  let v1 = vars[Math.floor(Math.random() * vars.length)];
  let v2 = vars[Math.floor(Math.random() * vars.length)];
  while (v2 === v1) v2 = vars[Math.floor(Math.random() * vars.length)];

  let mode = Math.floor(Math.random() * 2); // 0 = eliminasi umum, 1 = campuran jumlah-selisih

  let ask, correct, question;

  if (mode === 0) {
    // =========================
    // MODE 1: SPLDV ELIMINASI UMUM
    // =========================
    let sol1 = Math.floor(Math.random() * 6) + 1;
    let sol2 = Math.floor(Math.random() * 6) + 1;

    let a1, b1, a2, b2;

    do {
      a1 = Math.floor(Math.random() * 3) + 1;
      b1 = Math.floor(Math.random() * 3) + 1;
      a2 = Math.floor(Math.random() * 3) + 1;
      b2 = Math.floor(Math.random() * 3) + 1;
    } while (a1 * b2 === a2 * b1); // hindari sistem sejenis

    let c1 = a1 * sol1 + b1 * sol2;
    let c2 = a2 * sol1 + b2 * sol2;

    ask = Math.random() < 0.5 ? v1 : v2;
    correct = ask === v1 ? sol1 : sol2;

    let expr1 = buildAlgebraExpression([
      [a1, v1],
      [b1, v2]
    ]);

    let expr2 = buildAlgebraExpression([
      [a2, v1],
      [b2, v2]
    ]);

    question = `Selesaikan sistem berikut:<br>${expr1} = ${c1}<br>${expr2} = ${c2}<br>Nilai ${ask} adalah ...`;
  }

  else {
    // =========================
    // MODE 2: SPLDV CAMPURAN (JUMLAH-SELISIH)
    // =========================
    let sol1 = Math.floor(Math.random() * 6) + 1;
    let sol2 = Math.floor(Math.random() * 6) + 1;

    let eq1 = sol1 + sol2;
    let eq2 = sol1 - sol2;

    let type = Math.floor(Math.random() * 2);
    let systemText;

    if (type === 0) {
      systemText = `${v1} + ${v2} = ${eq1}<br>${v1} - ${v2} = ${eq2}`;
    } else {
      systemText = `${v2} + ${v1} = ${eq1}<br>${v2} - ${v1} = ${-eq2}`;
    }

    ask = Math.random() < 0.5 ? v1 : v2;
    correct = ask === v1 ? sol1 : sol2;

    question = `Selesaikan sistem berikut:<br>${systemText}<br>Nilai ${ask} adalah ...`;
  }

  return createQuestion({
    id: "stage14w2",
    stage: 14,
    topic: "SPLDV Eliminasi & Campuran (Ash Phantom)",
    question,
    options: generateOptionsNumber(correct),
    correct,
    damage: 40,
    difficulty: "hard"
  });
}

function stage15w2() {
  const vars = ["x", "y", "a", "b", "m", "n", "p", "q"];
  let v1 = vars[Math.floor(Math.random() * vars.length)];
  let v2 = vars[Math.floor(Math.random() * vars.length)];
  while (v2 === v1) v2 = vars[Math.floor(Math.random() * vars.length)];

  let type = Math.floor(Math.random() * 3);

  let question, correct, wrongCandidates;

  if (type === 0) {
    // jumlah & selisih
    let sum = Math.floor(Math.random() * 10) + 10;
    let diff = Math.floor(Math.random() * 5) + 2;

    correct = `${v1} + ${v2} = ${sum}<br>${v1} - ${v2} = ${diff}`;

    wrongCandidates = [
      `${v1} + ${v2} = ${diff}<br>${v1} - ${v2} = ${sum}`,
      `${v1} - ${v2} = ${sum}<br>${v1} + ${v2} = ${diff}`,
      `2${v1} + ${v2} = ${sum}<br>${v1} - ${v2} = ${diff}`,
      `${v1} + ${v2} = ${sum + 1}<br>${v1} - ${v2} = ${diff}`
    ];

    question = `Dua bilangan memiliki jumlah ${sum} dan selisih ${diff}. Jika bilangan pertama adalah ${v1} dan bilangan kedua adalah ${v2}, maka model matematikanya adalah ...`;
  }

  else if (type === 1) {
    // harga barang
    let c1 = Math.floor(Math.random() * 4) + 2;
    let c2 = Math.floor(Math.random() * 4) + 1;
    let d1 = Math.floor(Math.random() * 4) + 1;
    let d2 = Math.floor(Math.random() * 4) + 2;

    while (c1 === d1 && c2 === d2) {
      d1 = Math.floor(Math.random() * 4) + 1;
      d2 = Math.floor(Math.random() * 4) + 2;
    }

    let total1 = Math.floor(Math.random() * 20) + 20;
    let total2 = Math.floor(Math.random() * 20) + 10;

    while (total2 === total1) {
      total2 = Math.floor(Math.random() * 20) + 10;
    }

    correct = `${buildAlgebraExpression([[c1, v1], [c2, v2]])} = ${total1}<br>${buildAlgebraExpression([[d1, v1], [d2, v2]])} = ${total2}`;

    wrongCandidates = [
      `${buildAlgebraExpression([[c1, v1], [c2, v2]])} = ${total2}<br>${buildAlgebraExpression([[d1, v1], [d2, v2]])} = ${total1}`,
      `${buildAlgebraExpression([[c1, v1], [-c2, v2]])} = ${total1}<br>${buildAlgebraExpression([[d1, v1], [d2, v2]])} = ${total2}`,
      `${buildAlgebraExpression([[c1, v1], [d2, v2]])} = ${total1}<br>${buildAlgebraExpression([[d1, v1], [c2, v2]])} = ${total2}`,
      `${buildAlgebraExpression([[c1, v1], [c2, v2]])} = ${total1 + 1}<br>${buildAlgebraExpression([[d1, v1], [d2, v2]])} = ${total2}`
    ];

    question = `Harga ${c1} barang A dan ${c2} barang B adalah ${total1}, sedangkan harga ${d1} barang A dan ${d2} barang B adalah ${total2}. Jika harga barang A = ${v1} dan harga barang B = ${v2}, maka model matematikanya adalah ...`;
  }

  else {
    // umur
    let total = Math.floor(Math.random() * 15) + 20;
    let diff = Math.floor(Math.random() * 6) + 2;

    correct = `${v1} + ${v2} = ${total}<br>${v1} - ${v2} = ${diff}`;

    wrongCandidates = [
      `${v1} + ${v2} = ${diff}<br>${v1} - ${v2} = ${total}`,
      `${v2} - ${v1} = ${diff}<br>${v1} + ${v2} = ${total}`,
      `${v1} + ${v2} = ${total}<br>2${v1} - ${v2} = ${diff}`,
      `${v1} + ${v2} = ${total + 1}<br>${v1} - ${v2} = ${diff}`
    ];

    question = `Jumlah umur dua orang adalah ${total} dan selisih umur mereka adalah ${diff}. Jika umur orang pertama = ${v1} dan umur orang kedua = ${v2}, maka model matematikanya adalah ...`;
  }

  let options = [correct, ...new Set(wrongCandidates.filter(opt => opt !== correct))];

  while (options.length < 4) {
    let extra = `${v1} + ${v2} = ${10 + options.length}<br>${v1} - ${v2} = ${2 + options.length}`;
    if (!options.includes(extra)) options.push(extra);
  }

  options = shuffle(options.slice(0, 4));

  return createQuestion({
    id: "stage15w2",
    stage: 15,
    topic: "Model Matematika SPLDV (Lava Elemental)",
    question,
    options,
    correct,
    damage: 45,
    difficulty: "very hard"
  });
}

function stage16w2() {
  let type = Math.floor(Math.random() * 3);

  let correct, question;

  if (type === 0) {
    // harga barang
    let pensil = Math.floor(Math.random() * 5) + 1;
    let buku = Math.floor(Math.random() * 5) + 2;

    let eq1 = 2 * pensil + buku;
    let eq2 = pensil + buku;

    correct = pensil;

    question = `Diketahui:<br>2 pensil dan 1 buku seharga ${eq1}<br>1 pensil dan 1 buku seharga ${eq2}<br>Harga 1 pensil adalah ...`;
  } 
  else if (type === 1) {
    // kaki hewan
    let ayam = Math.floor(Math.random() * 5) + 1;
    let kambing = Math.floor(Math.random() * 5) + 1;

    let kepala = ayam + kambing;
    let kaki = 2 * ayam + 4 * kambing;

    correct = ayam;

    question = `Diketahui:<br>Jumlah kepala hewan = ${kepala}<br>Jumlah kaki hewan = ${kaki}<br>Jika hewan terdiri dari ayam dan kambing, jumlah ayam adalah ...`;
  } 
  else {
    // umur
    let older = Math.floor(Math.random() * 10) + 15;   // 15–24
    let younger = Math.floor(Math.random() * 10) + 5;  // 5–14

    if (younger > older) [older, younger] = [younger, older];

    let total = older + younger;
    let diff = older - younger;

    correct = younger;

    question = `Diketahui:<br>Jumlah umur dua orang = ${total}<br>Selisih umur mereka = ${diff}<br>Umur yang lebih muda adalah ...`;
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
  // PHASE 1 — PLSV & PERTIDAKSAMAAN
  // =====================
  const phase1Pool = [stage6w2, stage7w2, stage8w2];
  let phase1Func = phase1Pool[Math.floor(Math.random() * phase1Pool.length)];
  let phase1 = makeBossPhaseW2(phase1Func(), "boss_p1", 45);

  // =====================
  // PHASE 2 — RELASI & FUNGSI
  // =====================
  const phase2Pool = [stage9w2, stage10w2];
  let phase2Func = phase2Pool[Math.floor(Math.random() * phase2Pool.length)];
  let phase2 = phase2Func();
  phase2.id = "boss_p2";
  phase2.stage = 17;
  phase2.damage = 50;
  phase2.difficulty = "boss";

  // =====================
  // PHASE 3 — KEMIRINGAN & PERSAMAAN GARIS
  // =====================
  const phase3Pool = [stage11w2, stage12w2];
  let phase3Func = phase3Pool[Math.floor(Math.random() * phase3Pool.length)];
  let phase3 = phase3Func();
  phase3.id = "boss_p3";
  phase3.stage = 17;
  phase3.damage = 55;
  phase3.difficulty = "boss";

  // =====================
  // PHASE 4 — SPLDV
  // =====================
  const phase4Pool = [stage13w2, stage14w2, stage15w2, stage16w2];
  let phase4Func = phase4Pool[Math.floor(Math.random() * phase4Pool.length)];
  let phase4 = phase4Func();
  phase4.id = "boss_p4";
  phase4.stage = 17;
  phase4.damage = 65;
  phase4.difficulty = "boss";

  // =====================
  // FINAL OBJECT
  // =====================
  return {
    id: "bossW2",
    stage: 17,
    topic: "Solarius the Equinox",
    difficulty: "boss",
    phases: [phase1, phase2, phase3, phase4]
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