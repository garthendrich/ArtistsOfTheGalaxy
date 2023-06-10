const fragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec2 v_texcoord;
in vec4 v_color;
in vec3 v_normal;
in vec3 v_light_direction;

uniform sampler2D u_texture;
uniform vec4 u_ambient_light; // Ambient light color and intensity
uniform vec4 u_diffuse_light; // Diffuse light color and intensity

out vec4 outColor;

void main() {
    vec4 texColor = texture(u_texture, v_texcoord) * v_color;

    // Lambertian Reflection
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(v_light_direction);
    float diffuse = max(dot(normal, lightDir), 0.0);
    vec4 diffuseColor = u_diffuse_light * diffuse;

    outColor = texColor * (u_ambient_light + diffuseColor);
}
`;

export default fragmentShaderSourceCode;
