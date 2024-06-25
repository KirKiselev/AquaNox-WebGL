import { GameModel, GameModelPart } from "./classes";
import { GameLevel, MSBModel } from "./types";

import MSBReader from "./MSBReader";

type MaterialPositioningInfo = { tile: number; textureID: number; offsetX: number; offsetY: number; materialResolution: number };
type ModelData = { vertices: Array<number>; indices: Array<number>; normals: Array<number>; uvs: Array<number>; texture: WebGLTexture | undefined };

class AssetsManager {
  private MAX_ATLAS_TEXTURE_SIZE: number;
  private glContext: WebGLRenderingContext;
  private gameLevelMap: GameLevel;

  private fetchedImages: Map<string, ImageBitmap | null>;
  private fetchedModels: Map<string, MSBModel | null>;

  public models: { [key: string]: GameModel };
  public textures: Map<number, WebGLTexture>;

  constructor(glContext: WebGLRenderingContext, maxAtlasTextureSize: number, gameLevelMap: GameLevel) {
    this.MAX_ATLAS_TEXTURE_SIZE = maxAtlasTextureSize < glContext?.getParameter(glContext.MAX_TEXTURE_SIZE) ? maxAtlasTextureSize : glContext?.getParameter(glContext.MAX_TEXTURE_SIZE);
    this.glContext = glContext;
    this.gameLevelMap = gameLevelMap;
    this.fetchedImages = new Map<string, ImageBitmap>();
    this.fetchedModels = new Map<string, MSBModel>();

    this.models = {};
    this.textures = new Map<number, WebGLTexture>();
  }

  public fetchResources(gameLevelMap: GameLevel) {
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

    Promise.all(promises).then(() => {
      this.prepareGameSources();
    });
  }

