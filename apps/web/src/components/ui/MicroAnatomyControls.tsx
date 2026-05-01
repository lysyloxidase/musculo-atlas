"use client";

import type { AtlasAction, AtlasState } from "@/lib/atlasState";
import type {
  FiberStructureLayer,
  SarcomereStructureLayer,
} from "@/lib/atlasState";
import { FIBER_TYPE_PROFILES, type FiberType } from "@/lib/microAnatomy";
import {
  CROSS_BRIDGE_CYCLE,
  getCrossBridgeStep,
  getLengthTensionForce,
} from "@/lib/sarcomere";
import { getZoomLevel } from "@/lib/zoom";
import type { Dispatch } from "react";

interface MicroAnatomyControlsProps {
  dispatch: Dispatch<AtlasAction>;
  state: AtlasState;
}

const fiberTypes = Object.values(FIBER_TYPE_PROFILES);
const fiberLayers: { id: FiberStructureLayer; label: string }[] = [
  { id: "nuclei", label: "Nuclei" },
  { id: "mitochondria", label: "Mito" },
  { id: "sr", label: "SR" },
  { id: "tTubules", label: "T-tubules" },
];
const sarcomereLayers: { id: SarcomereStructureLayer; label: string }[] = [
  { id: "thick", label: "Thick" },
  { id: "thin", label: "Thin" },
  { id: "titin", label: "Titin" },
  { id: "zDisc", label: "Z-disc" },
  { id: "mLine", label: "M-line" },
];

export default function MicroAnatomyControls({
  dispatch,
  state,
}: MicroAnatomyControlsProps) {
  const level = getZoomLevel(state.zoomValue);

  if (level < 5 || level > 8) {
    return null;
  }

  const bridgeStep = getCrossBridgeStep(state.crossBridgeStep);
  const force = getLengthTensionForce(state.sarcomereLengthUm);

  return (
    <section
      className="panel micro-controls"
      aria-labelledby="micro-controls-heading"
    >
      <h3 id="micro-controls-heading">Micro Anatomy</h3>
      {level === 5 ? (
        <button
          aria-pressed={state.fascicleCrossSection}
          onClick={() => dispatch({ type: "toggle_fascicle_cross_section" })}
          type="button"
        >
          Cross-section
        </button>
      ) : null}
      {level === 6 ? (
        <>
          <div className="fiber-type-toggle" aria-label="Fiber type toggle">
            {fiberTypes.map((profile) => (
              <button
                aria-pressed={state.fiberType === profile.id}
                key={profile.id}
                onClick={() =>
                  dispatch({
                    fiberType: profile.id as FiberType,
                    type: "set_fiber_type",
                  })
                }
                title={profile.description}
                type="button"
              >
                <span
                  className="swatch"
                  style={{ background: profile.color }}
                />
                {profile.label}
              </button>
            ))}
          </div>
          <div className="layer-chip-grid" aria-label="Fiber organelle layers">
            {fiberLayers.map((layer) => (
              <button
                aria-pressed={state.fiberVisibility[layer.id]}
                key={layer.id}
                onClick={() =>
                  dispatch({ layer: layer.id, type: "toggle_fiber_layer" })
                }
                type="button"
              >
                {layer.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
      {level === 8 ? (
        <div className="layer-chip-grid" aria-label="Sarcomere filament layers">
          {sarcomereLayers.map((layer) => (
            <button
              aria-pressed={state.sarcomereVisibility[layer.id]}
              key={layer.id}
              onClick={() =>
                dispatch({
                  layer: layer.id,
                  type: "toggle_sarcomere_layer",
                })
              }
              type="button"
            >
              {layer.label}
            </button>
          ))}
        </div>
      ) : null}
      {level === 8 ? (
        <div className="sarcomere-controls">
          <label htmlFor="sarcomere-length">
            SL {state.sarcomereLengthUm.toFixed(2)} um
          </label>
          <input
            id="sarcomere-length"
            max={3.5}
            min={1.8}
            onChange={(event) =>
              dispatch({
                lengthUm: Number(event.target.value),
                type: "set_sarcomere_length",
              })
            }
            step={0.05}
            type="range"
            value={state.sarcomereLengthUm}
          />
          <div className="force-meter" aria-label="Length tension force">
            <span style={{ width: `${Math.round(force * 100)}%` }} />
          </div>
          <p>Force {Math.round(force * 100)}%</p>
          <div className="cycle-steps" aria-label="Cross-bridge cycle">
            {CROSS_BRIDGE_CYCLE.map((step, index) => (
              <button
                aria-pressed={bridgeStep.id === step.id}
                key={step.id}
                onClick={() =>
                  dispatch({ step: index, type: "set_cross_bridge_step" })
                }
                title={step.label}
                type="button"
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p>{bridgeStep.label}</p>
        </div>
      ) : null}
    </section>
  );
}
