import MovableEntity from "./MovableEntity.js";

export default class Ship extends MovableEntity {
  constructor(origin) {
    super(origin);

    const [indices, vertices] = this._generateVertices();

    this.setIndices(indices);
    this.setVertices(vertices);
  }

  _generateVertices() {
    let indices = [];

    let vertices = [];

    // Define the vertices of the spaceship
    vertices = [
      // Body
      -0.5,
      0.0,
      0.5, // Vertex 0
      0.5,
      0.0,
      0.5, // Vertex 1
      -0.5,
      0.0,
      -0.5, // Vertex 2
      0.5,
      0.0,
      -0.5, // Vertex 3
      0.0,
      1.0,
      0.0, // Vertex 4 (top point)

      // Wing 1
      0.0,
      0.0,
      0.5, // Vertex 5
      1.0,
      0.0,
      0.5, // Vertex 6
      0.0,
      0.0,
      -0.5, // Vertex 7
      1.0,
      0.0,
      -0.5, // Vertex 8

      // Wing 2
      -1.0,
      0.0,
      0.5, // Vertex 9
      0.0,
      0.0,
      0.5, // Vertex 10
      -1.0,
      0.0,
      -0.5, // Vertex 11
      0.0,
      0.0,
      -0.5, // Vertex 12
    ];

    // Define the indices that connect the vertices to form triangles
    indices = [
      // Body
      0,
      2,
      1, // Triangle 1
      1,
      2,
      3, // Triangle 2
      0,
      1,
      4, // Triangle 3
      1,
      3,
      4, // Triangle 4
      3,
      2,
      4, // Triangle 5
      2,
      0,
      4, // Triangle 6

      // Wing 1
      5,
      6,
      7, // Triangle 7
      6,
      8,
      7, // Triangle 8

      // Wing 2
      9,
      10,
      11, // Triangle 9
      10,
      12,
      11, // Triangle 10
    ];
    return [indices, vertices];
  }
}
