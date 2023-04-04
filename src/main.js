import Renderer from "./Renderer.js";
import Planet from "./objects/Planet.js";

main();

function main() {
  const canvas = document.querySelector("#screen");
  const renderer = new Renderer(canvas);
  const planet = new Planet(1, [2, 3, -5]);
  renderer.render(planet);
}
