import vertexShaderSourceCode from "./shaders/vertexShader.glsl.js";
import fragmentShaderSourceCode from "./shaders/fragmentShader.glsl.js";
import addArrays from "./utils/addArrays.js";

import { FAR_BOUND } from "./config.js";

export default class Renderer {
  constructor(canvas, textures = null) {
    this.gl = canvas.getContext("webgl2");
    this._setupProgram();
    this._initializePointers();
    this._initializeBuffers();
    this._initializeMatrices();

    this.gl.enable(this.gl.DEPTH_TEST);
    this._setupProjection();
    this._initializeCamera();
    this._initializeLighting();
    this.loadedTextures = null;
    if (textures) {
      this.loadedTextures = this._loadTextures(textures);
    }
  }

  _setupProgram() {
    const vertexShader = this._loadShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSourceCode
    );
    const fragmentShader = this._loadShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSourceCode
    );

    this.program = this.gl.createProgram();

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);

    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(this.program);
      throw "Could not link WebGL program. \n\n" + info;
    }

    this.gl.useProgram(this.program);
  }

  _loadShader(type, sourceCode) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, sourceCode);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      throw "Could not compile WebGL shader. \n\n" + info;
    }

    return shader;
  }

  _initializePointers() {
    const gl = this.gl;
    const program = this.program;

    function getAttribLocation(name) {
      return gl.getAttribLocation(program, name);
    }

    function getUniformLocation(name) {
      return gl.getUniformLocation(program, name);
    }

    this.pointers = {
      attributes: {
        position: getAttribLocation("a_position"),
        color: getAttribLocation("a_color"),
        normals: getAttribLocation("a_normal"),
        textureCoord: getAttribLocation("a_texcoord"),
      },
      uniforms: {
        model: getUniformLocation("u_model_matrix"),
        view: getUniformLocation("u_view_matrix"),
        projection: getUniformLocation("u_projection_matrix"),
        normal: getUniformLocation("u_normal_matrix"),
        lightDirection: getUniformLocation("u_light_direction"),
        textureUnit: getUniformLocation("u_texture"),
      },
    };
  }

  _initializeBuffers() {
    this.buffers = {
      position: this.gl.createBuffer(),
      indices: this.gl.createBuffer(),
      colors: this.gl.createBuffer(),
      normals: this.gl.createBuffer(),
      texture: this.gl.createBuffer(),
    };
  }

  _initializeMatrices() {
    this.matrices = {
      model: glMatrix.mat4.create(),
      view: glMatrix.mat4.create(),
      projection: glMatrix.mat4.create(),
      normal: glMatrix.mat4.create(),
      texture: glMatrix.mat4.create(),
    };
  }

  _setupProjection() {
    this.matrices.projection = glMatrix.mat4.create();

    glMatrix.mat4.perspective(
      this.matrices.projection,
      (45 * Math.PI) / 180,
      this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
      0.1,
      FAR_BOUND
    );

    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.projection,
      false,
      this.matrices.projection
    );
  }

  _initializeCamera() {
    this.camera = {
      position: [0, 0, 0],
      viewDirection: [0, 0, -1],
      upDirection: [0, 1, 0],
    };

    this._updateCamera();
  }

  _updateCamera() {
    const cameraCenter = addArrays(
      this.camera.position,
      this.camera.viewDirection
    );

    this.matrices.camera = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
      this.matrices.camera,
      this.camera.position,
      cameraCenter,
      this.camera.upDirection
    );
    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.view,
      false,
      this.matrices.camera
    );
  }

  _initializeLighting() {
    this.lightDirection = [-1.0, -1.0, -2.0];

    this.gl.uniform3fv(
      this.pointers.uniforms.lightDirection,
      this.lightDirection
    );
  }

  _renderObject(object) {
    this._setPositionOrigin(object.origin);
    this._setVertices(object.vertices);
    this._setIndices(object.indices);
    this._setColor(object.colors);

    if (object.normals) {
      this._setNormals(object.normals);
    } else {
      const flatLightingNormals = this._generateFlatLightingNormals(
        object.vertices.length,
        this.lightDirection
      );

      this._setNormals(flatLightingNormals);
    }

    // check the maximum texture units
    // got from https://webglfundamentals.org/webgl/lessons/webgl-texture-units.html
    // const maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

    // if the object has a texture
    if (object.textureName) {
      this._setTextureCoords(object.textureCoords);
      // get the texture name (refer to Entity.js)
      const textureName = object.textureName;
      // get the texture and texture unit
      const { texture, textureUnitIndex } = this.loadedTextures[textureName];

      // Activate the texture unit and bind the texture
      this.gl.activeTexture(this.gl.TEXTURE0 + textureUnitIndex);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

      // get the sample and set this texture unit to the sampler2d
      this.gl.uniform1i(this.pointers.uniforms.textureUnit, textureUnitIndex);
    }

    this.gl.drawElements(
      this.gl.TRIANGLES,
      object.indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }

  _generateFlatLightingNormals(verticesLength, lightDirection) {
    const normal = glMatrix.vec3.create();
    glMatrix.vec3.normalize(normal, [
      -lightDirection[0],
      -lightDirection[1],
      -lightDirection[2],
    ]);
    return new Array(verticesLength / 3).fill([
      normal[0],
      normal[1],
      normal[2],
    ]);
  }

  /**-------------------------
   *  POSITION FUNCTIONS
   * -------------------------
   */

  _setPositionOrigin(origin) {
    this.matrices.model = glMatrix.mat4.create();
    glMatrix.mat4.translate(this.matrices.model, this.matrices.model, origin);
    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.model,
      false,
      this.matrices.model
    );

    this._updateNormalMatrix();
  }

  _updateNormalMatrix() {
    const modelViewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.multiply(
      modelViewMatrix,
      this.matrices.view,
      this.matrices.model
    );

    this.matrices.normal = glMatrix.mat4.create();
    glMatrix.mat4.invert(this.matrices.normal, modelViewMatrix);
    glMatrix.mat4.transpose(this.matrices.normal, this.matrices.normal);

    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.normal,
      false,
      this.matrices.normal
    );
  }

  _setVertices(vertices) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );

    this.gl.vertexAttribPointer(
      this.pointers.attributes.position,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.enableVertexAttribArray(this.pointers.attributes.position);
  }

  _setIndices(indices) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );
  }

  _setNormals(normals) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normals);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(normals.flat(Infinity)),
      this.gl.STATIC_DRAW
    );

    this.gl.vertexAttribPointer(
      this.pointers.attributes.normals,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.enableVertexAttribArray(this.pointers.attributes.normals);
  }

  /**-------------------------
   *  COLOR FUNCTIONS
   * -------------------------
   */
  _setColor(color) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.colors);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(color),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(
      this.pointers.attributes.color,
      4,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.pointers.attributes.color);
  }

  /**--------------------------
   * TEXTURE FUNCTIONS
   * ------------------------
   */
  _loadTextures(textures) {
    const loadedTextures = {};
    let textureUnitIndex = 1;

    for (const textureName in textures) {
      // create a texture in webgl for each texture
      const texturePath = textures[textureName];
      const texture = this._loadOneTexture(texturePath);

      // set the texture and the texture unit of the texture name in the loaded textures
      loadedTextures[textureName] = {
        texture: texture,
        textureUnitIndex: textureUnitIndex,
      };

      // Increment the texture unit index for the next texture
      textureUnitIndex++;
    }
    return loadedTextures;
  }

  _loadOneTexture(texturePath) {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Load the texture image
    const image = new Image();
    const path = "./src/assets/" + texturePath;
    image.src = path;

    // Actually the onload is not necessary since local, haha :<
    image.onload = () => {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

      // For wrapping mode, note that for power of 2 textures this wont work
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        image
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR
      );
    };

    return texture;
  }

  _setTextureCoords(textureCoords) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texture);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(textureCoords),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(
      this.pointers.attributes.textureCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.enableVertexAttribArray(this.pointers.attributes.textureCoord);
  }

  /** ------------------------
   *  PUBLIC METHODS
   * -------------------------
   */
  renderEntities(entities) {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    for (const entity of entities) this._renderObject(entity);
  }

  moveCamera(x, y, z) {
    this.camera.position = addArrays(this.camera.position, [x, y, z]);
    this._updateCamera();
  }
}
