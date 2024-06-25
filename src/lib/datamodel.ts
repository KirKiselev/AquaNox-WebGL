
import AssetsManager from "./assetsmanager.ts";

import { GameObject } from "./classes.ts";

import { GameLevel } from "./types.ts";

export class DataModel {
  public gameData: Array<GameObject>;
  private gameLevelMap: GameLevel;
  private store: AssetsManager;

  public constructor(store: AssetsManager, gameLevelMap: GameLevel) {
    this.gameData = new Array<GameObject>();
    this.store = store;
    this.gameLevelMap = gameLevelMap;
  }

  public addGameObjects() {
    let currentObject;
    for (let object in this.gameLevelMap.gameObjects) {
      currentObject = this.gameLevelMap.gameObjects[object];
      this.gameData.push(new GameObject(currentObject.position, currentObject.rotation, this.store.models[currentObject.model]));
    }
    console.log(this.gameData);
  }
}
