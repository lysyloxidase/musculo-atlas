"use client";

import type { AtlasAction, AtlasState } from "@/lib/atlasState";
import { getZoomLevel } from "@/lib/zoom";
import { Canvas } from "@react-three/fiber";
import { Minus, Plus } from "lucide-react";
import type { Dispatch } from "react";
import { Suspense } from "react";
import LevelRenderer from "./LevelRenderer";
import ZoomController from "./ZoomController";

interface AtlasCanvasProps {
  dispatch: Dispatch<AtlasAction>;
  state: AtlasState;
}

export default function AtlasCanvas({ dispatch, state }: AtlasCanvasProps) {
  const level = getZoomLevel(state.zoomValue);

  return (
    <div
      className="atlas-canvas"
      onDoubleClick={() =>
        dispatch({ nowMs: performance.now(), type: "double_click_selected" })
      }
      onWheel={(event) => {
        event.preventDefault();
        dispatch({
          deltaY: event.deltaY,
          fine: event.ctrlKey,
          nowMs: performance.now(),
          type: "semantic_scroll",
        });
      }}
    >
      <div className="canvas-controls" aria-label="Zoom controls">
        <button
          aria-label="Zoom out"
          onClick={() =>
            dispatch({
              type: "zoom",
              value: Math.max(0, state.zoomValue - 0.06),
              nowMs: performance.now(),
            })
          }
          title="Zoom out"
          type="button"
        >
          <Minus aria-hidden="true" size={18} />
        </button>
        <button
          aria-label="Zoom in"
          onClick={() =>
            dispatch({
              type: "zoom",
              value: Math.min(1, state.zoomValue + 0.06),
              nowMs: performance.now(),
            })
          }
          title="Zoom in"
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
        </button>
      </div>
      <Canvas
        camera={{ fov: 45, position: [0, 0.35, 4] }}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
      >
        <color args={["#171717"]} attach="background" />
        <ambientLight intensity={0.55} />
        <directionalLight intensity={2.1} position={[3, 4, 5]} />
        <Suspense fallback={null}>
          <ZoomController zoomValue={state.zoomValue} />
          <LevelRenderer dispatch={dispatch} level={level} state={state} />
        </Suspense>
      </Canvas>
    </div>
  );
}
