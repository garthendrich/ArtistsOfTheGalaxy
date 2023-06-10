import addArrays from "./utils/addArrays.js";
import vertexShaderSourceCode from "./shaders/vertexShader.glsl.js";
import fragmentShaderSourceCode from "./shaders/fragmentShader.glsl.js";

export default class Renderer {
  constructor(canvas, textures = null) {
    this.gl = canvas.getContext("webgl2");
    this._setupProgram();
    this._initializePointers();
    this._initializeBuffers();

    this.gl.enable(this.gl.DEPTH_TEST);
    this._setupProjection();
    this._initializeCamera();
    this._setupLightValues();
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

  _setupLightValues() {
    // Define light properties
    this.lightDirection = [1, 1, 1, 0.0]; // Example light direction

    // Set ambient and diffuse light colors and intensities
    this.ambientLight = [0.8, 0.8, 0.8, 1.0];
    this.diffuseLight = [1, 1, 1, 1.0];
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
        textureCoord: getAttribLocation("a_texcoord"),
      },
      uniforms: {
        lightDirection: getUniformLocation("u_light_direction"),
        ambientLight: getUniformLocation("u_ambient_light"),
        diffuseLight: getUniformLocation("u_diffuse_light"),
        model: getUniformLocation("u_model_matrix"),
        view: getUniformLocation("u_view_matrix"),
        projection: getUniformLocation("u_projection_matrix"),
        textureUnit: getUniformLocation("u_texture"),
      },
    };
  }

  _initializeBuffers() {
    this.buffers = {
      position: this.gl.createBuffer(),
      indices: this.gl.createBuffer(),
      colors: this.gl.createBuffer(),
      texture: this.gl.createBuffer(),
    };
  }

  _setupProjection() {
    const projectionMatrix = glMatrix.mat4.create();

    glMatrix.mat4.perspective(
      projectionMatrix,
      (45 * Math.PI) / 180,
      this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
      0.1,
      1000
    );

    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.projection,
      false,
      projectionMatrix
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

    const cameraMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
      cameraMatrix,
      this.camera.position,
      cameraCenter,
      this.camera.upDirection
    );
    this.gl.uniformMatrix4fv(this.pointers.uniforms.view, false, cameraMatrix);
  }

  _renderObject(object) {
    this._setPositionOrigin(object.origin);
    this._setVertices(object.vertices);
    this._setIndices(object.indices);
    this._setColor(object.colors);
    this._setLightComponents();
    // check the maximum texture units
    // got from https://webglfundamentals.org/webgl/lessons/webgl-texture-units.html
    // const maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    // console.log(maxTextureUnits);

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

  /**-------------------------
   *  POSITION FUNCTIONS
   * -------------------------
   */

  _setPositionOrigin(origin) {
    const modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(modelMatrix, modelMatrix, origin);
    this.gl.uniformMatrix4fv(this.pointers.uniforms.model, false, modelMatrix);
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

  _setLightComponents() {
    const lightDirectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.fromTranslation(lightDirectionMatrix, this.lightDirection);

    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.lightDirection,
      false,
      this.lightDirection
    );
    this.gl.uniform4fv(this.pointers.uniforms.ambientLight, this.ambientLight);
    this.gl.uniform4fv(this.pointers.uniforms.diffuseLight, this.diffuseLight);
  }

  /** ------------------------
   *  PUBLIC METHODS
   * -------------------------
   */
  renderObjects(objects) {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    for (const object of objects) this._renderObject(object);
  }

  moveCamera(x, y, z) {
    this.camera.position = addArrays(this.camera.position, [x, y, z]);
    this._updateCamera();
  }

  setLightDirection(direction) {
    this.lightDirection = direction;
  }

  setAmbientLight(light) {
    this.ambientLight = light;
  }

  setDiffuseLight(light) {
    this.diffuseLight = light;
  }
}
