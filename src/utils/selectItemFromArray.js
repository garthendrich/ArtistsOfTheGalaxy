import { getRandomNumber } from "./randomizer.js";

export function selectItemFromArray(array) {
  const index = Math.floor(getRandomNumber(0, array.length));
  return array[index];
}
