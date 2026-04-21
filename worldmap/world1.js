import { shuffle, generateOptionsNumber } from "../engine/mathUtils.js";

// ===============================
// WORLD 1: THE ROOT FLOOR
// ===============================

// ---------- HELPER UTILITIES ----------
function generateOptionsText(correct, wrongList) {
  let pool = [...new Set((wrongList || []).filter(opt => opt !== correct))];
  let options = [correct, ...pool];

  return shuffle(options).slice(0, 4);
}

function formatInt(n, isLeading = false) {
  if (n >= 0) return `${n}`;
  return isLeading ? `${n}` : `(${n})`;
}

function formatValue(n, isLeading = false) {
  const v = round2(n);

  if (Number.isInteger(v)) {
    return v >= 0 ? `${v}` : (isLeading ? `${v}` : `(${v})`);
  }

  return v >= 0
    ? v.toFixed(2)
    : (isLeading ? `${v.toFixed(2)}` : `(${v.toFixed(2)})`);
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function primeFactorization(n) {
  let factors = [];
  let d = 2;
  while (n > 1) {
    while (n % d === 0) {
      factors.push(d);
      n /= d;
    }
    d++;
  }
  return factors.join(" × ");
}

function gcd(a, b) {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function toSuperscript(n) {
  const map = {
    "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴",
    "5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"
  };
  return n.toString().split("").map(d => map[d]).join("");
}

function sqrtSymbol(n) {
  return `√${n}`;
}

function toSuperscriptDigits(str) {
  const map = {
    "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴",
    "5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"
  };
  return String(str).split("").map(ch => map[ch] || ch).join("");
}

function toSubscriptDigits(str) {
  const map = {
    "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄",
    "5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","-":"₋"
  };
  return String(str).split("").map(ch => map[ch] || ch).join("");
}

function formatFractionText(num, den) {
  return `${toSuperscriptDigits(num)}⁄${toSubscriptDigits(den)}`;
}

function formatMixedNumberText(whole, num, den) {
  return `${whole} ${formatFractionText(num, den)}`;
}

function formatSimplifiedFractionText(num, den, preferMixed = false) {
  const factor = gcd(num, den);
  let n = num / factor;
  let d = den / factor;

  if (d === 1) return `${n}`;

  if (preferMixed && Math.abs(n) > d) {
    const whole = Math.trunc(n / d);
    const rem = Math.abs(n % d);

    if (rem === 0) return `${whole}`;
    return formatMixedNumberText(whole, rem, d);
  }

  return formatFractionText(n, d);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildExpressionString(values, ops) {
  let tokens = [formatValue(values[0], true)];

  for (let i = 0; i < ops.length; i++) {
    tokens.push(ops[i], formatValue(values[i + 1]));
  }

  return tokens.join(" ");
}

function evaluateLinear(values, ops) {
  let nums = [...values];
  let operators = [...ops];

  let i = 0;
  while (i < operators.length) {
    if (operators[i] === "×" || operators[i] === "÷") {
      if (operators[i] === "÷" && nums[i + 1] === 0) return null;

      let result =
        operators[i] === "×"
          ? nums[i] * nums[i + 1]
          : nums[i] / nums[i + 1];

      if (!Number.isFinite(result)) return null;

      nums.splice(i, 2, round2(result));
      operators.splice(i, 1);
    } else {
      i++;
    }
  }

  let finalResult = nums[0];
  for (let j = 0; j < operators.length; j++) {
    if (operators[j] === "+") {
      finalResult = round2(finalResult + nums[j + 1]);
    } else {
      finalResult = round2(finalResult - nums[j + 1]);
    }

    if (!Number.isFinite(finalResult)) return null;
  }

  return round2(finalResult);
}

function evaluateLinearIntegerOnly(values, ops) {
  let nums = [...values];
  let operators = [...ops];

  let i = 0;
  while (i < operators.length) {
    if (operators[i] === "×" || operators[i] === "÷") {
      if (operators[i] === "÷") {
        if (nums[i + 1] === 0) return null;
        if (!Number.isInteger(nums[i] / nums[i + 1])) return null;
      }

      let result =
        operators[i] === "×"
          ? nums[i] * nums[i + 1]
          : nums[i] / nums[i + 1];

      if (!Number.isFinite(result) || !Number.isInteger(result)) return null;

      nums.splice(i, 2, result);
      operators.splice(i, 1);
    } else {
      i++;
    }
  }

  let finalResult = nums[0];
  for (let j = 0; j < operators.length; j++) {
    if (operators[j] === "+") {
      finalResult = finalResult + nums[j + 1];
    } else {
      finalResult = finalResult - nums[j + 1];
    }

    if (!Number.isFinite(finalResult) || !Number.isInteger(finalResult)) return null;
  }

  return finalResult;
}

function buildStage4ProblemIntegerOnly(values, ops, useParentheses = true) {
  if (!useParentheses) {
    return {
      expr: buildExpressionString(values, ops),
      value: evaluateLinearIntegerOnly(values, ops)
    };
  }

  const maxStart = values.length - 2;
  const start = randInt(0, maxStart);
  const end = randInt(start + 1, Math.min(values.length - 1, start + 2));

  const innerValues = values.slice(start, end + 1);
  const innerOps = ops.slice(start, end);
  const innerValue = evaluateLinearIntegerOnly(innerValues, innerOps);

  if (innerValue === null) return null;

  const outerValues = [
    ...values.slice(0, start),
    innerValue,
    ...values.slice(end + 1)
  ];

  const outerOps = [
    ...ops.slice(0, start),
    ...ops.slice(end)
  ];

  const finalValue = evaluateLinearIntegerOnly(outerValues, outerOps);
  if (finalValue === null) return null;

  let tokens = [formatValue(values[0], true)];
  for (let i = 0; i < ops.length; i++) {
    tokens.push(ops[i], formatValue(values[i + 1]));
  }

  const startToken = start * 2;
  const endToken = end * 2;

  const innerExpr = tokens.slice(startToken, endToken + 1).join(" ");
  tokens.splice(startToken, endToken - startToken + 1, `(${innerExpr})`);

  return {
    expr: tokens.join(" "),
    value: finalValue
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
  return {
    id,
    stage,
    topic,
    question,
    options,
    correct,
    damage,
    difficulty
  };
}

function makeBossPhase(questionObj, phaseId, damage) {
  return {
    ...questionObj,
    id: phaseId,
    stage: 17,
    damage,
    difficulty: "boss"
  };
}

// ===============================
// ZONA 1 – BILANGAN BULAT
// ===============================

// Stage 1
function stage1w1() {
  const limit = 40;

  let a = randInt(-limit, limit);
  let b = randInt(-limit, limit);

  let op = Math.random() < 0.5 ? "+" : "-";
  let correct = op === "+" ? a + b : a - b;

  return createQuestion({
    id: "stage1w1",
    stage: 1,
    topic: "Penjumlahan & Pengurangan Bilangan Bulat",
    question: `${formatInt(a, true)} ${op} ${formatInt(b)} = ... `,
    options: generateOptionsNumber(correct),
    correct,
    damage: 10,
    difficulty: "easy"
  });
}

// Stage 2
function stage2w1() {
  const limit = 20;

  let a = randInt(-limit, limit);
  let b = randInt(-limit, limit);

  let correct = a * b;

  return createQuestion({
    id: "stage2w1",
    stage: 2,
    topic: "Perkalian Bilangan Bulat",
    question: `${formatInt(a, true)} × ${formatInt(b)} = ... `,
    options: generateOptionsNumber(correct),
    correct,
    damage: 15,
    difficulty: "easy"
  });
}

function stage3w1() {
  const resultLimit = 20;
  const divisorLimit = 10;

  let result;
  do {
    result = randInt(-resultLimit, resultLimit);
  } while (result === 0);

  let divisor;
  do {
    divisor = randInt(-divisorLimit, divisorLimit);
  } while (divisor === 0);

  let dividend = result * divisor;
  let correct = result;

  return createQuestion({
    id: "stage3w1",
    stage: 3,
    topic: "Pembagian Bilangan Bulat",
    question: `${formatInt(dividend, true)} ÷ ${formatInt(divisor)} = ... `,
    options: generateOptionsNumber(correct),
    correct,
    damage: 18,
    difficulty: "medium"
  });
}

// Stage 4
function stage4w1() {
  const ops = ["+", "-", "×", "÷"];

  const numberLimit = 25;
  const divisorLimit = 10;

  for (let attempt = 0; attempt < 100; attempt++) {
    const totalOps = randInt(3, 4);

    let values = [randInt(-numberLimit, numberLimit)];
    let operators = [];

    for (let i = 0; i < totalOps; i++) {
      const op = ops[Math.floor(Math.random() * ops.length)];
      let next;

      if (op === "÷") {
        next = randInt(1, divisorLimit);
      } else if (op === "×") {
        next = randInt(-6, 6);
        if (next === 0) next = 2;
      } else {
        next = randInt(-numberLimit, numberLimit);
      }

      operators.push(op);
      values.push(next);
    }

    const useParentheses = Math.random() < 0.6;
    const problem = buildStage4ProblemIntegerOnly(values, operators, useParentheses);

    if (!problem || problem.value === null) continue;

    return createQuestion({
      id: "stage4w1",
      stage: 4,
      topic: "Operasi Campuran Bilangan Bulat",
      question: `${problem.expr} = ... `,
      options: generateOptionsNumber(problem.value),
      correct: problem.value,
      damage: 25,
      difficulty: "medium"
    });
  }

  return createQuestion({
    id: "stage4w1",
    stage: 4,
    topic: "Operasi Campuran Bilangan Bulat",
    question: `12 ÷ 3 + 4 × 2 = ... `,
    options: generateOptionsNumber(12),
    correct: 12,
    damage: 25,
    difficulty: "medium"
  });
}

// ===============================
// ZONA 2 – PECAHAN & DESIMAL
// ===============================

// Stage 5
function stage5w1() {
  let type = Math.random() < 0.5 ? "biasa" : "campuran";

  let num, den, whole = 0, fracNum = 0;

  if (type === "biasa") {
    num = Math.floor(Math.random() * 18) + 2;
    den = Math.floor(Math.random() * 18) + 2;
  } else {
    whole = Math.floor(Math.random() * 5) + 1;
    den = Math.floor(Math.random() * 8) + 2;
    fracNum = Math.floor(Math.random() * (den - 1)) + 1; // 1 .. den-1
    num = whole * den + fracNum;
  }

  let factor = gcd(num, den);
  let simpNum = num / factor;
  let simpDen = den / factor;

  let correct = formatSimplifiedFractionText(num, den, type === "campuran");

  let question = type === "biasa"
    ? `Sederhanakan ${formatFractionText(num, den)}`
    : `Sederhanakan ${formatMixedNumberText(whole, fracNum, den)}`;

  let wrong1Num = num;
  let wrong1Den = den;
  if (formatFractionText(wrong1Num, wrong1Den) === correct) {
    wrong1Num = simpNum + 1;
    wrong1Den = simpDen;
  }

  let wrong2Num = simpNum;
  let wrong2Den = simpDen + 1;
  if (
    formatFractionText(wrong2Num, wrong2Den) === correct ||
    (wrong2Num === wrong1Num && wrong2Den === wrong1Den)
  ) {
    wrong2Num = simpNum + 2;
    wrong2Den = simpDen;
  }

  let wrong3Num = simpNum + 1;
  let wrong3Den = simpDen + 1;
  if (
    formatFractionText(wrong3Num, wrong3Den) === correct ||
    (wrong3Num === wrong1Num && wrong3Den === wrong1Den) ||
    (wrong3Num === wrong2Num && wrong3Den === wrong2Den)
  ) {
    wrong3Num = simpNum * 2;
    wrong3Den = simpDen + 1;
  }

  let wrong1 = formatFractionText(wrong1Num, wrong1Den);
  let wrong2 = formatFractionText(wrong2Num, wrong2Den);
  let wrong3 = formatFractionText(wrong3Num, wrong3Den);

  let options = shuffle([correct, wrong1, wrong2, wrong3]);

  return createQuestion({
    id: "stage5w1",
    stage: 5,
    topic: "Penyederhanaan Pecahan",
    question,
    options,
    correct,
    damage: 20,
    difficulty: "medium"
  });
}

// Stage 6
function stage6w1() {
  const denominators = [2, 4, 5, 8, 10];

  let type = Math.random() < 0.5 ? "biasa" : "campuran";

  let num, den, whole = 0;

  den = denominators[Math.floor(Math.random() * denominators.length)];

  if (type === "campuran") {
    whole = Math.floor(Math.random() * 4) + 1;
    num = Math.floor(Math.random() * (den - 1)) + 1;
  } else {
    num = Math.floor(Math.random() * den);
  }

  let value = whole + num / den;
  let correct = value.toFixed(2);

  let question = type === "biasa"
    ? `Ubah ${formatFractionText(num, den)} ke bentuk desimal`
    : `Ubah ${formatMixedNumberText(whole, num, den)} ke bentuk desimal`;

  let wrongCandidates = [
    (value + 0.10).toFixed(2),
    (value - 0.10).toFixed(2),
    (value + 0.20).toFixed(2),
    (value - 0.20).toFixed(2),
    (value + 1).toFixed(2),
    (value - 1).toFixed(2)
  ];

  let uniqueWrongs = [...new Set(wrongCandidates.filter(v => v !== correct))];

  while (uniqueWrongs.length < 3) {
    let extra = (value + (Math.random() * 2 - 1)).toFixed(2);
    if (extra !== correct && !uniqueWrongs.includes(extra)) {
      uniqueWrongs.push(extra);
    }
  }

  let options = shuffle([correct, ...uniqueWrongs.slice(0, 3)]);

  return createQuestion({
    id: "stage6w1",
    stage: 6,
    topic: "Pecahan ke Desimal",
    question,
    options,
    correct,
    damage: 20,
    difficulty: "medium"
  });
}

// Stage 7
function randomFractionValue() {
  let type = Math.floor(Math.random() * 3);

  if (type === 0) {
    let a = Math.floor(Math.random() * 8) + 1;
    let b = Math.floor(Math.random() * 8) + 2;
    return { str: formatFractionText(a, b), val: a / b };
  } else if (type === 1) {
    let whole = Math.floor(Math.random() * 4) + 1;
    let b = Math.floor(Math.random() * 5) + 2;
    let a = Math.floor(Math.random() * (b - 1)) + 1;
    return { str: formatMixedNumberText(whole, a, b), val: whole + a / b };
  } else {
    let d = (Math.random() * 5).toFixed(2);
    return { str: d, val: parseFloat(d) };
  }
}

function stage7w1() {
  let left = randomFractionValue();
  let right = randomFractionValue();

  let correct = left.val > right.val ? ">" : left.val < right.val ? "<" : "=";

  return createQuestion({
    id: "stage7w1",
    stage: 7,
    topic: "Perbandingan Nilai",
    question: `${left.str} ... ${right.str}`,
    options: ["<", ">", "=", "tidak dapat ditentukan"],
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// Stage 8
function stage8w1() {
  let arr = [];
  while (arr.length < 4) {
    let item = randomFractionValue();
    if (!arr.some(x => Math.abs(x.val - item.val) < 1e-9)) {
      arr.push(item);
    }
  }

  let ascending = Math.random() < 0.5;

  let sorted = [...arr].sort((a, b) => ascending ? a.val - b.val : b.val - a.val);
  let joinSymbol = ascending ? " < " : " > ";

  let correct = sorted.map(x => x.str).join(joinSymbol);

  let optionPool = [
    correct,
    arr.map(x => x.str).join(joinSymbol),
    [...sorted].reverse().map(x => x.str).join(joinSymbol)
  ];

  while (optionPool.length < 6) {
    optionPool.push(shuffle([...arr]).map(x => x.str).join(joinSymbol));
  }

  let options = [...new Set(optionPool)];

  while (options.length < 4) {
    let candidate = shuffle([...arr]).map(x => x.str).join(joinSymbol);
    if (!options.includes(candidate)) {
      options.push(candidate);
    }
  }

  options = shuffle(options.slice(0, 4));

  return createQuestion({
    id: "stage8w1",
    stage: 8,
    topic: "Mengurutkan Bilangan",
    question: `Urutkan dari ${ascending ? "terkecil ke terbesar" : "terbesar ke terkecil"}: ${arr.map(x => x.str).join(", ")}`,
    options,
    correct,
    damage: 30,
    difficulty: "hard"
  });
}

// ===============================
// ZONA 3 – FPB, KPK, PRIMA
// ===============================

// Stage 9
function stage9w1() {
  let n = Math.floor(Math.random() * 501); // 0 sampai 500
  let isPrimeActual = isPrime(n);

  let question = `Bilangan ${n} adalah bilangan prima. Pernyataan tersebut ...`;
  let correct = isPrimeActual ? "Benar" : "Salah";

  return createQuestion({
    id: "stage9w1",
    stage: 9,
    topic: "Bilangan Prima",
    question,
    options: ["Benar", "Salah"],
    correct,
    damage: 20,
    difficulty: "medium"
  });
}

// Stage 10
function stage10w1() {
  const primePool = [2, 2, 2, 3, 3, 5, 5, 7];

  let factors, n;
  do {
    factors = [];
    const factorCount = Math.random() < 0.5 ? 3 : 4;

    for (let i = 0; i < factorCount; i++) {
      factors.push(primePool[randInt(0, primePool.length - 1)]);
    }

    n = factors.reduce((a, b) => a * b, 1);
  } while (n < 100 || n > 999);

  factors.sort((a, b) => a - b);
  const correct = factors.join(" × ");

  const wrongCandidates = [
    `${n}`, // belum difaktorkan
    `${factors[0] * factors[1]} × ${factors.slice(2).join(" × ")}`, // ada faktor komposit
    `${factors[0]} × ${factors[1]} × ${factors.slice(2).reduce((a, b) => a * b, 1)}`, // gabung faktor belakang
    `${factors.map((f, i) => i === 0 ? f + 1 : f).join(" × ")}` // salah satu faktor diubah
  ];

  let options = [correct, ...new Set(wrongCandidates.filter(opt => opt !== correct))];

  while (options.length < 4) {
    const extra = `${n + randInt(1, 9)}`;
    if (!options.includes(extra)) options.push(extra);
  }

  options = shuffle(options.slice(0, 4));

  return createQuestion({
    id: "stage10w1",
    stage: 10,
    topic: "Faktorisasi Prima",
    question: `Faktorisasi prima dari ${n} adalah ...`,
    options,
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// Stage 11
function stage11w1() {

  let count = Math.random() < 0.5 ? 2 : 3;

  let nums = [];
    while (nums.length < count) {
      let candidate = Math.floor(Math.random() * 20) + 2;
      if (!nums.includes(candidate)) {
        nums.push(candidate);
      }
    }

  let type = Math.random() < 0.5 ? "FPB" : "KPK";

  let correct;

  if (type === "FPB") {
    correct = nums.reduce((a, b) => gcd(a, b));
  } else {
    correct = nums.reduce((a, b) => lcm(a, b));
  }

  return createQuestion({
    id: "stage11w1",
    stage: 11,
    topic: "FPB dan KPK",
    question: `${type} dari ${nums.join(", ")} adalah ...`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 30,
    difficulty: "medium"
  });
}

// Stage 12
function stage12w1() {

  const items = ["apel", "jeruk", "buku", "pensil", "kursi", "bola", "kue"];
  const people = ["siswa", "peserta", "anggota tim", "anak"];
  const activities = ["olahraga", "latihan", "belajar kelompok", "bermain"];
  const events = ["lampu berkedip", "alarm berbunyi", "bel berbunyi", "mesin menyala"];

  let type = Math.floor(Math.random() * 4);

  let a = Math.floor(Math.random() * 20) + 10; // 10–30
  let b = Math.floor(Math.random() * 20) + 10;

  let correct, question;

  if (type === 0) {
    // FPB pembagian barang
  let item1, item2;
    do {
      item1 = items[Math.floor(Math.random() * items.length)];
      item2 = items[Math.floor(Math.random() * items.length)];
    } while (item1 === item2);

    correct = gcd(a, b);

    question = `${a} ${item1} dan ${b} ${item2} akan dimasukkan ke dalam beberapa kotak dengan jumlah yang sama banyak. Jumlah kotak maksimum adalah ...`;
  }

  else if (type === 1) {
    // FPB kelompok
    let person = people[Math.floor(Math.random() * people.length)];

    correct = gcd(a, b);

    question = `Terdapat ${a} ${person} laki-laki dan ${b} ${person} perempuan. Mereka akan dibagi ke dalam beberapa kelompok dengan jumlah yang sama. Banyak kelompok maksimum adalah ...`;
  }

  else if (type === 2) {
    // KPK jadwal kegiatan
    let activity = activities[Math.floor(Math.random() * activities.length)];

    let p, q;
      do {
        p = Math.floor(Math.random() * 6) + 3;
        q = Math.floor(Math.random() * 6) + 3;
      } while (p === q);

    correct = lcm(p, q);

    question = `Ani melakukan ${activity} setiap ${p} hari sekali dan Budi setiap ${q} hari sekali. Mereka akan melakukannya bersama lagi setelah ... hari`;
  }

  else {
    // KPK peristiwa berulang
    let event = events[Math.floor(Math.random() * events.length)];

  let p, q;
    do {
      p = Math.floor(Math.random() * 6) + 2;
      q = Math.floor(Math.random() * 6) + 2;
    } while (p === q);

    correct = lcm(p, q);

    question = `Sebuah ${event} terjadi setiap ${p} detik dan yang lain setiap ${q} detik. Keduanya akan terjadi bersamaan lagi setelah ... detik`;
  }

  return createQuestion({
    id: "stage12w1",
    stage: 12,
    topic: "Soal Cerita FPB & KPK",
    question,
    options: generateOptionsNumber(correct),
    correct,
    damage: 35,
    difficulty: "hard"
  });
}

// ===============================
// ZONA 4 – PANGKAT & AKAR
// ===============================

// Stage 13
function stage13w1() {
  let type = Math.floor(Math.random() * 3);

  let a = Math.floor(Math.random() * 5) + 2;
  let b = Math.floor(Math.random() * 3) + 2;

  let question, correct, options;

  if (type === 0) {
    let sup = toSuperscript(b);
    question = `${a}${sup} = ... `;
    correct = Math.pow(a, b);
    options = generateOptionsNumber(correct);
  }

  else if (type === 1) {
    let sup = toSuperscript(b);
    let mult = Array(b).fill(a).join(" × ");
    question = `${a}${sup} sama dengan ...`;
    correct = mult;

    let wrongPool = [
      `${a} × ${b}`,
      `${b} × ${b} × ${b}`,
      `${a} × ${a} × ${b} × ${b}`,
      `${a} × ${a} × ${a}`
    ];

    options = shuffle([correct, ...new Set(wrongPool.filter(opt => opt !== correct))]).slice(0, 4);
  }

  else {
    let mult = Array(b).fill(a).join(" × ");
    let sup = toSuperscript(b);
    question = `${mult} dapat ditulis sebagai ...`;
    correct = `${a}${sup}`;

    let wrongPool = [
      `${b}${toSuperscript(a)}`,
      `${a}${toSuperscript(b - 1)}`,
      `${a} × ${b}`,
      `${a}${toSuperscript(b + 1)}`
    ];

    options = shuffle([correct, ...new Set(wrongPool.filter(opt => opt !== correct))]).slice(0, 4);
  }

  return createQuestion({
    id: "stage13w1",
    stage: 13,
    topic: "Konsep Pangkat",
    question,
    options,
    correct,
    damage: 20,
    difficulty: "medium"
  });
}

// Stage 14
function stage14w1() {
  let type = Math.random() < 0.5 ? "kali" : "bagi";

  let a = Math.floor(Math.random() * 5) + 2;
  let m = Math.floor(Math.random() * 4) + 2;
  let n = Math.floor(Math.random() * 3) + 1;

  let question, correct;

  if (type === "kali") {
    question = `${a}${toSuperscript(m)} × ${a}${toSuperscript(n)} = ... `;
    correct = Math.pow(a, m + n);
  } else {
    if (n > m) [m, n] = [n, m];
    question = `${a}${toSuperscript(m)} ÷ ${a}${toSuperscript(n)} = ... `;
    correct = Math.pow(a, m - n);
  }

  return createQuestion({
    id: "stage14w1",
    stage: 14,
    topic: "Sifat Pangkat",
    question,
    options: generateOptionsNumber(correct),
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// Stage 15
function stage15w1() {
  let base = Math.floor(Math.random() * 15) + 2;
  let square = base * base;

  let question = `${sqrtSymbol(square)} = ... `;
  let correct = base;

  return createQuestion({
    id: "stage15w1",
    stage: 15,
    topic: "Akar Kuadrat",
    question,
    options: generateOptionsNumber(correct),
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// Stage 16
function stage16w1() {
  let type = Math.floor(Math.random() * 6);

  let a = Math.floor(Math.random() * 8) + 2; // 2..9
  let b = Math.floor(Math.random() * 6) + 2; // 2..7
  let c = Math.floor(Math.random() * 4) + 1; // 1..4

  let a2 = a * a;
  let b2 = b * b;
  let c2 = c * c;

  let question, correct;

  // 1. a² + √(b²)
  if (type === 0) {
    question = `${a}${toSuperscript(2)} + √(${b2}) = ... `;
    correct = a2 + b;
  }

  // 2. a² - √(b²)
  else if (type === 1) {
    question = `${a}${toSuperscript(2)} - √(${b2}) = ... `;
    correct = a2 - b;
  }

  // 3. √(a²) + b²
  else if (type === 2) {
    question = `√(${a2}) + ${b}${toSuperscript(2)} = ... `;
    correct = a + b2;
  }

  // 4. √(a²) × b²
  else if (type === 3) {
    question = `√(${a2}) × ${b}${toSuperscript(2)} = ... `;
    correct = a * b2;
  }

  // 5. √(a² × b²) + c²  -> di dalam akar ditulis hasilnya
  else if (type === 4) {
    question = `√(${a2 * b2}) + ${c}${toSuperscript(2)} = ... `;
    correct = (a * b) + c2;
  }

  // 6. a² + √(b² × c²) -> di dalam akar ditulis hasilnya
  else {
    question = `${a}${toSuperscript(2)} + √(${b2 * c2}) = ... `;
    correct = a2 + (b * c);
  }

  return createQuestion({
    id: "stage16w1",
    stage: 16,
    topic: "Operasi Campuran Pangkat dan Akar",
    question,
    options: generateOptionsNumber(correct),
    correct,
    damage: 30,
    difficulty: "hard"
  });
}

function bossStageW1() {
  // Phase 1 — Bilangan Bulat
  const phase1Pool = [stage4w1];
  const phase1Func = phase1Pool[randInt(0, phase1Pool.length - 1)];
  const phase1 = makeBossPhase(phase1Func(), "boss_p1", 35);
  phase1.topic = "Phase 1 - Operasi Campuran Bilangan Bulat";

  // Phase 2 — Pecahan & Desimal
  const phase2Pool = [stage7w1, stage8w1];
  const phase2Func = phase2Pool[randInt(0, phase2Pool.length - 1)];
  const phase2 = makeBossPhase(phase2Func(), "boss_p2", 45);
  phase2.topic = "Phase 2 - Pecahan dan Desimal";

  // Phase 3 — FPB, KPK, Prima
  const phase3Pool = [stage10w1, stage11w1, stage12w1];
  const phase3Func = phase3Pool[randInt(0, phase3Pool.length - 1)];
  const phase3 = makeBossPhase(phase3Func(), "boss_p3", 55);
  phase3.topic = "Phase 3 - FPB, KPK, dan Bilangan Prima";

  // Phase 4 — Pangkat & Akar
  const phase4Pool = [stage14w1, stage15w1, stage16w1];
  const phase4Func = phase4Pool[randInt(0, phase4Pool.length - 1)];
  const phase4 = makeBossPhase(phase4Func(), "boss_p4", 70);
  phase4.topic = "Phase 4 - Pangkat dan Akar";

  return {
    id: "bossW1",
    stage: 17,
    topic: "Akarion, Penjaga The Root Floor",
    difficulty: "boss",
    phases: [phase1, phase2, phase3, phase4]
  };
}

// ===============================
// ROUTER WORLD 1 (NUMBERS)
// ===============================
export function generateQuestionW1(stageNum) {
  const map = {
    1: stage1w1,
    2: stage2w1,
    3: stage3w1,
    4: stage4w1,
    5: stage5w1,
    6: stage6w1,
    7: stage7w1,
    8: stage8w1,
    9: stage9w1,
    10: stage10w1,
    11: stage11w1,
    12: stage12w1,
    13: stage13w1,
    14: stage14w1,
    15: stage15w1,
    16: stage16w1,
    17: bossStageW1
  };

  const generator = map[stageNum];

  if (!generator) {
    console.error("Stage World 1 tidak ditemukan:", stageNum);
    return null;
  }

  return generator();
}