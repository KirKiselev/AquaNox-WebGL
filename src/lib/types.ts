export type MSBModel = { vertices: Array<Array<number>>; indices: Array<Array<number>>; normals: Array<Array<number>>; uvs: Array<Array<number>>; materials: Array<Array<string>> };

export type GameLevel = {
  sourceList: {
    models: Array<string>;
    images: Array<string>;
    sounds: Array<string>;
  };

  modelsAdditionalInfo: {
    [key: string]: {
      glowingElementsGroups: Array<number>;
      transparentElementsgroups: Array<number>;
      opaqueElementsgroups: Array<number>;
    };
  };

  gameObjects: {
    [key: string]: {
      model: string;
      position: { x: number; y: number; z: number };
      rotation: { x: number; y: number; z: number };
    };
  };
};
