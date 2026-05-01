import type { GrossLayer } from "./grossAnatomy";
import type { FiberType } from "./microAnatomy";
import type { ZoomLevel } from "./types";

export interface AtlasState {
  activeLayer: GrossLayer;
  activeRegionId: string;
  fascicleCrossSection: boolean;
  fiberType: FiberType;
  selectedFiberId: string;
  selectedMuscleId: string;
  selectedNodeId: string;
  zoomValue: number;
}

export type AtlasAction =
  | { type: "zoom"; value: number }
  | { type: "select_body_region"; regionId: string }
  | { type: "select_layer"; layer: GrossLayer }
  | { type: "select_region"; regionId: string }
  | { type: "select_muscle"; muscleId: string }
  | { type: "select_muscle_belly"; muscleId: string }
  | { type: "select_fiber"; fiberId: string }
  | { type: "select_myofibril"; myofibrilId: string }
  | { type: "set_fiber_type"; fiberType: FiberType }
  | { type: "toggle_fascicle_cross_section" };

export const DEFAULT_ATLAS_STATE: AtlasState = {
  activeLayer: "skeleton",
  activeRegionId: "lower_limb",
  fascicleCrossSection: true,
  fiberType: "type_I",
  selectedFiberId: "fiber_1",
  selectedMuscleId: "rectus_femoris",
  selectedNodeId: "body",
  zoomValue: 0,
};

export function createAtlasStateFromSearch(search: string): AtlasState {
  const params = new URLSearchParams(search);
  const zoom = Number(params.get("zoom"));
  const node = params.get("node");
  const muscle = params.get("muscle");
  const fiberType = params.get("fiberType") as FiberType | null;

  return {
    ...DEFAULT_ATLAS_STATE,
    fiberType:
      fiberType === "type_I" ||
      fiberType === "type_IIa" ||
      fiberType === "type_IIx"
        ? fiberType
        : DEFAULT_ATLAS_STATE.fiberType,
    selectedMuscleId: muscle ?? DEFAULT_ATLAS_STATE.selectedMuscleId,
    selectedNodeId: node ?? DEFAULT_ATLAS_STATE.selectedNodeId,
    zoomValue: Number.isFinite(zoom)
      ? clampZoom(zoom)
      : DEFAULT_ATLAS_STATE.zoomValue,
  };
}

export const LEVEL_ENTRY_ZOOM: Record<ZoomLevel, number> = {
  1: 0,
  2: 0.12,
  3: 0.24,
  4: 0.34,
  5: 0.46,
  6: 0.56,
  7: 0.66,
  8: 0.76,
  9: 0.86,
  10: 0.96,
};

function clampZoom(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function atlasReducer(
  state: AtlasState,
  action: AtlasAction,
): AtlasState {
  switch (action.type) {
    case "select_body_region":
      return {
        ...state,
        activeRegionId: action.regionId,
        selectedNodeId: "musculoskeletal_system",
        zoomValue: LEVEL_ENTRY_ZOOM[2],
      };
    case "select_layer":
      return {
        ...state,
        activeLayer: action.layer,
      };
    case "select_muscle":
      return {
        ...state,
        selectedMuscleId: action.muscleId,
        selectedNodeId: action.muscleId,
        zoomValue: LEVEL_ENTRY_ZOOM[4],
      };
    case "select_muscle_belly":
      return {
        ...state,
        selectedMuscleId: action.muscleId,
        selectedNodeId: `${action.muscleId}_fascicle`,
        zoomValue: LEVEL_ENTRY_ZOOM[5],
      };
    case "select_fiber":
      return {
        ...state,
        selectedFiberId: action.fiberId,
        selectedNodeId: `${state.selectedMuscleId}_fiber`,
        zoomValue: LEVEL_ENTRY_ZOOM[6],
      };
    case "select_myofibril":
      return {
        ...state,
        selectedNodeId: `${state.selectedMuscleId}_myofibril`,
        zoomValue: LEVEL_ENTRY_ZOOM[7],
      };
    case "select_region":
      return {
        ...state,
        activeRegionId: action.regionId,
        selectedNodeId: action.regionId,
        zoomValue: LEVEL_ENTRY_ZOOM[3],
      };
    case "set_fiber_type":
      return {
        ...state,
        fiberType: action.fiberType,
      };
    case "toggle_fascicle_cross_section":
      return {
        ...state,
        fascicleCrossSection: !state.fascicleCrossSection,
      };
    case "zoom":
      return {
        ...state,
        zoomValue: clampZoom(action.value),
      };
    default:
      return state;
  }
}
