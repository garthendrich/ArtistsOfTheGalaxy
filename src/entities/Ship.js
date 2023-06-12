import MovableEntity from "/src/entities/MovableEntity";

export default class Ship extends MovableEntity {
  constructor(length, origin) {
    super(origin);
    const [indices, vertices] = this._generateVertices();
    const colors = this.generateColors(indices);
    const textureCoords = this._generateTextureVertices();

    this.setColors(colors);
    this.setIndices(indices);
    this.setVertices(vertices);
    this.setTextureCoords(textureCoords);
    this.setTexture("SHIP");
  }

  _generateVertices() {
    // Define the vertices for the jet model

    const vertices = [
      // Main body vertices
      -4,
      4,
      -16, // Vertex 0
      -4,
      -4,
      -16, // Vertex 1
      4,
      -4,
      -16, // Vertex 2
      4,
      4,
      -16, // Vertex 3
      -4,
      4,
      8, // Vertex 4
      -4,
      -4,
      8, // Vertex 5
      4,
      -4,
      8, // Vertex 6
      4,
      4,
      8, // Vertex 7

      // Wings vertices
      -12,
      0,
      -8, // Vertex 8
      12,
      0,
      -8, // Vertex 9
      -8,
      0,
      -24, // Vertex 10
      8,
      0,
      -24, // Vertex 11
    ];

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
}
