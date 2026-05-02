import type { TissueSystemId } from "./connectiveTissue";
import type { GrossLayer } from "./grossAnatomy";
import { getMuscleDetail, resolveMuscleId } from "./grossAnatomy";
import { HIERARCHY_BY_ID } from "./hierarchy";
import type { FiberType } from "./microAnatomy";
import {
  type DomainId,
  type MolecularRenderMode,
  type ProteinId,
  type TroponinState,
  getDefaultDomainForProtein,
  getDomainStructure,
  isDomainId,
  isProteinId,
  parseMolecularRenderMode,
  parseTroponinState,
  resolveProteinIdFromFilament,
} from "./molecular";
import type { PhysiologyOverlayMode } from "./physiology";
import { getNextEccStepIndex, getPreviousEccStepIndex } from "./physiology";
import { clampSarcomereLength } from "./sarcomere";
import {
  LEVEL_ENTRY_ZOOM,
  type ZoomTransition,
  applyScrollZoom,
  createZoomTransition,
  getAdjacentLevelForDoubleClick,
  getAdjacentLevelForEscape,
  getBreadcrumbItems,
} from "./semanticZoom";
import type { ZoomLevel } from "./types";
import { getZoomLevel } from "./zoom";

export { LEVEL_ENTRY_ZOOM } from "./semanticZoom";

export type FiberStructureLayer = "nuclei" | "mitochondria" | "sr" | "tTubules";

export type SarcomereStructureLayer =
  | "thick"
  | "thin"
  | "titin"
  | "zDisc"
  | "mLine";

export type StructureVisibility<T extends string> = Record<T, boolean>;

export interface AtlasState {
  activeLayer: GrossLayer;
  activeRegionId: string;
  crossBridgeStep: number;
  eccStepIndex: number;
  fascicleCrossSection: boolean;
  fiberComparisonMode: boolean;
  fiberType: FiberType;
  fiberVisibility: StructureVisibility<FiberStructureLayer>;
  isAnimationPlaying: boolean;
  molecularRenderMode: MolecularRenderMode;
  physiologyOverlay: PhysiologyOverlayMode;
  sarcomereLengthUm: number;
  sarcomereVisibility: StructureVisibility<SarcomereStructureLayer>;
  selectedAtomId: string | null;
  selectedDomainId: DomainId;
  selectedFiberId: string;
  selectedMuscleId: string;
  selectedNodeId: string;
  selectedProteinId: ProteinId;
  selectedTissueSystem: TissueSystemId;
  troponinState: TroponinState;
  zoomValue: number;
  zoomTransition: ZoomTransition | null;
}

export type AtlasAction =
  | { type: "hydrate_from_search"; search: string }
  | { type: "zoom"; value: number; nowMs?: number }
  | { type: "semantic_scroll"; deltaY: number; fine?: boolean; nowMs?: number }
  | { type: "jump_level"; level: ZoomLevel; nowMs?: number }
  | { type: "zoom_out"; nowMs?: number }
  | { type: "double_click_selected"; nowMs?: number }
  | { type: "navigate_to_node"; nodeId: string; nowMs?: number }
  | { type: "select_body_region"; regionId: string; nowMs?: number }
  | { type: "select_layer"; layer: GrossLayer }
  | { type: "select_region"; regionId: string; nowMs?: number }
  | { type: "select_muscle"; muscleId: string; nowMs?: number }
  | { type: "select_muscle_belly"; muscleId: string; nowMs?: number }
  | { type: "select_fiber"; fiberId: string; nowMs?: number }
  | { type: "select_myofibril"; myofibrilId: string; nowMs?: number }
  | { type: "select_sarcomere"; sarcomereId: string; nowMs?: number }
  | { type: "select_filament"; filamentId: string; nowMs?: number }
  | { type: "select_protein"; proteinId: ProteinId; nowMs?: number }
  | { type: "select_domain"; domainId: DomainId; nowMs?: number }
  | { type: "select_atom"; atomId: string }
  | { type: "set_fiber_type"; fiberType: FiberType }
  | { type: "set_sarcomere_length"; lengthUm: number }
  | { type: "set_cross_bridge_step"; step: number }
  | { type: "set_ecc_step"; step: number }
  | { type: "next_ecc_step" }
  | { type: "previous_ecc_step" }
  | { type: "set_physiology_overlay"; overlay: PhysiologyOverlayMode }
  | { type: "toggle_fiber_comparison" }
  | { type: "select_tissue_system"; system: TissueSystemId }
  | { type: "set_molecular_render_mode"; mode: MolecularRenderMode }
  | { type: "set_troponin_state"; state: TroponinState }
  | { type: "toggle_animation" }
  | { type: "toggle_fiber_layer"; layer: FiberStructureLayer }
  | { type: "toggle_sarcomere_layer"; layer: SarcomereStructureLayer }
  | { type: "toggle_fascicle_cross_section" };

