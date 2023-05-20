import Entity from "./Entity.js";
import { getRandomNumber } from "../utils/randomizer.js";

export default class Collectibles extends Entity {
  constructor(length = 1, origin) {
    super(origin);

    // Default black Color;
    this.color = [1, 0, 0, 1];
    // behaviors
    this.selectedBehavior = this._generateBehavior();
    this.attribute = this._generateAttribute();
    console.log(this.selectedBehavior, this.attribute);
    const [indices, vertices] = this._generateVertices(length);
    // will contain repeated copies of the default color
    let colors = this._generateColors(indices);

    this.setIndices(indices);
    this.setVertices(vertices);
    this.setColors(colors);
  }

  _generateVertices(length) {
    const vertices = [
      -length,
      -length,
      length,
      length,
      -length,
      length,
      length,
      length,
      length,
      -length,
      length,
      length,

      -length,
      -length,
      -length,
      -length,
      length,
      -length,
      length,
      length,
      -length,
      length,
      -length,
      -length,

      -length,
      length,
      -length,
      -length,
      length,
      length,
      length,
      length,
      length,
      length,
      length,
      -length,

      -length,
      -length,
      -length,
      length,
      -length,
      -length,
      length,
      -length,
      length,
      -length,
      -length,
      length,

      length,
      -length,
      -length,
      length,
      length,
      -length,
      length,
      length,
      length,
      length,
      -length,
      length,

      -length,
      -length,
      -length,
      -length,
      -length,
      length,
      -length,
      length,
      length,
      -length,
      length,
      -length,
    ];
    const indices = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ];

    return [indices, vertices];
  }

  _selectItemFromArray(array, min, max) {
    let index = Math.floor(getRandomNumber(min, max));
    return array[index];
  }

  _generateBehavior() {
    const behaviors = ["SPEED", "COLOR", "SIZE"];

    return this._selectItemFromArray(behaviors, 0, 3);
  }

  _generateColor() {
    const colors = [
      [0.0, 0.0, 1.0, 1], // BLUE
      [0.0, 1.0, 0.0, 1], // GREEN
      [1.0, 0.0, 0.0, 1], // RED
      [0.0, 1.0, 1.0, 1],
      [1.0, 1.0, 0.0, 1],
      [1.0, 0.0, 1.0, 1],
    ];

    this.color = this._selectItemFromArray(colors, 0, colors.length);

    return this.color;
  }

  _generateSpeed() {
    const speeds = [1, 2, 3, 4, 5];
    this.color = [1, 1, 1, 1];

    return this._selectItemFromArray(speeds, 0, 3, speeds.length);
  }

  _generateSize() {
    // bullet sizes
    const sizes = [1, 2, 3, 4, 5];
    this.color = [1, 1, 1, 1];
    return this._selectItemFromArray(sizes, 0, sizes.length);
  }

  _generateAttribute() {
    switch (this.selectedBehavior) {
      case "SPEED":
        return this._generateSpeed();
      case "COLOR":
        return this._generateColor();
      case "SIZE":
        return this._generateSize();
    }
  }

  //   Will load texture depending on the type of the collectible (SPEED, COLOR, SIZE);
  //   _loadTexture(){}

  // _generateTextureVertices(){}

  _generateColors(indices) {
    let indicesCount = indices.length;
    let colors = [];
    for (let i = 0; i < indicesCount; i++) {
      colors.push(this.color[0]);
      colors.push(this.color[1]);
      colors.push(this.color[2]);
      colors.push(this.color[3]);
    }
    return colors;
  }
}
