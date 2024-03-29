import Collectibles from "/src/entities/Collectibles";
import Ship from "/src/entities/Ship";
import Sphere from "/src/entities/Sphere";
import { hasCollided } from "/src/events/objectCollision";
import { getRandomNumber } from "/src/utils/randomizer";
import { getBackground } from "/src/utils/randomizeBackground";
import { selectItemFromArray } from "/src/utils/selectItemFromArray";

import {
  SMALLEST_PLANET_RADIUS,
  BIGGEST_PLANET_RADIUS,
  COLLECTIBLE_SIZE,
  SHIP_Z_DISTANCE_FROM_CAMERA,
  FAR_BOUND,
  FIELD_OF_VIEW_DEGREES,
  BULLET_INTERVAL_TIME,
  PLANET_INTERVAL_TIME,
  COLLECTIBLE_INTERVAL_TIME,
  SPHERE_SPHERE_COLLISION,
  ENTITY_SHIP_COLLISION,
  BULLET_COLORS,
} from "/src/config";
import { playerInputs } from "/src/playerInputs";
import Renderer from "/src/Renderer";

// GLOBAL SCENE ATTRIBUTES
const ship = new Ship(0, [0, -20, -SHIP_Z_DISTANCE_FROM_CAMERA]);
const planets = [];
const bullets = [];
const collectibles = [];

let bulletColor = selectItemFromArray(BULLET_COLORS);
let shipSpeed = 50;
let bulletSize = 2;

/** ----------------------------------
 *  Textures
 *  ----------------------------------
 */
const textures = {
  DEFAULT: "white-texture.jpeg",
  SIZE: "size-texture.png",
  SPEED: "speed-texture.png",
  COLOR: "color-texture.png",
  PLANET1: "planet-texture.png",
  PLANET2: "planet-texture-2.png",
  PLANET3: "planet-texture-3.png",
  PLANET4: "planet-texture-4.png",
  SHIP: "spaceship-texture-5.jpg",
};

// Canvas init
const canvas = document.querySelector("#screen");
const renderer = new Renderer(canvas, textures);

// GLOBAL ANIMATION ATTRIBUTES
let currentTime = Date.now();
let lastFrameTime = currentTime;
let fpsCounter = 0;

let lastBulletFireTime = 0;

let lastPlanetSpawn = 0;
let lastCollectibleSpawn = 0;

let shipHorizontalBound;
let shipVerticalBound;

document.addEventListener("DOMContentLoaded", () => {
  window.requestAnimationFrame(loop);

  const backgroundImg = document.getElementById("backgroundImg");
  backgroundImg.src = getBackground();

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);
});

//change size of canvas based on the width and height of the window's layout viewport
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer.resize(window.innerWidth, window.innerHeight);

  const fieldOfViewRadians = (FIELD_OF_VIEW_DEGREES * Math.PI) / 180;
  shipVerticalBound =
    Math.tan(fieldOfViewRadians / 2) * SHIP_Z_DISTANCE_FROM_CAMERA;
  shipHorizontalBound =
    shipVerticalBound * (window.innerWidth / window.innerHeight);
}

function loop() {
  fpsCounter++;
  if (currentTime - lastFrameTime > 1000) {
    console.log("FPS: " + fpsCounter);
    fpsCounter = 0;
    lastFrameTime = currentTime;
  }

  moveShip();
  spawnBullet();
  spawnPlanet();
  spawnCollectible();
  despawnFarOffBullets();
  despawnPassedPlanets();
  manageEntityCollisions();

  const entities = [ship, ...bullets, ...planets, ...collectibles];
  for (const entity of entities) {
    entity.updatePosition();
  }
  renderer.renderEntities(entities);

  currentTime = Date.now();
  window.requestAnimationFrame(loop);
}

