import { ShaderInfo } from "../_types/shaderinfo";

let shaderInfo: ShaderInfo = {
  shaderSourses: {
    vertexShaders: {
      VSHADER_SOURCE_1:
        "#version 300 es\n" +
        "in vec4 a_Position;\n" +
        "in vec2 a_TexCoord;\n" +
        //
        "uniform mat4 u_vpMatrix;\n" +
        "uniform mat4 u_mMatrix;\n" +
        //
        "out vec2 v_TexCoord;\n" +
        //
        "void main() {\n" +
        " gl_Position = u_vpMatrix * u_mMatrix * a_Position;\n" +
        " v_TexCoord = a_TexCoord;\n" +
        "}\n",
    },
    fragmentShaders: {
      FSHADER_SOURCE_1:
        "#version 300 es\n" +
        "precision mediump float;\n" +
        "in vec2 v_TexCoord;\n" +
        /////////////////////////////////////////////
        "uniform sampler2D u_Sampler;\n" +
        //
        "out vec4 FragColor;\n" +
        //
        "void main() {\n" +
        " FragColor = texture(u_Sampler, v_TexCoord);\n" +
        "}\n",
    },
  },

  shaderPrograms: [{ programName: "program_1", vertexShader: "VSHADER_SOURCE_1", fragmentShader: "FSHADER_SOURCE_1" }],
};

export default shaderInfo;
