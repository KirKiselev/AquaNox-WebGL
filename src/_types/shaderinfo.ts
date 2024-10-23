export type ShaderInfo = {
  shaderSourses: {
    vertexShaders: {
      [key: string]: string;
    };
    fragmentShaders: {
      [key: string]: string;
    };
  };
  shaderPrograms: Array<{ programName: string; vertexShader: string; fragmentShader: string }>;
};
