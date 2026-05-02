"use client";

import { getLevelStructureMap } from "@/lib/anatomicalFidelity";
import type { AtlasState } from "@/lib/atlasState";
import { getZoomLevel } from "@/lib/zoom";

interface FidelityPanelProps {
  state: AtlasState;
}

export default function FidelityPanel({ state }: FidelityPanelProps) {
  const level = getZoomLevel(state.zoomValue);
  const mapping = getLevelStructureMap(level);

  return (
    <section
      className="panel fidelity-panel"
      aria-labelledby="fidelity-heading"
    >
      <h3 id="fidelity-heading">1:1 Structure Map</h3>
      <p>{mapping.canonicalStructure}</p>
      <dl>
        <div>
          <dt>Mode</dt>
          <dd>{mapping.fidelityMode.replaceAll("_", " ")}</dd>
        </div>
        <div>
          <dt>Rule</dt>
          <dd>{mapping.oneToOneRule}</dd>
        </div>
        <div>
          <dt>Examples</dt>
          <dd>{mapping.visibleExamples.join(", ")}</dd>
        </div>
      </dl>
    </section>
  );
}
