// https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection 

// import Sphere from "../entities/Sphere";

// Function that detects whether object1 and object2 has collided. Takes one object1 and one object2 at 
// a time.
// params: type { string } Indicator whether it is sphere to sphere collision or entitity to ship
export function hasCollided(type, object1, object2){

    if(type==="sphereToSphere"){ // sphere to sphere collission (planet and bullets)
        const distance = Math.sqrt(
            (object1.getX() - object2.getX()) * (object1.getX() - object2.getX()) +
            (object1.getY() - object2.getY()) * (object1.getY() - object2.getY()) +
            (object1.getZ() - object2.getZ()) * (object1.getZ() - object2.getZ())
        );
        console.log(distance < object1.getRadius() + object2.getRadius());
        return distance < object1.getRadius() + object2.getRadius();
    } else if(type==="entityToShip"){

    }


}