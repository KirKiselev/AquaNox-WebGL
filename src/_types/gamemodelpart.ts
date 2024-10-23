/*export type GameModelPart = {
  vertices: Float32Array;
  verticesBuffer: WebGLBuffer;
  indices: Uint16Array;
  indicesBuffer: WebGLBuffer;
  normals: Float32Array;
  normalsBuffer: WebGLBuffer;
  uvs: Float32Array;
  uvsBuffer: WebGLBuffer;
  texture: WebGLTexture;
  textureID: number;
};
*/

export type GameModelPart = {
  verticesBuffer: WebGLBuffer;
  indicesBuffer: WebGLBuffer;
  normalsBuffer: WebGLBuffer;
  uvsBuffer: WebGLBuffer;
  texture: WebGLTexture;
  textureID: number;
  polygons: number;
};
