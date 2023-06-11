import MovableEntity from "./MovableEntity.js";
import { getRandomNumber } from "../utils/randomizer.js";

export default class Sphere extends MovableEntity {
  constructor(radius = 1, origin, isPlanet = false) {
    super(origin);
    const [indices, vertices, normals, textureCoords] =
      this._generateVertices(radius);
    const colors = this.generateColors(indices);

    this.setColors(colors);
    this.setIndices(indices);
    this.setTextureCoords(textureCoords);
    this.setVertices(vertices);
    this.setNormals(normals);
    if (isPlanet === true) {
      this.setTexture("PLANET" + Math.floor(getRandomNumber(1, 4)));
    }

    // set an attribute: radius
    this.radius = radius;
  }

  // method for getting the radius of the sphere object
  getRadius() {
    return this.radius;
  }

  _generateVertices(radius) {
    /**
     * buffer data generator derived from three.js SphereGeometry
     * https://github.com/mrdoob/three.js/blob/dev/src/geometries/SphereGeometry.js
     */

    const phiStart = 0;
    const phiLength = Math.PI * 2;
    const thetaStart = 0;
    const thetaLength = Math.PI;
    const widthSegments = 16;
    const heightSegments = 16;

    let index = 0;
    const grid = [];

    // buffers

    const indices = [];
    const vertices = [];
    const normals = [];
    const textureCoords = [];

    // generate vertices

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = [];

      const v = iy / heightSegments;

      let uOffset = 0;

      if (iy === 0) {
        uOffset = 0.5 / widthSegments;
      } else if (iy === heightSegments) {
        uOffset = -0.5 / widthSegments;
      }

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;

        // vertex

        const x =
          -radius *
          Math.cos(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);
        const y = radius * Math.cos(thetaStart + v * thetaLength);
        const z =
          radius *
          Math.sin(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);

        vertices.push(x, y, z);

        const normal = glMatrix.vec3.create();
        glMatrix.vec3.normalize(normal, [x, y, z]);
        normals.push(...normal);

        textureCoords.push(u + uOffset, 1 - v);

        verticesRow.push(index);
        index++;
      }

      grid.push(verticesRow);
    }

    // indices

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0) indices.push(a, b, d);
        if (iy !== heightSegments - 1) indices.push(b, c, d);
      }
    }

    return [indices, vertices, normals, textureCoords];
  }
}
