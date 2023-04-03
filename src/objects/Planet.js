export default class Planet {
  constructor(radius = 1) {
    /**
     * buffer data generator derived from three.js SphereGeometry
     * https://github.com/mrdoob/three.js/blob/dev/src/geometries/SphereGeometry.js
     */

    const phiStart = 0;
    const phiLength = Math.PI * 2;
    const thetaStart = 0;
    const thetaLength = Math.PI;
    const widthSegments = 64;
    const heightSegments = 64;

    let index = 0;
    const grid = [];

    // buffers

    this.indices = [];
    this.vertices = [];

    // generate vertices

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = [];

      const v = iy / heightSegments;

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

        this.vertices.push(x, y, z);

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

        if (iy !== 0) this.indices.push(a, b, d);
        if (iy !== heightSegments - 1) this.indices.push(b, c, d);
      }
    }
  }
}
