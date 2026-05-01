"use client";

import type { ZoomLevel } from "@/lib/types";
import { useFrame } from "@react-three/fiber";
import { type PropsWithChildren, useRef } from "react";
import type { Group, Material, Object3D } from "three";

interface TransitionFadeProps extends PropsWithChildren {
  durationMs?: number;
  level: ZoomLevel;
  phase?: "active" | "enter" | "exit" | "preload";
  targetOpacity?: number;
}

function easeOutCubic(value: number): number {
  return 1 - (1 - value) ** 3;
}

function applyOpacity(root: Object3D, opacity: number): void {
  root.traverse((child) => {
    const material = (child as { material?: Material | Material[] }).material;

    if (!material) {
      return;
    }

    const materials = Array.isArray(material) ? material : [material];

    for (const item of materials) {
      const baseOpacity =
        typeof item.userData.baseOpacity === "number"
          ? item.userData.baseOpacity
          : item.opacity;

      item.userData.baseOpacity = baseOpacity;
      item.transparent = opacity < 1 || baseOpacity < 1;
      item.opacity = baseOpacity * opacity;
      item.needsUpdate = true;
    }
  });
}

export default function TransitionFade({
  children,
  durationMs = 300,
  level,
  phase = "active",
  targetOpacity = 1,
}: TransitionFadeProps) {
  const groupRef = useRef<Group>(null);
  const startedAtMs = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    if (startedAtMs.current === null) {
      startedAtMs.current = clock.elapsedTime * 1000;
    }

    const elapsedMs = clock.elapsedTime * 1000 - startedAtMs.current;
    const progress = Math.min(1, Math.max(0, elapsedMs / durationMs));
    const eased = easeOutCubic(progress);
    const opacity =
      phase === "enter"
        ? eased * targetOpacity
        : phase === "exit"
          ? (1 - eased) * targetOpacity
          : targetOpacity;

    groupRef.current.visible = opacity > 0.01 && phase !== "preload";
    applyOpacity(groupRef.current, opacity);
  });

  return (
    <group
      ref={groupRef}
      name={`level-${level}-${phase}`}
      userData={{
        crossfadeDurationMs: durationMs,
        opacityTarget: targetOpacity,
        phase,
      }}
      visible={phase !== "preload"}
    >
      {children}
    </group>
  );
}
