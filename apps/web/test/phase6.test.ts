import { describe, expect, it } from "vitest";
import {
  DEFAULT_ATLAS_STATE,
  LEVEL_ENTRY_ZOOM,
  atlasReducer,
} from "../src/lib/atlasState";
import {
  TRANSITION_DURATION_MS,
  applyScrollZoom,
  createZoomTransition,
  estimateTransitionFps,
  getMinimapPosition,
  getPreloadLevels,
  getRenderLevelSlots,
  getScaleBarModel,
  resolveSearchResult,
} from "../src/lib/semanticZoom";
import { getZoomLevel } from "../src/lib/zoom";

describe("phase 6 continuous semantic zoom", () => {
  it("scrolls continuously from Level 1 to Level 10 without level jumps", () => {
    let zoomValue = 0;
    let previousLevel = getZoomLevel(zoomValue);

    for (let index = 0; index < 50; index += 1) {
      zoomValue = applyScrollZoom(zoomValue, 20);
      const level = getZoomLevel(zoomValue);

      expect(level).toBeGreaterThanOrEqual(previousLevel);
      expect(level - previousLevel).toBeLessThanOrEqual(1);
      previousLevel = level;
    }

    expect(zoomValue).toBe(1);
    expect(previousLevel).toBe(10);
  });

  it("crossfades both adjacent levels during the 300ms transition", () => {
    const transition = createZoomTransition(0.09, 0.11, 100);
    const slots = getRenderLevelSlots(0.11, transition, 250);

    expect(transition?.durationMs).toBe(TRANSITION_DURATION_MS);
    expect(slots.map((slot) => slot.level)).toEqual([1, 2]);
    expect(slots.every((slot) => slot.opacity > 0 && slot.opacity < 1)).toBe(
      true,
    );
  });

  it("clicking Body in the breadcrumb from Level 8 zooms all the way out", () => {
    const sarcomereState = atlasReducer(DEFAULT_ATLAS_STATE, {
      nodeId: "rectus_femoris_sarcomere",
      nowMs: 0,
      type: "navigate_to_node",
    });
    const bodyState = atlasReducer(sarcomereState, {
      nodeId: "body",
      nowMs: 100,
      type: "navigate_to_node",
    });

    expect(getZoomLevel(sarcomereState.zoomValue)).toBe(8);
    expect(bodyState.selectedNodeId).toBe("body");
    expect(bodyState.zoomValue).toBe(LEVEL_ENTRY_ZOOM[1]);
  });

  it("uses the correct scale-bar units at every semantic level", () => {
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[1]).unit).toBe("m");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[2]).unit).toBe("m");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[3]).unit).toBe("cm");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[4]).unit).toBe("cm");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[5]).unit).toBe("mm");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[6]).unit).toBe("um");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[7]).unit).toBe("um");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[8]).unit).toBe("um");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[9]).unit).toBe("nm");
    expect(getScaleBarModel(LEVEL_ENTRY_ZOOM[10]).unit).toBe("A");
  });

  it("searching titin navigates to the Level 9 titin protein view", () => {
    const result = resolveSearchResult("titin");
    const state = atlasReducer(DEFAULT_ATLAS_STATE, {
      nodeId: result?.id ?? "",
      nowMs: 0,
      type: "navigate_to_node",
    });

    expect(result?.id).toBe("titin");
    expect(state.selectedNodeId).toBe("titin");
    expect(getZoomLevel(state.zoomValue)).toBe(9);
  });

  it("double-clicking the Level 8 thick-filament context enters Level 9 myosin", () => {
    const sarcomereState = atlasReducer(DEFAULT_ATLAS_STATE, {
      nodeId: "rectus_femoris_sarcomere",
      nowMs: 0,
      type: "navigate_to_node",
    });
    const myosinState = atlasReducer(sarcomereState, {
      nowMs: 100,
      type: "double_click_selected",
    });

    expect(myosinState.selectedNodeId).toBe("myosin_ii");
    expect(myosinState.selectedProteinId).toBe("myosin_ii");
    expect(getZoomLevel(myosinState.zoomValue)).toBe(9);
  });

  it("Escape from Level 9 returns to the Level 8 sarcomere", () => {
    const proteinState = atlasReducer(DEFAULT_ATLAS_STATE, {
      nodeId: "myosin_ii",
      nowMs: 0,
      type: "navigate_to_node",
    });
    const sarcomereState = atlasReducer(proteinState, {
      nowMs: 100,
      type: "zoom_out",
    });

    expect(getZoomLevel(proteinState.zoomValue)).toBe(9);
    expect(sarcomereState.selectedNodeId).toBe("rectus_femoris_sarcomere");
    expect(getZoomLevel(sarcomereState.zoomValue)).toBe(8);
  });

  it("keeps transition rendering within the 60fps target", () => {
    expect(estimateTransitionFps(2)).toBeGreaterThanOrEqual(60);
  });

  it("preloads the active level and +/-1 adjacent levels", () => {
    expect(getPreloadLevels(5)).toEqual([4, 5, 6]);
    expect(getPreloadLevels(1)).toEqual([1, 2]);
    expect(getPreloadLevels(10)).toEqual([9, 10]);
  });

  it("maps the minimap indicator to the continuous zoom position", () => {
    expect(getMinimapPosition(0)).toBe(0);
    expect(getMinimapPosition(0.5)).toBe(50);
    expect(getMinimapPosition(1)).toBe(100);
  });
});
