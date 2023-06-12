import { getRandomNumber } from "/src/utils/randomizer";

export function selectItemFromArray(array) {
  const index = Math.floor(getRandomNumber(0, array.length));
  return array[index];
}
