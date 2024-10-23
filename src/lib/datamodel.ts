import { vec3 } from "gl-matrix";

import { AssetsManager } from "./assetsmanager.ts";

import { GameObject } from "../_classes/gameobject.ts";

import { GameLevel } from "../_types/gamelevel.ts";
import { GameModel } from "../_types/gamemodel.ts";

export class DataModel {
  public gameData: Array<GameObject>;
  //private gameLevelMap: GameLevel;
  public gameLevelMap: GameLevel;
  private store: AssetsManager;

  public player: { position: vec3; direction: vec3; up: vec3 };

  public constructor(store: AssetsManager, gameLevelMap: GameLevel) {
    this.gameData = new Array<GameObject>();
    this.store = store;
    this.gameLevelMap = gameLevelMap;

    this.player = { position: vec3.create(), direction: vec3.create(), up: vec3.create() };
    vec3.set(this.player.position, 0, 0, 60);
    vec3.set(this.player.direction, 0, 0, -1);
    vec3.set(this.player.up, 0, 1, 0);
  }

  public loadLevelMap() {
    let currentObject;
    let gameObject: GameObject;
    for (let current in this.gameLevelMap.gameObjects) {
      currentObject = this.gameLevelMap.gameObjects[current];

      gameObject = new GameObject(this.store.models.get(currentObject.model) as GameModel);
      gameObject.setObjectRotation(currentObject.rotation.x, currentObject.rotation.y, currentObject.rotation.z);
      gameObject.setObjectTranslation(currentObject.position.x, currentObject.position.y, currentObject.position.z);
      gameObject.updateObjectOrientationMatrix();

      this.gameData.push(gameObject);
    }
  }
}
