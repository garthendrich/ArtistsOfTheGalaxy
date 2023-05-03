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

  const SPEED = 0.8; // ! test/demo code
  const FARTHEST_Z = 100; // ! test/demo code
  let z = 0; // ! test/demo code
  let incrementer = -SPEED; // ! test/demo code

  window.requestAnimationFrame(loop);

  function loop() {
    if (z < 0 || z > FARTHEST_Z) incrementer *= -1; // ! test/demo code
    renderer.moveCamera(0, 0, incrementer); // ! test/demo code
    z += incrementer; // ! test/demo code

    renderer.renderObjects(planets);

    window.requestAnimationFrame(loop);
  }
}
