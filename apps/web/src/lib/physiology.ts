import {
  FIBER_TYPE_PROFILES,
  type FiberType,
  getFiberOrganelleCounts,
} from "./microAnatomy";
import {
  CROSS_BRIDGE_CYCLE,
  type CrossBridgeStepId,
  clampSarcomereLength,
  getLengthTensionForce,
} from "./sarcomere";

export type PhysiologyOverlayMode = "ecc" | "cross_bridge" | "length_tension";

export type EccStepId =
  | "ach_release"
  | "nachr_activation"
  | "sarcolemma_ap"
  | "t_tubule_entry"
  | "dhpr_activation"
  | "ryr1_coupling"
  | "calcium_release"
  | "troponin_binding"
  | "tropomyosin_shift"
  | "cross_bridge_exposure"
  | "serca_relaxation";

export interface EccStep {
  biochemistry: string;
  color: string;
  highlight: "nmj" | "sarcolemma" | "t_tubule" | "sr" | "thin_filament";
  id: EccStepId;
  index: number;
  ionFlow: "acetylcholine" | "sodium" | "charge" | "calcium" | "none";
  label: string;
  structureTarget: string;
}

export interface CrossBridgeBiochemistryStep {
  chemistryLabel: string;
  description: string;
  id: CrossBridgeStepId;
  nucleotideState: string;
  stepNumber: number;
}

export interface LengthTensionPoint {
  activeForce: number;
  annotation: string;
  limb: "ascending" | "plateau" | "descending";
  passiveTitinForce: number;
  sarcomereLengthUm: number;
  totalForce: number;
  xPct: number;
  yPct: number;
}

export interface FiberTypeComparison {
  color: string;
  contractionSpeed: "slow" | "fast" | "very_fast";
  fatigueResistance: "high" | "moderate" | "low";
  glycogenScore: number;
  id: FiberType;
  label: string;
  lipidDropletCount: number;
  metabolicPathway: string;
  mitochondriaVolumePct: number;
  myosinGene: string;
  organelleSummary: string;
  titinIsoform: string;
}

export const ECC_STEPS: EccStep[] = [
  {
    biochemistry: "Motor neuron vesicles release acetylcholine into the cleft.",
    color: "#d7b95d",
    highlight: "nmj",
    id: "ach_release",
    index: 1,
    ionFlow: "acetylcholine",
    label: "ACh release at neuromuscular junction",
    structureTarget: "Neuromuscular junction",
  },
  {
    biochemistry: "nAChR opens and drives the local end-plate potential.",
    color: "#5fd0c5",
    highlight: "sarcolemma",
    id: "nachr_activation",
    index: 2,
    ionFlow: "sodium",
    label: "nAChR activation and end-plate potential",
    structureTarget: "Motor end plate",
  },
  {
    biochemistry:
      "Voltage-gated sodium channels propagate the action potential.",
    color: "#ee7664",
    highlight: "sarcolemma",
    id: "sarcolemma_ap",
    index: 3,
    ionFlow: "charge",
    label: "Action potential along sarcolemma",
    structureTarget: "Sarcolemma",
  },
  {
    biochemistry:
      "Depolarization dives into the fiber through transverse tubules.",
    color: "#5fd0c5",
    highlight: "t_tubule",
    id: "t_tubule_entry",
    index: 4,
    ionFlow: "charge",
    label: "AP enters T-tubules",
    structureTarget: "T-tubule system",
  },
  {
    biochemistry: "Cav1.1 DHPR senses voltage and changes conformation.",
    color: "#9d8df1",
    highlight: "t_tubule",
    id: "dhpr_activation",
    index: 5,
    ionFlow: "charge",
    label: "DHPR voltage sensor activates",
    structureTarget: "DHPR / Cav1.1",
  },
  {
    biochemistry: "DHPR mechanically gates RyR1 across the triad junction.",
    color: "#d7b95d",
    highlight: "sr",
    id: "ryr1_coupling",
    index: 6,
    ionFlow: "none",
    label: "DHPR mechanically couples to RyR1",
    structureTarget: "Triad junction",
  },
  {
    biochemistry: "RyR1 opens and calcium floods from terminal cisternae.",
    color: "#ee7664",
    highlight: "sr",
    id: "calcium_release",
    index: 7,
    ionFlow: "calcium",
    label: "Calcium release from SR",
    structureTarget: "SR terminal cisternae",
  },
  {
    biochemistry: "Calcium binds troponin C on the regulated thin filament.",
    color: "#5fd0c5",
    highlight: "thin_filament",
    id: "troponin_binding",
    index: 8,
    ionFlow: "calcium",
    label: "Calcium binds troponin C",
    structureTarget: "Troponin C",
  },
  {
    biochemistry: "TnI releases actin and tropomyosin moves B to C to M state.",
    color: "#9d8df1",
    highlight: "thin_filament",
    id: "tropomyosin_shift",
    index: 9,
    ionFlow: "none",
    label: "Tropomyosin shifts B to C to M",
    structureTarget: "Tropomyosin groove strand",
  },
  {
    biochemistry: "Myosin-binding sites open and cycling heads can attach.",
    color: "#d7b95d",
    highlight: "thin_filament",
    id: "cross_bridge_exposure",
    index: 10,
    ionFlow: "none",
    label: "Myosin sites exposed",
    structureTarget: "Actin myosin-binding interface",
  },
  {
    biochemistry:
      "SERCA uses ATP to pump calcium back into the SR for relaxation.",
    color: "#5fd0c5",
    highlight: "sr",
    id: "serca_relaxation",
    index: 11,
    ionFlow: "calcium",
    label: "SERCA restores calcium to SR",
    structureTarget: "SERCA pump",
  },
];

