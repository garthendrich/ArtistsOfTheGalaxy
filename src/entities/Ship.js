import MovableEntity from "./MovableEntity.js";

export default class Ship extends MovableEntity {
  constructor(length, origin) {
    super(origin);
    let span = length * 2;
    const [indices, vertices] = this._generateVertices(span, length);

    this.setIndices(indices);
    this.setVertices(vertices);
    this.setTexture("DEFAULT");
  }

  _generateVertices(span, length) {
    let indices = [];

    let vertices = [];

    // Define the vertices of the spaceship
    vertices = [
      // Body
      -length,
      0.0,
      length, // Vertex 0
      length,
      0.0,
      length, // Vertex 1
      -length,
      0.0,
      -length, // Vertex 2
      length,
      0.0,
      -length, // Vertex 3
      0.0,
      span,
      0.0, // Vertex 4 (top point)

      // Wing 1
      0.0,
      0.0,
      length, // Vertex 5
      span,
      0.0,
      length, // Vertex 6
      0.0,
      0.0,
      -length, // Vertex 7
      span,
      0.0,
      -length, // Vertex 8

      // Wing 2
      -span,
      0.0,
      length, // Vertex 9
      0.0,
      0.0,
      length, // Vertex 10
      -span,
      0.0,
      -length, // Vertex 11
      0.0,
      0.0,
      -length, // Vertex 12
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
