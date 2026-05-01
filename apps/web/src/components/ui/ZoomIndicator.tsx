import { LEVEL_NAMES } from "@/lib/dimensions";
import { getZoomLevel } from "@/lib/zoom";

interface ZoomIndicatorProps {
  zoomValue: number;
}

export default function ZoomIndicator({ zoomValue }: ZoomIndicatorProps) {
  const level = getZoomLevel(zoomValue);

  return (
    <div className="zoom-hud" aria-label="Zoom indicator">
      <strong>
        L{level} - {LEVEL_NAMES[level]}
      </strong>
      <div className="scale-bar" />
      <span>{Math.round(zoomValue * 100)}%</span>
    </div>
  );
}
