import { AssetsManager } from "./assetsmanager.ts";

import { DataModel } from "./datamodel";

import { Scene } from "../_classes/scene";

export class Renderer {
  private canvas: HTMLCanvasElement;
  private glContext: WebGLRenderingContext;
  private store: AssetsManager;

  private scene: Scene;
  private shaderProgramVariablesLinks: { [keyof: string]: { [keyof: string]: WebGLUniformLocation | GLint } };

  public constructor(canvas: HTMLCanvasElement, glContext: WebGLRenderingContext, linkToDataModel: DataModel, store: AssetsManager) {
    this.canvas = canvas;
    this.glContext = glContext;
    this.store = store;

    this.scene = new Scene(linkToDataModel);
    this.shaderProgramVariablesLinks = {};

    //
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
    let gl = this.glContext;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.store.textures.get(0) as WebGLTexture);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    this.renderOpaqueObjects();
    //this.renderOpaqueGlowObjects();
    //this.renderTransparentObjects();
  }

  private renderOpaqueObjects() {
    this.createLinksToRenderProgramVariables();

    let gl = this.glContext;
    let linkToProgramVariables = this.shaderProgramVariablesLinks.opaque_render_program;

    gl.useProgram(this.store.shaderPrograms.opaque_render_program);

    this.scene.objectsToRender.forEach((object) => {
      object.model.opaqueElements?.forEach((opaqueElement) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        //a_Position = gl.getAttribLocation(this.store.shaderPrograms.opaque_render_program, "a_Position");
        gl.bindBuffer(gl.ARRAY_BUFFER, opaqueElement.verticesBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // a_TexCoord = gl.getAttribLocation(this.store.shaderPrograms.opaque_render_program, "a_TexCoord");
        gl.bindBuffer(gl.ARRAY_BUFFER, opaqueElement.uvsBuffer);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, opaqueElement.indicesBuffer);

        gl.uniformMatrix4fv(linkToProgramVariables.u_vpMatrix, false, this.scene.camera);
        gl.uniformMatrix4fv(linkToProgramVariables.u_mMatrix, false, object.objectOrientationMatrix);
        gl.uniform1i(linkToProgramVariables.u_Sampler, 0);

        gl.drawElements(gl.TRIANGLES, opaqueElement.polygons * 3, gl.UNSIGNED_SHORT, 0);
      });
    });
  }

  private renderOpaqueGlowObjects() {
    return;
  }

  private renderTransparentObjects() {
    let currentProgram = this.store.shaderPrograms.transparent_render_program;
    let gl = this.glContext;
    gl.useProgram(currentProgram);

    let a_Position = gl.getAttribLocation(currentProgram, "a_Position");
    let a_TexCoord = gl.getAttribLocation(currentProgram, "a_TexCoord");

    let u_vpMatrix = gl.getUniformLocation(currentProgram, "u_vpMatrix");
    let u_mMatrix = gl.getUniformLocation(currentProgram, "u_mMatrix");
    let u_Sampler = gl.getUniformLocation(currentProgram, "u_Sampler");

    this.scene.objectsToRender.forEach((object) => {
      object.model.transparentElements?.forEach((transparentElement) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, transparentElement.verticesBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, transparentElement.uvsBuffer);
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_TexCoord);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, transparentElement.indicesBuffer);

        gl.uniformMatrix4fv(u_vpMatrix, false, this.scene.camera);
        gl.uniformMatrix4fv(u_mMatrix, false, object.objectOrientationMatrix);
        gl.uniform1i(u_Sampler, 0);

        gl.drawElements(gl.TRIANGLES, transparentElement.polygons * 3, gl.UNSIGNED_SHORT, 0);
      });
    });
  }

  private renderTransparentGlowObjects() {
    return;
  }

  public createLinksToRenderProgramVariables() {
    const gl = this.glContext;
    let program: WebGLProgram | null = null;
    let numUniforms = 0;
    let info: WebGLActiveInfo | null = null;

    for (let programName in this.store.shaderPrograms) {
      program = this.store.shaderPrograms[programName];
      this.shaderProgramVariablesLinks[programName] = {};

      numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

      for (let i = 0; i < numUniforms; ++i) {
        info = gl.getActiveUniform(program, i);
        if (info) this.shaderProgramVariablesLinks[programName][info.name] = gl.getUniformLocation(program, info.name) as WebGLUniformLocation;
      }
    }
  }
}
