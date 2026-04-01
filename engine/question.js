// ===================================
// QUESTION GENERATION SYSTEM
// ===================================

// -----------------------------------
// 1. HELPER FUNCTIONS (GLOBAL)
// -----------------------------------

// Mendapatkan integer acak
window.getRandomInt = function(min, max, excludeZero = true) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (excludeZero && num === 0) return window.getRandomInt(min, max, excludeZero);
    return num;
};

// Memilih elemen acak dari array
window.getRandomItem = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

// Format bentuk aljabar ax + b
window.formatLinearExpr = function(a, variable, b) {
    let term1 = '';
    if (a === 1) term1 = variable;
    else if (a === -1) term1 = `-${variable}`;
    else term1 = `${a}${variable}`;

    let term2 = '';
    if (b > 0) term2 = ` + ${b}`;
    else if (b < 0) term2 = ` - ${Math.abs(b)}`;

    return `${term1}${term2}`;
};

// Format bentuk aljabar a1x + a2y
window.formatLinearExpr2 = function(a1, var1, a2, var2) {
    let term1 = '';
    if (a1 === 1) term1 = var1;
    else if (a1 === -1) term1 = `-${var1}`;
    else term1 = `${a1}${var1}`;

    let term2 = '';
    if (a2 > 0) term2 = ` + ${a2}${var2}`;
    else if (a2 < 0) term2 = ` - ${Math.abs(a2)}${var2}`;

    return `${term1}${term2}`;
};

// -----------------------------------
// 2. MAIN ROUTER (LOGIKA BARU)
// -----------------------------------


// -----------------------------------
// 3. CUSTOM QUESTION LOGIC (GURU)
// -----------------------------------

function generateCustomQuestion(categoryString) {
    // Hapus prefix "custom_" untuk dapat ID kelas
    const classId = categoryString.replace('custom_', '');
    
    // Ambil data kelas dari Firebase (via teacher.js)
    const allClasses = window.getCustomClasses ? window.getCustomClasses() : {};
    const targetClass = allClasses[classId];

    // Validasi: Apakah kelas ada & punya soal?
    if (targetClass && targetClass.questions && targetClass.questions.length > 0) {
        // Ambil soal acak
        const randomIndex = Math.floor(Math.random() * targetClass.questions.length);
        const qData = targetClass.questions[randomIndex];

        return {
            question: qData.question,
            answer: qData.answer,
            type: qData.type || 'input',
            explanation: qData.explanation || 'Pembahasan dari Guru.',
            options: qData.options || null
        };
    } else {
        // Fallback jika kosong
        return {
            question: "Guru belum memasukkan soal di kelas ini.",
            answer: 0,
            type: 'input',
            explanation: "Hubungi gurumu."
        };
    }
}

// -----------------------------------
// 4. SYSTEM QUESTION LOGIC (Bawaan)
// -----------------------------------

function generateSystemQuestion(difficulty, category) {
    let type;

    // Tentukan tipe soal berdasarkan kesulitan
    if (difficulty === 'basic') {
        type = Math.random() < 0.5 ? 'input' : 'true_false';
    } else if (difficulty === 'intermediate') {
        type = Math.random() < 0.5 ? 'multiple_choice' : 'true_false_double';
    } else {
        type = Math.random() < 0.5 ? 'input' : 'true_false';
    }

    // Routing ke fungsi pembuat soal spesifik
    if (category === 'bentuk_aljabar') {
        return generateBentukAljabarQuestion(difficulty, type);
    } else if (category === 'plsv') {
        return generatePLSVQuestion(difficulty, type);
    } else if (category === 'pertidaksamaan') {
        return generatePertidaksamaanQuestion(difficulty, type);
    } else if (category === 'spldv') {
        return generateSPLDVQuestion(difficulty, type);
    } else if (category === 'relasi_fungsi') {
        return generateRelasiFungsiQuestion(difficulty, type);
    } else if (category === 'garis_lurus') {
        return generateGarisLurusQuestion(difficulty, type);
    } else {
        return generateBentukAljabarQuestion(difficulty, type);
    }
}

// -----------------------------------
// 5. MATH GENERATORS (Logika Lama)
// -----------------------------------

