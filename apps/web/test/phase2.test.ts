import { describe, expect, it } from "vitest";
import {
  DEFAULT_ATLAS_STATE,
  LEVEL_ENTRY_ZOOM,
  atlasReducer,
} from "../src/lib/atlasState";
import {
  FULLY_DETAILED_MUSCLE_IDS,
  GROSS_LAYERS,
  MUSCLE_DATABASE,
  getGrossBreadcrumbLabels,
  getMuscleDetail,
  getMusclesForRegion,
  getPennationArrowCount,
  hasCompleteMuscleMetadata,
} from "../src/lib/grossAnatomy";
import {
  estimateGrossAnatomyFps,
  getGrossMesh,
  getLevelTwoLayerMesh,
  hasThreeBodyLods,
} from "../src/lib/meshManifest";
import { getZoomLevel } from "../src/lib/zoom";

describe("phase 2 mesh manifest", () => {
  it("defines a 60fps body mesh budget with 3 BodyParts3D LODs", () => {
    const body = getGrossMesh("body");

    expect(hasThreeBodyLods()).toBe(true);
    expect(body.lods.map((lod) => lod.triangles)).toEqual([50000, 10000, 2000]);
    expect(
      body.lods.every((lod) => estimateGrossAnatomyFps(lod.triangles) >= 60),
    ).toBe(true);
  });

  it("maps every level 2 layer to a loadable mesh manifest entry", () => {
    for (const layer of GROSS_LAYERS) {
      const mesh = getLevelTwoLayerMesh(layer.id);

      expect(mesh.level).toBe(2);
      expect(mesh.lods[0]?.path.endsWith(".gltf")).toBe(true);
    }
  });
});

describe("phase 2 interaction state", () => {
  it("clicking a muscle group loads the anterior thigh region", () => {
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      regionId: "anterior_thigh_compartment",
      type: "select_region",
    });

    expect(state.activeRegionId).toBe("anterior_thigh_compartment");
    expect(state.selectedNodeId).toBe("anterior_thigh_compartment");
    expect(getZoomLevel(state.zoomValue)).toBe(3);
  });

  it("clicking a muscle loads Level 4 metadata context", () => {
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      muscleId: "rectus_femoris",
      type: "select_muscle",
    });

    expect(state.selectedMuscleId).toBe("rectus_femoris");
    expect(state.selectedNodeId).toBe("rectus_femoris");
    expect(state.zoomValue).toBe(LEVEL_ENTRY_ZOOM[4]);
    expect(getZoomLevel(state.zoomValue)).toBe(4);
  });

  it("changes the Level 2 layer without disturbing selected region", () => {
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      layer: "connective",
      type: "select_layer",
    });

    expect(state.activeLayer).toBe("connective");
    expect(state.activeRegionId).toBe(DEFAULT_ATLAS_STATE.activeRegionId);
  });
});

describe("phase 2 muscle metadata", () => {
  it("keeps at least 50 muscles and 10 complete muscle records", () => {
    expect(MUSCLE_DATABASE.length).toBeGreaterThanOrEqual(50);
    expect(FULLY_DETAILED_MUSCLE_IDS.length).toBeGreaterThanOrEqual(10);

    for (const muscleId of FULLY_DETAILED_MUSCLE_IDS) {
      expect(hasCompleteMuscleMetadata(getMuscleDetail(muscleId))).toBe(true);
    }
  });

  it("shows all required fields for rectus femoris", () => {
    const rectus = getMuscleDetail("rectus_femoris");

    expect(rectus.origin).toContain("Anterior inferior iliac spine");
    expect(rectus.insertion).toContain("Tibial tuberosity");
    expect(rectus.innervation).toContain("Femoral nerve");
    expect(rectus.blood_supply).toContain("Lateral circumflex");
    expect(rectus.action).toContain("Knee extension");
    expect(rectus.opensim?.max_iso_force_N).toBe(1169);
    expect(rectus.fiber_type_pct).toEqual({ I: 35, IIa: 35, IIx: 30 });
  });

  it("provides anterior thigh muscles and visible pennation arrows for Level 4", () => {
    const anteriorThigh = getMusclesForRegion("anterior_thigh_compartment");

    expect(anteriorThigh.map((muscle) => muscle.id)).toEqual([
      "rectus_femoris",
      "vastus_lateralis",
      "vastus_medialis",
      "vastus_intermedius",
      "sartorius",
    ]);
    expect(getPennationArrowCount("rectus_femoris")).toBeGreaterThan(0);
  });

  it("uses gross anatomy breadcrumb labels for Level 1-4 navigation", () => {
    expect(getGrossBreadcrumbLabels("rectus_femoris")).toEqual([
      "Body",
      "Lower Limb",
      "Anterior Thigh",
      "Rectus femoris",
    ]);
  });
});
