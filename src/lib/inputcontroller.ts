export class InputController {
  //static inputScheme: { [key: string]: boolean };
  private inputState: Map<string, boolean>;
  private activeKeys = ["keyW", "keyA", "keyS", "keyD"];
  public pressedKeys: Array<string> = [];

  public start() {
    window.addEventListener("keydown", (e) => {
      if (this.inputState.has(e.code) && this.inputState.get(e.code) !== true) {
        this.inputState.set(e.code, true);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.inputState.has(e.code) && this.inputState.get(e.code) !== false) {
        this.inputState.set(e.code, false);
      }
    });

    this.activeKeys.forEach((key) => {
      this.inputState.set(key, false);
    });
  }

  public getPressedKeys() {
    this.activeKeys.forEach((key) => {
      if (this.inputState.get(key)) {
        this.pressedKeys.push("key");
      }
    });
  }

  public constructor() {
    this.inputState = new Map();
    this.start();
  }
}
