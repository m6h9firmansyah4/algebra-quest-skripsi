export function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export function generateOptionsNumber(correct) {
  let options = new Set();
  options.add(correct);

  while (options.size < 4) {
    let wrong = correct + Math.floor(Math.random() * 10 - 5);
    if (wrong !== correct) options.add(wrong);
  }

  return shuffle([...options]);
}