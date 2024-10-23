import { AssetsManager } from "./assetsmanager";

import { DataModel } from "./datamodel";

import { Scene } from "../_classes/scene";

export class Renderer {
  private canvas: HTMLCanvasElement;
  private glContext: WebGLRenderingContext;
  private store: AssetsManager;

  private scene: Scene;

  public constructor(canvas: HTMLCanvasElement, glContext: WebGLRenderingContext, linkToDataModel: DataModel, store: AssetsManager) {
    this.canvas = canvas;
    this.glContext = glContext;
    this.store = store;

    this.scene = new Scene(linkToDataModel);
  }

  start() {
    this.prepareScene();
    this.renderScene();
  }

  //
  prepareScene() {
    this.scene.prepareScene();
  }
  //

  //
  renderScene() {
    console.log("Render");
    console.log(this.scene.objectsToRender);
    /*
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

        a_TexCoord = 

u_MvpMatrix = 
    */

    let currentProgram = this.store.shaderPrograms.get("program_1") as WebGLProgram;
    let gl = this.glContext;

    gl.useProgram(currentProgram);

    let a_Position = gl.getAttribLocation(currentProgram, "a_Position");
    let a_TexCoord = gl.getAttribLocation(currentProgram, "a_TexCoord");

    let u_vpMatrix = gl.getUniformLocation(currentProgram, "u_vpMatrix");
    let u_mMatrix = gl.getUniformLocation(currentProgram, "u_mMatrix");
    let u_Sampler = gl.getUniformLocation(currentProgram, "u_Sampler");

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.store.textures.get(0) as WebGLTexture);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    this.scene.objectsToRender.forEach((object) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

      gl.bindBuffer(gl.ARRAY_BUFFER, object.model.opaqueElements[0].verticesBuffer);
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);

      gl.bindBuffer(gl.ARRAY_BUFFER, object.model.opaqueElements[0].uvsBuffer);
      gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_TexCoord);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.model.opaqueElements[0].indicesBuffer);

      gl.uniformMatrix4fv(u_vpMatrix, false, this.scene.camera);
      gl.uniformMatrix4fv(u_mMatrix, false, object.objectOrientationMatrix);
      gl.uniform1i(u_Sampler, 0);

      gl.drawElements(gl.TRIANGLES, object.model.opaqueElements[0].polygons * 3, gl.UNSIGNED_SHORT, 0);
    });
  }
  //
}
