import addVertices from "./utils/addVertices.js";
import vertexShaderSourceCode from "./shaders/vertexShader.glsl.js";
import fragmentShaderSourceCode from "./shaders/fragmentShader.glsl.js";

export default class Renderer {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl2");
    this._setupProgram();
    this._initializePointers();
    this._initializeBuffers();

    this.gl.enable(this.gl.DEPTH_TEST);
    this._setupProjection();
    this._initializeCamera();
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
      },
      uniforms: {
        model: getUniformLocation("u_model_matrix"),
        view: getUniformLocation("u_view_matrix"),
        projection: getUniformLocation("u_projection_matrix"),
      },
    };
  }

  _initializeBuffers() {
    this.buffers = {
      position: this.gl.createBuffer(),
      indices: this.gl.createBuffer(),
      colors: this.gl.createBuffer(),
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
  }

  _updateCamera() {
    const cameraCenter = addVertices(
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

    this.gl.drawElements(
      this.gl.TRIANGLES,
      object.indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }

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

  // public methods

  renderObjects(objects) {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    for (const object of objects) this._renderObject(object);
  }

  moveCamera(x, y, z) {
    this.camera.position = addVertices(this.camera.position, [x, y, z]);
    this._updateCamera();
  }
}