function generateBentukAljabarQuestion(difficulty, type) {
    let question, answer, explanation, options;
    
    const vars = ['x', 'y', 'a', 'm', 'p'];
    const v = window.getRandomItem(vars); 

    if (difficulty === 'basic') {
        const operations = ['koefisien', 'konstanta', 'substitusi_sederhana'];
        const op = window.getRandomItem(operations);

        const a = window.getRandomInt(-9, 9);
        const b = window.getRandomInt(-9, 9);
        const expr = window.formatLinearExpr(a, v, b);

        if (op === 'koefisien') {
            question = `Tentukan koefisien dari ${v} pada bentuk aljabar: ${expr}`;
            answer = a;
            explanation = `Koefisien adalah angka yang berada di depan variabel ${v}.`;
        } else if (op === 'konstanta') {
            question = `Tentukan konstanta pada bentuk aljabar: ${expr}`;
            answer = b;
            explanation = `Konstanta adalah suku yang tidak memuat variabel.`;
        } else { 
            const val = window.getRandomInt(2, 5);
            question = `Jika ${v} = ${val}, berapakah nilai dari ${expr}?`;
            answer = (a * val) + b;
            explanation = `${expr} mengganti ${v} dengan ${val} \n= ${a}(${val}) ${b < 0 ? '- ' + Math.abs(b) : '+ ' + b} \n= ${a*val} ${b < 0 ? '- ' + Math.abs(b) : '+ ' + b} \n= ${answer}`;
        }

        if (type === 'multiple_choice') {
            let opts = new Set([answer]);
            while(opts.size < 4) {
                opts.add(answer + window.getRandomInt(-5, 5));
            }
            options = Array.from(opts).sort(() => Math.random() - 0.5);
            answer = options.indexOf(answer);
        }

    } else if (difficulty === 'intermediate') {
        const operations = ['penjumlahan_suku', 'perkalian_distributif'];
        const op = window.getRandomItem(operations);

        if (op === 'penjumlahan_suku') {
            const a1 = window.getRandomInt(-9, 9);
            const b1 = window.getRandomInt(-9, 9);
            const a2 = window.getRandomInt(-9, 9);
            const b2 = window.getRandomInt(-9, 9);
            
            let qStr = `${a1}${v}`;
            if(b1 !== 0) qStr += (b1 > 0 ? ` + ${b1}` : ` - ${Math.abs(b1)}`);
            if(a2 !== 0) qStr += (a2 > 0 ? ` + ${a2}${v}` : ` - ${Math.abs(a2)}${v}`);
            if(b2 !== 0) qStr += (b2 > 0 ? ` + ${b2}` : ` - ${Math.abs(b2)}`);

            question = `Sederhanakan bentuk aljabar: ${qStr}`;
            
            const resA = a1 + a2;
            const resB = b1 + b2;
            answer = window.formatLinearExpr(resA, v, resB);
            
            explanation = `Kelompokkan suku sejenis: (${a1}${v} ${a2 > 0 ? '+' : '-'} ${Math.abs(a2)}${v}) + (${b1} ${b2 > 0 ? '+' : '-'} ${Math.abs(b2)}) \n= ${window.formatLinearExpr(resA, v, resB)}`;

        } else {
            const k = window.getRandomInt(2, 5) * (Math.random() < 0.5 ? 1 : -1);
            const a = window.getRandomInt(1, 4);
            const b = window.getRandomInt(-5, 5);
            
            const inner = window.formatLinearExpr(a, v, b);
            question = `Jabarkan bentuk: ${k}(${inner})`;
            
            const resA = k * a;
            const resB = k * b;
            answer = window.formatLinearExpr(resA, v, resB);
            
            explanation = `Kalikan ${k} ke setiap suku di dalam kurung: \n${k} × ${a}${v} = ${resA}${v} \n${k} × ${b} = ${resB} \nHasil: ${answer}`;
        }

        if (type === 'multiple_choice') {
            const wrong1 = window.formatLinearExpr(window.getRandomInt(-9, 9), v, window.getRandomInt(-9, 9)); 
            const wrong2 = window.formatLinearExpr(window.getRandomInt(-9, 9), v, window.getRandomInt(-9, 9));
            const wrong3 = "Tidak dapat disederhanakan";
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(answer);
        }

    } else { // Advanced
        const operations = ['pemfaktoran', 'substitusi_kompleks'];
        const op = window.getRandomItem(operations);

        if (op === 'pemfaktoran') {
            const fpb = window.getRandomInt(2, 6);
            const a = window.getRandomInt(1, 3);
            const b = window.getRandomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
            
            const term1 = fpb * a;
            const term2 = fpb * b;
            const soalExpr = window.formatLinearExpr(term1, v, term2);

            question = `Faktorkan bentuk aljabar berikut: ${soalExpr}`;
            
            let inner = window.formatLinearExpr(a, v, b);
            answer = `${fpb}(${inner})`;
            explanation = `FPB dari ${term1} dan ${Math.abs(term2)} adalah ${fpb}. \nKeluarkan ${fpb}: ${fpb}(${inner})`;

        } else {
            const val = window.getRandomInt(-3, 4);
            const a = window.getRandomInt(1, 2);
            const b = window.getRandomInt(-5, 5);
            const c = window.getRandomInt(-5, 5);
            
            let quadratic = `${v}²`;
            if(b !== 0) quadratic += (b > 0 ? ` + ${b}${v}` : ` - ${Math.abs(b)}${v}`);
            if(c !== 0) quadratic += (c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`);

            question = `Jika ${v} = ${val}, tentukan nilai dari ${quadratic}`;
            answer = (val * val) + (b * val) + c;
            explanation = `Substitusi ${v} = ${val}: \n(${val})² ${b>=0 ? '+' : ''}${b}(${val}) ${c>=0 ? '+' : ''}${c} \n= ${val*val} ${b*val >= 0 ? '+' : ''}${b*val} ${c>=0 ? '+' : ''}${c} \n= ${answer}`;
        }

        if (type === 'multiple_choice') {
            if (typeof answer === 'string') {
                options = [
                    answer, 
                    `${window.getRandomInt(2,5)}(${v} + ${window.getRandomInt(1,5)})`,
                    `${window.getRandomInt(2,5)}(${v} - ${window.getRandomInt(1,5)})`,
                    `${v}(${window.getRandomInt(1,9)} + ${window.getRandomInt(1,9)})`
                ].sort(() => Math.random() - 0.5);
                answer = options.indexOf(answer);
            } else {
                let opts = new Set([answer]);
                while(opts.size < 4) opts.add(answer + window.getRandomInt(-10, 10));
                options = Array.from(opts).sort(() => Math.random() - 0.5);
                answer = options.indexOf(answer);
            }
        }
    }

    if (type.includes('true_false')) {
        const isTrue = Math.random() > 0.5;
        let displayedAnswer = isTrue ? answer : (typeof answer === 'number' ? answer + window.getRandomInt(1, 5) : "Jawaban Salah");
        question = `${question} Adalah ${displayedAnswer}.`;
        options = ['Benar', 'Salah'];
        answer = isTrue ? 0 : 1;
    }

    return { question, answer, explanation, type, options };
}

function generatePertidaksamaanQuestion(difficulty, type) {
    let question, answer, explanation, options;

    if (difficulty === 'basic') {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = Math.floor(Math.random() * 10) + 10;
        const ops = ['>', '<', '≥', '≤'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        answer = op === '>' || op === '≥' ? 'x > ' + Math.floor((c - b) / a) : 'x < ' + Math.floor((c - b) / a);
        question = `Selesaikan: ${window.formatLinearExpr(a, 'x', b)} ${op} ${c}`;
        explanation = `${a}x ${op} ${c - b}, x ${op} ${(c - b) / a}`;

        if (type === 'multiple_choice') {
            const wrong1 = 'x = ' + Math.floor((c - b) / a);
            const wrong2 = 'x ≥ ' + Math.floor((c - b) / a);
            const wrong3 = 'x ≤ ' + Math.floor((c - b) / a);
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(answer);
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (!isTrue) {
                question = `Selesaikan: ${window.formatLinearExpr(a, 'x', b)} = ${c}`;
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else if (difficulty === 'intermediate') {
        const types = ['compound', 'absolute', 'quadratic'];
        const qtype = types[Math.floor(Math.random() * types.length)];

        if (qtype === 'compound') {
            const a = Math.floor(Math.random() * 3) + 2;
            const b = Math.floor(Math.random() * 3) + 1;
            answer = `${a} ≤ x ≤ ${a + b}`;
            question = `Selesaikan: x ≥ ${a} dan x ≤ ${a + b}`;
            explanation = `Irisan dari x ≥ ${a} dan x ≤ ${a + b} adalah ${answer}`;
        } else if (qtype === 'absolute') {
            const center = Math.floor(Math.random() * 5) + 3;
            const radius = Math.floor(Math.random() * 3) + 1;
            answer = `${center - radius} < x < ${center + radius}`;
            question = `Selesaikan: |x - ${center}| < ${radius}`;
            explanation = `-${radius} < x - ${center} < ${radius}, ${center - radius} < x < ${center + radius}`;
        } else {
            const a = Math.floor(Math.random() * 2) + 1;
            answer = `x > ${a} atau x < -${a}`;
            question = `Selesaikan: x² > ${a * a}`;
            explanation = `x > ${a} atau x < -${a}`;
        }

        if (type === 'multiple_choice') {
            const wrong1 = `x ≥ ${a}`;
            const wrong2 = `x ≤ ${a}`;
            const wrong3 = `x = ${a}`;
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(answer);
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            question = `Solusi dari pertidaksamaan ${window.formatLinearExpr(a, 'x', b)} ${op} ${c} adalah x ${isTrue ? answer : 'x = ' + Math.floor((c - b) / a)}. Benar atau Salah?`;
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else { // advanced
        const types = ['system', 'fraction', 'word'];
        const qtype = types[Math.floor(Math.random() * types.length)];

        if (qtype === 'system') {
            const a = Math.floor(Math.random() * 3) + 2;
            const b = Math.floor(Math.random() * 3) + 1;
            answer = `x ≥ ${a} dan x ≤ ${b}`;
            question = `Selesaikan sistem: x ≥ ${a}, x ≤ ${b}, x > ${a - 1}`;
            explanation = `Irisan: x ≥ ${a} dan x ≤ ${b}`;
        } else if (qtype === 'fraction') {
            const num = Math.floor(Math.random() * 3) + 2;
            const den = Math.floor(Math.random() * 3) + 3;
            answer = `x > ${num / den}`;
            question = `Selesaikan: x/2 > ${num / den}`;
            explanation = `x > ${(num / den) * 2}`;
        } else {
            const price1 = Math.floor(Math.random() * 10) + 5;
            const price2 = Math.floor(Math.random() * 10) + 5;
            const budget = Math.floor(Math.random() * 20) + 15;
            answer = `0 ≤ x ≤ ${Math.floor(budget / price1)}`;
            question = `Beli x buku @${price1}rb, sisa ≥ ${budget - price1 * Math.floor(budget / price1)}rb. x maksimal?`;
            explanation = `Sisa = ${budget} - ${price1}x ≥ ${budget - price1 * Math.floor(budget / price1)}, x ≤ ${Math.floor(budget / price1)}`;
        }

        if (type === 'multiple_choice') {
            const wrong1 = `x > ${a}`;
            const wrong2 = `x < ${b}`;
            const wrong3 = `x = ${a}`;
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(answer);
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (!isTrue) {
                question = question.replace('≥', '>');
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    }

    return { question, answer, explanation, type, options };
}

function generateSPLDVQuestion(difficulty, type) {
    let question, answer, explanation, options;

    if (difficulty === 'basic') {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        const c = Math.floor(Math.random() * 5) + 5;
        const d = Math.floor(Math.random() * 3) + 1;
        const e = Math.floor(Math.random() * 3) + 1;
        const f = Math.floor(Math.random() * 5) + 5;

        const x = Math.floor(Math.random() * 3) + 1;
        const y = Math.floor(Math.random() * 3) + 1;
        const eq1 = `${window.formatLinearExpr2(a, 'x', b, 'y')} = ${a * x + b * y}`;
        const eq2 = `${window.formatLinearExpr2(d, 'x', e, 'y')} = ${d * x + e * y}`;

        answer = `x = ${x}, y = ${y}`;
        question = `Selesaikan sistem: ${eq1}; ${eq2}`;
        explanation = `Gunakan substitusi atau eliminasi untuk mencari x dan y`;

        if (type === 'multiple_choice') {
            const wrong1 = `x = ${x + 1}, y = ${y}`;
            const wrong2 = `x = ${x}, y = ${y + 1}`;
            const wrong3 = `x = ${y}, y = ${x}`;
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(`x = ${x}, y = ${y}`);
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            question = `Solusi dari sistem persamaan ${eq1}; ${eq2} adalah ${isTrue ? answer : `x = ${x + 1}, y = ${y}`}. Benar atau Salah?`;
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else if (difficulty === 'intermediate') {
        const methods = ['substitution', 'elimination'];
        const method = methods[Math.floor(Math.random() * methods.length)];

        if (method === 'substitution') {
            const x = Math.floor(Math.random() * 3) + 2;
            const y = Math.floor(Math.random() * 3) + 1;
            answer = `x = ${x}, y = ${y}`;
            question = `Selesaikan: x + 2y = ${x + 2 * y}; 3x - y = ${3 * x - y}`;
            explanation = `Dari persamaan 1: x = ${x + 2 * y} - 2y = ${x}. Substitusi ke persamaan 2.`;
        } else {
            const x = Math.floor(Math.random() * 3) + 1;
            const y = Math.floor(Math.random() * 3) + 1;
            answer = `x = ${x}, y = ${y}`;
            question = `Selesaikan: 2x + 3y = ${2 * x + 3 * y}; 2x - y = ${2 * x - y}`;
            explanation = `Kurangkan persamaan 2 dari persamaan 1: 4y = ${4 * y}, y = ${y}. Substitusi.`;
        }

        if (type === 'multiple_choice') {
            const wrong1 = `x = ${x + 1}, y = ${y}`;
            const wrong2 = `x = ${x}, y = ${y - 1}`;
            const wrong3 = `x = ${y}, y = ${x}`;
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(`x = ${x}, y = ${y}`);
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (!isTrue) {
                question = question.replace('=', '>');
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else { // advanced
        const types = ['complex', 'word_problem', 'matrix'];
        const qtype = types[Math.floor(Math.random() * types.length)];

        if (qtype === 'complex') {
            const x = Math.floor(Math.random() * 2) + 2;
            const y = Math.floor(Math.random() * 2) + 1;
            answer = `x = ${x}, y = ${y}`;
            question = `Selesaikan: x + y + z = ${x + y + 1}; 2x - y + z = ${2 * x - y + 1}; x + 2y - z = ${x + 2 * y - 1}`;
            explanation = `Gunakan eliminasi bertahap untuk sistem 3 variabel`;
        } else if (qtype === 'word_problem') {
            const price_a = Math.floor(Math.random() * 5) + 3;
            const price_b = Math.floor(Math.random() * 5) + 2;
            const qty_a = Math.floor(Math.random() * 3) + 1;
            const qty_b = Math.floor(Math.random() * 3) + 1;
            const total = price_a * qty_a + price_b * qty_b;
            answer = `${qty_a} buku A, ${qty_b} buku B`;
            question = `Beli ${qty_a} buku @${price_a}rb dan ${qty_b} buku @${price_b}rb total ${total}rb. Jumlah masing-masing?`;
            explanation = `x buku A, y buku B: ${price_a}x + ${price_b}y = ${total}; x + y = ${qty_a + qty_b}`;
        } else {
            const a = Math.floor(Math.random() * 3) + 2;
            const b = Math.floor(Math.random() * 3) + 1;
            answer = `x = ${a}, y = ${b}`;
            question = `Gunakan matriks untuk: ${a}x + ${b}y = ${a * a + b * b}; ${a}x - ${b}y = ${a * a - b * b}`;
            explanation = `Matriks koefisien dikalikan invers dengan konstanta`;
        }

        if (type === 'multiple_choice') {
            const wrong1 = `x = ${a + 1}, y = ${b}`;
            const wrong2 = `x = ${a}, y = ${b + 1}`;
            const wrong3 = `x = ${b}, y = ${a}`;
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(`x = ${a}, y = ${b}`);
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (!isTrue) {
                question = question.replace('=', '≠');
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    }

    return { question, answer, explanation, type, options };
}

function generateRelasiFungsiQuestion(difficulty, type) {
    let question, answer, explanation, options;

    if (difficulty === 'basic') {
        const concepts = ['domain', 'codomain', 'relation'];
        const concept = concepts[Math.floor(Math.random() * concepts.length)];

        if (concept === 'domain') {
            const pairs = [[1, 2], [2, 3], [3, 4]];
            answer = '{1, 2, 3}';
            question = `Domain dari relasi ${(pairs.map(p => `(${p[0]},${p[1]})`).join(', '))} adalah?`;
            explanation = `Domain adalah himpunan elemen pertama: {1, 2, 3}`;
        } else if (concept === 'codomain') {
            const codomain = [2, 3, 4, 5];
            answer = '{2, 3, 4, 5}';
            question = `Jika kodomain adalah {2, 3, 4, 5}, maka kodomainnya adalah?`;
            explanation = `Kodomain adalah himpunan tujuan yang mungkin: {2, 3, 4, 5}`;
        } else {
            const pairs = [[1, 1], [2, 4], [3, 9]];
            answer = 'fungsi';
            question = `Relasi ${(pairs.map(p => `(${p[0]},${p[1]})`).join(', '))} adalah fungsi atau relasi biasa?`;
            explanation = `Setiap elemen domain dipetakan ke tepat satu elemen kodomain`;
        }

        if (type === 'multiple_choice') {
            if (concept === 'domain') {
                const wrong1 = '{2, 3, 4}';
                const wrong2 = '{1, 2}';
                const wrong3 = '{1, 3}';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('{1, 2, 3}');
            } else if (concept === 'codomain') {
                const wrong1 = '{1, 2, 3, 4}';
                const wrong2 = '{2, 3, 4}';
                const wrong3 = '{1, 2, 3, 5}';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('{2, 3, 4, 5}');
            } else {
                const wrong1 = 'relasi biasa';
                const wrong2 = 'bukan keduanya';
                const wrong3 = 'himpunan';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('fungsi');
            }
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (concept === 'domain') {
                question = `Domain dari relasi ${(pairs.map(p => `(${p[0]},${p[1]})`).join(', '))} adalah ${isTrue ? answer : '{2, 3, 4}'}. Benar atau Salah?`;
            } else if (concept === 'codomain') {
                question = `Kodomain dari relasi tersebut adalah ${isTrue ? answer : '{1, 2, 3, 4}'}. Benar atau Salah?`;
            } else {
                question = `Relasi ${(pairs.map(p => `(${p[0]},${p[1]})`).join(', '))} adalah ${isTrue ? answer : 'relasi biasa'}. Benar atau Salah?`;
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else if (difficulty === 'intermediate') {
        const concepts = ['function', 'range', 'inverse'];
        const concept = concepts[Math.floor(Math.random() * concepts.length)];

        if (concept === 'function') {
            answer = 'fungsi';
            question = `Relasi dimana setiap x dipetakan ke tepat satu f(x) disebut?`;
            explanation = `Definisi fungsi: setiap elemen domain ke tepat satu elemen kodomain`;
        } else if (concept === 'range') {
            const func = 'f(x) = x²';
            const domain = [1, 2, 3];
            answer = '{1, 4, 9}';
            question = `Range dari ${func} dengan domain {1, 2, 3} adalah?`;
            explanation = `f(1)=1, f(2)=4, f(3)=9, range = {1, 4, 9}`;
        } else {
            answer = 'f⁻¹(x) = √x';
            question = `Invers dari f(x) = x² (x ≥ 0) adalah?`;
            explanation = `Tukar x dan y: x = y², y = √x`;
        }

        if (type === 'multiple_choice') {
            if (concept === 'function') {
                const wrong1 = 'relasi';
                const wrong2 = 'himpunan';
                const wrong3 = 'domain';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('fungsi');
            } else if (concept === 'range') {
                const wrong1 = '{1, 2, 3}';
                const wrong2 = '{0, 1, 4}';
                const wrong3 = '{1, 2, 3, 4, 9}';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('{1, 4, 9}');
            } else {
                const wrong1 = 'f⁻¹(x) = x²';
                const wrong2 = 'f⁻¹(x) = 2x';
                const wrong3 = 'f⁻¹(x) = x/2';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('f⁻¹(x) = √x');
            }
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (!isTrue) {
                if (concept === 'function') {
                    question = `Setiap relasi adalah fungsi?`;
                } else if (concept === 'range') {
                    question = `Range selalu sama dengan kodomain?`;
                } else {
                    question = `Setiap fungsi memiliki invers?`;
                }
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else { // advanced
        const concepts = ['composite', 'types', 'graph'];
        const concept = concepts[Math.floor(Math.random() * concepts.length)];

        if (concept === 'composite') {
            answer = '(f ∘ g)(x) = f(g(x))';
            question = `Komposisi fungsi f ∘ g berarti?`;
            explanation = `f ∘ g adalah f dilanjutkan g: (f ∘ g)(x) = f(g(x))`;
        } else if (concept === 'types') {
            const func = 'f(x) = 2x + 1';
            answer = 'linear';
            question = `Jenis fungsi ${func} adalah?`;
            explanation = `Bentuk f(x) = ax + b adalah fungsi linear`;
        } else {
            answer = 'parabola';
            question = `Grafik dari f(x) = x² adalah?`;
            explanation = `Fungsi kuadrat menghasilkan grafik parabola`;
        }

        if (type === 'multiple_choice') {
            if (concept === 'composite') {
                const wrong1 = '(f ∘ g)(x) = g(f(x))';
                const wrong2 = '(f ∘ g)(x) = f(x) + g(x)';
                const wrong3 = '(f ∘ g)(x) = f(x) × g(x)';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('(f ∘ g)(x) = f(g(x))');
            } else if (concept === 'types') {
                const wrong1 = 'kuadrat';
                const wrong2 = 'eksponen';
                const wrong3 = 'logaritma';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('linear');
            } else {
                const wrong1 = 'garis lurus';
                const wrong2 = 'lingkaran';
                const wrong3 = 'hiperbola';
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf('parabola');
            }
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (!isTrue) {
                if (concept === 'composite') {
                    question = `Komposisi fungsi adalah f(g(x)) = g(f(x))?`;
                } else if (concept === 'types') {
                    question = `f(x) = x² adalah fungsi linear?`;
                } else {
                    question = `Grafik f(x) = 1/x adalah parabola?`;
                }
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    }

    return { question, answer, explanation, type, options };
}

function generateGarisLurusQuestion(difficulty, type) {
    let question, answer, explanation, options;

    if (difficulty === 'basic') {
        const concepts = ['gradient', 'intercept', 'point'];
        const concept = concepts[Math.floor(Math.random() * concepts.length)];

        if (concept === 'gradient') {
            const x1 = Math.floor(Math.random() * 5) + 1;
            const y1 = Math.floor(Math.random() * 5) + 1;
            const x2 = x1 + Math.floor(Math.random() * 3) + 1;
            const y2 = y1 + Math.floor(Math.random() * 5) + 2;
            const grad = (y2 - y1) / (x2 - x1);
            answer = grad;
            question = `Gradien garis melalui (${x1},${y1}) dan (${x2},${y2}) adalah?`;
            explanation = `m = (${y2} - ${y1}) / (${x2} - ${x1}) = ${grad}`;
        } else if (concept === 'intercept') {
            const m = Math.floor(Math.random() * 3) + 1;
            const c = Math.floor(Math.random() * 5) + 1;
            answer = c;
            question = `Intersep y dari garis y = ${window.formatLinearExpr(m, 'x', c)} adalah?`;
            explanation = `Intersep y adalah nilai c dalam y = mx + c, yaitu ${c}`;
        } else {
            const m = Math.floor(Math.random() * 3) + 1;
            const x = Math.floor(Math.random() * 5) + 1;
            const y = Math.floor(Math.random() * 5) + 1;
            answer = y - m * x;
            question = `Intersep y garis gradien ${m} melalui (${x},${y}) adalah?`;
            explanation = `y = mx + c → ${y} = ${m}(${x}) + c → c = ${y} - ${m * x} = ${answer}`;
        }

        if (type === 'multiple_choice') {
            const wrong1 = answer + 1;
            const wrong2 = answer - 1;
            const wrong3 = Math.floor(answer * 1.5);
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(answer);
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (concept === 'gradient') {
                question = `Gradien garis yang melalui titik (${x1},${y1}) dan (${x2},${y2}) adalah ${isTrue ? answer : answer + 1}. Benar atau Salah?`;
            } else if (concept === 'intercept') {
                question = `Intersep y dari garis y = ${window.formatLinearExpr(m, 'x', c)} adalah ${isTrue ? answer : answer + 1}. Benar atau Salah?`;
            } else {
                question = `Intersep y garis gradien ${m} melalui (${x},${y}) adalah ${isTrue ? answer : answer + 1}. Benar atau Salah?`;
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else if (difficulty === 'intermediate') {
        const concepts = ['equation', 'parallel', 'perpendicular'];
        const concept = concepts[Math.floor(Math.random() * concepts.length)];

        if (concept === 'equation') {
            const m = Math.floor(Math.random() * 3) + 1;
            const x = Math.floor(Math.random() * 5) + 1;
            const y = Math.floor(Math.random() * 5) + 1;
            answer = `y - ${y} = ${m}(x - ${x})`;
            question = `Persamaan garis gradien ${m} melalui (${x},${y}) adalah?`;
            explanation = `y - y₁ = m(x - x₁) → y - ${y} = ${m}(x - ${x})`;
        } else if (concept === 'parallel') {
            const m = Math.floor(Math.random() * 3) + 1;
            answer = m;
            question = `Gradien garis paralel dengan y = ${m}x + 5 adalah?`;
            explanation = `Garis paralel memiliki gradien sama: ${m}`;
        } else {
            const m = Math.floor(Math.random() * 3) + 1;
            const grad_perp = -1 / m;
            answer = grad_perp;
            question = `Gradien garis tegak lurus dengan y = ${m}x + 3 adalah?`;
            explanation = `Gradien tegak lurus = -1/m = -1/${m} = ${grad_perp}`;
        }

        if (type === 'multiple_choice') {
            if (concept === 'equation') {
                const wrong1 = `y = ${m}x + ${y - m * x}`;
                const wrong2 = `y + ${y} = ${m}(x + ${x})`;
                const wrong3 = `y = ${m}(x - ${x}) + ${y}`;
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf(`y - ${y} = ${m}(x - ${x})`);
            } else if (concept === 'parallel') {
                const wrong1 = -m;
                const wrong2 = m + 1;
                const wrong3 = 1 / m;
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf(m);
            } else {
                const wrong1 = 1 / m;
                const wrong2 = m;
                const wrong3 = -m;
                options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
                answer = options.indexOf(grad_perp);
            }
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (!isTrue) {
                if (concept === 'equation') {
                    question = `Persamaan garis gradien ${m} melalui (${x},${y}) adalah y = ${m}x + ${y - m * x}?`;
                } else if (concept === 'parallel') {
                    question = `Gradien garis paralel dengan y = ${m}x + 5 adalah ${-m}?`;
                } else {
                    question = `Gradien garis tegak lurus dengan y = ${m}x + 3 adalah ${m}?`;
                }
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else { // advanced
        const concepts = ['intersection', 'distance', 'area'];
        const concept = concepts[Math.floor(Math.random() * concepts.length)];

        if (concept === 'intersection') {
            const m1 = Math.floor(Math.random() * 3) + 1;
            const c1 = Math.floor(Math.random() * 5) + 1;
            const m2 = Math.floor(Math.random() * 3) + 1;
            const c2 = Math.floor(Math.random() * 5) + 1;
            const x = (c2 - c1) / (m1 - m2);
            const y = m1 * x + c1;
            answer = `(${x}, ${y})`;
            question = `Titik potong y = ${window.formatLinearExpr(m1, 'x', c1)} dan y = ${window.formatLinearExpr(m2, 'x', c2)} adalah?`;
            explanation = `Setara: ${m1}x + ${c1} = ${m2}x + ${c2}, x = ${x}, y = ${y}`;
        } else if (concept === 'distance') {
            const x1 = Math.floor(Math.random() * 3) + 1;
            const y1 = Math.floor(Math.random() * 3) + 1;
            const x2 = x1 + Math.floor(Math.random() * 3) + 1;
            const y2 = y1 + Math.floor(Math.random() * 3) + 1;
            const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            answer = Math.round(dist * 100) / 100;
            question = `Jarak antara (${x1},${y1}) dan (${x2},${y2}) adalah?`;
            explanation = `d = √((${x2} - ${x1})² + (${y2} - ${y1})²) = √(${dist ** 2}) = ${answer}`;
        } else {
            const base = Math.floor(Math.random() * 5) + 3;
            const height = Math.floor(Math.random() * 3) + 2;
            answer = (base * height) / 2;
            question = `Luas segitiga dengan alas ${base} dan tinggi ${height} adalah?`;
            explanation = `Luas = (alas × tinggi) ÷ 2 = (${base} × ${height}) ÷ 2 = ${answer}`;
        }

        if (type === 'multiple_choice') {
            const wrong1 = Math.round(answer + 1);
            const wrong2 = Math.round(answer - 1);
            const wrong3 = Math.round(answer * 1.5);
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(answer);
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            if (!isTrue) {
                question = question.replace('adalah?', 'bukan?');
            }
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    }

    return { question, answer, explanation, type, options };
}

function generatePLSVQuestion(difficulty, type) {
    let question, answer, explanation, options;

    if (difficulty === 'basic') {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = Math.floor(Math.random() * 10) + 10;
        answer = Math.floor((c - b) / a);
        question = `Selesaikan: ${window.formatLinearExpr(a, 'x', b)} = ${c}`;
        explanation = `${a}x = ${c} - ${b} = ${c - b}, x = ${c - b} ÷ ${a} = ${answer}`;

        if (type === 'multiple_choice') {
            const wrong1 = Math.floor((c - b) / (a + 1));
            const wrong2 = Math.floor((c + b) / a);
            const wrong3 = answer + 1;
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(Math.floor((c - b) / a));
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            question = `Solusi dari ${window.formatLinearExpr(a, 'x', b)} = ${c} adalah x = ${isTrue ? answer : answer + 1}. Benar atau Salah?`;
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    } else if (difficulty === 'intermediate') {
        const operations = ['fraction', 'decimal', 'mixed'];
        const op = operations[Math.floor(Math.random() * operations.length)];

        if (op === 'fraction') {
            const num = Math.floor(Math.random() * 3) + 2;
            const den = Math.floor(Math.random() * 3) + 2;
            const const_val = Math.floor(Math.random() * 5) + 3;
            answer = (const_val * den) / num;
            question = `Selesaikan: x/${den} + ${const_val} = ${const_val + 1}`;
            explanation = `x/${den} = 1, x = 1 × ${den} = ${den}`;
        } else if (op === 'decimal') {
            const coeff = Math.floor(Math.random() * 3) + 2;
            const const_val = Math.floor(Math.random() * 5) + 3;
            answer = (const_val + 2) / coeff;
            question = `Selesaikan: ${coeff}x - ${const_val} = ${const_val + 2}`;
            explanation = `${coeff}x = ${2 * const_val + 2}, x = ${(2 * const_val + 2)} ÷ ${coeff} = ${answer}`;
        } else {
            const a = Math.floor(Math.random() * 3) + 2;
            const b = Math.floor(Math.random() * 3) + 1;
            const c = Math.floor(Math.random() * 5) + 5;
            answer = (c + b) / a;
            question = `Selesaikan: ${a}(x + ${b}) = ${a * c}`;
            explanation = `x + ${b} = ${c}, x = ${c} - ${b} = ${c - b}`;
        }

        if (type === 'multiple_choice') {
            const wrong1 = answer + 1;
            const wrong2 = answer - 1;
            const wrong3 = answer * 2;
            options = [answer, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            answer = options.indexOf(answer);
        } else if (type === 'true_false_double') {
            let statement1, statement2;
            if (op === 'fraction') {
                statement1 = `Solusi x/${den} + ${const_val} = ${const_val + 1} adalah x = ${den}`;
                statement2 = `Solusi x/${den} + ${const_val} = ${const_val + 1} adalah x = ${den + 1}`;
            } else if (op === 'decimal') {
                statement1 = `Solusi ${coeff}x - ${const_val} = ${const_val + 2} adalah x = ${answer}`;
                statement2 = `Solusi ${coeff}x - ${const_val} = ${const_val + 2} adalah x = ${answer + 1}`;
            } else {
                statement1 = `Solusi ${a}(x + ${b}) = ${a * c} adalah x = ${c - b}`;
                statement2 = `Solusi ${a}(x + ${b}) = ${a * c} adalah x = ${c - b + 1}`;
            }
            question = `Manakah pernyataan yang benar?`;
            options = [statement1, statement2];
            answer = 0;
        }
    } else { // advanced - word problems
        const problems = ['age', 'speed', 'work'];
        const problem = problems[Math.floor(Math.random() * problems.length)];

        if (problem === 'age') {
            const current_age = Math.floor(Math.random() * 10) + 20;
            const years_ago = Math.floor(Math.random() * 5) + 3;
            answer = current_age - years_ago;
            question = `Umur seseorang ${current_age} tahun. ${years_ago} tahun yang lalu umurnya x tahun. Berapa x?`;
            explanation = `x = ${current_age} - ${years_ago} = ${answer}`;
        } else if (problem === 'speed') {
            const speed1 = Math.floor(Math.random() * 20) + 30;
            const speed2 = Math.floor(Math.random() * 15) + 20;
            const time = Math.floor(Math.random() * 3) + 2;
            answer = (speed1 + speed2) * time;
            question = `Mobil A ${speed1} km/jam, mobil B ${speed2} km/jam berlawanan arah. Berapa jarak setelah ${time} jam?`;
            explanation = `Jarak = (${speed1} + ${speed2}) × ${time} = ${answer} km`;
        } else {
            const rate = Math.floor(Math.random() * 5) + 2;
            const time = Math.floor(Math.random() * 5) + 3;
            answer = rate * time;
            question = `Pekerja menyelesaikan x unit per jam. Dalam ${time} jam menyelesaikan ${rate * time} unit. Berapa x?`;
            explanation = `x × ${time} = ${rate * time}, x = ${rate * time} ÷ ${time} = ${answer}`;
        }

        if (type === 'input') {
            // Word problem with input answer
        } else if (type === 'true_false') {
            const isTrue = Math.random() > 0.5;
            question = question.replace(/\?$/, ` adalah ${isTrue ? answer : answer + 1}? Benar atau Salah?`);
            options = ['Benar', 'Salah'];
            answer = isTrue ? 0 : 1;
        }
    }

    return { question, answer, explanation, type, options };
}

// Generate questions for other categories (to be implemented)
function generateBilanganQuestion(difficulty) {
    return { 
        question: "Coming soon...", 
        answer: 0, 
        explanation: "Kategori ini sedang dalam pengembangan" 
    };
}

function generateGeometriQuestion(difficulty) {
    return { 
        question: "Coming soon...", 
        answer: 0, 
        explanation: "Kategori ini sedang dalam pengembangan" 
    };
}

function generatePeluangQuestion(difficulty) {
    return { 
        question: "Coming soon...", 
        answer: 0, 
        explanation: "Kategori ini sedang dalam pengembangan" 
    };
}