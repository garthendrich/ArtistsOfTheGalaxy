import Renderer from "./Renderer.js";
import Sphere from "./entities/Sphere.js";
import Ship from "./entities/Ship.js";

main();

function main() {
  let shipX = 0;
  let shipY = 0;
  let shipZ = 0;
  let shipSize = 1;
  let movementSpeed = 0.1;
  
  const ship = new Ship(shipSize, [shipX, shipY, shipZ]);
  
  const planets = [
    new Sphere(10, [20, 30, -350]),
    new Sphere(10, [0, 0, -300]),
    new Sphere(20, [-60, -20, -450]),
    new Sphere(20, [-60, 50, -360]),
    new Sphere(20, [40, 0, -300]),
    new Sphere(30, [110, -150, -600]),
    new Sphere(30, [-300, -220, -900]),
  ];

  const canvas = document.querySelector("#screen");
  const renderer = new Renderer(canvas);

  window.requestAnimationFrame(loop);

  function loop() {
    const objects = [ship, ...planets];
    renderer.renderObjects(objects);

    window.requestAnimationFrame(loop);
  }

  function movement() {
    return function() {
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
}