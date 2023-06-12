import { getRandomNumber } from "/src/utils/randomizer";

export function getBackground() {
  let number = Math.floor(getRandomNumber(1, 7));
  return "/assets/bg-galaxy-" + number + ".jpg";
}
