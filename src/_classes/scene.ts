import { glMatrix, mat4, vec3 } from "gl-matrix";

import { DataModel } from "../lib/datamodel";

import { GameObject } from "./gameobject";

import { GameModelPart } from "../_types/gamemodelpart";

export class Scene {
  public camera;
  public viewMatrix;
  public perspectiveMatrix;
  public objectsToRender;
  public opaqueObjects;
  public opaqueGlowObjects;
  public transparentObjects;
  public transparentGlowObjects;
  public dataModel;

  public constructor(linkToDataModel: DataModel) {
    this.camera = mat4.create(); // VPMatrix
    this.viewMatrix = mat4.create();
    this.perspectiveMatrix = mat4.create();
    this.objectsToRender = new Array<GameObject>();
    this.opaqueObjects = new Map<number, Array<GameModelPart>>();
    this.opaqueGlowObjects = new Map<number, Array<GameModelPart>>();
    this.transparentObjects = new Map<number, Array<GameModelPart>>();
    this.transparentGlowObjects = new Map<number, Array<GameModelPart>>();
    this.dataModel = linkToDataModel;
  }

  prepareScene() {
    this.updateCam();
    this.objectsToRender = this.cullObjectsToRender();
    //this.sortObjectsToRender();
  }

  ////____helpers____//////////////////////////////////////////////////////////////////

  updateCam() {
    mat4.lookAt(this.viewMatrix, this.dataModel.player.position, this.dataModel.player.direction, this.dataModel.player.up);
    mat4.perspective(this.perspectiveMatrix, (45 * Math.PI) / 180, 640 / 480, 1, 2000);
    mat4.multiply(this.camera, this.perspectiveMatrix, this.viewMatrix);
  }
  //

  //
  cullObjectsToRender() {
    return this.dataModel.gameData;
  }
  //

  sortObjectsToRender() {
    this.opaqueObjects.clear();
    this.opaqueGlowObjects.clear();
    this.transparentObjects.clear();
    this.transparentGlowObjects.clear();

    this.objectsToRender.forEach((object) => {
      object.model.opaqueElements?.forEach((opaqueElement) => {
        if (this.opaqueObjects.has(opaqueElement.textureID)) {
          this.opaqueObjects.get(opaqueElement.textureID)?.push(opaqueElement);
        } else {
          this.opaqueObjects.set(opaqueElement.textureID, new Array<GameModelPart>());
          this.opaqueObjects.get(opaqueElement.textureID)?.push(opaqueElement);
        }
      });
      object.model.opaqueGlowElements?.forEach((opaqueGlowElement) => {
        if (this.opaqueGlowObjects.has(opaqueGlowElement.textureID)) {
          this.opaqueGlowObjects.get(opaqueGlowElement.textureID)?.push(opaqueGlowElement);
        } else {
          this.opaqueGlowObjects.set(opaqueGlowElement.textureID, new Array<GameModelPart>());
          this.opaqueGlowObjects.get(opaqueGlowElement.textureID)?.push(opaqueGlowElement);
        }
      });

      object.model.transparentElements?.forEach((transparentElement) => {
        if (this.transparentObjects.has(transparentElement.textureID)) {
          this.transparentObjects.get(transparentElement.textureID)?.push(transparentElement);
        } else {
          this.transparentObjects.set(transparentElement.textureID, new Array<GameModelPart>());
          this.transparentObjects.get(transparentElement.textureID)?.push(transparentElement);
        }
      });
      object.model.transparentGlowElements?.forEach((transparentGlowElement) => {
        if (this.transparentGlowObjects.has(transparentGlowElement.textureID)) {
          this.transparentGlowObjects.get(transparentGlowElement.textureID)?.push(transparentGlowElement);
        } else {
          this.transparentGlowObjects.set(transparentGlowElement.textureID, new Array<GameModelPart>());
          this.transparentGlowObjects.get(transparentGlowElement.textureID)?.push(transparentGlowElement);
        }
      });
    });
  }
}
