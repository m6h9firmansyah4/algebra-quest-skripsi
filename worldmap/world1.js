import { shuffle, generateOptionsNumber } from "../engine/mathUtils.js";

// ============================================================
// WORLD 1: THE ROOT FLOOR
// Generator soal matematika bidang bilangan untuk World 1.
// File ini berisi utility, template soal, stage 1-16, boss stage,
// dan router untuk memilih generator berdasarkan nomor stage.
// ============================================================

// ============================================================
// HELPER UTILITIES
// Kumpulan fungsi bantu agar pembuatan soal, opsi jawaban,
// format angka, pecahan, FPB/KPK, dan validasi soal lebih rapi.
// ============================================================
/**
 * Utility: membuat ID unik untuk setiap kemunculan soal.
 * ID ini membantu game membedakan soal yang sama ketika muncul ulang.
 */
function makeInstanceId(baseId) {
  return `${baseId}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

/**
 * Utility: membuat kunci unik berdasarkan tipe data dan nilai opsi.
 * Dipakai untuk mencegah opsi duplikat, misalnya angka 1 dan string "1".
 */
function optionKey(value) {
  return `${typeof value}:${String(value)}`;
}

/**
 * Utility: memastikan opsi jawaban tidak kosong, null, atau NaN.
 * Opsi yang tidak valid akan diabaikan saat pilihan jawaban dibuat.
 */
function isValidOption(value) {
  return (
    value !== undefined &&
    value !== null &&
    !(typeof value === "number" && Number.isNaN(value))
  );
}

/**
 * Utility: membuat opsi cadangan ketika kandidat opsi belum cukup.
 * Untuk angka, opsi dibuat dari selisih tertentu terhadap jawaban benar.
 */
function buildFallbackOption(correct, index, attempt) {
  if (typeof correct === "number" && Number.isFinite(correct)) {
    const offsets = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
    return correct + (offsets[attempt % offsets.length] || index + 1);
  }

  return `Opsi ${index + 1}`;
}

/**
 * Utility: menyusun opsi jawaban agar berisi jawaban benar, bebas duplikat,
 * memiliki jumlah minimal tertentu, lalu diacak sebelum ditampilkan.
 */
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

/**
 * Utility: membuat opsi berbentuk teks, seperti pecahan, simbol, atau pernyataan.
 * Fungsi ini tetap memastikan jawaban benar masuk dan opsi tidak berulang.
 */
function generateOptionsText(correct, wrongList = [], fallbackList = []) {
  const candidates = [...(wrongList || []), ...(fallbackList || [])].filter(
    (opt) => opt !== correct,
  );

  return normalizeOptions(correct, candidates, 4);
}

/**
 * Utility: membuat opsi angka secara aman menggunakan generateOptionsNumber.
 * Jika generator utama gagal, soal tetap memiliki opsi melalui normalizeOptions.
 */
function generateOptionsNumberSafe(correct, wrongList = []) {
  let generated = [];

  try {
    generated = generateOptionsNumber(correct) || [];
  } catch (error) {
    console.warn("Gagal membuat opsi angka:", error);
  }

  return normalizeOptions(correct, [...wrongList, ...generated], 4);
}

/**
 * Utility: memformat bilangan bulat, terutama bilangan negatif.
 * Bilangan negatif diberi tanda kurung jika berada setelah operator.
 */
function formatInt(n, isLeading = false) {
  if (n >= 0) return `${n}`;
  return isLeading ? `${n}` : `(${n})`;
}

/**
 * Utility: memformat nilai numerik, baik bilangan bulat maupun desimal.
 * Nilai dibulatkan dua angka desimal agar ekspresi soal tetap rapi.
 */
function formatValue(n, isLeading = false) {
  const v = round2(n);

  if (Number.isInteger(v)) {
    return v >= 0 ? `${v}` : isLeading ? `${v}` : `(${v})`;
  }

  return v >= 0
    ? v.toFixed(2)
    : isLeading
      ? `${v.toFixed(2)}`
      : `(${v.toFixed(2)})`;
}

/**
 * Utility: membulatkan angka ke dua angka di belakang koma.
 * Number.EPSILON digunakan untuk mengurangi kesalahan pembulatan desimal.
 */
function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Utility: memeriksa apakah suatu bilangan merupakan bilangan prima.
 * Digunakan pada stage bilangan prima dan pemilihan angka acak prima.
 */
function isPrime(n) {
  if (n < 2) return false;

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }

  return true;
}

/**
 * Utility: menghasilkan teks faktorisasi prima dari sebuah bilangan.
 * Disiapkan sebagai fungsi bantu jika dibutuhkan untuk tampilan faktorisasi.
 */
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

/**
 * Utility: mengurutkan dan mengubah daftar faktor prima menjadi teks.
 * Contoh hasil: 2 × 2 × 3.
 */
function formatPrimeFactors(factors) {
  return [...factors].sort((a, b) => a - b).join(" × ");
}

/**
 * Utility: membuat opsi pengecoh untuk soal faktorisasi prima.
 * Pengecoh dibuat dengan mengganti, menghapus, atau menambah faktor prima.
 */
function generateWrongPrimeFactorOptions(factors, correct, count = 3) {
  const primeChoices = [2, 3, 5, 7, 11, 13];
  const wrongOptions = [];

  const addOption = (candidateFactors) => {
    const cleaned = candidateFactors
      .filter((f) => primeChoices.includes(f))
      .sort((a, b) => a - b);

    if (cleaned.length < 2) return;

    const text = formatPrimeFactors(cleaned);

    if (text !== correct && !wrongOptions.includes(text)) {
      wrongOptions.push(text);
    }
  };

  let attempt = 0;

  while (wrongOptions.length < count && attempt < 100) {
    const candidate = [...factors];
    const action = randInt(0, 2);

    if (action === 0) {
      const index = randInt(0, candidate.length - 1);
      let replacement;

      do {
        replacement = primeChoices[randInt(0, primeChoices.length - 1)];
      } while (replacement === candidate[index]);

      candidate[index] = replacement;
    } else if (action === 1 && candidate.length > 3) {
      candidate.splice(randInt(0, candidate.length - 1), 1);
    } else {
      candidate.push(primeChoices[randInt(0, primeChoices.length - 1)]);
    }

    addOption(candidate);
    attempt++;
  }

  return wrongOptions;
}

/**
 * Utility: menghitung FPB/GCD dari dua bilangan menggunakan algoritma Euclid.
 * Dipakai pada soal FPB, penyederhanaan pecahan, dan validasi pecahan senilai.
 */
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

/**
 * Utility: menghitung KPK/LCM dari dua bilangan berdasarkan rumus a × b / FPB.
 * Jika salah satu bilangan bernilai 0, hasil KPK dikembalikan sebagai 0.
 */
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

/**
 * Utility: membuat dua atau tiga bilangan yang memiliki FPB lebih dari 1.
 * Fungsi ini mencegah soal FPB terlalu sering menghasilkan jawaban 1.
 */
function generateFpbNumbers(count, maxNumber = 21) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const commonFactor = randInt(2, 10);
    const maxMultiplier = Math.floor(maxNumber / commonFactor);

    if (maxMultiplier < count) continue;

    const nums = [];

    while (nums.length < count) {
      const multiplier = randInt(1, maxMultiplier);
      const candidate = commonFactor * multiplier;

      if (!nums.includes(candidate)) {
        nums.push(candidate);
      }
    }

    const correct = nums.reduce((a, b) => gcd(a, b));

    if (correct > 1) {
      return { nums, correct };
    }
  }

  return {
    nums: count === 2 ? [6, 12] : [6, 12, 18],
    correct: 6,
  };
}

/**
 * Utility: membuat opsi angka positif, bulat, valid, dan tidak duplikat.
 * Dipakai untuk soal yang jawabannya tidak boleh negatif, seperti FPB, KPK, dan luas.
 */
function generatePositiveOptionsNumberSafe(
  correct,
  wrongList = [],
  minOptions = 4,
) {
  const options = [];
  const used = new Set();

  const addOption = (value) => {
    if (typeof value !== "number") return;
    if (!Number.isFinite(value)) return;
    if (!Number.isInteger(value)) return;
    if (value <= 0) return;

    const key = optionKey(value);
    if (used.has(key)) return;

    used.add(key);
    options.push(value);
  };

  addOption(correct);

  wrongList.forEach(addOption);

  try {
    const generated = generateOptionsNumber(correct) || [];
    generated.forEach(addOption);
  } catch (error) {
    console.warn("Gagal membuat opsi angka positif:", error);
  }

  const offsets = [1, 2, 3, 5, 10, -1, -2, -3, -5, -10];
  let attempt = 0;

  while (options.length < minOptions && attempt < 100) {
    addOption(correct + offsets[attempt % offsets.length]);
    attempt++;
  }

  return shuffle(options.slice(0, minOptions));
}

/**
 * Utility: membuat sepasang bilangan dengan FPB lebih dari 1.
 * Cocok untuk soal cerita pembagian kelompok atau pembagian benda sama banyak.
 */
function generateFpbPair(minNumber = 10, maxNumber = 30) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const commonFactor = randInt(2, 10);

    const minMultiplier = Math.ceil(minNumber / commonFactor);
    const maxMultiplier = Math.floor(maxNumber / commonFactor);

    if (minMultiplier >= maxMultiplier) continue;

    const m1 = randInt(minMultiplier, maxMultiplier);
    let m2;

    do {
      m2 = randInt(minMultiplier, maxMultiplier);
    } while (m2 === m1);

    const a = commonFactor * m1;
    const b = commonFactor * m2;
    const correct = gcd(a, b);

    if (correct > 1) {
      return { a, b, correct };
    }
  }

  return { a: 18, b: 24, correct: 6 };
}

/**
 * Utility: memformat angka desimal dengan gaya Indonesia.
 * Titik desimal diganti koma, misalnya 1.5 menjadi 1,5.
 */
function formatDecimalID(value) {
  const rounded = Number(value.toFixed(2));

  if (Number.isInteger(rounded)) return `${rounded}`;

  return rounded.toString().replace(".", ",");
}

/**
 * Utility: memformat bilangan ribuan dengan pemisah titik sesuai gaya Indonesia.
 * Contoh: 12000 menjadi 12.000.
 */
function formatWholeNumberID(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Utility: membentuk teks notasi ilmiah Indonesia.
 * Contoh: 3,5 × 10⁴.
 */
function formatScientificNotationID(coefficient, exponent) {
  return `${formatDecimalID(coefficient)} × 10${toSuperscript(exponent)}`;
}

/**
 * Utility: menghasilkan seluruh kemungkinan urutan dari sebuah array.
 * Digunakan untuk membuat opsi pengecoh pada soal mengurutkan bilangan.
 */
function getPermutations(arr) {
  if (arr.length <= 1) return [arr];

  const result = [];

  arr.forEach((item, index) => {
    const rest = arr.filter((_, i) => i !== index);
    const perms = getPermutations(rest);

    perms.forEach((perm) => {
      result.push([item, ...perm]);
    });
  });

  return result;
}

/**
 * Utility: mengubah angka menjadi karakter pangkat/superscript.
 * Contoh: 12 menjadi ¹².
 */
function toSuperscript(n) {
  const map = {
    0: "⁰",
    1: "¹",
    2: "²",
    3: "³",
    4: "⁴",
    5: "⁵",
    6: "⁶",
    7: "⁷",
    8: "⁸",
    9: "⁹",
  };

  return n
    .toString()
    .split("")
    .map((d) => map[d])
    .join("");
}

/**
 * Utility: menampilkan simbol akar kuadrat pada bilangan.
 * Contoh: 16 menjadi √16.
 */
function sqrtSymbol(n) {
  return `√${n}`;
}

/**
 * Utility: mengubah digit dan tanda negatif menjadi superscript.
 * Digunakan untuk menulis pembilang pecahan secara lebih ringkas.
 */
function toSuperscriptDigits(str) {
  const map = {
    0: "⁰",
    1: "¹",
    2: "²",
    3: "³",
    4: "⁴",
    5: "⁵",
    6: "⁶",
    7: "⁷",
    8: "⁸",
    9: "⁹",
    "-": "⁻",
  };

  return String(str)
    .split("")
    .map((ch) => map[ch] || ch)
    .join("");
}

/**
 * Utility: mengubah digit dan tanda negatif menjadi subscript.
 * Digunakan untuk menulis penyebut pecahan secara lebih ringkas.
 */
function toSubscriptDigits(str) {
  const map = {
    0: "₀",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
    "-": "₋",
  };

  return String(str)
    .split("")
    .map((ch) => map[ch] || ch)
    .join("");
}

/**
 * Utility: membentuk teks pecahan dengan pembilang superscript dan penyebut subscript.
 * Contoh: 1/2 ditulis sebagai ¹⁄₂.
 */
function formatFractionText(num, den) {
  return `${toSuperscriptDigits(num)}⁄${toSubscriptDigits(den)}`;
}

/**
 * Utility: membentuk teks pecahan campuran.
 * Contoh: 1 ¹⁄₂.
 */
function formatMixedNumberText(whole, num, den) {
  return `${whole} ${formatFractionText(num, den)}`;
}

/**
 * Utility: menyederhanakan pecahan dan mengembalikannya sebagai teks.
 * Jika preferMixed aktif, pecahan tidak sejati dapat ditulis sebagai pecahan campuran.
 */
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

/**
 * Utility: mengubah pecahan menjadi nilai desimal.
 * Dipakai untuk membandingkan nilai pecahan, desimal, dan pecahan campuran.
 */
function fractionValue(num, den) {
  return num / den;
}

/**
 * Utility: memeriksa apakah dua pecahan memiliki nilai yang sama.
 * Toleransi kecil digunakan untuk menghindari masalah presisi angka desimal.
 */
function isSameFractionValue(num1, den1, num2, den2) {
  return Math.abs(fractionValue(num1, den1) - fractionValue(num2, den2)) < 1e-9;
}

/**
 * Utility: memformat angka desimal umum dengan koma sebagai pemisah desimal.
 * Fungsi ini digunakan pada stage perbandingan dan pengurutan nilai.
 */
function formatDecimal(value) {
  const rounded = Number(value.toFixed(2));

  if (Number.isInteger(rounded)) return `${rounded}`;

  return rounded.toString().replace(".", ",");
}

/**
 * Utility: menghasilkan bilangan bulat acak dalam rentang inklusif.
 * Nilai min dan max sama-sama berpeluang muncul.
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Utility: membentuk teks ekspresi operasi campuran dari daftar angka dan operator.
 * Digunakan ketika soal tidak memakai tanda kurung.
 */
function buildExpressionString(values, ops) {
  let tokens = [formatValue(values[0], true)];

  for (let i = 0; i < ops.length; i++) {
    tokens.push(ops[i], formatValue(values[i + 1]));
  }

  return tokens.join(" ");
}

/**
 * Utility: menghitung ekspresi operasi campuran dengan prioritas × dan ÷.
 * Fungsi ini hanya menerima hasil antara dan hasil akhir berupa bilangan bulat.
 */
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
        operators[i] === "×" ? nums[i] * nums[i + 1] : nums[i] / nums[i + 1];

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

/**
 * Utility: memilih satu bilangan prima acak dalam rentang tertentu.
 * Dipakai untuk membuat pernyataan benar pada stage bilangan prima.
 */
function getRandomPrime(min = 2, max = 500) {
  const primes = [];

  for (let i = min; i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }

  return primes[randInt(0, primes.length - 1)];
}

/**
 * Utility: memilih satu bilangan bukan prima dalam rentang tertentu.
 * Dipakai untuk membuat pernyataan salah pada stage bilangan prima.
 */
function getRandomNonPrime(min = 2, max = 500) {
  let n;

  do {
    n = randInt(min, max);
  } while (isPrime(n));

  return n;
}

/**
 * Utility: membangun soal operasi campuran stage 4.
 * Fungsi ini dapat menambahkan tanda kurung dan memastikan hasilnya tetap bilangan bulat.
 */
function buildStage4ProblemIntegerOnly(values, ops, useParentheses = true) {
  if (!useParentheses) {
    return {
      expr: buildExpressionString(values, ops),
      value: evaluateLinearIntegerOnly(values, ops),
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
    ...values.slice(end + 1),
  ];

  const outerOps = [...ops.slice(0, start), ...ops.slice(end)];

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
    value: finalValue,
  };
}

// ============================================================
// QUESTION TEMPLATE & VALIDATION UTILITIES
// Bagian ini membentuk struktur standar soal dan memeriksa
// apakah soal yang dibuat sudah valid sebelum dikirim ke game.
// ============================================================
/**
 * Template utility: membentuk objek soal standar yang dipakai seluruh stage.
 * Setiap soal memiliki id, instanceId, stage, topik, pertanyaan, opsi, jawaban, damage, dan difficulty.
 */
function createQuestion({
  id,
  stage,
  topic,
  question,
  options,
  correct,
  damage,
  difficulty,
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
    difficulty,
  };
}

/**
 * Validation utility: memeriksa kelengkapan dan validitas satu soal biasa.
 * Validasi memastikan opsi berbentuk array, jawaban benar tersedia, dan opsi tidak duplikat.
 */
function validateQuestion(questionObj) {
  if (!questionObj || typeof questionObj !== "object") return false;
  if (!questionObj.id || !questionObj.question || !questionObj.topic)
    return false;
  if (!Array.isArray(questionObj.options) || questionObj.options.length < 2)
    return false;
  if (!questionObj.options.some((opt) => opt === questionObj.correct))
    return false;

  const uniqueOptions = new Set(questionObj.options.map(optionKey));
  return uniqueOptions.size === questionObj.options.length;
}

/**
 * Validation utility: memeriksa validitas boss stage.
 * Setiap phase dalam boss stage harus memenuhi aturan validasi soal biasa.
 */
function validateBossQuestion(bossObj) {
  if (!bossObj || !Array.isArray(bossObj.phases)) return false;
  return bossObj.phases.every(validateQuestion);
}

/**
 * Boss utility: mengubah soal biasa menjadi phase boss.
 * Stage asli disimpan sebagai sourceStage/timerStage, sedangkan stage aktif dibuat menjadi 17.
 */
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
    difficulty: "boss",
  };
}

// ============================================================
// ZONA 1 – BILANGAN BULAT
// ============================================================

// ------------------------------------------------------------
// STAGE 1 – Penjumlahan & Pengurangan Bilangan Bulat
// Fokus: menghitung operasi tambah atau kurang pada bilangan bulat.
// ------------------------------------------------------------
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
    difficulty: "easy",
  });
}

// ------------------------------------------------------------
// STAGE 2 – Perkalian Bilangan Bulat
// Fokus: menghitung hasil perkalian dua bilangan bulat.
// ------------------------------------------------------------
function stage2w1() {
  const limit = 10;

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
    difficulty: "easy",
  });
}

// ------------------------------------------------------------
// STAGE 3 – Pembagian Bilangan Bulat
// Fokus: membagi bilangan bulat dengan hasil yang tetap bulat.
// ------------------------------------------------------------
function stage3w1() {
  const resultLimit = 10;
  const divisorLimit = 4;

  let result;
  do {
    result = randInt(-resultLimit, resultLimit);
  } while (result === 0);

  let divisor;
  do {
    divisor = randInt(-divisorLimit, divisorLimit);
  } while (divisor === 0 || Math.abs(divisor) === 1);

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
    difficulty: "medium",
  });
}

// ------------------------------------------------------------
// STAGE 4 – Operasi Campuran Bilangan Bulat
// Fokus: menyelesaikan operasi campuran dengan prioritas operasi dan tanda kurung.
// ------------------------------------------------------------
function stage4w1() {
  const ops = ["+", "-", "×", "÷"];

  const numberLimit = 10;
  const divisorLimit = 4;
  const maxAnswerAbs = 100;

  for (let attempt = 0; attempt < 100; attempt++) {
    const totalOps = 2;

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
    const problem = buildStage4ProblemIntegerOnly(
      values,
      operators,
      useParentheses,
    );

    if (!problem || problem.value === null) continue;
    if (Math.abs(problem.value) > maxAnswerAbs) continue;

    return createQuestion({
      id: "stage4w1",
      stage: 4,
      topic: "Operasi Campuran Bilangan Bulat",
      question: `${problem.expr} = ... `,
      options: generateOptionsNumberSafe(problem.value),
      correct: problem.value,
      damage: 25,
      difficulty: "medium",
    });
  }

  return createQuestion({
    id: "stage4w1",
    stage: 4,
    topic: "Operasi Campuran Bilangan Bulat",
    question: `12 ÷ 3 + 8 = ... `,
    options: generateOptionsNumberSafe(12),
    correct: 12,
    damage: 25,
    difficulty: "medium",
  });
}

// ============================================================
// ZONA 2 – PECAHAN & DESIMAL
// ============================================================

// ------------------------------------------------------------
// STAGE 5 – Penyederhanaan Pecahan
// Fokus: menyederhanakan pecahan biasa atau pecahan campuran.
// ------------------------------------------------------------
function stage5w1() {
  const type = Math.random() < 0.5 ? "biasa" : "campuran";

  let num,
    den,
    whole = 0,
    fracNum = 0;

  if (type === "biasa") {
    do {
      num = randInt(2, 20);
      den = randInt(2, 20);
    } while (gcd(num, den) === 1 || num === den || num % den === 0);
  } else {
    whole = randInt(1, 5);

    do {
      den = randInt(2, 10);
      fracNum = randInt(1, den - 1);
    } while (gcd(fracNum, den) === 1);

    num = whole * den + fracNum;
  }

  const factor = gcd(num, den);
  const simpNum = num / factor;
  const simpDen = den / factor;
  const correct = formatSimplifiedFractionText(num, den, type === "campuran");

  const question =
    type === "biasa"
      ? `Sederhanakan ${formatFractionText(num, den)}`
      : `Sederhanakan ${formatMixedNumberText(whole, fracNum, den)}`;

  const wrongFractions = [
    [num, den],
    [simpNum + 1, simpDen],
    [Math.max(1, simpNum - 1), simpDen],
    [simpNum, simpDen + 1],
    [simpNum + 1, simpDen + 1],
    [simpNum * 2, simpDen + 1],
    [simpNum + 2, Math.max(2, simpDen - 1)],
  ];

  const wrongOptions = [];

  for (const [wrongNum, wrongDen] of wrongFractions) {
    if (wrongDen === 0) continue;
    if (isSameFractionValue(wrongNum, wrongDen, simpNum, simpDen)) continue;

    const wrongText = formatSimplifiedFractionText(
      wrongNum,
      wrongDen,
      type === "campuran",
    );

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
    difficulty: "medium",
  });
}
// ------------------------------------------------------------
// STAGE 6 – Pecahan ke Desimal
// Fokus: mengubah pecahan biasa atau pecahan campuran ke bentuk desimal.
// ------------------------------------------------------------
function stage6w1() {
  const denominators = [2, 4, 5, 10];
  const type = Math.random() < 0.5 ? "biasa" : "campuran";

  let num,
    den,
    whole = 0;
  den = denominators[randInt(0, denominators.length - 1)];

  if (type === "campuran") {
    whole = randInt(1, 4);
    num = randInt(1, den - 1);
  } else {
    num = randInt(1, den - 1);
  }

  const value = whole + num / den;
  const correct = formatDecimalID(value);

  const question =
    type === "biasa"
      ? `Ubah ${formatFractionText(num, den)} ke bentuk desimal`
      : `Ubah ${formatMixedNumberText(whole, num, den)} ke bentuk desimal`;

  const wrongOptions = [
    formatDecimalID(value + 0.1),
    formatDecimalID(Math.max(0, value - 0.1)),
    formatDecimalID(value + 0.2),
    formatDecimalID(value + 1),
    formatDecimalID(Math.max(0, value - 1)),
  ].filter((opt) => opt !== correct);

  return createQuestion({
    id: "stage6w1",
    stage: 6,
    topic: "Pecahan ke Desimal",
    question,
    options: generateOptionsText(correct, wrongOptions),
    correct,
    damage: 20,
    difficulty: "medium",
  });
}

/**
 * Stage support utility: membuat nilai acak berupa pecahan biasa, pecahan campuran, atau desimal.
 * Digunakan pada stage perbandingan dan pengurutan bilangan.
 */
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

// ------------------------------------------------------------
// STAGE 7 – Perbandingan Nilai Pecahan dan Desimal
// Fokus: menentukan hubungan <, >, atau = antara dua nilai.
// ------------------------------------------------------------
function stage7w1() {
  let left = randomFractionValue();
  let right;

  if (Math.random() < 0.25) {
    right = { ...left };
  } else {
    do {
      right = randomFractionValue();
    } while (Math.abs(left.val - right.val) < 1e-9);
  }

  let correct = left.val > right.val ? ">" : left.val < right.val ? "<" : "=";

  return createQuestion({
    id: "stage7w1",
    stage: 7,
    topic: "Perbandingan Nilai",
    question: `${left.str} ... ${right.str}`,
    options: ["<", ">", "="],
    correct,
    damage: 25,
    difficulty: "medium",
  });
}
// ------------------------------------------------------------
// STAGE 8 – Mengurutkan Bilangan
// Fokus: mengurutkan pecahan/desimal dari kecil ke besar atau sebaliknya.
// ------------------------------------------------------------
function stage8w1() {
  const arr = [];
  let guard = 0;

  while (arr.length < 3 && guard < 100) {
    const item = randomFractionValue();

    if (!arr.some((x) => Math.abs(x.val - item.val) < 1e-9)) {
      arr.push(item);
    }

    guard++;
  }

  if (arr.length < 3) {
    const fallback = [
      { str: formatFractionText(1, 2), val: 0.5 },
      { str: "1", val: 1 },
      { str: formatMixedNumberText(1, 1, 2), val: 1.5 },
    ];

    for (const item of fallback) {
      if (!arr.some((x) => Math.abs(x.val - item.val) < 1e-9)) {
        arr.push(item);
      }

      if (arr.length >= 3) break;
    }
  }

  const selected = arr.slice(0, 3);
  const ascending = Math.random() < 0.5;

  const sorted = [...selected].sort((a, b) =>
    ascending ? a.val - b.val : b.val - a.val,
  );

  const joinSymbol = ascending ? " < " : " > ";
  const correct = sorted.map((x) => x.str).join(joinSymbol);

  const allWrongOptions = getPermutations(selected)
    .map((items) => items.map((x) => x.str).join(joinSymbol))
    .filter((option) => option !== correct);

  const wrongOptions = shuffle([...new Set(allWrongOptions)]).slice(0, 3);

  return createQuestion({
    id: "stage8w1",
    stage: 8,
    topic: "Mengurutkan Bilangan",
    question: `Urutkan dari ${ascending ? "terkecil ke terbesar" : "terbesar ke terkecil"}: ${selected.map((x) => x.str).join(", ")}`,
    options: generateOptionsText(correct, wrongOptions),
    correct,
    damage: 30,
    difficulty: "hard",
  });
}

// ============================================================
// ZONA 3 – FPB, KPK, DAN BILANGAN PRIMA
// ============================================================

// ------------------------------------------------------------
// STAGE 9 – Bilangan Prima
// Fokus: menentukan benar/salah suatu pernyataan tentang bilangan prima.
// ------------------------------------------------------------
function stage9w1() {
  const shouldBePrime = Math.random() < 0.5;

  const n = shouldBePrime ? getRandomPrime(2, 500) : getRandomNonPrime(2, 500);

  const correct = shouldBePrime ? "Benar" : "Salah";

  return createQuestion({
    id: "stage9w1",
    stage: 9,
    topic: "Bilangan Prima",
    question: `Bilangan ${n} adalah bilangan prima. Pernyataan tersebut ...`,
    options: ["Benar", "Salah"],
    correct,
    damage: 20,
    difficulty: "medium",
  });
}

// ------------------------------------------------------------
// STAGE 10 – Faktorisasi Prima
// Fokus: menentukan bentuk faktorisasi prima dari bilangan tiga digit.
// ------------------------------------------------------------
function stage10w1() {
  const primePool = [2, 2, 3, 3, 5, 5, 7, 11, 13];

  let factors = [];
  let n = 1;

  for (let attempt = 0; attempt < 100; attempt++) {
    factors = [];
    const factorCount = Math.random() < 0.5 ? 3 : 4;

    for (let i = 0; i < factorCount; i++) {
      factors.push(primePool[randInt(0, primePool.length - 1)]);
    }

    n = factors.reduce((a, b) => a * b, 1);

    if (n >= 100 && n <= 999) break;
  }

  factors.sort((a, b) => a - b);

  const correct = formatPrimeFactors(factors);
  const wrongOptions = generateWrongPrimeFactorOptions(factors, correct, 3);
  const options = generateOptionsText(correct, wrongOptions);

  return createQuestion({
    id: "stage10w1",
    stage: 10,
    topic: "Faktorisasi Prima",
    question: `Faktorisasi prima dari ${n} adalah ...`,
    options,
    correct,
    damage: 25,
    difficulty: "medium",
  });
}

// ------------------------------------------------------------
// STAGE 11 – FPB dan KPK
// Fokus: menghitung FPB atau KPK dari dua/tiga bilangan.
// ------------------------------------------------------------
function stage11w1() {
  const maxNumber = 21;
  const maxKpk = 300;
  const maxAttempt = 100;

  for (let attempt = 0; attempt < maxAttempt; attempt++) {
    const count = Math.random() < 0.5 ? 2 : 3;
    const type = Math.random() < 0.5 ? "FPB" : "KPK";

    let nums = [];
    let correct;

    if (type === "FPB") {
      const generated = generateFpbNumbers(count, maxNumber);

      nums = generated.nums;
      correct = generated.correct;
    } else {
      while (nums.length < count) {
        const candidate = randInt(2, maxNumber);

        if (!nums.includes(candidate)) {
          nums.push(candidate);
        }
      }

      correct = nums.reduce((a, b) => lcm(a, b));

      if (correct > maxKpk) {
        continue;
      }
    }

    return createQuestion({
      id: "stage11w1",
      stage: 11,
      topic: "FPB dan KPK",
      question: `${type} dari ${nums.join(", ")} adalah ...`,
      options: generatePositiveOptionsNumberSafe(correct),
      correct,
      damage: 30,
      difficulty: "medium",
    });
  }

  return createQuestion({
    id: "stage11w1",
    stage: 11,
    topic: "FPB dan KPK",
    question: `KPK dari 6, 8, 12 adalah ...`,
    options: generatePositiveOptionsNumberSafe(24),
    correct: 24,
    damage: 30,
    difficulty: "medium",
  });
}

// ------------------------------------------------------------
// STAGE 12 – Soal Cerita FPB dan KPK
// Fokus: menerapkan FPB/KPK dalam konteks pembagian kelompok dan kejadian berulang.
// ------------------------------------------------------------
function stage12w1() {
  const type = Math.floor(Math.random() * 4);

  let correct, question;

  if (type === 0) {
    const scenarios = [
      {
        item1: "apel",
        item2: "jeruk",
        container: "kantong",
      },
      {
        item1: "buku tulis",
        item2: "pensil",
        container: "paket alat tulis",
      },
      {
        item1: "kue cokelat",
        item2: "kue keju",
        container: "kotak",
      },
      {
        item1: "bola merah",
        item2: "bola biru",
        container: "keranjang",
      },
    ];

    const scenario = scenarios[randInt(0, scenarios.length - 1)];
    const generated = generateFpbPair(10, 30);

    const a = generated.a;
    const b = generated.b;
    correct = generated.correct;

    question = `${a} ${scenario.item1} dan ${b} ${scenario.item2} akan dibagi ke dalam beberapa ${scenario.container}. Setiap ${scenario.container} berisi jumlah ${scenario.item1} yang sama dan jumlah ${scenario.item2} yang sama tanpa sisa. Banyak ${scenario.container} maksimum adalah ...`;
  } else if (type === 1) {
    const scenarios = [
      {
        male: "siswa laki-laki",
        female: "siswa perempuan",
      },
      {
        male: "peserta putra",
        female: "peserta putri",
      },
      {
        male: "anak laki-laki",
        female: "anak perempuan",
      },
      {
        male: "anggota tim putra",
        female: "anggota tim putri",
      },
    ];

    const scenario = scenarios[randInt(0, scenarios.length - 1)];
    const generated = generateFpbPair(10, 30);

    const a = generated.a;
    const b = generated.b;
    correct = generated.correct;

    question = `Terdapat ${a} ${scenario.male} dan ${b} ${scenario.female}. Mereka akan dibagi ke dalam beberapa kelompok. Setiap kelompok memiliki jumlah ${scenario.male} yang sama dan jumlah ${scenario.female} yang sama tanpa sisa. Banyak kelompok maksimum adalah ...`;
  } else if (type === 2) {
    const scenarios = [
      {
        name1: "Ani",
        name2: "Budi",
        activity: "mengikuti latihan",
      },
      {
        name1: "Rina",
        name2: "Doni",
        activity: "belajar kelompok",
      },
      {
        name1: "Siti",
        name2: "Raka",
        activity: "berolahraga",
      },
      {
        name1: "Maya",
        name2: "Andi",
        activity: "mengikuti les",
      },
    ];

    const scenario = scenarios[randInt(0, scenarios.length - 1)];

    let p, q;

    do {
      p = randInt(3, 8);
      q = randInt(3, 8);
    } while (p === q);

    correct = lcm(p, q);

    question = `${scenario.name1} dan ${scenario.name2} ${scenario.activity} bersama hari ini. ${scenario.name1} ${scenario.activity} setiap ${p} hari sekali, sedangkan ${scenario.name2} setiap ${q} hari sekali. Mereka akan ${scenario.activity} bersama lagi setelah ... hari`;
  } else {
    const scenarios = [
      {
        object1: "Lampu A",
        object2: "Lampu B",
        action: "berkedip",
      },
      {
        object1: "Alarm A",
        object2: "Alarm B",
        action: "berbunyi",
      },
      {
        object1: "Bel A",
        object2: "Bel B",
        action: "berbunyi",
      },
      {
        object1: "Mesin A",
        object2: "Mesin B",
        action: "menyala",
      },
    ];

    const scenario = scenarios[randInt(0, scenarios.length - 1)];

    let p, q;

    do {
      p = randInt(2, 7);
      q = randInt(2, 7);
    } while (p === q);

    correct = lcm(p, q);

    question = `${scenario.object1} ${scenario.action} setiap ${p} detik, sedangkan ${scenario.object2} ${scenario.action} setiap ${q} detik. Jika keduanya ${scenario.action} bersamaan sekarang, keduanya akan ${scenario.action} bersamaan lagi setelah ... detik`;
  }

  return createQuestion({
    id: "stage12w1",
    stage: 12,
    topic: "Soal Cerita FPB & KPK",
    question,
    options: generatePositiveOptionsNumberSafe(correct),
    correct,
    damage: 35,
    difficulty: "hard",
  });
}

// ============================================================
// ZONA 4 – PANGKAT, AKAR, DAN NOTASI ILMIAH
// ============================================================

// ------------------------------------------------------------
// STAGE 13 – Konsep Pangkat
// Fokus: memahami nilai pangkat, perkalian berulang, dan bentuk pangkat.
// ------------------------------------------------------------
function stage13w1() {
  const type = Math.floor(Math.random() * 3);

  const a = randInt(2, 6);
  const b = randInt(2, 4);

  let question, correct, options;

  if (type === 0) {
    question = `Nilai dari ${a}${toSuperscript(b)} adalah ...`;
    correct = Math.pow(a, b);

    const wrongPool = [
      a * b,
      a + b,
      Math.pow(a, b - 1),
      Math.pow(a, b + 1),
      Math.pow(b, a),
    ].filter(
      (opt) =>
        opt !== correct &&
        Number.isFinite(opt) &&
        Number.isInteger(opt) &&
        opt > 0,
    );

    options = generateOptionsNumberSafe(correct, wrongPool);
  } else if (type === 1) {
    const mult = Array(b).fill(a).join(" × ");

    question = `Bentuk perkalian berulang dari ${a}${toSuperscript(b)} adalah ...`;
    correct = mult;

    const wrongPool = [
      `${a} × ${b}`,
      Array(b).fill(b).join(" × "),
      Array(Math.max(1, b - 1))
        .fill(a)
        .join(" × "),
      Array(b + 1)
        .fill(a)
        .join(" × "),
      Array(b).fill(a).join(" + "),
    ];

    options = generateOptionsText(correct, wrongPool);
  } else {
    const mult = Array(b).fill(a).join(" × ");

    question = `Bentuk pangkat yang sesuai dengan ${mult} adalah ...`;
    correct = `${a}${toSuperscript(b)}`;

    const wrongPool = [];

    const addWrongPower = (base, exp) => {
      const text = `${base}${toSuperscript(exp)}`;
      const value = Math.pow(base, exp);
      const correctValue = Math.pow(a, b);

      if (
        text !== correct &&
        value !== correctValue &&
        !wrongPool.includes(text)
      ) {
        wrongPool.push(text);
      }
    };

    addWrongPower(b, a);
    addWrongPower(a, Math.max(1, b - 1));
    addWrongPower(a, b + 1);
    addWrongPower(a + 1, b);
    addWrongPower(Math.max(2, a - 1), b);

    wrongPool.push(`${a} × ${b}`);

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
    difficulty: "medium",
  });
}
// ------------------------------------------------------------
// STAGE 14 – Akar Kuadrat
// Fokus: menentukan akar kuadrat dari bilangan kuadrat sempurna.
// ------------------------------------------------------------
function stage14w1() {
  let base = Math.floor(Math.random() * 15) + 2;
  let square = base * base;

  let question = `${sqrtSymbol(square)} = ... `;
  let correct = base;

  return createQuestion({
    id: "stage14w1",
    stage: 14,
    topic: "Akar Kuadrat",
    question,
    options: generateOptionsNumberSafe(correct),
    correct,
    damage: 25,
    difficulty: "medium",
  });
}

// ------------------------------------------------------------
// STAGE 15 – Notasi Ilmiah
// Fokus: mengubah bilangan biasa ke notasi ilmiah dan sebaliknya.
// ------------------------------------------------------------
function stage15w1() {
  const type = Math.random() < 0.5 ? "toScientific" : "toStandard";

  const coefficientTimes10 = randInt(10, 99);
  const coefficient = coefficientTimes10 / 10;
  const exponent = randInt(3, 6);

  const standardNumber = coefficientTimes10 * Math.pow(10, exponent - 1);
  const scientificText = formatScientificNotationID(coefficient, exponent);
  const standardText = formatWholeNumberID(standardNumber);

  let question, correct, wrongOptions;

  if (type === "toScientific") {
    question = `Bentuk notasi ilmiah dari ${standardText} adalah ...`;
    correct = scientificText;

    const wrongCoefficient =
      coefficient < 8.9 ? coefficient + 1 : coefficient - 1;

    wrongOptions = [
      formatScientificNotationID(coefficient, exponent - 1),
      formatScientificNotationID(coefficient, exponent + 1),
      formatScientificNotationID(coefficientTimes10, exponent - 1),
      formatScientificNotationID(wrongCoefficient, exponent),
    ];
  } else {
    question = `Nilai dari ${scientificText} dalam bentuk bilangan biasa adalah ...`;
    correct = standardText;

    wrongOptions = [
      formatWholeNumberID(standardNumber / 10),
      formatWholeNumberID(standardNumber * 10),
      formatWholeNumberID(
        (coefficientTimes10 + 1) * Math.pow(10, exponent - 1),
      ),
      formatWholeNumberID(
        Math.max(1, standardNumber - Math.pow(10, exponent - 1)),
      ),
    ];
  }

  return createQuestion({
    id: "stage15w1",
    stage: 15,
    topic: "Notasi Ilmiah",
    question,
    options: generateOptionsText(correct, wrongOptions),
    correct,
    damage: 25,
    difficulty: "medium",
  });
}
// ------------------------------------------------------------
// STAGE 16 – Penerapan Bilangan Berpangkat
// Fokus: menggunakan pangkat dua atau tiga dalam soal cerita sederhana.
// ------------------------------------------------------------
function stage16w1() {
  const type = randInt(0, 3);

  let question, correct, wrongList;

  if (type === 0) {
    const side = randInt(4, 12);
    correct = Math.pow(side, 2);

    question = `Sebuah lantai berbentuk persegi memiliki panjang sisi ${side} meter. Luas lantai tersebut adalah ... meter persegi`;

    wrongList = [
      side * 2,
      side * 4,
      correct + side,
      Math.max(1, correct - side),
    ];
  } else if (type === 1) {
    const edge = randInt(2, 6);
    correct = Math.pow(edge, 3);

    question = `Sebuah kubus memiliki panjang rusuk ${edge} cm. Volume kubus tersebut adalah ... cm³`;

    wrongList = [
      edge * 3,
      Math.pow(edge, 2),
      Math.pow(edge, 2) * 3,
      correct + edge,
    ];
  } else if (type === 2) {
    const amount = randInt(2, 5);
    correct = Math.pow(amount, 3);

    question = `Dalam sebuah permainan, terdapat ${amount} kelompok. Setiap kelompok memiliki ${amount} kotak, dan setiap kotak berisi ${amount} kartu. Jumlah kartu seluruhnya adalah ...`;

    wrongList = [
      amount * 3,
      Math.pow(amount, 2),
      Math.pow(amount, 2) + amount,
      correct + amount,
    ];
  } else {
    const dots = randInt(5, 12);
    correct = Math.pow(dots, 2);

    question = `Sebuah pola titik membentuk persegi dengan ${dots} titik pada setiap sisi. Banyak titik seluruhnya adalah ...`;

    wrongList = [
      dots * 2,
      dots * 4,
      correct + dots,
      Math.max(1, correct - dots),
    ];
  }

  return createQuestion({
    id: "stage16w1",
    stage: 16,
    topic: "Penerapan Bilangan Berpangkat",
    question,
    options: generatePositiveOptionsNumberSafe(correct, wrongList),
    correct,
    damage: 30,
    difficulty: "hard",
  });
}

// ============================================================
// BOSS STAGE WORLD 1
// Bagian ini menggabungkan beberapa stage sebelumnya menjadi
// rangkaian phase untuk pertarungan boss.
// ============================================================
// ------------------------------------------------------------
// STAGE 17 – Boss Stage: Akarion, Penjaga The Root Floor
// Fokus: mengambil beberapa soal dari stage sebelumnya sebagai phase boss.
// ------------------------------------------------------------
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
  phase3.topic = "Phase 3 - Faktorisasi Prima, FPB, dan KPK";

  const phase4Pool = [stage14w1, stage15w1, stage16w1];
  const phase4Func = phase4Pool[randInt(0, phase4Pool.length - 1)];
  const phase4 = makeBossPhase(phase4Func(), "boss_p4", 70);
  phase4.topic = "Phase 4 - Pangkat, Akar, dan Notasi Ilmiah";

  return {
    id: "bossW1",
    stage: 17,
    topic: "Akarion, Penjaga The Root Floor",
    difficulty: "boss",
    phases: [phase1, phase2, phase3, phase4],
  };
}

// ============================================================
// ROUTER WORLD 1 – PEMILIH GENERATOR SOAL
// Fungsi publik untuk mengambil soal berdasarkan nomor stage.
// ============================================================
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
    17: bossStageW1,
  };

  const generator = map[stageNum];

  if (!generator) {
    console.error("Stage World 1 tidak ditemukan:", stageNum);
    return null;
  }

  const question = generator();
  const isValid =
    stageNum === 17
      ? validateBossQuestion(question)
      : validateQuestion(question);

  if (!isValid) {
    console.warn("Soal World 1 tidak valid:", question);
  }

  return question;
}