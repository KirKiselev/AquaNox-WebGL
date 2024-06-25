import { GameObject } from "./classes";

export class Renderer {
  private glContext: WebGLRenderingContext;

  public constructor(glContext: WebGLRenderingContext) {
    this.glContext = glContext;
  }

  draw(scene: Array<GameObject>) {
    if (this.glContext) {
      console.log(scene);
    }
  }
}
