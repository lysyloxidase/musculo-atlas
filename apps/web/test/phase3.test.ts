import { describe, expect, it } from "vitest";
import {
  DEFAULT_ATLAS_STATE,
  LEVEL_ENTRY_ZOOM,
  atlasReducer,
  createAtlasStateFromSearch,
} from "../src/lib/atlasState";
import {
  DEFAULT_FASCICLE_CONFIG,
  FIBER_TYPE_PROFILES,
  T_TUBULE_LUMEN_NM,
  T_TUBULE_SPACING_UM,
  buildFascicleConfig,
  estimateInstancedLevelFps,
  generateHoneycombFibers,
  getFiberOrganelleCounts,
  getLevelFiveInstanceBudget,
  getMitochondriaDensityRank,
  hasWavyPerimysium,
} from "../src/lib/microAnatomy";
import { getZoomLevel } from "../src/lib/zoom";

describe("phase 3 fascicle procedural model", () => {
  it("generates a honeycomb cross-section with 10-100 visible fibers", () => {
    const config = buildFascicleConfig({ fiberCount: 100 });
    const fibers = generateHoneycombFibers(config);

    expect(fibers.length).toBe(100);
    expect(fibers.length).toBeGreaterThanOrEqual(10);
    expect(fibers.length).toBeLessThanOrEqual(100);
    expect(
      new Set(
        fibers.map((fiber) => `${fiber.x.toFixed(3)}:${fiber.y.toFixed(3)}`),
      ).size,
    ).toBe(fibers.length);
  });

  it("keeps the perimysium as a two-layer crossed wavy collagen pattern", () => {
    expect(hasWavyPerimysium(DEFAULT_FASCICLE_CONFIG)).toBe(true);
    expect(DEFAULT_FASCICLE_CONFIG.perimysiumLayers).toBe(2);
    expect(DEFAULT_FASCICLE_CONFIG.collagenPattern).toBe("crossed_wavy");
  });

  it("keeps Level 5 instanced rendering inside a 60fps budget", () => {
    const config = buildFascicleConfig({ fiberCount: 100 });
    const budget = getLevelFiveInstanceBudget(config);

    expect(budget).toBeGreaterThanOrEqual(100);
    expect(estimateInstancedLevelFps(budget)).toBeGreaterThanOrEqual(60);
  });

  it("exposes cross-section mode and click-through transition to Level 6", () => {
    const crossSectionState = atlasReducer(DEFAULT_ATLAS_STATE, {
      type: "toggle_fascicle_cross_section",
    });

    expect(DEFAULT_ATLAS_STATE.fascicleCrossSection).toBe(true);
    expect(crossSectionState.fascicleCrossSection).toBe(false);

    const fiberState = atlasReducer(DEFAULT_ATLAS_STATE, {
      fiberId: "fiber_12",
      type: "select_fiber",
    });

    expect(fiberState.selectedFiberId).toBe("fiber_12");
    expect(fiberState.zoomValue).toBe(LEVEL_ENTRY_ZOOM[6]);
    expect(getZoomLevel(fiberState.zoomValue)).toBe(6);
  });

  it("can deep-link directly to fascicle and fiber review states", () => {
    const state = createAtlasStateFromSearch(
      "?zoom=0.56&node=rectus_femoris_fiber&muscle=rectus_femoris&fiberType=type_IIx",
    );

    expect(state.selectedNodeId).toBe("rectus_femoris_fiber");
    expect(state.selectedMuscleId).toBe("rectus_femoris");
    expect(state.fiberType).toBe("type_IIx");
    expect(getZoomLevel(state.zoomValue)).toBe(6);
  });
});

describe("phase 3 muscle fiber organelles", () => {
  it("defines sarcolemma, nuclei, myofibrils, T-tubules, and mitochondria counts", () => {
    const counts = getFiberOrganelleCounts("type_I");

    expect(counts.nuclei).toBeGreaterThan(0);
    expect(counts.myofibrils).toBe(50);
    expect(counts.tTubuleDiscs).toBeGreaterThan(10);
    expect(counts.mitochondria).toBeGreaterThan(0);
    expect(T_TUBULE_SPACING_UM).toBe(1.2);
    expect(T_TUBULE_LUMEN_NM).toEqual([30, 40]);
  });

  it("matches mitochondrial density to fiber type", () => {
    expect(getMitochondriaDensityRank()).toEqual([
      "type_I",
      "type_IIa",
      "type_IIx",
    ]);
    expect(FIBER_TYPE_PROFILES.type_I.mitochondriaRendered).toBeGreaterThan(
      FIBER_TYPE_PROFILES.type_IIx.mitochondriaRendered,
    );
  });

  it("fiber type toggle changes organelle composition", () => {
    const typeIState = atlasReducer(DEFAULT_ATLAS_STATE, {
      fiberType: "type_I",
      type: "set_fiber_type",
    });
    const typeIIxState = atlasReducer(typeIState, {
      fiberType: "type_IIx",
      type: "set_fiber_type",
    });
    const typeICounts = getFiberOrganelleCounts(typeIState.fiberType);
    const typeIIxCounts = getFiberOrganelleCounts(typeIIxState.fiberType);

    expect(typeICounts.mitochondria).toBeGreaterThan(
      typeIIxCounts.mitochondria,
    );
    expect(typeIIxCounts.glycogenParticles).toBeGreaterThan(
      typeICounts.glycogenParticles,
    );
  });

  it("clicking a myofibril advances to Level 7", () => {
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      myofibrilId: "myofibril_1",
      type: "select_myofibril",
    });

    expect(state.selectedNodeId).toBe("rectus_femoris_myofibril");
    expect(getZoomLevel(state.zoomValue)).toBe(7);
  });
});
