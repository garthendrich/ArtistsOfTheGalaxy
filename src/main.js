import Renderer from "./Renderer.js";
import Planet from "./objects/Planet.js";

main();

function main() {
  const canvas = document.querySelector("#screen");
  const renderer = new Renderer(canvas);
  const planets = [
    new Planet(1, [2, 3, -5]),
    new Planet(1, [0, 0, 0]),
    new Planet(2, [-6, -2, -15]),
    new Planet(2, [-6, 5, -6]),
    new Planet(2, [4, 0, 0]),
    new Planet(3, [11, -15, -30]),
    new Planet(3, [-30, -22, -60]),
  ];
  renderer.renderObjects(planets);
}
