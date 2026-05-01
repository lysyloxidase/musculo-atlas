import type { ZoomLevel } from "@/lib/types";
import type { ComponentType } from "react";
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

const renderers: Record<ZoomLevel, ComponentType> = {
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

interface LevelRendererProps {
  level: ZoomLevel;
}

export default function LevelRenderer({ level }: LevelRendererProps) {
  const Renderer = renderers[level];

  return <Renderer />;
}
