import { BULLET_MAX_DISTANCE_FROM_SHIP } from "./config.js";
import Collectibles from "./entities/Collectibles.js";
import Sphere from "./entities/Sphere.js";
import Renderer from "./Renderer.js";
import addArrays from "./utils/addArrays.js";

main();

function main() {
  /** ---------------------------------
   * OBJECTS starts here
   * ----------------------------------
   */

  const planets = [
    new Sphere(10, [20, 30, -350]),
    new Sphere(20, [-60, -20, -450]),
    new Sphere(20, [-60, 50, -360]),
    new Sphere(20, [40, 0, -300]),
    new Sphere(30, [110, -150, -600]),
    new Sphere(30, [-300, -220, -900]),
  ];

  const bullets = [];

  const collectibles = [new Collectibles(20, [20, 30, -100])];

  /** ---------------------------------
   * OBJECTS ends here
   * ----------------------------------
   */

  const canvas = document.querySelector("#screen");
  const renderer = new Renderer(canvas);

  window.requestAnimationFrame(loop);

  function loop() {
    for (const [bulletIndex, bullet] of bullets.entries()) {
      // ! change camera z to ship z position
      // ship.getZ()
      if (
        bullet.getZ() - renderer.camera.position[1] <
        -BULLET_MAX_DISTANCE_FROM_SHIP
      ) {
        bullets.splice(bulletIndex, 1);
        continue;
      }

      bullet.updatePosition();
    }

    const objects = [...planets, ...bullets, ...collectibles];
    renderer.renderObjects(objects);

    window.requestAnimationFrame(loop);
  }

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") spawnBullet();
  });

  function spawnBullet() {
    const bulletSpawnPosition = addArrays(renderer.camera.position, [0, -4, 0]); // ! change based on ship
    const bullet = new Sphere(1, bulletSpawnPosition, [0, 1, 4]);
    bullet.moveBack(512);
    bullets.push(bullet);
  }
}
