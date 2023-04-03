const vertexShaderSourceCode = `#version 300 es
in vec3 a_position;

in vec4 a_color;
out vec4 v_color;

uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;

void main() {
    gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vec4(a_position, 1);

    v_color = a_color;
}
`;

export default vertexShaderSourceCode;
