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

  setTextureCoords(textureCoords) {
    this.textureCoords = textureCoords;
  }

  setTextureImage(texturePath) {
    this.texturePath = texturePath;
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
