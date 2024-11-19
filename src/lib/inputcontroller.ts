export class InputController {
  public inputState: { [keyof: string]: boolean };
  private inputScheme: { [keyof: string]: string };
  private inputMapper: { [keyof: string]: string };

  public lockElement: HTMLElement;
  public pointerDisplacement: { x: number; y: number };

  public constructor(lockElement: HTMLElement) {
    this.inputState = {};
    this.inputMapper = {};
    this.inputScheme = { forward: "KeyW", backward: "KeyS", left: "KeyA", right: "KeyD" };

    this.lockElement = lockElement;
    this.pointerDisplacement = { x: 0, y: 0 };

    this.start();
  }

  public start() {
    let pointerDisplacement = this.pointerDisplacement;

    window.addEventListener("keydown", (e) => {
      if (this.inputMapper[e.code] !== undefined) {
        this.inputState[this.inputMapper[e.code]] = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.inputMapper[e.code] !== undefined) {
        this.inputState[this.inputMapper[e.code]] = false;
      }
    });

    for (let prop in this.inputScheme) {
      this.inputMapper[this.inputScheme[prop]] = prop;
    }

    for (let prop in this.inputScheme) {
      this.inputState[prop] = false;
    }

    //____pointer_lock____ //

    document.addEventListener("click", () => {
      if (!document.pointerLockElement) {
        this.lockElement.requestPointerLock();
      }
    });

    document.addEventListener("pointerlockchange", lockChangeAlert, false);

    function lockChangeAlert() {
      if (document.pointerLockElement) {
        document.addEventListener("mousemove", trackPointerDisplacement, false);
      } else {
        document.removeEventListener("mousemove", trackPointerDisplacement, false);
      }
    }

    function trackPointerDisplacement(e: MouseEvent) {
      pointerDisplacement.x += e.movementX;
      pointerDisplacement.y += e.movementY;
    }

    ///////////////////////
  }

  public pause() {
    return;
  }

  public continue() {
    return;
  }

  public stop() {
    return;
  }

  public clearPointerDisplacement() {
    this.pointerDisplacement.x = 0;
    this.pointerDisplacement.y = 0;
  }
}
