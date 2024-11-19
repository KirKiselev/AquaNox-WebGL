import { GameModel } from "../_types/gamemodel";
import { GameModelPart } from "../_types/gamemodelpart";
import { GameLevel } from "../_types/gamelevel";
import { MSBModel } from "../_types/msbmodel";
import { ShaderInfo } from "../_types/shaderinfo";

import MSBReader from "./MSBReader";
import { ModelData } from "../_types/modeldata";

type MaterialPositioningInfo = { tile: number; textureID: number; offsetX: number; offsetY: number; materialResolution: number };

export class AssetsManager {
  private MAX_ATLAS_TEXTURE_SIZE: number;
  private glContext: WebGLRenderingContext;

  //
  private gameLevelMap: GameLevel;
  private shaderInfo: ShaderInfo;
  //

  private fetchedImages: Map<string, ImageBitmap | null>;
  private fetchedModels: Map<string, MSBModel | null>;

  //public models: { [key: string]: GameModel };
  public models: Map<string, GameModel>;
  public textures: Map<number, WebGLTexture>;
  public shaderPrograms: { [keyof: string]: WebGLProgram };

  private markedMaterials: Map<string, MaterialPositioningInfo>;

  constructor(glContext: WebGLRenderingContext, maxAtlasTextureSize: number, gameLevelMap: GameLevel, shaderInfo: ShaderInfo) {
    this.MAX_ATLAS_TEXTURE_SIZE = maxAtlasTextureSize < glContext?.getParameter(glContext.MAX_TEXTURE_SIZE) ? maxAtlasTextureSize : glContext?.getParameter(glContext.MAX_TEXTURE_SIZE);
    this.glContext = glContext;
    this.gameLevelMap = gameLevelMap;
    this.shaderInfo = shaderInfo;
    this.fetchedImages = new Map<string, ImageBitmap>();
    this.fetchedModels = new Map<string, MSBModel>();

    this.models = new Map<string, GameModel>();
    this.textures = new Map<number, WebGLTexture>();
    this.shaderPrograms = {};

    this.markedMaterials = new Map<string, MaterialPositioningInfo>();
  }

  public async start() {
    await this.fetchResources(this.gameLevelMap);

    this.crateShaderPrograms();
    this.createTextureAtlases();
    this.createGameModels();

    //clear.resourses
    this.fetchedImages.clear();
    this.fetchedModels.clear();
    this.markedMaterials.clear();
  }

  private async fetchResources(gameLevelMap: GameLevel) {
    let promises: Array<Promise<any>> = [];

    gameLevelMap.sourceList.images.forEach((element: string) => {
      promises.push(
        fetch(`../${element + ".png"}`)
          .then((response) => response.blob())
          .then((blob) => createImageBitmap(blob))
          .then((imageBitmap) => {
            this.fetchedImages.set(element, imageBitmap);
          })
      );
    });

    gameLevelMap.sourceList.models.forEach((model: any) => {
      promises.push(
        fetch(`../${model + ".msb"}`)
          .then((response) => response.blob())
          .then((blob) => {
            this.fetchedModels.set(model, MSBReader(new File([blob], model + ".msb")));
          })
      );
    });

    await Promise.all(promises);
  }

  private crateShaderPrograms() {
    function createShader(context: WebGLRenderingContext, shaderType: GLenum, source: string) {
      let shader = context.createShader(shaderType);
      if (shader == null) {
        throw new Error("unable to create shader " + source);
      }
      context.shaderSource(shader, source);
      context.compileShader(shader);

      let compiled = context.getShaderParameter(shader, context.COMPILE_STATUS);
      if (!compiled) {
        let error = context.getShaderInfoLog(shader);
        context.deleteShader(shader);
        throw new Error("Failed to compile shader: " + error);
      }

      return shader;
    }

    function createShaderProgram(context: WebGLRenderingContext, vshader: WebGLShader, fshader: WebGLShader) {
      let program = context.createProgram();
      if (!program) {
        throw new Error("unable to create shader program ");
      }

      context.attachShader(program, vshader);
      context.attachShader(program, fshader);

      context.linkProgram(program);

      if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        context.deleteProgram(program);
        context.deleteShader(vshader);
        context.deleteShader(fshader);
        throw new Error("Failed to link shader program");
      }
      return program;
    }

