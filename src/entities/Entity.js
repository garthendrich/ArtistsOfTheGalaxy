export default class Entity {
  constructor(origin = [0, 0, 0]) {
    this.origin = origin;
    this.textureName = "DEFAULT";
    this.colors = [1, 1, 1, 1];
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
}
