import { describe, expect, it } from "vitest";
import muscles from "../src/data/muscles.json";
import {
  HIERARCHY_BY_ID,
  HIERARCHY_NODES,
  REQUIRED_PHASE_ONE_TRAVERSAL,
  findPath,
  isDescendant,
} from "../src/lib/hierarchy";
import { CANONICAL_PDB_IDS } from "../src/lib/proteins";
import { getZoomLevel } from "../src/lib/zoom";

const requiredPdbIds = [
  "2MYS",
  "5N69",
  "8G4L",
  "1BR1",
  "3I5G",
  "3MFP",
  "1ATN",
  "6KN8",
  "1TIT",
  "1TIU",
  "3B43",
  "1YA5",
  "5JLH",
  "5NOG",
  "5NOL",
  "6KLN",
  "7QIM",
  "4D1E",
  "1SU4",
  "3TLM",
  "5T15",
  "7M6L",
];

describe("phase 1 hierarchy", () => {
  it("traverses Body -> rectus_femoris -> fascicle -> sarcomere -> titin -> Ig domain", () => {
    for (
      let index = 0;
      index < REQUIRED_PHASE_ONE_TRAVERSAL.length - 1;
      index += 1
    ) {
      const current = REQUIRED_PHASE_ONE_TRAVERSAL[index];
      const next = REQUIRED_PHASE_ONE_TRAVERSAL[index + 1];

      expect(isDescendant(current, next)).toBe(true);
    }

    const fullPath = findPath("body", "titin_ig_domain");
    expect(fullPath?.map((node) => node.id)).toEqual([
      "body",
      "musculoskeletal_system",
      "lower_limb",
      "thigh_region",
      "anterior_thigh_compartment",
      "rectus_femoris",
      "rectus_femoris_fascicle",
      "rectus_femoris_fiber",
      "rectus_femoris_myofibril",
      "rectus_femoris_sarcomere",
      "titin",
      "titin_ig_domain",
    ]);
  });

  it("requires dimensions and source citations for every hierarchy node", () => {
    for (const node of HIERARCHY_NODES) {
      expect(node.dimensions.scale_meters).toBeGreaterThan(0);
      expect(node.dimensions.source.trim().length).toBeGreaterThan(8);

      for (const childId of node.children_ids) {
        const child = HIERARCHY_BY_ID.get(childId);
        expect(child?.parent_id).toBe(node.id);
      }
    }
  });
});

describe("phase 1 zoom math", () => {
  it("maps canonical zoom values to semantic levels", () => {
    expect(getZoomLevel(0)).toBe(1);
    expect(getZoomLevel(0.5)).toBe(5);
    expect(getZoomLevel(1)).toBe(10);
  });
});

describe("phase 1 catalogs", () => {
  it("contains at least 50 muscles with architecture and innervation", () => {
    expect(muscles.length).toBeGreaterThanOrEqual(50);

    for (const muscle of muscles) {
      expect(muscle.fiber_length_cm).toBeGreaterThan(0);
      expect(muscle.pennation_deg).toBeGreaterThanOrEqual(0);
      expect(muscle.pcsa_cm2).toBeGreaterThan(0);
      expect(muscle.innervation.trim().length).toBeGreaterThan(0);
    }
  });

  it("contains every canonical PDB id from the research brief", () => {
    for (const pdbId of requiredPdbIds) {
      expect(CANONICAL_PDB_IDS).toContain(pdbId);
    }
  });
});
