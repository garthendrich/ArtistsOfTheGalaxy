import Renderer from "./Renderer.js";
import Sphere from "./entities/Sphere.js";

main();

function main() {
  let shipMovementSpeed = 0.1;
  const ship = new Sphere(1, [0, 0, -10]); // ! temporary entity class

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
    return function (event) {
      if (canvas.width > 5 && canvas.height > 5) {
        if ("ArrowRight" === event.key) {
          ship.origin[0] += shipMovementSpeed;
        }

        if ("ArrowLeft" === event.key) {
          ship.origin[0] -= shipMovementSpeed;
        }

        if ("ArrowUp" === event.key) {
          ship.origin[1] += shipMovementSpeed;
        }

        if ("ArrowDown" === event.key) {
          ship.origin[1] -= shipMovementSpeed;
        }
      }
    };
  }

  function stopMovement() {
    return function () {};
  }

  const bodyElement = document.querySelector("body");

  bodyElement.addEventListener("keyup", stopMovement);
  bodyElement.addEventListener("keydown", movement());
}
