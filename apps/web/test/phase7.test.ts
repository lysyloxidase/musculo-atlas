import { describe, expect, it } from "vitest";
import {
  DEFAULT_ATLAS_STATE,
  LEVEL_ENTRY_ZOOM,
  atlasReducer,
  createAtlasStateFromSearch,
} from "../src/lib/atlasState";
import {
  BONE_LEVELS,
  CARTILAGE_ZONES,
  SYNOVIAL_JOINT_DETAIL,
  TENDON_LEVELS,
  estimateTissueSystemFps,
  getOsteonLevel,
  getTendonZoomPath,
  hasCartilageTidemark,
  hasTendonDBanding,
} from "../src/lib/connectiveTissue";
import {
  getFiberOrganelleCounts,
  getMitochondriaDensityRank,
} from "../src/lib/microAnatomy";
import { getPdbLoadPlan } from "../src/lib/molecular";
import {
  CROSS_BRIDGE_BIOCHEMISTRY,
  ECC_STEPS,
  FIBER_TYPE_COMPARISON,
  compareFiberTypeOrganelles,
  getCrossBridgeBiochemistryStep,
  getEccStep,
  getLengthTensionPoint,
} from "../src/lib/physiology";
import {
  ACCESSIBILITY_FEATURES,
  PERFORMANCE_TARGETS,
  RELEASE_BREADCRUMB_TRAIL,
  allPerformanceTargetsPass,
  getInitialBundleTargetMb,
} from "../src/lib/production";
import {
  applyScrollZoom,
  getBreadcrumbItems,
  getPreloadLevels,
} from "../src/lib/semanticZoom";
import { getZoomLevel } from "../src/lib/zoom";

describe("phase 7 excitation-contraction coupling overlays", () => {
  it("plays all 11 ECC steps sequentially with named structures", () => {
    expect(ECC_STEPS).toHaveLength(11);

    for (let index = 0; index < ECC_STEPS.length; index += 1) {
      expect(getEccStep(index).index).toBe(index + 1);
      expect(getEccStep(index).structureTarget.length).toBeGreaterThan(3);
    }

    let state = DEFAULT_ATLAS_STATE;
    for (let index = 0; index < ECC_STEPS.length; index += 1) {
      state = atlasReducer(state, { type: "next_ecc_step" });
    }

    expect(state.eccStepIndex).toBe(DEFAULT_ATLAS_STATE.eccStepIndex);
  });

  it("maps cross-bridge cycle states to biochemistry labels", () => {
    expect(CROSS_BRIDGE_BIOCHEMISTRY).toHaveLength(5);
    expect(getCrossBridgeBiochemistryStep(0).chemistryLabel).toContain(
      "M.ADP.Pi",
    );
    expect(getCrossBridgeBiochemistryStep(1).chemistryLabel).toContain("Pi");
    expect(getCrossBridgeBiochemistryStep(2).chemistryLabel).toContain("ADP");
    expect(getCrossBridgeBiochemistryStep(3).chemistryLabel).toContain("ATP");
    expect(getCrossBridgeBiochemistryStep(4).chemistryLabel).toContain(
      "hydrolysis",
    );
  });

  it("synchronizes length-tension chart points with the sarcomere slider", () => {
    const short = getLengthTensionPoint(1.8);
    const plateau = getLengthTensionPoint(2.1);
    const long = getLengthTensionPoint(3.2);
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      lengthUm: 3.2,
      type: "set_sarcomere_length",
    });

    expect(short.limb).toBe("ascending");
    expect(plateau.limb).toBe("plateau");
    expect(long.limb).toBe("descending");
    expect(long.passiveTitinForce).toBeGreaterThan(short.passiveTitinForce);
    expect(getLengthTensionPoint(state.sarcomereLengthUm).xPct).toBeCloseTo(
      long.xPct,
      5,
    );
  });
});

