export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function generateOptionsNumber(correct) {
  const finalCorrect = round2(correct);

  let options = new Set();
  options.add(finalCorrect);

  while (options.size < 4) {
    let delta = Math.floor(Math.random() * 10 - 5);
    if (delta === 0) continue;

    let wrong = round2(finalCorrect + delta);
    if (wrong !== finalCorrect) options.add(wrong);
  }

  return shuffle([...options]);
}