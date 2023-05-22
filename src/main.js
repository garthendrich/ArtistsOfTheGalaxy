import Renderer from "./Renderer.js";
import Collectibles from "./entities/Collectibles.js";
import Sphere from "./entities/Sphere.js";

main();

function main() {
  /** ---------------------------------
   * OBJECTS starts here
   * ----------------------------------
   */
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

  const collectibles = [
    new Collectibles(20, [80, 30, 10]),
    new Collectibles(20, [20, 30, 10]),
    new Collectibles(20, [-40, 30, 10]),
    new Collectibles(20, [-100, 30, 10]),
    new Collectibles(20, [80, -20, 10]),
    new Collectibles(20, [20, -20, 10]),
    new Collectibles(20, [-40, -20, 10]),
    new Collectibles(20, [-100, -20, 10]),
  ];

  /** ---------------------------------
   * OBJECTS ends here
   * ----------------------------------
   */

  /** ----------------------------------
   *  Textures
   *  ----------------------------------
   */
  const textures = {
    SIZE: "size-texture.png",
    SPEED: "speed-texture.png",
    COLOR: "color-texture.png",
  };

  /** ----------------------------------
   *  Renderer proper
   *  ----------------------------------
   */

  const canvas = document.querySelector("#screen");
  const renderer = new Renderer(canvas, textures);

  // Animation

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
