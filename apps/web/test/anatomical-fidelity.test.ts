import { describe, expect, it } from "vitest";
import {
  ADULT_BODY_PROPORTIONS,
  allLevelsHaveOneToOneRules,
  getBodyHeightFromHeadUnits,
  getLevelStructureMap,
} from "../src/lib/anatomicalFidelity";
import type { ZoomLevel } from "../src/lib/types";

describe("anatomical atlas fidelity", () => {
  it("uses adult anatomical proportions for the Level 1 human figure", () => {
    expect(ADULT_BODY_PROPORTIONS.heightM).toBe(1.7);
    expect(ADULT_BODY_PROPORTIONS.headUnits).toBe(7.5);
    expect(getBodyHeightFromHeadUnits()).toBeCloseTo(0.226, 2);
    expect(ADULT_BODY_PROPORTIONS.shoulderWidthM).toBeGreaterThan(
      ADULT_BODY_PROPORTIONS.pelvisWidthM,
    );
  });

  it("defines a 1:1 structure rule for every semantic zoom level", () => {
    expect(allLevelsHaveOneToOneRules()).toBe(true);

    for (let level = 1; level <= 10; level += 1) {
      const mapping = getLevelStructureMap(level as ZoomLevel);

      expect(mapping.level).toBe(level);
      expect(mapping.visibleExamples.length).toBeGreaterThanOrEqual(3);
      expect(mapping.renderedStructureCount).toBeGreaterThanOrEqual(
        mapping.requiredStructureCount,
      );
    }
  });

  it("marks gross anatomy levels as named structures instead of generic blobs", () => {
    expect(getLevelStructureMap(1).visibleExamples).toContain("rib cage");
    expect(getLevelStructureMap(2).visibleExamples).toContain("skeleton");
    expect(getLevelStructureMap(3).visibleExamples).toContain("rectus femoris");
    expect(getLevelStructureMap(4).oneToOneRule).toContain("proximal tendon");
  });
});
