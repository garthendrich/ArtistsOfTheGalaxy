export default class Entity {
  constructor(origin = [0, 0, 0]) {
    this.origin = origin;
    this.textureName = "DEFAULT";
    this.color = [1, 1, 1, 1];
  }

  setIndices(indices) {
    this.indices = indices;
  }

  setVertices(vertices) {
    this.vertices = vertices;
  }

  setColor(color) {
    this.color = color;
    this.setColors(this.generateColors(this.getIndices()));
  }

  setColors(colors) {
    this.colors = colors;
  }

  setNormals(normals) {
    this.normals = normals;
  }

  setTextureCoords(textureCoords) {
    this.textureCoords = textureCoords;
  }

  setTexture(textureName) {
    this.textureName = textureName;
  }

  getX() {
    return this.origin[0];
  }

  getY() {
    return this.origin[1];
  }

  getZ() {
    return this.origin[2];
  }

  getIndices() {
    return this.indices;
  }

  generateColors(indices) {
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
