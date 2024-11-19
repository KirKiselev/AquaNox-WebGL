//@ts-nocheck

import { Renderer } from "./renderer";
import { InputController } from "./inputcontroller";
import { DataModel } from "./datamodel";
import { AssetsManager } from "./assetsmanager";

import gameLevel from "../_data files/gamelevel";
import shaderInfo from "../_data files/shaders";

import { GameLevel, ShaderInfo } from "../_types/types";

export class Application {
  private gamelevelmap: GameLevel;
  private shaderInfo: ShaderInfo;

  private canvas: HTMLCanvasElement;
  private glContext: WebGLRenderingContext | null;

  private inputcontroller;
  private assetsmanager;
  private datamodel;
  private renderer;

  public constructor(canvas: HTMLCanvasElement) {
    //
    this.gamelevelmap = gameLevel;
    this.shaderInfo = shaderInfo;
    //
    this.canvas = canvas;
    if (!canvas) throw new Error("Canvas element doesn`t exist");

    //
    this.canvas.width = 640;
    this.canvas.height = 480;
    //

    this.glContext = this.canvas.getContext("webgl2");
    if (!this.glContext) throw new Error("Rendering context not created");

    this.inputcontroller = new InputController(this.canvas);
    this.assetsmanager = new AssetsManager(this.glContext as WebGLRenderingContext, 2048, this.gamelevelmap, this.shaderInfo);
    this.datamodel = new DataModel(this.inputcontroller, this.assetsmanager, this.gamelevelmap);
    this.renderer = new Renderer(this.canvas, this.glContext as WebGLRenderingContext, this.datamodel, this.assetsmanager);

    this.gameLoop = this.gameLoop.bind(this);

    this.start();
  }

  async start() {
    this.inputcontroller.start();
    await this.assetsmanager.start();

    this.datamodel.loadLevelMap();
    this.renderer.createLinksToRenderProgramVariables();

    //this.renderer.start(); //prepare scene & render

    //____ start_game_loop ____

    this.gameLoop();

    ///////////////////////////

    //this.assetsmanager.showTextures();
  }

  gameLoop() {
    this.datamodel.updateGameState();

    this.renderer.prepareScene();
    this.renderer.renderScene();

    //window.requestAnimationFrame(this.gameLoop);
  }
}