describe("phase 7 connective tissue hierarchy", () => {
  it("defines all six tendon sub-levels from tropocollagen back to tendon", () => {
    const microToMacro = getTendonZoomPath("micro_to_macro");

    expect(TENDON_LEVELS).toHaveLength(6);
    expect(microToMacro[0].id).toBe("T6");
    expect(microToMacro.at(-1)?.id).toBe("T1");
    expect(hasTendonDBanding()).toBe(true);
    expect(TENDON_LEVELS.find((level) => level.id === "T4")?.dBandingNm).toBe(
      67,
    );
    expect(
      TENDON_LEVELS.find((level) => level.id === "T3")?.renderFeature,
    ).toContain("crimp");
  });

  it("renders bone as osteon, lamellae, mineralized collagen, and crystal levels", () => {
    const osteon = getOsteonLevel();

    expect(BONE_LEVELS).toHaveLength(5);
    expect(osteon.id).toBe("B2");
    expect(osteon.diameterRange).toEqual([200, 350]);
    expect(osteon.lamellaeCount).toEqual([8, 15]);
    expect(osteon.renderFeature).toContain("Haversian canal");
    expect(BONE_LEVELS[3].mineral).toContain("Ca10(PO4)6(OH)2");
  });

  it("models cartilage zones, tidemark, calcified zone, and synovial joint fluid", () => {
    expect(CARTILAGE_ZONES.map((zone) => zone.id)).toEqual([
      "superficial",
      "middle",
      "deep",
      "tidemark",
      "calcified",
    ]);
    expect(hasCartilageTidemark()).toBe(true);
    expect(SYNOVIAL_JOINT_DETAIL.synovialFluid).toContain("hyaluronic acid");
    expect(SYNOVIAL_JOINT_DETAIL.synovialFluid).toContain("lubricin");
  });
});

describe("phase 7 fiber type comparison and release gates", () => {
  it("changes organelle composition across fiber types", () => {
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      type: "toggle_fiber_comparison",
    });
    const typeI = getFiberOrganelleCounts("type_I");
    const typeIIx = getFiberOrganelleCounts("type_IIx");

    expect(state.fiberComparisonMode).toBe(true);
    expect(getMitochondriaDensityRank()).toEqual([
      "type_I",
      "type_IIa",
      "type_IIx",
    ]);
    expect(compareFiberTypeOrganelles("type_I", "type_IIx")).toBeGreaterThan(0);
    expect(typeIIx.glycogenParticles).toBeGreaterThan(typeI.glycogenParticles);
    expect(FIBER_TYPE_COMPARISON.map((profile) => profile.myosinGene)).toEqual([
      "MYH7",
      "MYH2",
      "MYH1",
    ]);
  });

  it("supports a continuous Level 1 to Level 10 session", () => {
    let zoomValue = LEVEL_ENTRY_ZOOM[1];

    while (zoomValue < 1) {
      zoomValue = applyScrollZoom(zoomValue, 20);
    }

    expect(getZoomLevel(zoomValue)).toBe(10);
    expect(getPreloadLevels(9)).toEqual([8, 9, 10]);
  });

  it("keeps the release breadcrumb from body to atomically selected S1 domain", () => {
    const trail = getBreadcrumbItems("myosin_s1_motor").map(
      (item) => item.label,
    );

    expect(trail).toContain("Body");
    expect(trail).toContain("Anterior Thigh");
    expect(trail).toContain("Fascicle");
    expect(trail).toContain("Fiber");
    expect(trail).toContain("Myofibril");
    expect(trail).toContain("Sarcomere");
    expect(trail).toContain("Myosin II");
    expect(trail.at(-1)).toContain("S1");
    expect(RELEASE_BREADCRUMB_TRAIL).toEqual([
      "Body",
      "Thigh",
      "Quad",
      "Fascicle",
      "Fiber",
      "Myofibril",
      "Sarcomere",
      "Myosin",
      "S1 domain",
      "Atom",
    ]);
  });

  it("loads all canonical PDB structures and honors production budgets", () => {
    expect(getPdbLoadPlan().length).toBeGreaterThanOrEqual(15);
    expect(getInitialBundleTargetMb()).toBeLessThanOrEqual(5);
    expect(allPerformanceTargetsPass()).toBe(true);
    expect(PERFORMANCE_TARGETS.every((target) => target.passes)).toBe(true);
    expect(ACCESSIBILITY_FEATURES.length).toBeGreaterThanOrEqual(5);
    expect(estimateTissueSystemFps("tendon")).toBeGreaterThanOrEqual(60);
  });

  it("deep-links Phase 7 overlay state", () => {
    const state = createAtlasStateFromSearch(
      "?zoom=0.56&node=rectus_femoris_fiber&ecc=6&overlay=ecc&compare=fiber&tissue=bone",
    );

    expect(getZoomLevel(state.zoomValue)).toBe(6);
    expect(state.eccStepIndex).toBe(6);
    expect(state.physiologyOverlay).toBe("ecc");
    expect(state.fiberComparisonMode).toBe(true);
    expect(state.selectedTissueSystem).toBe("bone");
  });
});