export const DEFAULT_ATLAS_STATE: AtlasState = {
  activeLayer: "skeleton",
  activeRegionId: "lower_limb",
  crossBridgeStep: 0,
  eccStepIndex: 0,
  fascicleCrossSection: true,
  fiberComparisonMode: false,
  fiberType: "type_I",
  fiberVisibility: {
    mitochondria: true,
    nuclei: true,
    sr: true,
    tTubules: true,
  },
  isAnimationPlaying: true,
  molecularRenderMode: "surface",
  physiologyOverlay: "ecc",
  sarcomereLengthUm: 2.4,
  sarcomereVisibility: {
    mLine: true,
    thick: true,
    thin: true,
    titin: true,
    zDisc: true,
  },
  selectedAtomId: null,
  selectedDomainId: "titin_ig_domain",
  selectedFiberId: "fiber_1",
  selectedMuscleId: "rectus_femoris",
  selectedNodeId: "body",
  selectedProteinId: "titin",
  selectedTissueSystem: "tendon",
  troponinState: "blocked",
  zoomValue: 0,
  zoomTransition: null,
};

export function createAtlasStateFromSearch(search: string): AtlasState {
  const params = new URLSearchParams(search);
  const zoom = Number(params.get("zoom"));
  const node = params.get("node");
  const muscle = params.get("muscle");
  const fiberType = params.get("fiberType") as FiberType | null;
  const sarcomereLengthUm = Number(params.get("sl"));
  const crossBridgeStep = Number(params.get("bridge"));
  const eccStepIndex = Number(params.get("ecc"));
  const protein = params.get("protein");
  const domain = params.get("domain");
  const atom = params.get("atom");
  const physiologyOverlay = parsePhysiologyOverlay(params.get("overlay"));
  const selectedTissueSystem = parseTissueSystem(params.get("tissue"));
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
    eccStepIndex: Number.isFinite(eccStepIndex)
      ? Math.max(0, Math.round(eccStepIndex))
      : DEFAULT_ATLAS_STATE.eccStepIndex,
    fiberComparisonMode: params.get("compare") === "fiber",
    fiberType:
      fiberType === "type_I" ||
      fiberType === "type_IIa" ||
      fiberType === "type_IIx"
        ? fiberType
        : DEFAULT_ATLAS_STATE.fiberType,
    molecularRenderMode:
      molecularRenderMode ?? DEFAULT_ATLAS_STATE.molecularRenderMode,
    physiologyOverlay:
      physiologyOverlay ?? DEFAULT_ATLAS_STATE.physiologyOverlay,
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
    selectedTissueSystem:
      selectedTissueSystem ?? DEFAULT_ATLAS_STATE.selectedTissueSystem,
    sarcomereLengthUm: Number.isFinite(sarcomereLengthUm)
      ? clampSarcomereLength(sarcomereLengthUm)
      : DEFAULT_ATLAS_STATE.sarcomereLengthUm,
    troponinState: troponinState ?? DEFAULT_ATLAS_STATE.troponinState,
    zoomValue: Number.isFinite(zoom)
      ? clampZoom(zoom)
      : DEFAULT_ATLAS_STATE.zoomValue,
    zoomTransition: null,
  };
}

