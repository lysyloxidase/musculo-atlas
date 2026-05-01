"use client";

import { getZoomLevel } from "@/lib/zoom";
import { Canvas } from "@react-three/fiber";
import { Minus, Plus } from "lucide-react";
import { Suspense, useState } from "react";
import LevelRenderer from "./LevelRenderer";
import TransitionFade from "./TransitionFade";
import ZoomController from "./ZoomController";

export default function AtlasCanvas() {
  const [zoomValue, setZoomValue] = useState(0.5);
  const level = getZoomLevel(zoomValue);

  return (
    <div className="atlas-canvas">
      <div className="canvas-controls" aria-label="Zoom controls">
        <button
          aria-label="Zoom out"
          onClick={() => setZoomValue((value) => Math.max(0, value - 0.06))}
          title="Zoom out"
          type="button"
        >
          <Minus aria-hidden="true" size={18} />
        </button>
        <button
          aria-label="Zoom in"
          onClick={() => setZoomValue((value) => Math.min(1, value + 0.06))}
          title="Zoom in"
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
        </button>
      </div>
      <Canvas camera={{ fov: 45, position: [0, 0.35, 4] }}>
        <color args={["#171717"]} attach="background" />
        <ambientLight intensity={0.55} />
        <directionalLight intensity={2.1} position={[3, 4, 5]} />
        <Suspense fallback={null}>
          <ZoomController zoomValue={zoomValue} />
          <TransitionFade level={level}>
            <LevelRenderer level={level} />
          </TransitionFade>
        </Suspense>
      </Canvas>
    </div>
  );
}
