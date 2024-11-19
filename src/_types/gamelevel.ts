export type GameLevel = {
  /*
  opaqueGlowElementsGroups - position of opaque groups with glowing details in original model
  */
  sourceList: {
    models: Array<string>;
    images: Array<string>;
    sounds: Array<string>;
  };

  modelsAdditionalInfo: {
    [key: string]: {
      renderGroups: {
        opaqueElements: Array<number>;
        opaqueGlowElements: Array<number>;
        transparentElements: Array<number>;
        transparentGlowElements: Array<number>;
      };
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
