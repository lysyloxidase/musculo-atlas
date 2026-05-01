"use client";

import {
  TRANSITION_DURATION_MS,
  type ZoomTransition,
  applyScrollZoom,
  createZoomTransition,
  getTransitionProgress,
} from "@/lib/semanticZoom";
import type { ZoomLevel } from "@/lib/types";
import { getCameraDistance, getZoomLevel } from "@/lib/zoom";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

export class ZoomEngine {
  anchorPoint = new Vector3(0, 0, 0);
  currentLevel: ZoomLevel;
  transition: ZoomTransition | null = null;
  transitionProgress = 1;
  zoomValue: number;

  constructor(zoomValue = 0) {
    this.zoomValue = zoomValue;
    this.currentLevel = getZoomLevel(zoomValue);
  }

  computeLevel(zoomValue: number): ZoomLevel {
    return getZoomLevel(zoomValue);
  }

  handleScroll(deltaY: number, fine = false, nowMs = performance.now()): void {
    const nextZoom = applyScrollZoom(this.zoomValue, deltaY, fine);
    const nextLevel = this.computeLevel(nextZoom);

    if (nextLevel !== this.currentLevel) {
      this.startTransition(this.currentLevel, nextLevel, nowMs);
    }

    this.zoomValue = nextZoom;
    this.currentLevel = nextLevel;
  }

  startTransition(
    from: ZoomLevel,
    to: ZoomLevel,
    nowMs = performance.now(),
  ): void {
    this.transition = createZoomTransition(
      this.zoomValue,
      this.zoomValue,
      nowMs,
      this.anchorPoint.toArray() as [number, number, number],
    ) ?? {
      anchorPoint: this.anchorPoint.toArray() as [number, number, number],
      durationMs: TRANSITION_DURATION_MS,
      from,
      startedAtMs: nowMs,
      to,
    };
    this.transitionProgress = 0;
  }

  update(nowMs = performance.now()): void {
    this.transitionProgress = getTransitionProgress(this.transition, nowMs);
  }
}

interface ZoomControllerProps {
  zoomValue: number;
}

export default function ZoomController({ zoomValue }: ZoomControllerProps) {
  const { camera } = useThree();
  const level = getZoomLevel(zoomValue);
  const targetDistance =
    level >= 9
      ? Math.max(2.4, getCameraDistance(zoomValue))
      : getCameraDistance(zoomValue);

  useFrame(() => {
    camera.near = level >= 9 ? 0.0001 : 0.01;
    camera.far = level <= 4 ? 100 : level >= 9 ? 20 : 10;
    camera.position.z += (targetDistance - camera.position.z) * 0.08;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });

  return null;
}
