export type GameModelPart = {
  verticesBuffer: WebGLBuffer;
  indicesBuffer: WebGLBuffer;
  normalsBuffer: WebGLBuffer;
  uvsBuffer: WebGLBuffer;
  texture: WebGLTexture;
  textureID: number;
  polygons: number;
};
