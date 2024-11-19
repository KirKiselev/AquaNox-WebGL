import { mat4, vec3, quat } from "gl-matrix";
import { GameModel } from "../_types/gamemodel";

export class GameObject {
  static objectIDcounter = 0;

  public objectID: number;

  public position: vec3;
  public rotation: vec3;
  public objectOrientationMatrix: mat4; // rotation * translation

  public model;

  public constructor(model: GameModel) {
    this.objectID = GameObject.objectIDcounter;
    GameObject.objectIDcounter++;

    this.position = vec3.create();
    this.rotation = vec3.create();
    this.objectOrientationMatrix = mat4.create();

    this.model = model;

    /*
    this.position = mat4.translate(this.position, this.position, positionVector);

    this.rotation = mat4.create();
    mat4.rotateX(this.rotation, this.rotation, (rotation.x * Math.PI) / 180);
    mat4.rotateY(this.rotation, this.rotation, (rotation.y * Math.PI) / 180);
    mat4.rotateZ(this.rotation, this.rotation, (rotation.z * Math.PI) / 180);

    

    */
  }

  public setObjectRotation(x: number, y: number, z: number) {
    if (x == this.rotation[0] && y == this.rotation[1] && z == this.rotation[2]) return;

    vec3.set(this.rotation, x, y, z);
  }

  public setObjectTranslation(x: number, y: number, z: number) {
    if (x == this.position[0] && y == this.position[1] && z == this.position[2]) return;

    vec3.set(this.position, x, y, z);
  }

  public updateObjectOrientationMatrix() {
    let q = quat.create();
    quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2]);
    mat4.fromRotationTranslation(this.objectOrientationMatrix, q, this.position);
  }
}
