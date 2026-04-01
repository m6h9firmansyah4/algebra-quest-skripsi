import { generateQuestionW1 } from "../worldmap/world1.js";
import { generateQuestionW2 } from "../worldmap/world2.js";

const worldMap = {
  numbers: generateQuestionW1,
  algebra: generateQuestionW2,
};

export function getQuestion(world, stage) {
  const generator = worldMap[world];

  if (!generator) {
    throw new Error("World tidak ditemukan: " + world);
  }

  return generator(stage);
}
