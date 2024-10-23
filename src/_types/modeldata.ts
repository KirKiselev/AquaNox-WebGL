//export type ModelData = { vertices: Array<number>; indices: Array<number>; normals: Array<number>; uvs: Array<number>; texture: WebGLTexture | undefined; textureID: number | undefined };

export type ModelData = {
  vertices: Array<number>;
  indices: Array<number>;
  normals: Array<number>;
  uvs: Array<number>;
  texture: WebGLTexture;
  textureID: number;
};