export const CROSS_BRIDGE_BIOCHEMISTRY: CrossBridgeBiochemistryStep[] =
  CROSS_BRIDGE_CYCLE.map((step, index) => {
    const labels: Record<
      CrossBridgeStepId,
      Omit<CrossBridgeBiochemistryStep, "id" | "stepNumber">
    > = {
      detachment: {
        chemistryLabel: "ATP binds -> detachment",
        description:
          "ATP binding lowers actin affinity and releases the myosin head.",
        nucleotideState: "AM + ATP",
      },
      power_stroke: {
        chemistryLabel: "Pi release -> power stroke",
        description:
          "Strong binding and lever-arm rotation slide actin 5-10 nm.",
        nucleotideState: "AM.ADP",
      },
      recovery_stroke: {
        chemistryLabel: "ATP hydrolysis -> recovery",
        description:
          "ATP becomes ADP.Pi and the head re-cocks for another cycle.",
        nucleotideState: "M.ADP.Pi",
      },
      rigor: {
        chemistryLabel: "ADP release -> rigor",
        description: "The head remains strongly bound until ATP binds again.",
        nucleotideState: "AM",
      },
      weak_attachment: {
        chemistryLabel: "M.ADP.Pi -> actin binding",
        description: "A cocked myosin head weakly binds exposed actin.",
        nucleotideState: "M.ADP.Pi",
      },
    };

    return {
      ...labels[step.id],
      id: step.id,
      stepNumber: index + 1,
    };
  });

