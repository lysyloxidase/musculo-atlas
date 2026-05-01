"use client";

import type { AtlasAction, AtlasState } from "@/lib/atlasState";
import { FIBER_TYPE_PROFILES, type FiberType } from "@/lib/microAnatomy";
import { getZoomLevel } from "@/lib/zoom";
import type { Dispatch } from "react";

interface MicroAnatomyControlsProps {
  dispatch: Dispatch<AtlasAction>;
  state: AtlasState;
}

const fiberTypes = Object.values(FIBER_TYPE_PROFILES);

export default function MicroAnatomyControls({
  dispatch,
  state,
}: MicroAnatomyControlsProps) {
  const level = getZoomLevel(state.zoomValue);

  if (level < 5 || level > 6) {
    return null;
  }

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
              <span className="swatch" style={{ background: profile.color }} />
              {profile.label}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