    this.shaderInfo.shaderPrograms.forEach((program) => {
      this.shaderPrograms[program.programName] = createShaderProgram(
        this.glContext,
        createShader(this.glContext, this.glContext.VERTEX_SHADER, this.shaderInfo.shaderSourses.vertexShaders[program.vertexShader]),
        createShader(this.glContext, this.glContext.FRAGMENT_SHADER, this.shaderInfo.shaderSourses.fragmentShaders[program.fragmentShader])
      );
    });
  }

  private createTextureAtlases() {
    function createWebglTexture(glContext: WebGLRenderingContext | null, texStore: Map<number, WebGLTexture>) {
      let texSource = auxCanvas?.transferToImageBitmap() as ImageBitmap;

      texStore.set(textureID, glContext?.createTexture() as WebGLTexture);
      glContext?.bindTexture(glContext.TEXTURE_2D, texStore.get(textureID) as WebGLTexture);
      glContext?.texParameteri(glContext?.TEXTURE_2D, glContext?.TEXTURE_MIN_FILTER, glContext?.LINEAR);
      glContext?.texImage2D(glContext?.TEXTURE_2D, 0, glContext?.RGBA, glContext?.RGBA, glContext?.UNSIGNED_BYTE, texSource);

      texSource.close();
    }

    let tilesPerTexture = Math.pow(this.MAX_ATLAS_TEXTURE_SIZE / 512, 2);
    let currentMaterialInfo: MaterialPositioningInfo;

    let currentEmptyTexTile = 0;
    let textureID = 0;
    let currentMaterialResolution = 512;
    let tileRow = 0;
    let tileColumn = 0;

    let auxCanvas = new OffscreenCanvas(this.MAX_ATLAS_TEXTURE_SIZE, this.MAX_ATLAS_TEXTURE_SIZE);
    let ctx = auxCanvas.getContext("2d", { alpha: true, colorSpace: "srgb", desynchronized: false, willReadFrequently: true });

    this.fetchedModels.forEach((modelData) => {
      modelData?.materials.forEach((material) => {
        if (!this.markedMaterials.has(material[0])) {
          this.markedMaterials.set(material[0], { tile: currentEmptyTexTile, textureID: textureID, offsetX: 0, offsetY: 0, materialResolution: 0 });
          currentEmptyTexTile++;

          if (currentEmptyTexTile > tilesPerTexture) {
            createWebglTexture(this.glContext, this.textures);

            currentEmptyTexTile = 0;
            textureID++;
          }

          currentMaterialInfo = this.markedMaterials.get(material[0]) as MaterialPositioningInfo;
          tileRow = Math.floor(currentMaterialInfo.tile / Math.sqrt(tilesPerTexture));
          tileColumn = currentMaterialInfo.tile % Math.sqrt(tilesPerTexture);
          ctx?.drawImage(this.fetchedImages.get(material[0]) as ImageBitmap, currentMaterialResolution * tileColumn, currentMaterialResolution * tileRow);

          currentMaterialInfo.offsetX = currentMaterialResolution * tileColumn;
          currentMaterialInfo.offsetY = currentMaterialResolution * tileRow;
          currentMaterialInfo.materialResolution = currentMaterialResolution;
        }
      });
    });

    createWebglTexture(this.glContext, this.textures);
  }

  private createGameModels() {
    const markedMaterials = this.markedMaterials;
    const modelsAdditionalInfo = this.gameLevelMap.modelsAdditionalInfo;
    const MAX_ATLAS_TEXTURE_SIZE = this.MAX_ATLAS_TEXTURE_SIZE;
    const textures = this.textures;
    const glContext = this.glContext;

    this.fetchedModels.forEach((modelData, modelName) => {
      this.models.set(modelName, createGameModel(modelData as MSBModel, modelName));
    });

    //____helpers____//////////////////////////////////////////////////////

    function createGameModel(modelData: MSBModel, modelName: string): GameModel {
      let gameModel: GameModel = {
        opaqueElements: undefined,
        opaqueGlowElements: undefined,
        transparentElements: undefined,
        transparentGlowElements: undefined,
      };

      let opaqueElementsIndeces = [];
      let opaqueGlowElementsIndeces = modelsAdditionalInfo[modelName].renderGroups.opaqueGlowElements;
      let transparentElementsIndeces = modelsAdditionalInfo[modelName].renderGroups.transparentElements;
      let transparentGlowElementsIndeces = modelsAdditionalInfo[modelName].renderGroups.transparentGlowElements;

      //compute opaque elements indeces
      for (let i = 0; i < modelData!.vertices.length; i++) {
        if (!opaqueGlowElementsIndeces?.includes(i) && !transparentElementsIndeces?.includes(i) && !transparentGlowElementsIndeces?.includes(i)) {
          opaqueElementsIndeces?.push(i);
        }
      }

      gameModel.opaqueElements = createModelParts(mergeGroupElements(modelData, opaqueElementsIndeces, markedMaterials));
      gameModel.opaqueGlowElements = createModelParts(mergeGroupElements(modelData, opaqueGlowElementsIndeces, markedMaterials));
      gameModel.transparentElements = createModelParts(mergeGroupElements(modelData, transparentElementsIndeces, markedMaterials));
      gameModel.transparentGlowElements = createModelParts(mergeGroupElements(modelData, transparentGlowElementsIndeces, markedMaterials));

      return gameModel;
    }

    function createModelParts(modelDataArray: Array<ModelData>): Array<GameModelPart> {
      let partsGroup = new Array<GameModelPart>();
      modelDataArray.forEach((element) => {
        let gameModelPart = {
          verticesBuffer: glContext.createBuffer(),
          indicesBuffer: glContext.createBuffer(),
          normalsBuffer: glContext.createBuffer(),
          uvsBuffer: glContext.createBuffer(),
          texture: element.texture,
          textureID: element.textureID,
          polygons: element.indices.length / 3,
        };

        glContext.bindBuffer(glContext.ARRAY_BUFFER, gameModelPart.verticesBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(element.vertices), glContext.STATIC_DRAW);

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, gameModelPart.indicesBuffer);
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(element.indices), glContext.STATIC_DRAW);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, gameModelPart.normalsBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(element.normals), glContext.STATIC_DRAW);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, gameModelPart.uvsBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(element.uvs), glContext.STATIC_DRAW);

        //@ts-ignore
        partsGroup.push(gameModelPart);
      });

      return partsGroup;
    }

    function mergeGroupElements(rawModel: MSBModel, indeces: Array<number>, materialAllocator: Map<string, MaterialPositioningInfo>): Array<ModelData> {
      let mergedElements = new Array<ModelData>();
      let pointer = new Map<number, number>(); // key:  texture ID of texture in atlas, value: position in merged elements array

      indeces.forEach((index) => {
        let materialName = rawModel.materials[index][0];
        let atlasTextureID = materialAllocator.get(materialName)?.textureID as number;
        let currentChunkInfo = materialAllocator.get(materialName) as MaterialPositioningInfo;
        let currentPartPosition = 0;

        if (pointer.has(atlasTextureID)) {
          currentPartPosition = pointer.get(atlasTextureID) as number;
        } else {
          mergedElements.push({ vertices: [], indices: [], normals: [], uvs: [], texture: textures.get(atlasTextureID) as WebGLTexture, textureID: atlasTextureID });
          currentPartPosition = mergedElements.length - 1;
          pointer.set(atlasTextureID, currentPartPosition);
        }

        mergedElements[currentPartPosition].indices = mergedElements[currentPartPosition].indices.concat(rawModel.indices[index].map((elem) => elem + mergedElements[currentPartPosition].vertices.length / 3));
        mergedElements[currentPartPosition].vertices = mergedElements[currentPartPosition].vertices.concat(rawModel.vertices[index]);
        mergedElements[currentPartPosition].normals = mergedElements[currentPartPosition].normals.concat(rawModel.normals[index]);
        mergedElements[currentPartPosition].uvs = mergedElements[currentPartPosition].uvs.concat(
          rawModel.uvs[index].map((elem, index) => {
            if (index % 2 == 0) {
              return (elem * currentChunkInfo.materialResolution + currentChunkInfo.offsetX) / MAX_ATLAS_TEXTURE_SIZE;
            } else {
              return (elem * currentChunkInfo.materialResolution + currentChunkInfo.offsetY) / MAX_ATLAS_TEXTURE_SIZE;
            }
          })
        );
      });

      return mergedElements;
    }
  }

  // for_debug_only
  async showTextures() {
    let texSlotSize = this.MAX_ATLAS_TEXTURE_SIZE;
    let texDrawSize = 512;
    let row = 0;
    let column = 0;

    let canvas2d = document.createElement("canvas");
    let auxCanvas = new OffscreenCanvas(texSlotSize, texSlotSize);
    let context2d = canvas2d.getContext("2d");
    let auxContext = auxCanvas.getContext("2d");

    let framebuffer = this.glContext.createFramebuffer();
    let data = new Uint8Array(texSlotSize * texSlotSize * 4);
    let imageData = context2d?.createImageData(texSlotSize, texSlotSize);
    let image: ImageBitmap;

    canvas2d.width = texSlotSize;
    canvas2d.height = texSlotSize;
    document.body.appendChild(canvas2d);

    for (let i = 0; i < this.textures.size; i++) {
      this.glContext.activeTexture(this.glContext.TEXTURE0);
      this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.textures.get(i) as WebGLTexture);

      this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, framebuffer);
      this.glContext.framebufferTexture2D(this.glContext.FRAMEBUFFER, this.glContext.COLOR_ATTACHMENT0, this.glContext.TEXTURE_2D, this.textures.get(i) as WebGLTexture, 0);

      this.glContext.readPixels(0, 0, texSlotSize, texSlotSize, this.glContext.RGBA, this.glContext.UNSIGNED_BYTE, data);

      imageData?.data.set(data);

      auxContext?.putImageData(imageData as ImageData, 0, 0);

      image = await createImageBitmap(auxCanvas, 0, 0, texSlotSize, texSlotSize);
      context2d?.drawImage(image, column * texDrawSize, row * texDrawSize, texDrawSize, texDrawSize);
      column++;
      if (column > texSlotSize / texDrawSize) {
        row++;
        column = 0;
      }
    }
    this.glContext.deleteFramebuffer(framebuffer);

    console.log("Debug");
    console.log(this.textures);
  }
  //
}
