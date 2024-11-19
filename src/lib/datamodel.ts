import { vec3 } from "gl-matrix";

import { InputController } from "./inputcontroller.ts";
import { AssetsManager } from "./assetsmanager.ts";

import { GameObject } from "../_classes/gameobject.ts";
import { Player } from "../_classes/player.ts";

import { GameLevel } from "../_types/gamelevel.ts";
import { GameModel } from "../_types/gamemodel.ts";

export class DataModel {
  public gameLevelMap: GameLevel;
  private inputController: InputController;
  private store: AssetsManager;

  public currentStateTimestamp: number;
  public previousStateTimestamp: number;
  public deltaTime: number;

  public gameData: Array<GameObject>;
  public player: Player;

  public constructor(inputController: InputController, store: AssetsManager, gameLevelMap: GameLevel) {
    this.inputController = inputController;
    this.store = store;
    this.gameLevelMap = gameLevelMap;

    this.currentStateTimestamp = performance.now();
    this.previousStateTimestamp = this.currentStateTimestamp;
    this.deltaTime = 0;

    this.gameData = new Array<GameObject>();

    this.player = new Player(this.inputController);
    this.player.setPosition(0, 0, 60);
    vec3.set(this.player.rotation, 0, 0, 0);
    this.player.setStartRotation(0, 0, 0);
  }

  // public loadLevelMap() {
  //   let currentObject;
  //   let gameObject: GameObject;
  //   for (let current in this.gameLevelMap.gameObjects) {
  //     currentObject = this.gameLevelMap.gameObjects[current];

  //     gameObject = new GameObject(this.store.models.get(currentObject.model) as GameModel);
  //     gameObject.setObjectRotation(currentObject.rotation.x, currentObject.rotation.y, currentObject.rotation.z);
  //     gameObject.setObjectTranslation(currentObject.position.x, currentObject.position.y, currentObject.position.z);
  //     gameObject.updateObjectOrientationMatrix();

  //     this.gameData.push(gameObject);
  //   }
  // }

  public loadLevelMap() {
    let current;
    let currentObject;
    let gameObject: GameObject;
    // for (let current in this.gameLevelMap.gameObjects) {
    //   currentObject = this.gameLevelMap.gameObjects[current];

    //   gameObject = new GameObject(this.store.models.get(currentObject.model) as GameModel);
    //   gameObject.setObjectRotation(currentObject.rotation.x, currentObject.rotation.y, currentObject.rotation.z);
    //   gameObject.setObjectTranslation(currentObject.position.x, currentObject.position.y, currentObject.position.z);
    //   gameObject.updateObjectOrientationMatrix();

    //   this.gameData.push(gameObject);
    // }

    current = Object.keys(this.gameLevelMap.gameObjects)[0];

    for (let q = 0; q < 1000; q++) {
      currentObject = this.gameLevelMap.gameObjects[current];

      gameObject = new GameObject(this.store.models.get(currentObject.model) as GameModel);
      gameObject.setObjectRotation(Math.random() * 360, Math.random() * 360, Math.random() * 360);
      gameObject.setObjectTranslation(50 - Math.random() * 100, 50 - Math.random() * 100, Math.random() * 100 - 5);
      gameObject.updateObjectOrientationMatrix();

      this.gameData.push(gameObject);
    }
  }

  public updateGameState() {
    this.previousStateTimestamp = this.currentStateTimestamp;
    this.currentStateTimestamp = performance.now();
    this.deltaTime = this.currentStateTimestamp - this.previousStateTimestamp;
    //console.log(this.deltaTime);

    this.player.getControllerVector();
    this.player.updatePlayerPosition(this.deltaTime);

    this.player.rotation[0] = -this.inputController.pointerDisplacement.y / 100;
    this.player.rotation[1] = -this.inputController.pointerDisplacement.x / 100;

    //console.log(this.player.direction);

    this.inputController.clearPointerDisplacement();

    this.player.updateDirection();
  }
}
