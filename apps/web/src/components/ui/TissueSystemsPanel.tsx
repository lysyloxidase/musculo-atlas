"use client";

import type { AtlasAction, AtlasState } from "@/lib/atlasState";
import {
  BONE_LEVELS,
  CARTILAGE_ZONES,
  SYNOVIAL_JOINT_DETAIL,
  TENDON_LEVELS,
  TISSUE_SYSTEMS,
  type TissueSystemId,
} from "@/lib/connectiveTissue";
import type { Dispatch } from "react";

interface TissueSystemsPanelProps {
  dispatch: Dispatch<AtlasAction>;
  state: AtlasState;
}

export default function TissueSystemsPanel({
  dispatch,
  state,
}: TissueSystemsPanelProps) {
  return (
    <section className="panel tissue-panel" aria-labelledby="tissue-heading">
      <h3 id="tissue-heading">Connective Tissue</h3>
      <div className="tissue-tabs" aria-label="Tissue system selector">
        {TISSUE_SYSTEMS.map((system) => (
          <button
            aria-pressed={state.selectedTissueSystem === system.id}
            key={system.id}
            onClick={() =>
              dispatch({
                system: system.id as TissueSystemId,
                type: "select_tissue_system",
              })
            }
            title={system.accessibleFrom}
            type="button"
          >
            {system.label}
          </button>
        ))}
      </div>
      {state.selectedTissueSystem === "tendon" ? <TendonPanel /> : null}
      {state.selectedTissueSystem === "bone" ? <BonePanel /> : null}
      {state.selectedTissueSystem === "cartilage" ? <CartilagePanel /> : null}
      {state.selectedTissueSystem === "joint" ? <JointPanel /> : null}
    </section>
  );
}

function TendonPanel() {
  return (
    <div className="tissue-detail">
      <div className="collagen-crimp" aria-hidden="true" />
      <ol>
        {TENDON_LEVELS.map((level) => (
          <li key={level.id}>
            <strong>
              {level.id} {level.label}
            </strong>
            <span>{level.renderFeature}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BonePanel() {
  return (
    <div className="tissue-detail">
      <div className="osteon-visual" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <ol>
        {BONE_LEVELS.map((level) => (
          <li key={level.id}>
            <strong>
              {level.id} {level.label}
            </strong>
            <span>{level.renderFeature}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CartilagePanel() {
  return (
    <div className="cartilage-stack" aria-label="Cartilage zones">
      {CARTILAGE_ZONES.map((zone) => (
        <div key={zone.id}>
          <strong>{zone.label}</strong>
          <span>{zone.feature}</span>
        </div>
      ))}
    </div>
  );
}

function JointPanel() {
  return (
    <div className="tissue-detail">
      <p>{SYNOVIAL_JOINT_DETAIL.capsule}</p>
      <p>{SYNOVIAL_JOINT_DETAIL.synovialMembrane}</p>
      <p>{SYNOVIAL_JOINT_DETAIL.synovialFluid}</p>
    </div>
  );
}