  private prepareGameSources() {
    function createWebglTexture(glContext: WebGLRenderingContext | null, texStore: Map<number, WebGLTexture>) {
      let texSource = auxCanvas?.transferToImageBitmap() as ImageBitmap;

      glContext?.activeTexture(glContext.TEXTURE0);
      texStore.set(textureID, glContext?.createTexture() as WebGLTexture);
      glContext?.bindTexture(glContext.TEXTURE_2D, texStore.get(textureID) as WebGLTexture);
      glContext?.texParameteri(glContext?.TEXTURE_2D, glContext?.TEXTURE_MIN_FILTER, glContext?.LINEAR);
      glContext?.texImage2D(glContext?.TEXTURE_2D, 0, glContext?.RGBA, glContext?.RGBA, glContext?.UNSIGNED_BYTE, texSource);

      texSource.close();
    }

    //____MARKUP_TEXTURE_ATLASES_&_TEXTURES_CREATION____//

    let tilesPerTexture = Math.pow(this.MAX_ATLAS_TEXTURE_SIZE / 512, 2);
    let currentMaterialInfo: MaterialPositioningInfo;

    let markedMaterials = new Map<string, MaterialPositioningInfo>();
    let currentEmptyTexTile = 0;
    let textureID = 0;
    let currentMaterialResolution = 512;
    let tileRow = 0;
    let tileColumn = 0;

    let auxCanvas: OffscreenCanvas | null = new OffscreenCanvas(this.MAX_ATLAS_TEXTURE_SIZE, this.MAX_ATLAS_TEXTURE_SIZE);
    let ctx = auxCanvas.getContext("2d", { alpha: true, colorSpace: "srgb", desynchronized: false, willReadFrequently: true });

    this.fetchedModels.forEach((modelData) => {
      modelData?.materials.forEach((material) => {
        if (!markedMaterials.has(material[0])) {
          markedMaterials.set(material[0], { tile: currentEmptyTexTile, textureID: textureID, offsetX: 0, offsetY: 0, materialResolution: 0 });
          currentEmptyTexTile++;

          if (currentEmptyTexTile > tilesPerTexture - 1) {
            createWebglTexture(this.glContext, this.textures);

            currentEmptyTexTile = 0;
            textureID++;
          }

          currentMaterialInfo = markedMaterials.get(material[0]) as MaterialPositioningInfo;
          tileRow = Math.floor(currentMaterialInfo.tile / Math.sqrt(tilesPerTexture));
          tileColumn = currentMaterialInfo.tile % Math.sqrt(tilesPerTexture);
          ctx?.drawImage(this.fetchedImages.get(material[0]) as ImageBitmap, currentMaterialResolution * tileRow, currentMaterialResolution * tileColumn);
          this.fetchedImages.set(material[0], null);

          currentMaterialInfo.offsetX = currentMaterialResolution * tileColumn;
          currentMaterialInfo.offsetY = currentMaterialResolution * tileRow;
          currentMaterialInfo.materialResolution = currentMaterialResolution;
        }
      });
    });

    createWebglTexture(this.glContext, this.textures);

    auxCanvas = null;
    ctx = null;

    //____MODELS_CORRECTION____//
    let opaqueElementsIndeces: Array<number> | null;
    let glowingElementsIndeces: Array<number> | null;
    let transparentElemetsIndeces: Array<number> | null;

    let opaqueElements: Array<ModelData> = [];
    //let glowingElements: Array<ModelData>;
    //let transparentElemets: Array<ModelData>;

    let groupsRelation = new Map<number, number>();
    let pos: number;
    let link: MaterialPositioningInfo;

    this.fetchedModels.forEach((modelData, modelName) => {
      glowingElementsIndeces = this.gameLevelMap.modelsAdditionalInfo[modelName].glowingElementsGroups;

      transparentElemetsIndeces = this.gameLevelMap.modelsAdditionalInfo[modelName].transparentElementsgroups;

      opaqueElementsIndeces = [];

      for (let i = 0; i < modelData!.vertices.length; i++) {
        if (!glowingElementsIndeces?.includes(i) && !transparentElemetsIndeces?.includes(i)) {
          opaqueElementsIndeces?.push(i);
        }
      }

      // index - group position in fetched model
      // pos - group position in new model

      opaqueElementsIndeces.forEach((index) => {
        if (!groupsRelation.has(markedMaterials.get(modelData?.materials[index][0] as string)?.textureID as number)) {
          groupsRelation.set(markedMaterials.get(modelData?.materials[index][0] as string)?.textureID as number, opaqueElements.length);
          opaqueElements.push({ vertices: [], indices: [], normals: [], uvs: [], texture: undefined });
        }
        link = markedMaterials.get(modelData?.materials[index][0] as string) as MaterialPositioningInfo;
        pos = groupsRelation.get(markedMaterials.get(modelData?.materials[index][0] as string)?.textureID as number) as number;

        opaqueElements[pos].vertices = opaqueElements[pos].vertices.concat(modelData?.vertices[index] as number[]);
        //@ts-ignore
        opaqueElements[pos].indices = opaqueElements[pos].indices.concat(modelData?.indices[index].map((elem) => elem + opaqueElements[pos].vertices.length));
        opaqueElements[pos].normals = opaqueElements[pos].normals.concat(modelData?.normals[index] as number[]);
        opaqueElements[pos].uvs = opaqueElements[pos].uvs.concat(
          //@ts-ignore
          modelData?.uvs[index].map((elem, index) => {
            if (index % 2 == 0) {
              return (elem * link.materialResolution + link.offsetX) / this.MAX_ATLAS_TEXTURE_SIZE;
            } else {
              return (elem * link.materialResolution + link.offsetY) / this.MAX_ATLAS_TEXTURE_SIZE;
            }
          })
        );
        opaqueElements[pos].texture = this.textures.get(markedMaterials.get(modelData?.materials[index][0] as string)?.textureID as number);
      });

      //____MODELS_CREATION_____//
      let currentModel: GameModel;
      let currentModelPart: GameModelPart;

      this.models[modelName] = new GameModel();
      currentModel = this.models[modelName];

      opaqueElements.forEach((elem, index) => {
        currentModel.opaqueElements.push(new GameModelPart());
        currentModelPart = currentModel.opaqueElements[index];
        currentModelPart.vertices = Float32Array.from(elem.vertices);
        currentModelPart.verticesBuffer = this.glContext?.createBuffer() as WebGLBuffer;
        this.glContext?.bindBuffer(this.glContext.ARRAY_BUFFER, currentModelPart.verticesBuffer);
        this.glContext?.bufferData(this.glContext.ARRAY_BUFFER, currentModelPart.vertices, this.glContext.STATIC_DRAW);

        currentModelPart.normals = Float32Array.from(elem.normals);
        currentModelPart.normalsBuffer = this.glContext?.createBuffer() as WebGLBuffer;
        this.glContext?.bindBuffer(this.glContext.ARRAY_BUFFER, currentModelPart.normalsBuffer);
        this.glContext?.bufferData(this.glContext.ARRAY_BUFFER, currentModelPart.normals, this.glContext.STATIC_DRAW);

        currentModelPart.uvs = Float32Array.from(elem.uvs);
        currentModelPart.uvsBuffer = this.glContext?.createBuffer() as WebGLBuffer;
        this.glContext?.bindBuffer(this.glContext.ARRAY_BUFFER, currentModelPart.uvsBuffer);
        this.glContext?.bufferData(this.glContext.ARRAY_BUFFER, currentModelPart.uvs, this.glContext.STATIC_DRAW);

        currentModelPart.indices = Uint16Array.from(elem.indices);
        currentModelPart.indicesBuffer = this.glContext?.createBuffer() as WebGLBuffer;
        this.glContext?.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, currentModelPart.indicesBuffer);
        this.glContext?.bufferData(this.glContext.ELEMENT_ARRAY_BUFFER, currentModelPart.indices, this.glContext.STATIC_DRAW);

        currentModelPart.texture = elem.texture as WebGLTexture;
      });

      opaqueElements.length = 0;
      groupsRelation.clear();
    });

    console.log("METHODS FOR GLOWING & TRANSPARENT OBJECTS DOES NOT EXIST");
  }
}

export default AssetsManager;
