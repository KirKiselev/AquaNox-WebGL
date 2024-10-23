import { GameModelPart } from "./gamemodelpart";

export type GameModel = {
  opaqueElements: Array<GameModelPart> | undefined;
  opaqueGlowElements: Array<GameModelPart> | undefined;
  transparentElements: Array<GameModelPart> | undefined;
  transparentGlowElements: Array<GameModelPart> | undefined;
};
