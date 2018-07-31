#version 330 core
out vec4 FragColor;

#define NR_POINT_LIGHTS 2

in VS_OUT {
    vec3 FragPos;
    vec2 TexCoords;
    vec3 TangentLightPos;
     vec3 TangentLightPos2;
    vec3 TangentViewPos;
    vec3 TangentFragPos;
} fs_in;

uniform sampler2D diffuseMap;
uniform sampler2D normalMap;
uniform vec3 onOff;
uniform bool normalMapping;

void main()
{
    // Obtain normal from normal map in range [0,1]
    vec3 normal = texture(normalMap, fs_in.TexCoords).rgb;
    // Transform normal vector to range [-1,1]
    normal = normalize(normal * 2.0 - 1.0);  // this normal is in tangent space
    vec3 result = vec3 (0,0,0);
    
        // Get diffuse color
        vec3 color = texture(diffuseMap, fs_in.TexCoords).rgb;
        // Ambient
        vec3 ambient = 0.5 * color;
        // Diffuse
        vec3 lightDir = normalize(fs_in.TangentLightPos - fs_in.TangentFragPos);
       
    
        float diff = max(dot(lightDir, normal), 0.0);
        vec3 diffuse = diff * color;
        // Specular
        vec3 viewDir = normalize(fs_in.TangentViewPos - fs_in.TangentFragPos);
        vec3 reflectDir = reflect(-lightDir, normal);
        vec3 halfwayDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
        vec3 specular = vec3(0.2) * spec;
    
     FragColor = vec4(onOff.x*ambient + onOff.y*diffuse + onOff.z*specular, 1.0f);
}