export const FIBER_TYPE_COMPARISON: FiberTypeComparison[] = [
  {
    color: FIBER_TYPE_PROFILES.type_I.color,
    contractionSpeed: "slow",
    fatigueResistance: "high",
    glycogenScore: 2,
    id: "type_I",
    label: "Type I slow oxidative",
    lipidDropletCount: FIBER_TYPE_PROFILES.type_I.lipidDropletCount,
    metabolicPathway: "oxidative phosphorylation and fatty-acid oxidation",
    mitochondriaVolumePct: FIBER_TYPE_PROFILES.type_I.mitochondriaVolumePct,
    myosinGene: "MYH7",
    organelleSummary:
      "Dense mitochondria, many lipid droplets, lower glycogen.",
    titinIsoform: "longer compliant N2A/PEVK-biased spring",
  },
  {
    color: FIBER_TYPE_PROFILES.type_IIa.color,
    contractionSpeed: "fast",
    fatigueResistance: "moderate",
    glycogenScore: 3,
    id: "type_IIa",
    label: "Type IIa fast oxidative-glycolytic",
    lipidDropletCount: FIBER_TYPE_PROFILES.type_IIa.lipidDropletCount,
    metabolicPathway: "mixed oxidative and glycolytic ATP supply",
    mitochondriaVolumePct: FIBER_TYPE_PROFILES.type_IIa.mitochondriaVolumePct,
    myosinGene: "MYH2",
    organelleSummary: "Intermediate mitochondria with strong glycogen stores.",
    titinIsoform: "intermediate compliance titin program",
  },
  {
    color: FIBER_TYPE_PROFILES.type_IIx.color,
    contractionSpeed: "very_fast",
    fatigueResistance: "low",
    glycogenScore: 5,
    id: "type_IIx",
    label: "Type IIx fast glycolytic",
    lipidDropletCount: FIBER_TYPE_PROFILES.type_IIx.lipidDropletCount,
    metabolicPathway: "rapid glycolysis and phosphocreatine buffering",
    mitochondriaVolumePct: FIBER_TYPE_PROFILES.type_IIx.mitochondriaVolumePct,
    myosinGene: "MYH1",
    organelleSummary: "Sparse mitochondria, pale cytoplasm, glycogen rich.",
    titinIsoform: "stiffer fast-fiber titin expression",
  },
];

export function getEccStep(index: number): EccStep {
  const normalizedIndex =
    ((Math.round(index) % ECC_STEPS.length) + ECC_STEPS.length) %
    ECC_STEPS.length;

  return ECC_STEPS[normalizedIndex];
}

export function getNextEccStepIndex(index: number): number {
  return (Math.round(index) + 1) % ECC_STEPS.length;
}

export function getPreviousEccStepIndex(index: number): number {
  return (Math.round(index) - 1 + ECC_STEPS.length) % ECC_STEPS.length;
}

export function getCrossBridgeBiochemistryStep(
  index: number,
): CrossBridgeBiochemistryStep {
  const normalizedIndex =
    ((Math.round(index) % CROSS_BRIDGE_BIOCHEMISTRY.length) +
      CROSS_BRIDGE_BIOCHEMISTRY.length) %
    CROSS_BRIDGE_BIOCHEMISTRY.length;

  return CROSS_BRIDGE_BIOCHEMISTRY[normalizedIndex];
}

export function getLengthTensionPoint(
  sarcomereLengthUm: number,
): LengthTensionPoint {
  const length = clampSarcomereLength(sarcomereLengthUm);
  const activeForce = getLengthTensionForce(length);
  const passiveTitinForce =
    length <= 2.6 ? 0 : Math.min(0.35, ((length - 2.6) / 0.9) ** 2 * 0.35);
  const totalForce = Math.min(1.2, activeForce + passiveTitinForce);
  const limb =
    length < 2.0 ? "ascending" : length <= 2.2 ? "plateau" : "descending";

  return {
    activeForce,
    annotation:
      limb === "ascending"
        ? "Ascending limb: filament overlap is still building."
        : limb === "plateau"
          ? "Plateau: near-maximal cross-bridge overlap."
          : "Descending limb: overlap falls while titin passive force rises.",
    limb,
    passiveTitinForce,
    sarcomereLengthUm: length,
    totalForce,
    xPct: ((length - 1.8) / (3.5 - 1.8)) * 100,
    yPct: 100 - (totalForce / 1.2) * 100,
  };
}

export function getFiberTypeComparison(
  fiberType: FiberType,
): FiberTypeComparison {
  const comparison = FIBER_TYPE_COMPARISON.find(
    (item) => item.id === fiberType,
  );

  if (!comparison) {
    throw new Error(`Unknown fiber type comparison: ${fiberType}`);
  }

  return comparison;
}

export function compareFiberTypeOrganelles(
  left: FiberType,
  right: FiberType,
): number {
  return (
    getFiberOrganelleCounts(left).mitochondria -
    getFiberOrganelleCounts(right).mitochondria
  );
}
