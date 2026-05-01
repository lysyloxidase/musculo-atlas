"use client";

import type { AtlasAction, AtlasState } from "@/lib/atlasState";
import {
  MOLECULAR_PROTEINS,
  type MolecularRenderMode,
  type ProteinId,
  TROPONIN_STATES,
  type TroponinState,
  getDefaultDomainForProtein,
  getProteinStructure,
} from "@/lib/molecular";
import { getZoomLevel } from "@/lib/zoom";
import type { Dispatch } from "react";

interface MolecularControlsProps {
  dispatch: Dispatch<AtlasAction>;
  state: AtlasState;
}

const renderModes: { id: MolecularRenderMode; label: string }[] = [
  { id: "molstar", label: "Mol*" },
  { id: "surface", label: "Surface" },
  { id: "cartoon", label: "Cartoon" },
  { id: "ball_and_stick", label: "Ball-stick" },
];

export default function MolecularControls({
  dispatch,
  state,
}: MolecularControlsProps) {
  const level = getZoomLevel(state.zoomValue);

  if (level < 9) {
    return null;
  }

  const protein = getProteinStructure(state.selectedProteinId);
  const defaultDomainId = getDefaultDomainForProtein(protein.id);

  return (
    <section
      className="panel molecular-controls"
      aria-labelledby="molecular-controls-heading"
    >
      <h3 id="molecular-controls-heading">Molecular View</h3>
      <div className="mode-grid" aria-label="Molecular rendering mode">
        {renderModes.map((mode) => (
          <button
            aria-pressed={state.molecularRenderMode === mode.id}
            key={mode.id}
            onClick={() =>
              dispatch({ mode: mode.id, type: "set_molecular_render_mode" })
            }
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>
      <div className="pdb-chip-list" aria-label="Canonical PDB structures">
        {protein.pdbIds.map((pdbId) => (
          <span key={pdbId}>{pdbId}</span>
        ))}
      </div>
      <div className="protein-grid" aria-label="Protein selector">
        {MOLECULAR_PROTEINS.map((item) => (
          <button
            aria-pressed={state.selectedProteinId === item.id}
            key={item.id}
            onClick={() =>
              dispatch({
                proteinId: item.id as ProteinId,
                type: "select_protein",
              })
            }
            title={item.displayName}
            type="button"
          >
            {item.displayName}
          </button>
        ))}
      </div>
      {protein.id === "actin" || protein.id === "troponin" ? (
        <div className="troponin-state" aria-label="Troponin calcium states">
          {Object.entries(TROPONIN_STATES).map(([id, descriptor]) => (
            <button
              aria-pressed={state.troponinState === id}
              key={id}
              onClick={() =>
                dispatch({
                  state: id as TroponinState,
                  type: "set_troponin_state",
                })
              }
              title={descriptor.label}
              type="button"
            >
              {id === "blocked" ? "B" : id === "closed" ? "C" : "M"}
            </button>
          ))}
        </div>
      ) : null}
      {level === 9 ? (
        <button
          onClick={() =>
            dispatch({ domainId: defaultDomainId, type: "select_domain" })
          }
          type="button"
        >
          Domain detail
        </button>
      ) : null}
    </section>
  );
}