function clampZoom(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function parsePhysiologyOverlay(
  value: string | null,
): PhysiologyOverlayMode | null {
  if (
    value === "ecc" ||
    value === "cross_bridge" ||
    value === "length_tension"
  ) {
    return value;
  }

  return null;
}

function parseTissueSystem(value: string | null): TissueSystemId | null {
  if (
    value === "tendon" ||
    value === "bone" ||
    value === "cartilage" ||
    value === "joint"
  ) {
    return value;
  }

  return null;
}

function withZoomTransition(
  state: AtlasState,
  nextState: AtlasState,
  nextZoom: number,
  nowMs?: number,
): AtlasState {
  const zoomValue = clampZoom(nextZoom);

  return {
    ...nextState,
    zoomTransition: createZoomTransition(
      state.zoomValue,
      zoomValue,
      getNowMs(nowMs),
    ),
    zoomValue,
  };
}

function getNowMs(nowMs?: number): number {
  if (typeof nowMs === "number") {
    return nowMs;
  }

  if (typeof performance !== "undefined") {
    return performance.now();
  }

  return Date.now();
}

function navigateToNode(
  state: AtlasState,
  nodeId: string,
  nowMs?: number,
): AtlasState {
  if (nodeId === "body") {
    return withZoomTransition(
      state,
      { ...state, selectedNodeId: "body" },
      LEVEL_ENTRY_ZOOM[1],
      nowMs,
    );
  }

  if (isProteinId(nodeId)) {
    return withZoomTransition(
      state,
      {
        ...state,
        selectedDomainId: getDefaultDomainForProtein(nodeId),
        selectedNodeId: nodeId,
        selectedProteinId: nodeId,
      },
      LEVEL_ENTRY_ZOOM[9],
      nowMs,
    );
  }

  if (isDomainId(nodeId)) {
    const domain = getDomainStructure(nodeId);

    return withZoomTransition(
      state,
      {
        ...state,
        selectedAtomId: null,
        selectedDomainId: nodeId,
        selectedNodeId: nodeId,
        selectedProteinId: domain.proteinId,
      },
      LEVEL_ENTRY_ZOOM[10],
      nowMs,
    );
  }

  const node = HIERARCHY_BY_ID.get(nodeId);

  if (node) {
    const nextState: AtlasState = {
      ...state,
      selectedNodeId: node.id,
    };

    if (node.level === 3) {
      nextState.activeRegionId = node.id;
    }

    if (node.level === 4) {
      nextState.selectedMuscleId = node.id;
    }

    return withZoomTransition(
      state,
      nextState,
      LEVEL_ENTRY_ZOOM[node.level],
      nowMs,
    );
  }

  const muscleId = resolveMuscleId(nodeId);

  try {
    getMuscleDetail(muscleId);

    return withZoomTransition(
      state,
      {
        ...state,
        selectedMuscleId: muscleId,
        selectedNodeId: muscleId,
      },
      LEVEL_ENTRY_ZOOM[4],
      nowMs,
    );
  } catch {
    return state;
  }
}

function zoomOut(state: AtlasState, nowMs?: number): AtlasState {
  const breadcrumb = getBreadcrumbItems(state.selectedNodeId);
  const previous = breadcrumb.at(-2);

  if (previous) {
    return navigateToNode(state, previous.nodeId, nowMs);
  }

  const targetLevel = getAdjacentLevelForEscape(getZoomLevel(state.zoomValue));

  return withZoomTransition(state, state, LEVEL_ENTRY_ZOOM[targetLevel], nowMs);
}

function doubleClickSelected(state: AtlasState, nowMs?: number): AtlasState {
  const level = getZoomLevel(state.zoomValue);

  if (level === 8) {
    return atlasReducer(state, {
      filamentId: "myosin_ii",
      nowMs,
      type: "select_filament",
    });
  }

  const targetLevel = getAdjacentLevelForDoubleClick(level);

  return withZoomTransition(state, state, LEVEL_ENTRY_ZOOM[targetLevel], nowMs);
}

export function atlasReducer(
  state: AtlasState,
  action: AtlasAction,
): AtlasState {
  switch (action.type) {
    case "hydrate_from_search":
      return createAtlasStateFromSearch(action.search);
    case "semantic_scroll": {
      const zoomValue = applyScrollZoom(
        state.zoomValue,
        action.deltaY,
        action.fine,
      );

      return withZoomTransition(state, state, zoomValue, action.nowMs);
    }
    case "jump_level":
      return withZoomTransition(
        state,
        state,
        LEVEL_ENTRY_ZOOM[action.level],
        action.nowMs,
      );
    case "zoom_out":
      return zoomOut(state, action.nowMs);
    case "double_click_selected":
      return doubleClickSelected(state, action.nowMs);
    case "navigate_to_node":
      return navigateToNode(state, action.nodeId, action.nowMs);
    case "select_body_region":
      return withZoomTransition(
        state,
        {
          ...state,
          activeRegionId: action.regionId,
          selectedNodeId: "musculoskeletal_system",
        },
        LEVEL_ENTRY_ZOOM[2],
        action.nowMs,
      );
    case "select_layer":
      return {
        ...state,
        activeLayer: action.layer,
      };
    case "select_muscle":
      return withZoomTransition(
        state,
        {
          ...state,
          selectedMuscleId: action.muscleId,
          selectedNodeId: action.muscleId,
        },
        LEVEL_ENTRY_ZOOM[4],
        action.nowMs,
      );
    case "select_muscle_belly":
      return withZoomTransition(
        state,
        {
          ...state,
          selectedMuscleId: action.muscleId,
          selectedNodeId: `${action.muscleId}_fascicle`,
        },
        LEVEL_ENTRY_ZOOM[5],
        action.nowMs,
      );
    case "select_fiber":
      return withZoomTransition(
        state,
        {
          ...state,
          selectedFiberId: action.fiberId,
          selectedNodeId: `${state.selectedMuscleId}_fiber`,
        },
        LEVEL_ENTRY_ZOOM[6],
        action.nowMs,
      );
    case "select_myofibril":
      return withZoomTransition(
        state,
        {
          ...state,
          selectedNodeId: `${state.selectedMuscleId}_myofibril`,
        },
        LEVEL_ENTRY_ZOOM[7],
        action.nowMs,
      );
    case "select_sarcomere":
      return withZoomTransition(
        state,
        {
          ...state,
          selectedNodeId: "rectus_femoris_sarcomere",
        },
        LEVEL_ENTRY_ZOOM[8],
        action.nowMs,
      );
    case "select_filament": {
      const proteinId = resolveProteinIdFromFilament(action.filamentId);

      return withZoomTransition(
        state,
        {
          ...state,
          selectedDomainId: getDefaultDomainForProtein(proteinId),
          selectedNodeId: proteinId,
          selectedProteinId: proteinId,
        },
        LEVEL_ENTRY_ZOOM[9],
        action.nowMs,
      );
    }
    case "select_protein":
      return withZoomTransition(
        state,
        {
          ...state,
          selectedDomainId: getDefaultDomainForProtein(action.proteinId),
          selectedNodeId: action.proteinId,
          selectedProteinId: action.proteinId,
        },
        LEVEL_ENTRY_ZOOM[9],
        action.nowMs,
      );
    case "select_domain":
      return withZoomTransition(
        state,
        {
          ...state,
          selectedAtomId: null,
          selectedDomainId: action.domainId,
          selectedNodeId: action.domainId,
          selectedProteinId: getDomainStructure(action.domainId).proteinId,
        },
        LEVEL_ENTRY_ZOOM[10],
        action.nowMs,
      );
    case "select_atom":
      return {
        ...state,
        selectedAtomId: action.atomId,
      };
    case "select_region":
      return withZoomTransition(
        state,
        {
          ...state,
          activeRegionId: action.regionId,
          selectedNodeId: action.regionId,
        },
        LEVEL_ENTRY_ZOOM[3],
        action.nowMs,
      );
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
    case "set_ecc_step":
      return {
        ...state,
        eccStepIndex: Math.max(0, Math.round(action.step)),
        physiologyOverlay: "ecc",
      };
    case "next_ecc_step":
      return {
        ...state,
        eccStepIndex: getNextEccStepIndex(state.eccStepIndex),
        physiologyOverlay: "ecc",
      };
    case "previous_ecc_step":
      return {
        ...state,
        eccStepIndex: getPreviousEccStepIndex(state.eccStepIndex),
        physiologyOverlay: "ecc",
      };
    case "set_physiology_overlay":
      return {
        ...state,
        physiologyOverlay: action.overlay,
      };
    case "toggle_fiber_comparison":
      return {
        ...state,
        fiberComparisonMode: !state.fiberComparisonMode,
      };
    case "select_tissue_system":
      return {
        ...state,
        selectedTissueSystem: action.system,
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
    case "toggle_animation":
      return {
        ...state,
        isAnimationPlaying: !state.isAnimationPlaying,
      };
    case "toggle_fiber_layer":
      return {
        ...state,
        fiberVisibility: {
          ...state.fiberVisibility,
          [action.layer]: !state.fiberVisibility[action.layer],
        },
      };
    case "toggle_sarcomere_layer":
      return {
        ...state,
        sarcomereVisibility: {
          ...state.sarcomereVisibility,
          [action.layer]: !state.sarcomereVisibility[action.layer],
        },
      };
    case "zoom":
      return withZoomTransition(
        state,
        state,
        clampZoom(action.value),
        action.nowMs,
      );
    default:
      return state;
  }
}
