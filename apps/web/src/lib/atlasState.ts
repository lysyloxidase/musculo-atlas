import type { GrossLayer } from "./grossAnatomy";
import type { FiberType } from "./microAnatomy";
import {
  type DomainId,
  type MolecularRenderMode,
  type ProteinId,
  type TroponinState,
  getDefaultDomainForProtein,
  getDomainStructure,
  isDomainId,
  parseMolecularRenderMode,
  parseTroponinState,
  resolveProteinIdFromFilament,
} from "./molecular";
import { clampSarcomereLength } from "./sarcomere";
import type { ZoomLevel } from "./types";

export interface AtlasState {
  activeLayer: GrossLayer;
  activeRegionId: string;
  crossBridgeStep: number;
  fascicleCrossSection: boolean;
  fiberType: FiberType;
  molecularRenderMode: MolecularRenderMode;
  sarcomereLengthUm: number;
  selectedAtomId: string | null;
  selectedDomainId: DomainId;
  selectedFiberId: string;
  selectedMuscleId: string;
  selectedNodeId: string;
  selectedProteinId: ProteinId;
  troponinState: TroponinState;
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
  | { type: "select_sarcomere"; sarcomereId: string }
  | { type: "select_filament"; filamentId: string }
  | { type: "select_protein"; proteinId: ProteinId }
  | { type: "select_domain"; domainId: DomainId }
  | { type: "select_atom"; atomId: string }
  | { type: "set_fiber_type"; fiberType: FiberType }
  | { type: "set_sarcomere_length"; lengthUm: number }
  | { type: "set_cross_bridge_step"; step: number }
  | { type: "set_molecular_render_mode"; mode: MolecularRenderMode }
  | { type: "set_troponin_state"; state: TroponinState }
  | { type: "toggle_fascicle_cross_section" };

export const DEFAULT_ATLAS_STATE: AtlasState = {
  activeLayer: "skeleton",
  activeRegionId: "lower_limb",
  crossBridgeStep: 0,
  fascicleCrossSection: true,
  fiberType: "type_I",
  molecularRenderMode: "surface",
  sarcomereLengthUm: 2.4,
  selectedAtomId: null,
  selectedDomainId: "titin_ig_domain",
  selectedFiberId: "fiber_1",
  selectedMuscleId: "rectus_femoris",
  selectedNodeId: "body",
  selectedProteinId: "titin",
  troponinState: "blocked",
  zoomValue: 0,
};

export function createAtlasStateFromSearch(search: string): AtlasState {
  const params = new URLSearchParams(search);
  const zoom = Number(params.get("zoom"));
  const node = params.get("node");
  const muscle = params.get("muscle");
  const fiberType = params.get("fiberType") as FiberType | null;
  const sarcomereLengthUm = Number(params.get("sl"));
  const crossBridgeStep = Number(params.get("bridge"));
  const protein = params.get("protein");
  const domain = params.get("domain");
  const atom = params.get("atom");
  const molecularRenderMode = parseMolecularRenderMode(params.get("mode"));
  const troponinState = parseTroponinState(params.get("troponin"));
  const selectedProteinId = protein
    ? resolveProteinIdFromFilament(protein)
    : DEFAULT_ATLAS_STATE.selectedProteinId;
  const selectedDomainId =
    domain && isDomainId(domain)
      ? domain
      : getDefaultDomainForProtein(selectedProteinId);

  return {
    ...DEFAULT_ATLAS_STATE,
    crossBridgeStep: Number.isFinite(crossBridgeStep)
      ? Math.max(0, Math.round(crossBridgeStep))
      : DEFAULT_ATLAS_STATE.crossBridgeStep,
    fiberType:
      fiberType === "type_I" ||
      fiberType === "type_IIa" ||
      fiberType === "type_IIx"
        ? fiberType
        : DEFAULT_ATLAS_STATE.fiberType,
    molecularRenderMode:
      molecularRenderMode ?? DEFAULT_ATLAS_STATE.molecularRenderMode,
    selectedAtomId: atom ?? DEFAULT_ATLAS_STATE.selectedAtomId,
    selectedDomainId,
    selectedMuscleId: muscle ?? DEFAULT_ATLAS_STATE.selectedMuscleId,
    selectedNodeId:
      node ??
      (domain && isDomainId(domain)
        ? domain
        : protein
          ? selectedProteinId
          : DEFAULT_ATLAS_STATE.selectedNodeId),
    selectedProteinId,
    sarcomereLengthUm: Number.isFinite(sarcomereLengthUm)
      ? clampSarcomereLength(sarcomereLengthUm)
      : DEFAULT_ATLAS_STATE.sarcomereLengthUm,
    troponinState: troponinState ?? DEFAULT_ATLAS_STATE.troponinState,
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
    case "select_sarcomere":
      return {
        ...state,
        selectedNodeId: "rectus_femoris_sarcomere",
        zoomValue: LEVEL_ENTRY_ZOOM[8],
      };
    case "select_filament": {
      const proteinId = resolveProteinIdFromFilament(action.filamentId);

      return {
        ...state,
        selectedDomainId: getDefaultDomainForProtein(proteinId),
        selectedNodeId: proteinId,
        selectedProteinId: proteinId,
        zoomValue: LEVEL_ENTRY_ZOOM[9],
      };
    }
    case "select_protein":
      return {
        ...state,
        selectedDomainId: getDefaultDomainForProtein(action.proteinId),
        selectedNodeId: action.proteinId,
        selectedProteinId: action.proteinId,
        zoomValue: LEVEL_ENTRY_ZOOM[9],
      };
    case "select_domain":
      return {
        ...state,
        selectedAtomId: null,
        selectedDomainId: action.domainId,
        selectedNodeId: action.domainId,
        selectedProteinId: getDomainStructure(action.domainId).proteinId,
        zoomValue: LEVEL_ENTRY_ZOOM[10],
      };
    case "select_atom":
      return {
        ...state,
        selectedAtomId: action.atomId,
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
    case "set_sarcomere_length":
      return {
        ...state,
        sarcomereLengthUm: clampSarcomereLength(action.lengthUm),
      };
    case "set_cross_bridge_step":
      return {
        ...state,
        crossBridgeStep: Math.max(0, Math.round(action.step)),
      };
    case "set_molecular_render_mode":
      return {
        ...state,
        molecularRenderMode: action.mode,
      };
    case "set_troponin_state":
      return {
        ...state,
        troponinState: action.state,
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
