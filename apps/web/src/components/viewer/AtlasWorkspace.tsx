"use client";

import { DEFAULT_ATLAS_STATE, atlasReducer } from "@/lib/atlasState";
import { useReducer } from "react";
import BreadcrumbNav from "../ui/BreadcrumbNav";
import InfoPanel from "../ui/InfoPanel";
import LayerToggle from "../ui/LayerToggle";
import LegendPanel from "../ui/LegendPanel";
import SearchOverlay from "../ui/SearchOverlay";
import ZoomIndicator from "../ui/ZoomIndicator";
import AtlasCanvas from "./AtlasCanvas";

export default function AtlasWorkspace() {
  const [state, dispatch] = useReducer(atlasReducer, DEFAULT_ATLAS_STATE);

  return (
    <main className="atlas-shell">
      <div className="atlas-topbar">
        <BreadcrumbNav nodeId={state.selectedNodeId} />
        <SearchOverlay
          onSelect={(nodeId) =>
            dispatch({ muscleId: nodeId, type: "select_muscle" })
          }
        />
      </div>
      <section className="atlas-stage" aria-label="MusculoAtlas viewer">
        <AtlasCanvas dispatch={dispatch} state={state} />
        <ZoomIndicator zoomValue={state.zoomValue} />
      </section>
      <aside className="atlas-side">
        <LayerToggle
          activeLayer={state.activeLayer}
          onLayerChange={(layer) => dispatch({ layer, type: "select_layer" })}
        />
        <InfoPanel
          activeLayer={state.activeLayer}
          muscleId={state.selectedMuscleId}
          nodeId={state.selectedNodeId}
        />
        <LegendPanel />
      </aside>
    </main>
  );
}
