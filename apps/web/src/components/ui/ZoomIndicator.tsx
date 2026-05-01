import {
  getLevelBadgeModel,
  getMinimapPosition,
  getMinimapTicks,
  getScaleBarModel,
} from "@/lib/semanticZoom";

interface ZoomIndicatorProps {
  nodeId: string;
  zoomValue: number;
}

export default function ZoomIndicator({
  nodeId,
  zoomValue,
}: ZoomIndicatorProps) {
  const scale = getScaleBarModel(zoomValue);
  const badge = getLevelBadgeModel(zoomValue, nodeId);
  const minimapPosition = getMinimapPosition(zoomValue);

  return (
    <>
      <div className="scale-hud" aria-label="Scale bar">
        <div className="scale-line" />
        <span>{scale.label}</span>
      </div>
      <div className="level-badge" aria-label="Level badge">
        <strong>{badge.label}</strong>
        <span>{badge.context}</span>
      </div>
      <div className="zoom-minimap" aria-label="Hierarchy minimap">
        <div className="minimap-track">
          {getMinimapTicks().map((tick) => (
            <span
              className="minimap-tick"
              key={tick.level}
              style={{ left: `${tick.position}%` }}
            >
              {tick.label}
            </span>
          ))}
          <span
            className="minimap-position"
            style={{ left: `${minimapPosition}%` }}
          />
        </div>
      </div>
    </>
  );
}
