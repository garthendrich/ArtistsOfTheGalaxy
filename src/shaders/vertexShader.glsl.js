const vertexShaderSourceCode = `#version 300 es
in vec3 a_position;
in vec4 a_color;
in vec2 a_texcoord;
in vec3 a_normal;

uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;
uniform vec3 u_light_direction; // Light direction in world space

out vec2 v_texcoord;
out vec4 v_color;
out vec3 v_normal;
out vec3 v_light_direction;

void main() {
    gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vec4(a_position, 1.0);

    v_texcoord = a_texcoord;
    v_color = a_color;
    v_normal = mat3(u_model_matrix) * a_normal; // Transform normal to world space
    v_light_direction = u_light_direction;
}
`;

export default vertexShaderSourceCode;
