const fragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec4 v_color;
out vec4 outColor;

in vec2 v_texcoord;
uniform sampler2D u_texture;
void main() {
    // uncomment line below to test colors
    // outColor = v_color;

    // outColor = vec4(0, 1, 0, 1);

    // comment line below to test colors on other entities
    outColor = texture(u_texture, v_texcoord) * v_color;
}
`;

export default fragmentShaderSourceCode;
