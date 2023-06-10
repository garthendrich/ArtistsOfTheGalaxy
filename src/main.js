import {
  BULLET_INTERVAL_TIME,
  BULLET_MAX_DISTANCE_FROM_SHIP,
  PLANET_INTERVAL_TIME,
  PLANET_MAX_DISTANCE_FROM_SHIP,
} from "./config.js";
import Collectibles from "./entities/Collectibles.js";
import Sphere from "./entities/Sphere.js";
import Ship from "./entities/Ship.js";
import Renderer from "./Renderer.js";
import addArrays from "./utils/addArrays.js";
import { getRandomNumber } from "./utils/randomizer.js";

let code = "temp";

main();

function main() {
  /** ---------------------------------
   * OBJECTS starts here
   * ----------------------------------
   */
  const ships = [new Ship(10, [0, -20, -150])];

  const planets = [
    new Sphere(10, [20, 30, -350]),
    new Sphere(20, [-60, -20, -450]),
    new Sphere(20, [-60, 50, -360]),
    new Sphere(20, [40, 0, -300]),
    new Sphere(30, [110, -150, -600]),
    new Sphere(30, [-300, -220, -900]),
  ];

  const bullets = [];

  const collectibles = [
    new Collectibles(20, [80, 30, -500]),
    new Collectibles(20, [20, 30, -500]),
    new Collectibles(20, [-40, 30, -500]),
    new Collectibles(20, [-100, 30, -500]),
    new Collectibles(20, [80, -20, -500]),
    new Collectibles(20, [20, -20, -500]),
    new Collectibles(20, [-40, -20, -500]),
    new Collectibles(20, [-100, -20, -500]),
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
    DEFAULT: "white-texture.jpeg",
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

  let currentTime = Date.now();
  let lastFrameTime = 0;
  let fpsCounter = 0;

  let lastBulletFireTime = 0;
  let willFireBullet = false;
  let willMove = false;

  let lastPlanetSpawn = 0;

  window.requestAnimationFrame(loop);

  function loop() {
    fpsCounter++;
    if (currentTime - lastFrameTime > 1000) {
      console.log("FPS: " + fpsCounter);
      fpsCounter = 0;
      lastFrameTime = currentTime;
    }

    if (willFireBullet) {
      spawnBullet();
    }

    // UNCOMMENT TO SPAWN PLANETS
    spawnPlanet();

    if (willMove) moveShip(code);
    else stopShip();

    for (const [bulletIndex, bullet] of bullets.entries()) {
      const bulletDistanceFromShip =
        renderer.camera.position[2] - bullet.getZ(); // ! change camera z position to ship z: ship.getZ()
      if (bulletDistanceFromShip > BULLET_MAX_DISTANCE_FROM_SHIP) {
        bullets.splice(bulletIndex, 1);
        continue;
      }

      bullet.updatePosition();
    }

    // updates and destroys planets based on position
    for (const [planetIndex, planet] of planets.entries()) {
      const planetDistanceFromShip =
        renderer.camera.position[2] + planet.getZ(); // ! change camera z position to ship z: ship.getZ()
      if (planetDistanceFromShip > PLANET_MAX_DISTANCE_FROM_SHIP) {
        planets.splice(planetIndex, 1);
        continue;
      }

      planet.updatePosition();
    }

    for (const [shipIndex, ship] of ships.entries()) {
      console.log(shipIndex);
      ship.updatePosition();
    }

    const objects = [...planets, ...bullets, ...ships, ...collectibles];
    renderer.renderObjects(objects);

    currentTime = Date.now();
    window.requestAnimationFrame(loop);
  }

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") willFireBullet = true;
    else if (
      event.code === "KeyW" ||
      event.code === "KeyA" ||
      event.code === "KeyS" ||
      event.code === "KeyD"
    ) {
      willMove = true;
      code = event.code;
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "Space") willFireBullet = false;
    else if (
      event.code === "KeyW" ||
      event.code === "KeyA" ||
      event.code === "KeyS" ||
      event.code === "KeyD"
    )
      willMove = false;
  });

  function spawnBullet() {
    if (currentTime - lastBulletFireTime < BULLET_INTERVAL_TIME) return;
    const bulletSpawnPosition = addArrays(renderer.camera.position, [
      ships[0].getX(),
      ships[0].getY(),
      ships[0].getZ(),
    ]);
    const bullet = new Sphere(1, bulletSpawnPosition, [0, 1, 4]);
    bullet.moveBack(512);
    bullets.push(bullet);

    lastBulletFireTime = currentTime;
  }

  // spawns planets
  function spawnPlanet() {
    if (currentTime - lastPlanetSpawn < PLANET_INTERVAL_TIME) return;
    const planetX = getRandomNumber(-15, 15) * 10;
    const planetY = getRandomNumber(-15, 15) * 10;
    const planetSpawnPosition = addArrays(renderer.camera.position, [
      planetX,
      planetY,
      -1500,
    ]);
    const planet = new Sphere(10, planetSpawnPosition);
    planet.moveForth(300);
    planets.push(planet);

    lastPlanetSpawn = currentTime;
  }

  function moveShip(code) {
    if (code === "KeyW") {
      ships[0].moveUp(50);
    } else if (code === "KeyA") {
      ships[0].moveLeft(50);
    } else if (code === "KeyS") {
      ships[0].moveDown(50);
    } else if (code === "KeyD") {
      ships[0].moveRight(50);
    }
  }

  function stopShip() {
    ships[0].stopXMovement();
    ships[0].stopYMovement();
    ships[0].stopZMovement();
  }
}
