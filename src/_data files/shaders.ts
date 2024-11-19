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
      VSHADER_SOURCE_2:
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
      VSHADER_SOURCE_3:
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
        "vec4 pre;\n" +
        "void main() {\n" +
        " FragColor = texture(u_Sampler, v_TexCoord);\n" +
        "}\n",
      FSHADER_SOURCE_2:
        "#version 300 es\n" +
        "precision mediump float;\n" +
        "in vec2 v_TexCoord;\n" +
        /////////////////////////////////////////////
        "uniform sampler2D u_Sampler;\n" +
        //
        "out vec4 FragColor;\n" +
        "vec4 currentPixel;\n" +
        //
        "void main() {\n" +
        " currentPixel = texture(u_Sampler, v_TexCoord);\n" +
        "if(currentPixel.a > 0.0) {\n" +
        " FragColor = currentPixel;\n" +
        "}\n" +
        "}\n",
      FSHADER_SOURCE_3:
        "#version 300 es\n" +
        "precision mediump float;\n" +
        "in vec2 v_TexCoord;\n" +
        /////////////////////////////////////////////
        "uniform sampler2D u_Sampler;\n" +
        //
        "out vec4 FragColor;\n" +
        //
        "vec4 pre;\n" +
        "void main() {\n" +
        " pre = texture(u_Sampler, v_TexCoord);\n" +
        "if(pre.a < 1.0) {\n" +
        " FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n" +
        "}\n" +
        "else {\n" +
        " FragColor = pre;\n" +
        "}\n" +
        "}\n",
    },
  },

  shaderPrograms: [
    { programName: "opaque_render_program", vertexShader: "VSHADER_SOURCE_1", fragmentShader: "FSHADER_SOURCE_1" },
    { programName: "transparent_render_program", vertexShader: "VSHADER_SOURCE_2", fragmentShader: "FSHADER_SOURCE_2" },
    { programName: "composite_render_program", vertexShader: "VSHADER_SOURCE_3", fragmentShader: "FSHADER_SOURCE_3" },
  ],
};

export default shaderInfo;
