import { vec3, mat4, quat } from "gl-matrix";
import { InputController } from "../lib/inputcontroller";

export class Player {
  public inputController: InputController;

  public position: vec3;
  public rotation: vec3;
  public direction: vec3;
  public up: vec3;
  public objectOrientationMatrix: mat4;

  public straightThrusterAcceleration: number;
  public sideThrusterAcceleration: number;

  public inputVector: vec3; // movement vector from inputcontroller

  constructor(linkToInputController: InputController) {
    this.inputController = linkToInputController;

    this.position = vec3.create();
    this.rotation = vec3.create();
    this.direction = vec3.create();
    this.up = vec3.create();

    this.objectOrientationMatrix = mat4.create();

    this.straightThrusterAcceleration = 0.0001;
    this.sideThrusterAcceleration = 0.0001;

    this.inputVector = vec3.create();
    vec3.set(this.inputVector, 0, 0, 0);
  }

  public setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
  }

  setDirection(x: number, y: number, z: number) {
    vec3.set(this.direction, x, y, z);
  }

  setUp(x: number, y: number, z: number) {
    vec3.set(this.up, x, y, z);
  }

  setStartRotation(x: number, y: number, z: number) {
    // x, y, z rotation in degrees
    let q = quat.create();

    vec3.set(this.direction, 0, 0, -100);
    vec3.set(this.up, 0, 100, 0);

    quat.fromEuler(q, x, y, z);

    vec3.transformQuat(this.direction, this.direction, q);
    vec3.transformQuat(this.rotation, this.rotation, q);
  }

  getControllerVector() {
    let x = 0;
    let y = 0;
    let z = 0;

    if (this.inputController.inputState.forward) z -= 1;
    if (this.inputController.inputState.backward) z += 1;
    if (this.inputController.inputState.left) x -= 1;
    if (this.inputController.inputState.right) x += 1;

    vec3.set(this.inputVector, x, y, z);
  }

  updatePlayerPosition(deltaTime: number) {
    vec3.scale(this.inputVector, this.inputVector, (1 / 100) * deltaTime);
    vec3.add(this.position, this.position, this.inputVector);
  }

  public updateDirection() {
    let q = quat.create();
    quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2]);
    vec3.transformQuat(this.direction, this.direction, q);
  }
}
