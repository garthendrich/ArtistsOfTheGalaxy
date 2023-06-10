// https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection

// import Sphere from "../entities/Sphere";

// Function that detects whether object1 and object2 has collided. Takes one object1 and one object2 at
// a time.
// params: type { string } Indicator whether it is sphere to sphere collision or entitity to ship
export function hasCollided(type, object1, object2) {
  if (type === "sphereToSphere") {
    // sphere to sphere collission (planet and bullets)
    const distance = Math.sqrt(
      (object1.getX() - object2.getX()) * (object1.getX() - object2.getX()) +
        (object1.getY() - object2.getY()) * (object1.getY() - object2.getY()) +
        (object1.getZ() - object2.getZ()) * (object1.getZ() - object2.getZ())
    );
    console.log(distance < object1.getRadius() + object2.getRadius());
    return distance < object1.getRadius() + object2.getRadius();
  } else if (type === "entityToShip") {
    const shipWidth = 10;
    const shipHeight = 10;
    const shipDepth = 10;

    const shipBoundingBox = {
      minX: object1.getX() - shipWidth / 2,
      maxX: object1.getX() + shipWidth / 2,
      minY: object1.getY() - shipHeight / 2,
      maxY: object1.getY() + shipHeight / 2,
      minZ: object1.getZ() - shipDepth / 2,
      maxZ: object1.getZ() + shipDepth / 2,
    };

    const objectWidth = 8;
    const objectHeight = 8;
    const objectDepth = 8;

    const objectBoundingBox = {
      minX: object2.getX() - objectWidth / 2,
      maxX: object2.getX() + objectWidth / 2,
      minY: object2.getY() - objectHeight / 2,
      maxY: object2.getY() + objectHeight / 2,
      minZ: object2.getZ() - objectDepth / 2,
      maxZ: object2.getZ() + objectDepth / 2,
    };

    if (
      shipBoundingBox.minX <= objectBoundingBox.maxX &&
      shipBoundingBox.maxX >= objectBoundingBox.minX &&
      shipBoundingBox.minY <= objectBoundingBox.maxY &&
      shipBoundingBox.maxY >= objectBoundingBox.minY &&
      shipBoundingBox.minZ <= objectBoundingBox.maxZ &&
      shipBoundingBox.maxZ >= objectBoundingBox.minZ
    ) {
      // Collision detected
      console.log("Collectible collected!");
      return true;
    }
  }
}
