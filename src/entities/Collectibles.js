import { selectItemFromArray } from "../utils/selectItemFromArray.js";

import { BULLET_COLORS } from "../config.js";
import MovableEntity from "./MovableEntity.js";

export default class Collectibles extends MovableEntity {
  constructor(length = 1, origin) {
    super(origin);

    // behaviors
    this.selectedBehavior = this._generateBehavior();
    this.attribute = this._generateAttribute();

    const [indices, vertices, normals] = this._generateVertices(length);
    // will contain repeated copies of the default color
    const colors = this.generateColors(indices);
    const textureCoords = this._generateTextureVertices();
    const textureName = this._generateTextureName();

    this.setVertices(vertices);
    this.setIndices(indices);
    this.setNormals(normals);
    this.setColors(colors);
    this.setTextureCoords(textureCoords);
    this.setTexture(textureName);
  }

  _generateVertices(length) {
    // Cube vertices and indices obtained from: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
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
    const normals = [
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1, //front
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1, //back
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0, //top
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0, //bottom
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, //right
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0, //left
    ];

    return [indices, vertices, normals];
  }

  _generateBehavior() {
    const behaviors = ["SPEED", "COLOR", "SIZE"];
    return selectItemFromArray(behaviors);
  }

  _generateColor() {
    this.color = selectItemFromArray(BULLET_COLORS);
    return this.color;
  }

  _generateShipSpeed() {
    const speeds = [1, 2, 3, 4, 5];
    return selectItemFromArray(speeds);
  }

  _generateSize() {
    // bullet sizes
    const sizes = [2, 3, 4, 5, 6];
    return selectItemFromArray(sizes);
  }

  _generateAttribute() {
    switch (this.selectedBehavior) {
      case "SPEED":
        return this._generateShipSpeed();
      case "COLOR":
        return this._generateColor();
      case "SIZE":
        return this._generateSize();
    }
  }

  _generateTextureVertices() {
    let vertices = [
      // top
      0, 1, 1, 1, 1, 0, 0, 0,

      // bottom
      0, 0, 1, 0, 1, 1, 0, 1,

      // front
      0, 0, 1, 0, 1, 1, 0, 1,

      // left
      0, 0, 1, 0, 1, 1, 0, 1,

      // Right
      1, 0, 0, 0, 0, 1, 1, 1,

      // back
      1, 1, 0, 1, 0, 0, 1, 0,
    ];

    return vertices;
  }

  _generateTextureName() {
    return this.selectedBehavior;
  }
}
