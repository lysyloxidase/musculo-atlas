import type { AtlasAction, AtlasState } from "@/lib/atlasState";
import {
  TRANSITION_DURATION_MS,
  getPreloadLevels,
  getRenderLevelSlots,
} from "@/lib/semanticZoom";
import type { ZoomLevel } from "@/lib/types";
import type { ComponentType } from "react";
import type { Dispatch } from "react";
import L1Body from "../levels/L1_Body";
import L2System from "../levels/L2_System";
import L3Region from "../levels/L3_Region";
import L4Muscle from "../levels/L4_Muscle";
import L5Fascicle from "../levels/L5_Fascicle";
import L6Fiber from "../levels/L6_Fiber";
import L7Myofibril from "../levels/L7_Myofibril";
import L8Sarcomere from "../levels/L8_Sarcomere";
import L9Protein from "../levels/L9_Protein";
import L10Atom from "../levels/L10_Atom";
import TransitionFade from "./TransitionFade";

export interface GrossLevelProps {
  dispatch: Dispatch<AtlasAction>;
  state: AtlasState;
}

const renderers: Record<ZoomLevel, ComponentType<GrossLevelProps>> = {
  1: L1Body,
  2: L2System,
  3: L3Region,
  4: L4Muscle,
  5: L5Fascicle,
  6: L6Fiber,
  7: L7Myofibril,
  8: L8Sarcomere,
  9: L9Protein,
  10: L10Atom,
};

interface LevelRendererProps extends GrossLevelProps {
  level: ZoomLevel;
}

export default function LevelRenderer({
  dispatch,
  level,
  state,
}: LevelRendererProps) {
  const slots = getRenderLevelSlots(
    state.zoomValue,
    state.zoomTransition,
    state.zoomTransition?.startedAtMs,
  );
  const visibleLevels = new Set(slots.map((slot) => slot.level));
  const preloadLevels = getPreloadLevels(level).filter(
    (preloadLevel) => !visibleLevels.has(preloadLevel),
  );

  return (
    <group
      name="semantic-level-stack"
      userData={{
        preloadedLevels: getPreloadLevels(level),
        visibleLevels: slots.map((slot) => slot.level),
      }}
    >
      {slots.map((slot) => {
        const Renderer = renderers[slot.level];

        return (
          <TransitionFade
            durationMs={TRANSITION_DURATION_MS}
            key={`${slot.level}-${slot.phase}`}
            level={slot.level}
            phase={slot.phase}
            targetOpacity={slot.opacity || 1}
          >
            <Renderer dispatch={dispatch} state={state} />
          </TransitionFade>
        );
      })}
      {preloadLevels.map((preloadLevel) => {
        const Renderer = renderers[preloadLevel];

        return (
          <TransitionFade
            key={`preload-${preloadLevel}`}
            level={preloadLevel}
            phase="preload"
            targetOpacity={0}
          >
            <Renderer dispatch={dispatch} state={state} />
          </TransitionFade>
        );
      })}
    </group>
  );
}
