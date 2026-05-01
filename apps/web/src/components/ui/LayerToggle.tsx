"use client";

import type { GrossLayer } from "@/lib/grossAnatomy";
import { GROSS_LAYERS } from "@/lib/grossAnatomy";

interface LayerToggleProps {
  activeLayer: GrossLayer;
  onLayerChange: (layer: GrossLayer) => void;
}

export default function LayerToggle({
  activeLayer,
  onLayerChange,
}: LayerToggleProps) {
  return (
    <div className="layer-toggle" aria-label="Gross anatomy layer toggle">
      {GROSS_LAYERS.map((layer) => (
        <button
          aria-pressed={activeLayer === layer.id}
          key={layer.id}
          onClick={() => onLayerChange(layer.id)}
          title={layer.description}
          type="button"
        >
          <span className="swatch" style={{ background: layer.color }} />
          {layer.label}
        </button>
      ))}
    </div>
  );
}