// Moves the ship within the bounds set
function moveShip() {
  const left = playerInputs.includes("KeyA");
  const right = playerInputs.includes("KeyD");
  const up = playerInputs.includes("KeyW");
  const down = playerInputs.includes("KeyS");

  if (left && !right && ship.getX() > -shipHorizontalBound) {
    ship.moveLeft(shipSpeed);
  } else if (right && !left && ship.getX() < shipHorizontalBound) {
    ship.moveRight(shipSpeed);
  } else {
    ship.stopXMovement();
  }

  if (up && !down && ship.getY() < shipVerticalBound) {
    ship.moveUp(shipSpeed);
  } else if (down && !up && ship.getY() > -shipVerticalBound) {
    ship.moveDown(shipSpeed);
  } else {
    ship.stopYMovement();
  }
}

// Spawns bullets with frequency controlled by intervals
function spawnBullet() {
  if (!playerInputs.includes("Space")) return;
  if (currentTime - lastBulletFireTime < BULLET_INTERVAL_TIME) return;

  const bullet = new Sphere(bulletSize, ship.origin);
  bullet.setColor(bulletColor);
  bullet.moveBack(2048);
  bullets.push(bullet);

  lastBulletFireTime = currentTime;
}

// Spawns planets with random sizes and positions within bounds set
// Frequency of spawn controlled by interval value
function spawnPlanet() {
  if (currentTime - lastPlanetSpawn < PLANET_INTERVAL_TIME) return;

  const planetRad =
    SMALLEST_PLANET_RADIUS +
    getRandomNumber(0, BIGGEST_PLANET_RADIUS - SMALLEST_PLANET_RADIUS);

  const planetX = getRandomNumber(-1, 1) * shipHorizontalBound;
  const planetY = getRandomNumber(-1, 1) * shipVerticalBound;
  const planetSpawnPosition = [planetX, planetY, -FAR_BOUND - planetRad];

  const planet = new Sphere(planetRad, planetSpawnPosition, true);
  planet.moveForth(256);
  planets.push(planet);

  lastPlanetSpawn = currentTime;
}

// Spawns collectibles with random positions within bounds set
// Frequency of spawn controlled by interval value
function spawnCollectible() {
  if (collectibles.length > 0) return;
  if (currentTime - lastCollectibleSpawn < COLLECTIBLE_INTERVAL_TIME) return;

  const collectibleX =
    getRandomNumber(-1, 1) * (shipHorizontalBound - COLLECTIBLE_SIZE);
  const collectibleY =
    getRandomNumber(-1, 1) * (shipVerticalBound - COLLECTIBLE_SIZE);
  const collectibleSpawnPosition = [
    collectibleX,
    collectibleY,
    -SHIP_Z_DISTANCE_FROM_CAMERA,
  ];

  const collectible = new Collectibles(
    COLLECTIBLE_SIZE,
    collectibleSpawnPosition
  );
  collectibles.push(collectible);

  lastCollectibleSpawn = currentTime;
}

function despawnFarOffBullets() {
  for (const [bulletIndex, bullet] of bullets.entries()) {
    if (bullet.getZ() < -FAR_BOUND - bullet.radius) {
      bullets.splice(bulletIndex, 1);
    }
  }
}

function despawnPassedPlanets() {
  for (const [planetIndex, planet] of planets.entries()) {
    if (planet.getZ() > BIGGEST_PLANET_RADIUS) {
      planets.splice(planetIndex, 1);
    }
  }
}

// Behaviors of objects (Ship, Bullets, Collectibles, Planets) when collision among them is detected
function manageEntityCollisions() {
  for (const [bulletIndex, bullet] of bullets.entries()) {
    for (const planet of planets) {
      if (hasCollided(SPHERE_SPHERE_COLLISION, planet, bullet)) {
        planet.setColor(bullet.color);
        bullets.splice(bulletIndex, 1);
      }
    }
  }

  for (const [collectibleIndex, collectible] of collectibles.entries()) {
    if (hasCollided(ENTITY_SHIP_COLLISION, ship, collectible)) {
      const behavior = collectible.selectedBehavior;
      const attribute = collectible.attribute;

      if (behavior == "COLOR") {
        bulletColor = attribute;
      } else if (behavior == "SIZE") {
        bulletSize = 1 * attribute;
      } else if (behavior == "SPEED") {
        shipSpeed = 50 * attribute;
      }
      collectibles.splice(collectibleIndex, 1);

      lastCollectibleSpawn = currentTime;
    }
  }
}
