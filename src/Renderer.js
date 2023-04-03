import vertexShaderSourceCode from "./shaders/vertexShader.glsl.js";
import fragmentShaderSourceCode from "./shaders/fragmentShader.glsl.js";

export default class Renderer {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl2");
    this._setupProgram();
    this._initPointers();
    this._initBuffers();
    this._initMatrices();
    this.gl.enable(this.gl.DEPTH_TEST);
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

  _initPointers() {
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

  _initBuffers() {
    this.buffers = {
      position: this.gl.createBuffer(),
      indices: this.gl.createBuffer(),
    };
  }

  _initMatrices() {
    this.matrices = {
      model: glMatrix.mat4.create(),
      view: glMatrix.mat4.create(),
      projection: glMatrix.mat4.create(),
    };
  }

  _setPosition(vertices) {
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

  // public methods

  render(object) {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this._setPosition(object.vertices);
    this._setIndices(object.indices);

    glMatrix.mat4.lookAt(this.matrices.view, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(
      this.matrices.projection,
      (45 * Math.PI) / 180,
      this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
      0.1,
      100
    );

    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.model,
      false,
      this.matrices.model
    );
    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.view,
      false,
      this.matrices.view
    );
    this.gl.uniformMatrix4fv(
      this.pointers.uniforms.projection,
      false,
      this.matrices.projection
    );

    this.gl.drawElements(
      this.gl.TRIANGLES,
      object.indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }
}
