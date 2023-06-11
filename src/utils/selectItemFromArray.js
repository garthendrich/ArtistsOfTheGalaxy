import { getRandomNumber } from "./randomizer.js";

export function selectItemFromArray(array, min, max) {
  let index = Math.floor(getRandomNumber(min, max));
  return array[index];
}
