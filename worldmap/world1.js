import { shuffle, generateOptionsNumber } from "../engine/mathUtils.js";

// ===============================
// WORLD 1: THE ROOT FLOOR
// ===============================

// ---------- HELPER UTILITIES ----------
function makeInstanceId(baseId) {
  return `${baseId}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function optionKey(value) {
  return `${typeof value}:${String(value)}`;
}

function isValidOption(value) {
  return value !== undefined
    && value !== null
    && !(typeof value === "number" && Number.isNaN(value));
}

function buildFallbackOption(correct, index, attempt) {
  if (typeof correct === "number" && Number.isFinite(correct)) {
    const offsets = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
    return correct + (offsets[attempt % offsets.length] || index + 1);
  }

  return `Opsi ${index + 1}`;
}

function normalizeOptions(correct, candidates = [], minOptions = 4) {
  const options = [];
  const used = new Set();

  const addOption = (value) => {
    if (!isValidOption(value)) return;

    const key = optionKey(value);
    if (used.has(key)) return;

    used.add(key);
    options.push(value);
  };

  addOption(correct);
  candidates.forEach(addOption);

  let attempt = 0;
  while (options.length < minOptions && attempt < 100) {
    addOption(buildFallbackOption(correct, options.length, attempt));
    attempt++;
  }

  return shuffle(options.slice(0, minOptions));
}

function generateOptionsText(correct, wrongList = [], fallbackList = []) {
  const candidates = [
    ...(wrongList || []),
    ...(fallbackList || [])
  ].filter(opt => opt !== correct);

  return normalizeOptions(correct, candidates, 4);
}

function generateOptionsNumberSafe(correct, wrongList = []) {
  let generated = [];

  try {
    generated = generateOptionsNumber(correct) || [];
  } catch (error) {
    console.warn("Gagal membuat opsi angka:", error);
  }

  return normalizeOptions(correct, [...wrongList, ...generated], 4);
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
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }

  return a;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

function toSuperscript(n) {
  const map = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹"
  };

  return n.toString().split("").map(d => map[d]).join("");
}

function sqrtSymbol(n) {
  return `√${n}`;
}

function toSuperscriptDigits(str) {
  const map = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "-": "⁻"
  };

  return String(str).split("").map(ch => map[ch] || ch).join("");
}

function toSubscriptDigits(str) {
  const map = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
    "-": "₋"
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

function fractionValue(num, den) {
  return num / den;
}

function isSameFractionValue(num1, den1, num2, den2) {
  return Math.abs(fractionValue(num1, den1) - fractionValue(num2, den2)) < 1e-9;
}

function formatDecimal(value) {
  if (Number.isInteger(value)) return `${value}`;
  return Number(value.toFixed(3)).toString();
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

    if (!Number.isFinite(finalResult) || !Number.isInteger(finalResult)) {
      return null;
    }
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
  const safeOptions = Array.isArray(options) ? options : [];

  return {
    id,
    instanceId: makeInstanceId(id),
    stage,
    topic,
    question,
    options: safeOptions,
    correct,
    damage,
    difficulty
  };
}

function validateQuestion(questionObj) {
  if (!questionObj || typeof questionObj !== "object") return false;
  if (!questionObj.id || !questionObj.question || !questionObj.topic) return false;
  if (!Array.isArray(questionObj.options) || questionObj.options.length < 2) return false;
  if (!questionObj.options.some(opt => opt === questionObj.correct)) return false;

  const uniqueOptions = new Set(questionObj.options.map(optionKey));
  return uniqueOptions.size === questionObj.options.length;
}

function validateBossQuestion(bossObj) {
  if (!bossObj || !Array.isArray(bossObj.phases)) return false;
  return bossObj.phases.every(validateQuestion);
}

function makeBossPhase(questionObj, phaseId, damage) {
  const originalStage = questionObj.stage;

  return {
    ...questionObj,
    id: phaseId,
    instanceId: makeInstanceId(phaseId),
    sourceStage: originalStage,
    timerStage: originalStage,
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
  const limit = 20;

  let a = randInt(-limit, limit);
  let b = randInt(-limit, limit);

  let op = Math.random() < 0.5 ? "+" : "-";
  let correct = op === "+" ? a + b : a - b;

  return createQuestion({
    id: "stage1w1",
    stage: 1,
    topic: "Penjumlahan & Pengurangan Bilangan Bulat",
    question: `${formatInt(a, true)} ${op} ${formatInt(b)} = ... `,
    options: generateOptionsNumberSafe(correct),
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
    options: generateOptionsNumberSafe(correct),
    correct,
    damage: 15,
    difficulty: "easy"
  });
}

// Stage 3
function stage3w1() {
  const resultLimit = 15;
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
    options: generateOptionsNumberSafe(correct),
    correct,
    damage: 18,
    difficulty: "medium"
  });
}

// Stage 4
function stage4w1() {
  const ops = ["+", "-", "×", "÷"];

  const numberLimit = 15;
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
      options: generateOptionsNumberSafe(problem.value),
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
    options: generateOptionsNumberSafe(12),
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
  const type = Math.random() < 0.5 ? "biasa" : "campuran";

  let num, den, whole = 0, fracNum = 0;

  if (type === "biasa") {
    num = randInt(2, 20);
    den = randInt(2, 20);
  } else {
    whole = randInt(1, 5);
    den = randInt(2, 10);
    fracNum = randInt(1, den - 1);
    num = whole * den + fracNum;
  }

  const factor = gcd(num, den);
  const simpNum = num / factor;
  const simpDen = den / factor;
  const correct = formatSimplifiedFractionText(num, den, type === "campuran");

  const question = type === "biasa"
    ? `Sederhanakan ${formatFractionText(num, den)}`
    : `Sederhanakan ${formatMixedNumberText(whole, fracNum, den)}`;

  const wrongFractions = [
    [num, den],
    [simpNum + 1, simpDen],
    [Math.max(1, simpNum - 1), simpDen],
    [simpNum, simpDen + 1],
    [simpNum + 1, simpDen + 1],
    [simpNum * 2, simpDen + 1],
    [simpNum + 2, Math.max(2, simpDen - 1)]
  ];

  const wrongOptions = [];

  for (const [wrongNum, wrongDen] of wrongFractions) {
    if (wrongDen === 0) continue;
    if (isSameFractionValue(wrongNum, wrongDen, simpNum, simpDen)) continue;

    const wrongText = formatSimplifiedFractionText(wrongNum, wrongDen, false);

    if (wrongText !== correct && !wrongOptions.includes(wrongText)) {
      wrongOptions.push(wrongText);
    }

    if (wrongOptions.length === 3) break;
  }

  return createQuestion({
    id: "stage5w1",
    stage: 5,
    topic: "Penyederhanaan Pecahan",
    question,
    options: generateOptionsText(correct, wrongOptions),
    correct,
    damage: 20,
    difficulty: "medium"
  });
}

// Stage 6
function stage6w1() {
  const denominators = [2, 4, 5, 10];
  const type = Math.random() < 0.5 ? "biasa" : "campuran";

  let num, den, whole = 0;
  den = denominators[randInt(0, denominators.length - 1)];

  if (type === "campuran") {
    whole = randInt(1, 4);
    num = randInt(1, den - 1);
  } else {
    num = randInt(1, den - 1);
  }

  const value = whole + num / den;
  const correct = formatDecimal(value);

  const question = type === "biasa"
    ? `Ubah ${formatFractionText(num, den)} ke bentuk desimal`
    : `Ubah ${formatMixedNumberText(whole, num, den)} ke bentuk desimal`;

  const wrongOptions = [
    formatDecimal(value + 0.1),
    formatDecimal(Math.max(0, value - 0.1)),
    formatDecimal(value + 0.2),
    formatDecimal(value + 1),
    formatDecimal(Math.max(0, value - 1))
  ].filter(opt => opt !== correct);

  return createQuestion({
    id: "stage6w1",
    stage: 6,
    topic: "Pecahan ke Desimal",
    question,
    options: generateOptionsText(correct, wrongOptions),
    correct,
    damage: 20,
    difficulty: "medium"
  });
}

// Stage 7
function randomFractionValue() {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    const b = randInt(2, 10);
    const a = randInt(1, b * 2);
    return { str: formatFractionText(a, b), val: a / b };
  }

  if (type === 1) {
    const whole = randInt(1, 4);
    const b = randInt(2, 8);
    const a = randInt(1, b - 1);
    return { str: formatMixedNumberText(whole, a, b), val: whole + a / b };
  }

  const d = round2(randInt(10, 500) / 100);
  return { str: formatDecimal(d), val: d };
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
    options: ["<", ">", "="],
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// Stage 8
function stage8w1() {
  const arr = [];
  let guard = 0;

  while (arr.length < 4 && guard < 100) {
    const item = randomFractionValue();

    if (!arr.some(x => Math.abs(x.val - item.val) < 1e-9)) {
      arr.push(item);
    }

    guard++;
  }

  if (arr.length < 4) {
    const fallback = [
      { str: formatFractionText(1, 2), val: 0.5 },
      { str: "1", val: 1 },
      { str: formatMixedNumberText(1, 1, 2), val: 1.5 },
      { str: "2", val: 2 }
    ];

    for (const item of fallback) {
      if (!arr.some(x => Math.abs(x.val - item.val) < 1e-9)) {
        arr.push(item);
      }

      if (arr.length >= 4) break;
    }
  }

  const selected = arr.slice(0, 4);
  const ascending = Math.random() < 0.5;
  const sorted = [...selected].sort((a, b) => ascending ? a.val - b.val : b.val - a.val);
  const joinSymbol = ascending ? " < " : " > ";
  const correct = sorted.map(x => x.str).join(joinSymbol);

  const wrongOptions = [];

  const addWrong = (items) => {
    const candidate = items.map(x => x.str).join(joinSymbol);

    if (candidate !== correct && !wrongOptions.includes(candidate)) {
      wrongOptions.push(candidate);
    }
  };

  addWrong(selected);
  addWrong([...sorted].reverse());

  let attempt = 0;
  while (wrongOptions.length < 3 && attempt < 50) {
    addWrong(shuffle([...selected]));
    attempt++;
  }

  return createQuestion({
    id: "stage8w1",
    stage: 8,
    topic: "Mengurutkan Bilangan",
    question: `Urutkan dari ${ascending ? "terkecil ke terbesar" : "terbesar ke terkecil"}: ${selected.map(x => x.str).join(", ")}`,
    options: generateOptionsText(correct, wrongOptions),
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
  let n = Math.floor(Math.random() * 501);
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
  const primePool = [2, 2, 3, 3, 5, 5, 7, 11, 13];

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
  const correct = primeFactorization(n);

  const wrongCandidates = [
    `${n}`,
    `${factors[0] * factors[1]} × ${factors.slice(2).join(" × ")}`,
    `${factors[0]} × ${factors[1]} × ${factors.slice(2).reduce((a, b) => a * b, 1)}`,
    `${factors.map((f, i) => i === 0 ? f + 1 : f).join(" × ")}`
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
    options: generateOptionsNumberSafe(correct),
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

  let a = Math.floor(Math.random() * 20) + 10;
  let b = Math.floor(Math.random() * 20) + 10;

  let correct, question;

  if (type === 0) {
    let item1, item2;

    do {
      item1 = items[Math.floor(Math.random() * items.length)];
      item2 = items[Math.floor(Math.random() * items.length)];
    } while (item1 === item2);

    correct = gcd(a, b);

    question = `${a} ${item1} dan ${b} ${item2} akan dimasukkan ke dalam beberapa kotak dengan jumlah yang sama banyak. Jumlah kotak maksimum adalah ...`;
  } else if (type === 1) {
    let person = people[Math.floor(Math.random() * people.length)];

    correct = gcd(a, b);

    question = `Terdapat ${a} ${person} laki-laki dan ${b} ${person} perempuan. Mereka akan dibagi ke dalam beberapa kelompok dengan jumlah yang sama. Banyak kelompok maksimum adalah ...`;
  } else if (type === 2) {
    let activity = activities[Math.floor(Math.random() * activities.length)];

    let p, q;

    do {
      p = Math.floor(Math.random() * 6) + 3;
      q = Math.floor(Math.random() * 6) + 3;
    } while (p === q);

    correct = lcm(p, q);

    question = `Ani melakukan ${activity} setiap ${p} hari sekali dan Budi setiap ${q} hari sekali. Mereka akan melakukannya bersama lagi setelah ... hari`;
  } else {
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
    options: generateOptionsNumberSafe(correct),
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
  const type = Math.floor(Math.random() * 3);

  const a = randInt(2, 6);
  const b = randInt(2, 4);

  let question, correct, options;

  if (type === 0) {
    question = `${a}${toSuperscript(b)} = ... `;
    correct = Math.pow(a, b);
    options = generateOptionsNumberSafe(correct);
  } else if (type === 1) {
    const mult = Array(b).fill(a).join(" × ");
    question = `${a}${toSuperscript(b)} sama dengan ...`;
    correct = mult;

    const wrongPool = [
      `${a} × ${b}`,
      Array(b).fill(b).join(" × "),
      Array(Math.max(1, b - 1)).fill(a).join(" × "),
      Array(b + 1).fill(a).join(" × "),
      `${a} + ${a} + ${a}`
    ];

    options = generateOptionsText(correct, wrongPool);
  } else {
    const mult = Array(b).fill(a).join(" × ");
    question = `${mult} dapat ditulis sebagai ...`;
    correct = `${a}${toSuperscript(b)}`;

    const wrongPool = [
      `${b}${toSuperscript(a)}`,
      `${a}${toSuperscript(Math.max(1, b - 1))}`,
      `${a} × ${b}`,
      `${a}${toSuperscript(b + 1)}`,
      `${a + 1}${toSuperscript(b)}`
    ];

    options = generateOptionsText(correct, wrongPool);
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
    options: generateOptionsNumberSafe(correct),
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
    options: generateOptionsNumberSafe(correct),
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// Stage 16
function stage16w1() {
  let type = Math.floor(Math.random() * 6);

  let a = Math.floor(Math.random() * 8) + 2;
  let b = Math.floor(Math.random() * 6) + 2;
  let c = Math.floor(Math.random() * 4) + 1;

  let a2 = a * a;
  let b2 = b * b;
  let c2 = c * c;

  let question, correct;

  if (type === 0) {
    question = `${a}${toSuperscript(2)} + √(${b2}) = ... `;
    correct = a2 + b;
  } else if (type === 1) {
    question = `${a}${toSuperscript(2)} - √(${b2}) = ... `;
    correct = a2 - b;
  } else if (type === 2) {
    question = `√(${a2}) + ${b}${toSuperscript(2)} = ... `;
    correct = a + b2;
  } else if (type === 3) {
    question = `√(${a2}) × ${b}${toSuperscript(2)} = ... `;
    correct = a * b2;
  } else if (type === 4) {
    question = `√(${a2 * b2}) + ${c}${toSuperscript(2)} = ... `;
    correct = (a * b) + c2;
  } else {
    question = `${a}${toSuperscript(2)} + √(${b2 * c2}) = ... `;
    correct = a2 + (b * c);
  }

  return createQuestion({
    id: "stage16w1",
    stage: 16,
    topic: "Operasi Campuran Pangkat dan Akar",
    question,
    options: generateOptionsNumberSafe(correct),
    correct,
    damage: 30,
    difficulty: "hard"
  });
}

// ===============================
// BOSS STAGE WORLD 1
// ===============================
function bossStageW1() {
  const phase1Pool = [stage4w1];
  const phase1Func = phase1Pool[randInt(0, phase1Pool.length - 1)];
  const phase1 = makeBossPhase(phase1Func(), "boss_p1", 35);
  phase1.topic = "Phase 1 - Operasi Campuran Bilangan Bulat";

  const phase2Pool = [stage7w1, stage8w1];
  const phase2Func = phase2Pool[randInt(0, phase2Pool.length - 1)];
  const phase2 = makeBossPhase(phase2Func(), "boss_p2", 45);
  phase2.topic = "Phase 2 - Pecahan dan Desimal";

  const phase3Pool = [stage10w1, stage11w1, stage12w1];
  const phase3Func = phase3Pool[randInt(0, phase3Pool.length - 1)];
  const phase3 = makeBossPhase(phase3Func(), "boss_p3", 55);
  phase3.topic = "Phase 3 - FPB, KPK, dan Bilangan Prima";

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

  const question = generator();
  const isValid = stageNum === 17
    ? validateBossQuestion(question)
    : validateQuestion(question);

  if (!isValid) {
    console.warn("Soal World 1 tidak valid:", question);
  }

  return question;
}