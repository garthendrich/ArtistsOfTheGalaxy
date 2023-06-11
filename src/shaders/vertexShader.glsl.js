const vertexShaderSourceCode = `#version 300 es
in vec3 a_position;
in vec4 a_color;
in vec2 a_texcoord;
in vec3 a_normal;

uniform vec3 u_light_direction;

uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;
uniform mat4 u_normal_matrix;

out vec2 v_texcoord;
out vec4 v_color;
out vec3 v_normal;

void main() {
    gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vec4(a_position, 1.0);

    v_texcoord = a_texcoord;

    vec3 corrected_a_normal = vec3(u_normal_matrix * vec4(a_normal, 1.0));
    vec3 normalized_a_normal = normalize(corrected_a_normal);
    vec3 normalized_u_light_direction = normalize(u_light_direction);
    float lambert_coefficient = dot(-normalized_u_light_direction, normalized_a_normal);
    lambert_coefficient = max(lambert_coefficient, 0.0);
    v_color = vec4(a_color.rgb * lambert_coefficient, a_color.a);
}
`;

export default vertexShaderSourceCode;
