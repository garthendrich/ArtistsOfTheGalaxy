import { getRandomNumber } from "./randomizer.js";

export function getBackground() {
  let number = Math.floor(getRandomNumber(1, 7));
  return "src/assets/bg-galaxy-" + number + ".jpg";
}
