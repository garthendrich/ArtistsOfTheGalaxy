import { getRandomNumber } from "./randomizer.js";

export function getBackground() {
  let number = Math.floor(getRandomNumber(1, 7));
  console.log("../assets/bg-galaxy-" + number + ".jpg");
  return "src/assets/bg-galaxy-" + number + ".jpg";
}
