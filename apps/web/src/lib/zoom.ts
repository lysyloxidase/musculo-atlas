import { LEVEL_SCALE_METERS } from "./dimensions";
import type { ZoomLevel } from "./types";

export const ZOOM_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const LEVEL_THRESHOLDS: Record<
  ZoomLevel,
  { enter: number; exit: number }
> = {
  1: { enter: 0.0, exit: 0.1 },
  2: { enter: 0.1, exit: 0.2 },
  3: { enter: 0.2, exit: 0.3 },
  4: { enter: 0.3, exit: 0.42 },
  5: { enter: 0.42, exit: 0.52 },
  6: { enter: 0.52, exit: 0.62 },
  7: { enter: 0.62, exit: 0.72 },
  8: { enter: 0.72, exit: 0.82 },
  9: { enter: 0.82, exit: 0.92 },
  10: { enter: 0.92, exit: 1.0 },
};

export function clampZoom(zoomValue: number): number {
  if (Number.isNaN(zoomValue)) {
    return 0;
  }

  return Math.min(1, Math.max(0, zoomValue));
}

export function getZoomLevel(zoomValue: number): ZoomLevel {
  const zoom = clampZoom(zoomValue);

  if (zoom === 1) {
    return 10;
  }

  return (
    ZOOM_LEVELS.find((level) => {
      const threshold = LEVEL_THRESHOLDS[level];
      return zoom >= threshold.enter && zoom < threshold.exit;
    }) ?? 10
  );
}

export function getLevelProgress(zoomValue: number): number {
  const zoom = clampZoom(zoomValue);
  const level = getZoomLevel(zoom);
  const threshold = LEVEL_THRESHOLDS[level];
  const span = threshold.exit - threshold.enter;

  if (span === 0) {
    return 1;
  }

  return Math.min(1, Math.max(0, (zoom - threshold.enter) / span));
}

export function getCameraDistance(
  zoomValue: number,
  farFactor = 3.5,
  nearFactor = 0.8,
): number {
  const level = getZoomLevel(zoomValue);
  const progress = getLevelProgress(zoomValue);
  const scale = LEVEL_SCALE_METERS[level];
  const factor = farFactor + (nearFactor - farFactor) * progress;

  return scale * factor;
}
