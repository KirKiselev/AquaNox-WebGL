import { useEffect, useRef } from "react";
import { Application } from "./lib/application";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appContainer = useRef<Application | null>(null);

  useEffect(() => {
    appContainer.current = new Application(canvasRef.current as HTMLCanvasElement);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ border: "1px solid green" }}></canvas>
    </>
  );
}

export default App;
