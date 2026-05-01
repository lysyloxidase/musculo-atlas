import { describe, expect, it } from "vitest";
import {
  DEFAULT_ATLAS_STATE,
  LEVEL_ENTRY_ZOOM,
  atlasReducer,
  createAtlasStateFromSearch,
} from "../src/lib/atlasState";
import {
  CROSS_BRIDGE_CYCLE,
  THICK_FILAMENT_LENGTH_UM,
  VISIBLE_FILAMENT_BUDGET,
  calculateBandGeometry,
  estimateSarcomereFps,
  getCrossBridgeStep,
  getLengthTensionForce,
} from "../src/lib/sarcomere";
import { getZoomLevel } from "../src/lib/zoom";

describe("phase 4 myofibril and sarcomere geometry", () => {
  it("positions I/A/H/Z bands correctly at SL 2.4 um", () => {
    const bands = calculateBandGeometry(2.4, "type_I");

    expect(bands.sarcomereLengthUm).toBe(2.4);
    expect(bands.zLeftUm).toBe(-1.2);
    expect(bands.zRightUm).toBe(1.2);
    expect(bands.aBandWidthUm).toBe(1.65);
    expect(bands.iBandWidthUm).toBeCloseTo(0.75, 5);
    expect(bands.halfIbandWidthUm).toBeCloseTo(0.375, 5);
    expect(bands.hZoneWidthUm).toBeGreaterThan(0);
    expect(bands.zDiscThicknessUm).toBe(0.12);
  });

  it("keeps thick filament length fixed while sarcomere length changes", () => {
    const short = calculateBandGeometry(1.8, "type_IIx");
    const long = calculateBandGeometry(3.5, "type_IIx");

    expect(short.thickFilamentLengthUm).toBe(THICK_FILAMENT_LENGTH_UM);
    expect(long.thickFilamentLengthUm).toBe(THICK_FILAMENT_LENGTH_UM);
    expect(short.aBandWidthUm).toBe(long.aBandWidthUm);
  });

  it("computes I-band width as sarcomere length minus A-band width", () => {
    for (const length of [1.8, 2.0, 2.4, 3.0, 3.5]) {
      const bands = calculateBandGeometry(length, "type_IIa");

      expect(bands.iBandWidthUm).toBeCloseTo(length - bands.aBandWidthUm, 5);
    }
  });

  it("updates I-band, H-zone, and titin stretch through the sarcomere slider action", () => {
    const initial = calculateBandGeometry(
      DEFAULT_ATLAS_STATE.sarcomereLengthUm,
      "type_I",
    );
    const updatedState = atlasReducer(DEFAULT_ATLAS_STATE, {
      lengthUm: 3.0,
      type: "set_sarcomere_length",
    });
    const updated = calculateBandGeometry(
      updatedState.sarcomereLengthUm,
      "type_I",
    );

    expect(updated.iBandWidthUm).toBeGreaterThan(initial.iBandWidthUm);
    expect(updated.hZoneWidthUm).toBeGreaterThan(initial.hZoneWidthUm);
    expect(updated.titinExtensionUm).toBeGreaterThan(initial.titinExtensionUm);
  });

  it("advances from myofibril to sarcomere and filament to protein levels", () => {
    const sarcomereState = atlasReducer(DEFAULT_ATLAS_STATE, {
      sarcomereId: "sarcomere_1",
      type: "select_sarcomere",
    });
    const proteinState = atlasReducer(sarcomereState, {
      filamentId: "myosin_ii",
      type: "select_filament",
    });

    expect(sarcomereState.selectedNodeId).toBe("rectus_femoris_sarcomere");
    expect(getZoomLevel(sarcomereState.zoomValue)).toBe(8);
    expect(proteinState.selectedNodeId).toBe("myosin_ii");
    expect(proteinState.zoomValue).toBe(LEVEL_ENTRY_ZOOM[9]);
  });
});

describe("phase 4 contraction physiology", () => {
  it("matches the classical length-tension shape", () => {
    expect(getLengthTensionForce(1.8)).toBeLessThan(getLengthTensionForce(2.0));
    expect(getLengthTensionForce(2.0)).toBe(1);
    expect(getLengthTensionForce(2.2)).toBe(1);
    expect(getLengthTensionForce(3.0)).toBeLessThan(1);
    expect(getLengthTensionForce(3.5)).toBe(0);
  });

  it("defines a smooth five-step cross-bridge cycle with power-stroke sliding", () => {
    expect(CROSS_BRIDGE_CYCLE).toHaveLength(5);
    expect(getCrossBridgeStep(0).id).toBe("weak_attachment");
    expect(getCrossBridgeStep(1).leverArmDeg).toBeGreaterThan(60);
    expect(getCrossBridgeStep(1).slidingNm).toBeGreaterThanOrEqual(5);
    expect(getCrossBridgeStep(5).id).toBe("weak_attachment");
  });

  it("keeps visible filament rendering inside the 60fps instancing budget", () => {
    expect(VISIBLE_FILAMENT_BUDGET.thickFilaments).toBeGreaterThanOrEqual(50);
    expect(VISIBLE_FILAMENT_BUDGET.thinFilaments).toBeGreaterThanOrEqual(100);
    expect(VISIBLE_FILAMENT_BUDGET.titinFilaments).toBeGreaterThanOrEqual(30);
    expect(estimateSarcomereFps()).toBeGreaterThanOrEqual(60);
  });

  it("deep-links directly to Level 8 with slider and cross-bridge state", () => {
    const state = createAtlasStateFromSearch(
      "?zoom=0.76&node=rectus_femoris_sarcomere&sl=3.0&bridge=2",
    );

    expect(getZoomLevel(state.zoomValue)).toBe(8);
    expect(state.sarcomereLengthUm).toBe(3.0);
    expect(getCrossBridgeStep(state.crossBridgeStep).id).toBe("rigor");
  });
});
