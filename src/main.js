import Renderer from "./Renderer.js";
import Collectibles from "./entities/Collectibles.js";
import Sphere from "./entities/Sphere.js";

main();

function main() {
  const planets = [
    new Sphere(10, [20, 30, -350]),
    new Sphere(10, [0, 0, -300]),
    new Sphere(20, [-60, -20, -450]),
    new Sphere(20, [-60, 50, -360]),
    new Sphere(20, [40, 0, -300]),
    new Sphere(30, [110, -150, -600]),
    new Sphere(30, [-300, -220, -900]),
  ];

  const movingSphere = new Sphere(5, [0, 0, -500]); // ! test/demo code
  movingSphere.moveRight(1); // ! test/demo code

  const collectibles = [new Collectibles(20, [20, 30, 10])];
  const canvas = document.querySelector("#screen");
  const renderer = new Renderer(canvas);

  const SPEED = 1; // ! test/demo code
  const FARTHEST_Z = 500; // ! test/demo code
  let z = 0; // ! test/demo code
  let incrementer = -SPEED; // ! test/demo code

  window.requestAnimationFrame(loop);

  function loop() {
    if (z < 0 || z > FARTHEST_Z) incrementer *= -1; // ! test/demo code
    renderer.moveCamera(0, 0, incrementer); // ! test/demo code
    z += incrementer; // ! test/demo code

    movingSphere.updatePosition();

    const objects = [...planets, ...collectibles];
    renderer.renderObjects(objects);

    window.requestAnimationFrame(loop);
  }
}
