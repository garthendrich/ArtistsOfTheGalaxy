export default class Entity {
  constructor(origin = [0, 0, 0]) {
    this.origin = origin;
  }

  setIndices(indices) {
    this.indices = indices;
  }

  setVertices(vertices) {
    this.vertices = vertices;
  }

  setColors(colors) {
    this.colors = colors;
  }
}
