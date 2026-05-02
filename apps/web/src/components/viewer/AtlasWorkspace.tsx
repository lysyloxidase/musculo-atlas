"use client";

import { DEFAULT_ATLAS_STATE, atlasReducer } from "@/lib/atlasState";
import type { ZoomLevel } from "@/lib/types";
import { useEffect, useReducer, useRef } from "react";
import BreadcrumbNav from "../ui/BreadcrumbNav";
import FidelityPanel from "../ui/FidelityPanel";
import InfoPanel from "../ui/InfoPanel";
import LayerToggle from "../ui/LayerToggle";
import LegendPanel from "../ui/LegendPanel";
import MicroAnatomyControls from "../ui/MicroAnatomyControls";
import MolecularControls from "../ui/MolecularControls";
import PhysiologyOverlay from "../ui/PhysiologyOverlay";
import SearchOverlay from "../ui/SearchOverlay";
import TissueSystemsPanel from "../ui/TissueSystemsPanel";
import ZoomIndicator from "../ui/ZoomIndicator";
import AtlasCanvas from "./AtlasCanvas";

export default function AtlasWorkspace() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(atlasReducer, DEFAULT_ATLAS_STATE);

  useEffect(() => {
    dispatch({
      search: window.location.search,
      type: "hydrate_from_search",
    });

    function handleKeyDown(event: KeyboardEvent) {
      const nowMs = performance.now();

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (event.key === "Escape") {
        dispatch({ nowMs, type: "zoom_out" });
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        dispatch({ type: "toggle_animation" });
        return;
      }

      const digitLevel =
        event.key === "0"
          ? 10
          : Number.isInteger(Number(event.key))
            ? Number(event.key)
            : null;

      if (digitLevel && digitLevel >= 1 && digitLevel <= 10) {
        dispatch({
          level: digitLevel as ZoomLevel,
          nowMs,
          type: "jump_level",
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="atlas-shell">
      <div className="atlas-topbar">
        <BreadcrumbNav
          nodeId={state.selectedNodeId}
          onNavigate={(nodeId) =>
            dispatch({
              nodeId,
              nowMs: performance.now(),
              type: "navigate_to_node",
            })
          }
        />
        <SearchOverlay
          inputRef={searchInputRef}
          onSelect={(nodeId) =>
            dispatch({
              nodeId,
              nowMs: performance.now(),
              type: "navigate_to_node",
            })
          }
        />
      </div>
      <section className="atlas-stage" aria-label="MusculoAtlas viewer">
        <AtlasCanvas dispatch={dispatch} state={state} />
        <ZoomIndicator
          nodeId={state.selectedNodeId}
          zoomValue={state.zoomValue}
        />
      </section>
      <aside className="atlas-side">
        <LayerToggle
          activeLayer={state.activeLayer}
          onLayerChange={(layer) => dispatch({ layer, type: "select_layer" })}
        />
        <InfoPanel
          activeLayer={state.activeLayer}
          crossBridgeStep={state.crossBridgeStep}
          fiberType={state.fiberType}
          molecularRenderMode={state.molecularRenderMode}
          muscleId={state.selectedMuscleId}
          selectedAtomId={state.selectedAtomId}
          nodeId={state.selectedNodeId}
          sarcomereLengthUm={state.sarcomereLengthUm}
          troponinState={state.troponinState}
        />
        <MicroAnatomyControls dispatch={dispatch} state={state} />
        <PhysiologyOverlay dispatch={dispatch} state={state} />
        <MolecularControls dispatch={dispatch} state={state} />
        <TissueSystemsPanel dispatch={dispatch} state={state} />
        <FidelityPanel state={state} />
        <LegendPanel />
      </aside>
    </main>
  );
}
