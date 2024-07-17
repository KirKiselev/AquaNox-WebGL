
import { GameModel, GameObject, Scene } from "./classes";
import { DataModel } from "./datamodel";

export class Renderer {
  private glContext: WebGLRenderingContext;

  private dataModel: DataModel
  private objectsToRender: Array<GameObject>
  private scene: Scene
  


  public constructor(glContext: WebGLRenderingContext, linkToDataModel: DataModel) {
    this.glContext = glContext;

    this.dataModel = linkToDataModel
    this.objectsToRender = new Array<GameObject>();
    this.scene = new Scene()
  }

  cullObjectsToRender() {
    this.objectsToRender = this.dataModel.gameData
    console.log("Culling")
    console.log(this.objectsToRender)
  }

  prepareScene() {
    this.objectsToRender.forEach((object)=>{object.model.glowingElements.forEach((modelElement)=>{this.scene.objectsToRender.glowing.push(modelElement)})
    object.model.transparentElements.forEach((modelElement)=>{this.scene.objectsToRender.transparent.push(modelElement)})
    object.model.opaqueElements.forEach((modelElement)=>{this.scene.objectsToRender.opaque.push(modelElement)})})
    console.log("preparing scene")
    console.log(this.scene.objectsToRender)
  }

  renderScene() {
    if (this.glContext) {
      console.log(this.scene);
    }
  }
}
