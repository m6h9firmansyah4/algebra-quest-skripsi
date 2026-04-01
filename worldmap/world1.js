import { shuffle, generateOptionsNumber } from "../engine/mathUtils.js";

// ===============================
// WORLD 1: THE ROOT FLOOR
// ===============================

// ---------- HELPER UTILITIES ----------
function generateOptionsText(correct, wrongList) {
  let options = new Set();
  options.add(correct);

  while (options.size < 4) {
    let rand = wrongList[Math.floor(Math.random() * wrongList.length)];
    if (rand !== correct) options.add(rand);
  }

  return shuffle([...options]);
}

function formatInt(n) {
  return n >= 0 ? `${n}` : `(${n})`;
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

// ===============================
// ZONA 1 – BILANGAN BULAT
// ===============================

// Stage 1
function stage1w1() {

  let a = Math.floor(Math.random() * 21) - 10;
  let b = Math.floor(Math.random() * 21) - 10;

  let op = Math.random() < 0.5 ? "+" : "-";

  let correct = op === "+" ? a + b : a - b;

  return createQuestion({
    id: "stage1w1",
    stage: 1,
    topic: "Penjumlahan & Pengurangan Bilangan Bulat",
    question: `${formatInt(a)} ${op} ${formatInt(b)} = ?`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 10,
    difficulty: "easy"
  });
}

// Stage 2
function stage2w1() {

  let a = Math.floor(Math.random() * 13) - 6;
  let b = Math.floor(Math.random() * 13) - 6;

  let correct = a * b;

  return createQuestion({
    id: "stage2w1",
    stage: 2,
    topic: "Perkalian Bilangan Bulat",
    question: `${formatInt(a)} × ${formatInt(b)} = ?`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 15,
    difficulty: "easy"
  });
}

function stage3w1() {

  let result = Math.floor(Math.random() * 10) - 5;
  if (result === 0) result = 2;

  let divisor = Math.floor(Math.random() * 9) - 4;
  if (divisor === 0) divisor = 2;

  let dividend = result * divisor;

  let correct = result;

  return createQuestion({
    id: "stage3w1",
    stage: 3,
    topic: "Pembagian Bilangan Bulat",
    question: `${formatInt(dividend)} ÷ ${formatInt(divisor)} = ?`,
    options: generateOptionsNumber(correct),
    correct,
    damage: 18,
    difficulty: "medium"
  });
}

// Stage 4
function stage4w1() {

  const ops = ["+", "-", "×", "÷"];

  // jumlah operasi 3–5
  let totalOps = Math.floor(Math.random() * 3) + 3;

  let numbers = [];
  let operators = [];

  // angka pertama
  let current = Math.floor(Math.random() * 11) - 5;
  numbers.push(current);

  for (let i = 0; i < totalOps; i++) {

    let op = ops[Math.floor(Math.random() * ops.length)];

    let next;

    if (op === "÷") {
      let divisor = Math.floor(Math.random() * 5) + 1;
      next = divisor;
      current = current / divisor;
    } else if (op === "×") {
      let mult = Math.floor(Math.random() * 5) + 1;
      next = mult;
      current = current * mult;
    } else if (op === "+") {
      let add = Math.floor(Math.random() * 11) - 5;
      next = add;
      current = current + add;
    } else {
      let sub = Math.floor(Math.random() * 11) - 5;
      next = sub;
      current = current - sub;
    }

    numbers.push(next);
    operators.push(op);
  }

  // buat string soal
  let expr = formatInt(numbers[0]);
  for (let i = 0; i < operators.length; i++) {
    expr += ` ${operators[i]} ${formatInt(numbers[i + 1])}`;
  }

  let correct = current;

  return createQuestion({
    id: "stage4w1",
    stage: 4,
    topic: "Operasi Campuran Bilangan Bulat",
    question: `${expr} = ?`,
    options: generateOptionsNumber(correct),
    correct,
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

  let num, den, whole = 0;

  if (type === "biasa") {
    num = Math.floor(Math.random() * 18) + 2;
    den = Math.floor(Math.random() * 18) + 2;
  } else {
    whole = Math.floor(Math.random() * 5) + 1;
    num = Math.floor(Math.random() * 8) + 1;
    den = Math.floor(Math.random() * 8) + 2;
    num = whole * den + num; // jadi pecahan biasa
  }

  let factor = gcd(num, den);
  let simpNum = num / factor;
  let simpDen = den / factor;

  let correct = `${simpNum}/${simpDen}`;

  let question = type === "biasa"
    ? `Sederhanakan ${num}/${den}`
    : `Sederhanakan ${whole} ${num - whole*den}/${den}`;

  return createQuestion({
    id: "stage5w1",
    stage: 5,
    topic: "Penyederhanaan Pecahan",
    question,
    options: generateOptionsText(correct, [
      `${num}/${den}`,
      `${simpNum}/${den}`,
      `${num}/${simpDen}`,
      `${simpNum * 2}/${simpDen * 2}`
    ]),
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
  num = Math.floor(Math.random() * den);

  if (type === "campuran") {
    whole = Math.floor(Math.random() * 4) + 1;
  }

  let value = whole + num / den;
  let correct = value.toFixed(2);

  let question = type === "biasa"
    ? `Ubah ${num}/${den} ke bentuk desimal`
    : `Ubah ${whole} ${num}/${den} ke bentuk desimal`;

  return createQuestion({
    id: "stage6w1",
    stage: 6,
    topic: "Pecahan ke Desimal",
    question,
    options: generateOptionsText(correct, [
      (value + 0.1).toFixed(2),
      (value - 0.1).toFixed(2),
      (value * 10).toFixed(2),
      (value / 10).toFixed(2)
    ]),
    correct,
    damage: 20,
    difficulty: "medium"
  });
}

// Stage 7
function stage7w1() {

  function randomValue() {
    let type = Math.floor(Math.random()*3);

    if (type === 0) {
      let a = Math.floor(Math.random()*8)+1;
      let b = Math.floor(Math.random()*8)+2;
      return { str: `${a}/${b}`, val: a/b };
    }
    else if (type === 1) {
      let whole = Math.floor(Math.random()*4)+1;
      let a = Math.floor(Math.random()*5)+1;
      let b = Math.floor(Math.random()*5)+2;
      return { str: `${whole} ${a}/${b}`, val: whole + a/b };
    }
    else {
      let d = (Math.random()*5).toFixed(2);
      return { str: d, val: parseFloat(d) };
    }
  }

  let left = randomValue();
  let right = randomValue();

  let correct = left.val > right.val ? ">" : left.val < right.val ? "<" : "=";

  return createQuestion({
    id: "stage7w1",
    stage: 7,
    topic: "Perbandingan Nilai",
    question: `${left.str} ... ${right.str}`,
    options: ["<", ">", "=", "tidak tahu"],
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// Stage 8
function stage8w1() {

  function randomValue() {
    let type = Math.floor(Math.random()*3);

    if (type === 0) {
      let a = Math.floor(Math.random()*8)+1;
      let b = Math.floor(Math.random()*8)+2;
      return { str: `${a}/${b}`, val: a/b };
    }
    else if (type === 1) {
      let whole = Math.floor(Math.random()*4)+1;
      let a = Math.floor(Math.random()*5)+1;
      let b = Math.floor(Math.random()*5)+2;
      return { str: `${whole} ${a}/${b}`, val: whole + a/b };
    }
    else {
      let d = (Math.random()*5).toFixed(2);
      return { str: d, val: parseFloat(d) };
    }
  }

  let arr = [randomValue(), randomValue(), randomValue(), randomValue()];

  let ascending = Math.random() < 0.5;

  let sorted = [...arr].sort((a,b)=> ascending ? a.val - b.val : b.val - a.val);

  let correct = sorted.map(x=>x.str).join(" < ");

  let options = [
    correct,
    arr.map(x=>x.str).join(" < "),
    sorted.slice().reverse().map(x=>x.str).join(" < "),
    shuffle(arr).map(x=>x.str).join(" < ")
  ];

  return createQuestion({
    id: "stage8w1",
    stage: 8,
    topic: "Mengurutkan Bilangan",
    question: `Urutkan dari ${ascending ? "terkecil ke terbesar" : "terbesar ke terkecil"}: ${arr.map(x=>x.str).join(", ")}`,
    options: shuffle(options),
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

  let n = Math.floor(Math.random() * 100) + 2;

  let isPrimeActual = isPrime(n);

  // kadang kita balik pernyataan
  let statementTruth = Math.random() < 0.5 ? isPrimeActual : !isPrimeActual;

  let question = `Bilangan ${n} adalah bilangan prima. Pernyataan tersebut ...`;

  let correct = statementTruth ? "Benar" : "Salah";

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

  let n = Math.floor(Math.random() * 900) + 100; // 100–999

  let correct = primeFactorization(n);

  let wrong1 = `${n}`; // tidak difaktorkan
  let wrong2 = primeFactorization(n).split(" × ").reverse().join(" × ");
  let wrong3 = `${Math.floor(n/2)} × 2`;

  return createQuestion({
    id: "stage10w1",
    stage: 10,
    topic: "Faktorisasi Prima",
    question: `Faktorisasi prima dari ${n} adalah ...`,
    options: shuffle([correct, wrong1, wrong2, wrong3]),
    correct,
    damage: 25,
    difficulty: "medium"
  });
}

// Stage 11
function stage11w1() {

  let count = Math.random() < 0.5 ? 2 : 3;

  let nums = [];
  for (let i = 0; i < count; i++) {
    nums.push(Math.floor(Math.random() * 20) + 2);
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
    let item1 = items[Math.floor(Math.random() * items.length)];
    let item2 = items[Math.floor(Math.random() * items.length)];

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

    let p = Math.floor(Math.random() * 6) + 3; // 3–8
    let q = Math.floor(Math.random() * 6) + 3;

    correct = lcm(p, q);

    question = `Ani melakukan ${activity} setiap ${p} hari sekali dan Budi setiap ${q} hari sekali. Mereka akan melakukannya bersama lagi setelah ... hari`;
  }

  else {
    // KPK peristiwa berulang
    let event = events[Math.floor(Math.random() * events.length)];

    let p = Math.floor(Math.random() * 6) + 2;
    let q = Math.floor(Math.random() * 6) + 2;

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
    // nilai pangkat
    let sup = toSuperscript(b);
    question = `${a}${sup} = ?`;
    correct = Math.pow(a, b);
    options = generateOptionsNumber(correct);
  }

  else if (type === 1) {
    // pangkat → perkalian
    let sup = toSuperscript(b);
    let mult = Array(b).fill(a).join(" × ");
    question = `${a}${sup} sama dengan ...`;
    correct = mult;

    options = shuffle([
      mult,
      `${a} × ${b}`,
      `${b} × ${b} × ${b}`,
      `${a} × ${a} × ${b} × ${b}`
    ]);
  }

  else {
    // perkalian → pangkat
    let mult = Array(b).fill(a).join(" × ");
    let sup = toSuperscript(b);
    question = `${mult} dapat ditulis sebagai ...`;
    correct = `${a}${sup}`;

    options = shuffle([
      `${a}${sup}`,
      `${b}${toSuperscript(a)}`,
      `${a}${toSuperscript(b-1)}`,
      `${a} × ${b}`
    ]);
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
    question = `${a}${toSuperscript(m)} × ${a}${toSuperscript(n)} = ?`;
    correct = Math.pow(a, m + n);
  } else {
    question = `${a}${toSuperscript(m)} ÷ ${a}${toSuperscript(n)} = ?`;
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

  let question = `${sqrtSymbol(square)} = ?`;
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

  let a = Math.floor(Math.random() * 8) + 2;
  let b = Math.floor(Math.random() * 6) + 1;

  let question, correct;

  // 1. √(a²)
  if (type === 0) {
    question = `√(${a}${toSuperscript(2)}) = ?`;
    correct = a;
  }

  // 2. √(a² × b²)
  else if (type === 1) {
    question = `√(${a}${toSuperscript(2)} × ${b}${toSuperscript(2)}) = ?`;
    correct = a * b;
  }

  // 3. √(a²) + b
  else if (type === 2) {
    question = `√(${a}${toSuperscript(2)}) + ${b} = ?`;
    correct = a + b;
  }

  // 4. √(a²) − b
  else if (type === 3) {
    question = `√(${a}${toSuperscript(2)}) - ${b} = ?`;
    correct = a - b;
  }

  // 5. a² + √(b²)
  else if (type === 4) {
    question = `${a}${toSuperscript(2)} + √(${b}${toSuperscript(2)}) = ?`;
    correct = (a * a) + b;
  }

  // 6. (√(a²))²
  else {
    question = `(√(${a}${toSuperscript(2)}))${toSuperscript(2)} = ?`;
    correct = a * a;
  }

  return createQuestion({
    id: "stage16w1",
    stage: 16,
    topic: "Campuran Pangkat & Akar",
    question,
    options: generateOptionsNumber(correct),
    correct,
    damage: 30,
    difficulty: "hard"
  });
}

// ===============================
// ROUTER WORLD 1 (NUMBERS)
// ===============================
export function generateQuestionW1(stageNum){

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
  };

  const generator = map[stageNum];

  if(!generator){
    console.error("Stage World 1 tidak ditemukan:", stageNum);
    return null;
  }

  return generator();
}