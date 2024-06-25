//@ts-nocheck

import { glMatrix, mat4, vec3 } from "gl-matrix";

export class GameObject {
  private position;
  private rotation;
  private model;

  public constructor(position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }, model: GameModel) {
    let positionVector = vec3.create();
    positionVector = vec3.set(positionVector, position.x, position.y, position.z);

    this.position = mat4.create();
    this.position = mat4.translate(this.position, this.position, positionVector);

    this.rotation = mat4.create();
    mat4.rotateX(this.rotation, this.rotation, (rotation.x * Math.PI) / 180);
    mat4.rotateY(this.rotation, this.rotation, (rotation.y * Math.PI) / 180);
    mat4.rotateZ(this.rotation, this.rotation, (rotation.z * Math.PI) / 180);

    this.model = model;
  }
}

export class GameModel {
  public opaqueElements: Array<GameModelPart>;
  public transparentElements: Array<GameModelPart>;
  public glowingElements: Array<GameModelPart>;

  public constructor() {
    this.opaqueElements = new Array<GameModelPart>();
    this.transparentElements = new Array<GameModelPart>();
    this.glowingElements = new Array<GameModelPart>();
  }
}

export class GameModelPart {
  public vertices: Float32Array;
  public verticesBuffer: WebGLBuffer;
  public indices: Uint16Array;
  public indicesBuffer: WebGLBuffer;
  public normals: Float32Array;
  public normalsBuffer: WebGLBuffer;
  public uvs: Float32Array;
  public uvsBuffer: WebGLBuffer;
  public texture: WebGLTexture;

  public constructor() {
    this.vertices;
    this.verticesBuffer;
    this.indices;
    this.indicesBuffer;
    this.normals;
    this.normalsBuffer;
    this.uvs;
    this.uvsBuffer;
    this.texture;
  }
}
