import Renderer from "./Renderer.js";
import Planet from "./objects/Planet.js";
import Ship from "./objects/Ship.js";

let shipX = 0;
let shipY = 0;
let shipZ = 0;
let shipSize = 1;
let movementSpeed = 0.1;

main();

function main() {
  const canvas = document.querySelector("#screen");
  const renderer = new Renderer(canvas);
  const planets = [
    new Ship(shipSize, [shipX, shipY, shipZ])
  ];
  renderer.renderObjects(planets);
}

function movement() {
  return function() {
    const canvas = document.querySelector("#screen");
    if(canvas.width - shipSize > 5 && canvas.height - shipSize > 5) {
      if( "ArrowRight" === event.key ){
        shipX += movementSpeed;
      }

      if( "ArrowLeft" === event.key ){
        shipX -= movementSpeed;
      }

      if( "ArrowUp" === event.key ){
        shipY += movementSpeed;
      }

      if( "ArrowDown" === event.key ){
        shipY -= movementSpeed;
      }
      console.log(shipX);
      main();
  }
}
}

function stopMovement() {
  return function(){

  }
}

const bodyElement = document.querySelector( "body" );

bodyElement.addEventListener("keyup", stopMovement);
bodyElement.addEventListener("keydown", movement());