import MovableEntity from "./MovableEntity.js";

export default class Ship extends MovableEntity {
  constructor(length, origin) {
    super(origin);
    let span = length * 2;
    const [indices, vertices] = this._generateVertices(span, length);

    this.setIndices(indices);
    this.setVertices(vertices);
  }

  _generateVertices(span, length) {
    // OLD MODEL
    // // Define the vertices of the spaceship
    // vertices = [
    //   // Body
    //   -length,
    //   0.0,
    //   length, // Vertex 0
    //   length,
    //   0.0,
    //   length, // Vertex 1
    //   -length,
    //   0.0,
    //   -length, // Vertex 2
    //   length,
    //   0.0,
    //   -length, // Vertex 3
    //   0.0,
    //   span,
    //   0.0, // Vertex 4 (top point)

    //   // Wing 1
    //   0.0,
    //   0.0,
    //   length, // Vertex 5
    //   span,
    //   0.0,
    //   length, // Vertex 6
    //   0.0,
    //   0.0,
    //   -length, // Vertex 7
    //   span,
    //   0.0,
    //   -length, // Vertex 8

    //   // Wing 2
    //   -span,
    //   0.0,
    //   length, // Vertex 9
    //   0.0,
    //   0.0,
    //   length, // Vertex 10
    //   -span,
    //   0.0,
    //   -length, // Vertex 11
    //   0.0,
    //   0.0,
    //   -length, // Vertex 12
    // ];

    // // Define the indices that connect the vertices to form triangles
    // indices = [
    //   // Body
    //   0,
    //   2,
    //   1, // Triangle 1
    //   1,
    //   2,
    //   3, // Triangle 2
    //   0,
    //   1,
    //   4, // Triangle 3
    //   1,
    //   3,
    //   4, // Triangle 4
    //   3,
    //   2,
    //   4, // Triangle 5
    //   2,
    //   0,
    //   4, // Triangle 6

    //   // Wing 1
    //   5,
    //   6,
    //   7, // Triangle 7
    //   6,
    //   8,
    //   7, // Triangle 8

    //   // Wing 2
    //   9,
    //   10,
    //   11, // Triangle 9
    //   10,
    //   12,
    //   11, // Triangle 10
    // ];

    // Define the vertices for the jet model

    console.log(span, length);
    const vertices = [
      // Main body vertices
      -1,
      1,
      -4, // Vertex 0
      -1,
      -1,
      -4, // Vertex 1
      1,
      -1,
      -4, // Vertex 2
      1,
      1,
      -4, // Vertex 3
      -1,
      1,
      2, // Vertex 4
      -1,
      -1,
      2, // Vertex 5
      1,
      -1,
      2, // Vertex 6
      1,
      1,
      2, // Vertex 7

      // Wings vertices
      -3,
      0,
      -2, // Vertex 8
      3,
      0,
      -2, // Vertex 9
      -2,
      0,
      -6, // Vertex 10
      2,
      0,
      -6, // Vertex 11
    ];

    for (let i = 0; i < vertices.length; i++) vertices[i] *= 4;

    // Define the indices for the jet model
    const indices = [
      // Main body faces
      0,
      1,
      2, // Face 0
      2,
      3,
      0, // Face 1
      4,
      7,
      6, // Face 2
      6,
      5,
      4, // Face 3
      0,
      4,
      5, // Face 4
      5,
      1,
      0, // Face 5
      1,
      5,
      6, // Face 6
      6,
      2,
      1, // Face 7
      2,
      6,
      7, // Face 8
      7,
      3,
      2, // Face 9
      3,
      7,
      4, // Face 10
      4,
      0,
      3, // Face 11

      // Wings faces
      8,
      10,
      11, // Face 12
      11,
      9,
      8, // Face 13
    ];
    return [indices, vertices];
  }
}
