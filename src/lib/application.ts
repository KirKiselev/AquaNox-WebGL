import { Renderer } from "./renderer";
import { InputController } from "./inputcontroller";
import { DataModel } from "./datamodel";

import gameLevel from "../gamelevel";
import AssetsManager from "./assetsmanager";
import { GameLevel } from "./types";

export class Application {
  private gamelevelmap: GameLevel;

  private canvas: HTMLCanvasElement;
  private glContext: WebGLRenderingContext | null;
  private renderer;
  private inputcontroller;
  private assetsmanager;
  private datamodel;

  public constructor(canvas: HTMLCanvasElement) {
    //
    this.gamelevelmap = gameLevel;
    //
    this.canvas = canvas;
    if (!canvas) throw new Error("Canvas element doesn`t exist");

    this.glContext = this.canvas.getContext("webgl");
    if (!this.glContext) throw new Error("Rendering context not created");

    this.renderer = new Renderer(this.glContext as WebGLRenderingContext);
    this.inputcontroller = new InputController();
    this.assetsmanager = new AssetsManager(this.glContext as WebGLRenderingContext, 1024, this.gamelevelmap);
    this.datamodel = new DataModel(this.assetsmanager, this.gamelevelmap);

    this.start();
  }

  start() {
    this.assetsmanager!.fetchResources(this.gamelevelmap);

    setTimeout(() => {
      this.datamodel!.addGameObjects();
    }, 500);
  }
}
