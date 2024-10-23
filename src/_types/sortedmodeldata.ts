import { ModelData } from "./modeldata";

export type SortedModelData = {
  opaqueElements: Array<ModelData> | undefined;
  opaqueGlowElements: Array<ModelData> | undefined;
  transparentElements: Array<ModelData> | undefined;
  transparentGlowElements: Array<ModelData> | undefined;
};
