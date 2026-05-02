import type { ZoomLevel } from "./types";

export type FidelityMode =
  | "mesh_backed"
  | "procedural_one_to_one"
  | "instanced_one_to_one"
  | "pdb_coordinate";

export interface AdultBodyProportions {
  heightM: number;
  headUnits: number;
  shoulderWidthM: number;
  pelvisWidthM: number;
  armSpanM: number;
  kneeHeightM: number;
  source: string;
}

export interface AnatomicalStructureMap {
  canonicalStructure: string;
  fidelityMode: FidelityMode;
  level: ZoomLevel;
  oneToOneRule: string;
  renderedStructureCount: number;
  requiredStructureCount: number;
  visibleExamples: string[];
}

export const ADULT_BODY_PROPORTIONS: AdultBodyProportions = {
  armSpanM: 1.7,
  headUnits: 7.5,
  heightM: 1.7,
  kneeHeightM: 0.48,
  pelvisWidthM: 0.32,
  shoulderWidthM: 0.42,
  source:
    "Classic adult anatomical proportion canon; MusculoAtlas procedural gross model",
};

export const LEVEL_STRUCTURE_MAP: Record<ZoomLevel, AnatomicalStructureMap> = {
  1: {
    canonicalStructure: "whole adult human body",
    fidelityMode: "mesh_backed",
    level: 1,
    oneToOneRule:
      "The body is represented as one adult anatomical subject with atlas-style contours, transparent skin, axial skeleton, appendicular skeleton, and named superficial muscle groups.",
    renderedStructureCount: 52,
    requiredStructureCount: 40,
    visibleExamples: ["skin silhouette", "skull", "rib cage", "pelvis"],
  },
  2: {
    canonicalStructure: "musculoskeletal system layers",
    fidelityMode: "mesh_backed",
    level: 2,
    oneToOneRule:
      "Each selectable gross layer maps to a named anatomical system, and skeleton targets the 206-bone catalog rather than a generic body shell.",
    renderedStructureCount: 4,
    requiredStructureCount: 4,
    visibleExamples: ["skeleton", "muscles", "connective tissue", "joints"],
  },
  3: {
    canonicalStructure: "anterior thigh compartment",
    fidelityMode: "procedural_one_to_one",
    level: 3,
    oneToOneRule:
      "Every visible anterior-thigh muscle corresponds to one named compartment muscle, with femur, patella, femoral nerve, artery, and vein separated.",
    renderedStructureCount: 10,
    requiredStructureCount: 10,
    visibleExamples: [
      "rectus femoris",
      "vastus lateralis",
      "vastus medialis",
      "sartorius",
    ],
  },
  4: {
    canonicalStructure: "single skeletal muscle",
    fidelityMode: "procedural_one_to_one",
    level: 4,
    oneToOneRule:
      "The selected muscle is rendered as one anatomical muscle belly with separate proximal tendon, distal tendon, central tendon/raphe, and fiber-direction overlay.",
    renderedStructureCount: 1,
    requiredStructureCount: 1,
    visibleExamples: ["muscle belly", "origin tendon", "insertion tendon"],
  },
  5: {
    canonicalStructure: "muscle fascicle",
    fidelityMode: "instanced_one_to_one",
    level: 5,
    oneToOneRule:
      "Each visible fiber cylinder is one muscle fiber inside one fascicle; perimysium, endomysium, and capillaries are separate semantic structures.",
    renderedStructureCount: 100,
    requiredStructureCount: 100,
    visibleExamples: ["fiber instance", "perimysium", "endomysium"],
  },
  6: {
    canonicalStructure: "single multinucleated muscle fiber",
    fidelityMode: "instanced_one_to_one",
    level: 6,
    oneToOneRule:
      "Every rendered organelle class is a named cellular structure; instance counts are sampled from the biological count while preserving one instance per displayed organelle.",
    renderedStructureCount: 50,
    requiredStructureCount: 50,
    visibleExamples: ["nucleus", "myofibril", "mitochondrion", "T-tubule"],
  },
  7: {
    canonicalStructure: "myofibril segment",
    fidelityMode: "procedural_one_to_one",
    level: 7,
    oneToOneRule:
      "Each rendered band is mapped to the anatomical band it represents: Z-disc, I-band, A-band, H-zone, and M-line.",
    renderedStructureCount: 5,
    requiredStructureCount: 5,
    visibleExamples: ["Z-disc", "I-band", "A-band", "H-zone"],
  },
  8: {
    canonicalStructure: "single sarcomere",
    fidelityMode: "instanced_one_to_one",
    level: 8,
    oneToOneRule:
      "Each visible thick, thin, and titin filament instance is one filament in the sarcomere lattice; dimensions stay tied to sarcomere geometry.",
    renderedStructureCount: 180,
    requiredStructureCount: 180,
    visibleExamples: ["thick filament", "thin filament", "titin", "M-line"],
  },
  9: {
    canonicalStructure: "sarcomeric protein",
    fidelityMode: "pdb_coordinate",
    level: 9,
    oneToOneRule:
      "Each protein view is linked to canonical PDB identifiers so the molecular structure maps to a real coordinate entry where available.",
    renderedStructureCount: 1,
    requiredStructureCount: 1,
    visibleExamples: ["myosin II", "F-actin", "titin", "SERCA"],
  },
  10: {
    canonicalStructure: "protein domain and atom set",
    fidelityMode: "pdb_coordinate",
    level: 10,
    oneToOneRule:
      "Every displayed atom record has an element, residue, sequence index, and coordinate; ball-and-stick mode keeps one sphere per atom.",
    renderedStructureCount: 1,
    requiredStructureCount: 1,
    visibleExamples: ["atom", "residue", "beta strand", "active site"],
  },
};

export function getLevelStructureMap(level: ZoomLevel): AnatomicalStructureMap {
  return LEVEL_STRUCTURE_MAP[level];
}

export function allLevelsHaveOneToOneRules(): boolean {
  return Object.values(LEVEL_STRUCTURE_MAP).every(
    (entry) =>
      entry.oneToOneRule.length > 40 &&
      entry.renderedStructureCount >= entry.requiredStructureCount,
  );
}

export function getBodyHeightFromHeadUnits(): number {
  return ADULT_BODY_PROPORTIONS.heightM / ADULT_BODY_PROPORTIONS.headUnits;
}
