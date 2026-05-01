import muscleCatalog from "../data/muscles.json";
import {
  getDomainStructure,
  getProteinStructure,
  isDomainId,
  isProteinId,
} from "./molecular";
import type { MuscleCatalogEntry, MuscleDetail } from "./types";

export type GrossLayer = "skeleton" | "muscle" | "connective" | "joints";

export interface BodyComposition {
  bones: number;
  muscles: number;
  muscleMassPctMale: number;
  muscleMassPctFemale: number;
  source: string;
}

export interface GrossLayerDescriptor {
  id: GrossLayer;
  label: string;
  meshId: string;
  color: string;
  description: string;
}

export interface RegionDetail {
  id: string;
  name: string;
  scale_cm: [number, number];
  muscles: string[];
  bones: string[];
  nerves: string[];
  vessels: string[];
  compartment: string;
  functionColorMap: Record<string, string>;
}

export const BODY_COMPOSITION: BodyComposition = {
  bones: 206,
  muscleMassPctFemale: 30,
  muscleMassPctMale: 40,
  muscles: 700,
  source:
    "Gray's Anatomy adult skeletal count; Janssen et al. 2000 skeletal muscle mass estimates",
};

export const GROSS_LAYERS: GrossLayerDescriptor[] = [
  {
    color: "#f4f1ea",
    description:
      "All 206 bones, separated into axial and appendicular regions.",
    id: "skeleton",
    label: "Skeleton",
    meshId: "l2_skeleton",
  },
  {
    color: "#ee7664",
    description: "Major muscle groups rendered as colored surface volumes.",
    id: "muscle",
    label: "Muscles",
    meshId: "l2_muscle_groups",
  },
  {
    color: "#5fd0c5",
    description:
      "Major tendons, ligaments, and fascia as translucent connective tissue.",
    id: "connective",
    label: "CT",
    meshId: "l2_connective",
  },
  {
    color: "#d7b95d",
    description: "Major synovial joints highlighted for motion context.",
    id: "joints",
    label: "Joints",
    meshId: "l2_joints",
  },
];

export const ANTERIOR_THIGH_REGION: RegionDetail = {
  bones: ["femur", "patella"],
  compartment:
    "Anterior compartment bounded by medial and lateral intermuscular septa and the fascia lata.",
  functionColorMap: {
    flexor: "#5fd0c5",
    extensor: "#ee7664",
    rotator: "#9d8df1",
  },
  id: "anterior_thigh_compartment",
  muscles: [
    "rectus_femoris",
    "vastus_lateralis",
    "vastus_medialis",
    "vastus_intermedius",
    "sartorius",
  ],
  name: "Anterior thigh",
  nerves: ["femoral nerve (L2-L4)"],
  scale_cm: [10, 60],
  vessels: ["femoral artery", "femoral vein"],
};

type DetailOverride = Omit<
  MuscleDetail,
  keyof MuscleCatalogEntry | "fully_detailed"
>;

const DETAILED_MUSCLES: Record<string, DetailOverride> = {
  biceps_brachii_long_head: {
    action: "Elbow flexion, forearm supination, weak shoulder flexion",
    blood_supply: "Brachial artery and anterior circumflex humeral artery",
    clinical:
      "Long-head tendinopathy and SLAP-associated pain are common shoulder presentations.",
    fiber_type_pct: { I: 45, IIa: 35, IIx: 20 },
    insertion: "Radial tuberosity and bicipital aponeurosis",
    opensim: {
      max_iso_force_N: 624,
      opt_fiber_length_m: 0.115,
      tendon_slack_m: 0.272,
    },
    origin: "Supraglenoid tubercle of scapula",
    pennation_pattern: "parallel",
  },
  biceps_femoris_long_head: {
    action: "Hip extension, knee flexion, lateral rotation of flexed knee",
    blood_supply: "Perforating branches of profunda femoris artery",
    clinical:
      "High-speed running commonly injures the proximal myotendinous junction.",
    fiber_type_pct: { I: 34, IIa: 33, IIx: 33 },
    insertion: "Head of fibula",
    opensim: {
      max_iso_force_N: 717,
      opt_fiber_length_m: 0.109,
      tendon_slack_m: 0.326,
    },
    origin: "Ischial tuberosity",
    pennation_pattern: "parallel",
  },
  deltoid: {
    action:
      "Shoulder abduction with anterior fibers flexing and medially rotating the arm",
    blood_supply:
      "Posterior circumflex humeral artery and deltoid branch of thoracoacromial artery",
    clinical:
      "Axillary nerve injury weakens abduction and reduces sensation over the regimental badge area.",
    fiber_type_pct: { I: 47, IIa: 36, IIx: 17 },
    insertion: "Deltoid tuberosity of humerus",
    opensim: {
      max_iso_force_N: 1210,
      opt_fiber_length_m: 0.09,
      tendon_slack_m: 0.12,
    },
    origin: "Lateral clavicle, acromion, and spine of scapula",
    pennation_pattern: "multipennate",
  },
  erector_spinae: {
    action: "Extends and laterally flexes the vertebral column",
    blood_supply: "Posterior intercostal, lumbar, and lateral sacral arteries",
    clinical:
      "Endurance deficits and strain can contribute to mechanical low-back pain.",
    fiber_type_pct: { I: 58, IIa: 27, IIx: 15 },
    insertion:
      "Ribs, thoracic and cervical transverse processes, and mastoid process",
    opensim: {
      max_iso_force_N: 2500,
      opt_fiber_length_m: 0.125,
      tendon_slack_m: 0.08,
    },
    origin:
      "Broad tendon from posterior iliac crest, sacrum, and lumbar spinous processes",
    pennation_pattern: "parallel",
  },
  gastrocnemius_medial: {
    action: "Plantarflexes ankle and flexes knee",
    blood_supply: "Sural branches of popliteal artery",
    clinical: "Medial head strain is the classic tennis leg injury.",
    fiber_type_pct: { I: 50, IIa: 30, IIx: 20 },
    insertion: "Posterior calcaneus via Achilles tendon",
    opensim: {
      max_iso_force_N: 1558,
      opt_fiber_length_m: 0.051,
      tendon_slack_m: 0.39,
    },
    origin: "Posterior surface of medial femoral condyle",
    pennation_pattern: "unipennate",
  },
  gluteus_maximus: {
    action: "Hip extension and lateral rotation",
    blood_supply: "Superior and inferior gluteal arteries",
    clinical: "Weakness impairs stair climbing and rising from sitting.",
    fiber_type_pct: { I: 52, IIa: 28, IIx: 20 },
    insertion: "Iliotibial tract and gluteal tuberosity of femur",
    opensim: {
      max_iso_force_N: 1944,
      opt_fiber_length_m: 0.142,
      tendon_slack_m: 0.157,
    },
    origin:
      "Ilium posterior to posterior gluteal line, sacrum, coccyx, and sacrotuberous ligament",
    pennation_pattern: "multipennate",
  },
  rectus_femoris: {
    action: "Knee extension, hip flexion",
    blood_supply: "Lateral circumflex femoral artery",
    clinical: "Rectus femoris strain common in kicking athletes.",
    fiber_type_pct: { I: 35, IIa: 35, IIx: 30 },
    insertion: "Tibial tuberosity via patellar tendon",
    opensim: {
      max_iso_force_N: 1169,
      opt_fiber_length_m: 0.084,
      tendon_slack_m: 0.346,
    },
    origin: "Anterior inferior iliac spine (AIIS), superior acetabular ridge",
    pennation_pattern: "bipennate",
  },
  soleus: {
    action: "Postural ankle plantarflexion",
    blood_supply: "Posterior tibial, fibular, and sural arteries",
    clinical:
      "Deep soleus strains can mimic Achilles or calf pain and often recover slowly.",
    fiber_type_pct: { I: 70, IIa: 20, IIx: 10 },
    insertion: "Posterior calcaneus via Achilles tendon",
    opensim: {
      max_iso_force_N: 3549,
      opt_fiber_length_m: 0.04,
      tendon_slack_m: 0.268,
    },
    origin: "Posterior fibular head, soleal line of tibia, and tendinous arch",
    pennation_pattern: "multipennate",
  },
  tibialis_anterior: {
    action: "Ankle dorsiflexion and inversion",
    blood_supply: "Anterior tibial artery",
    clinical:
      "Deep fibular nerve injury produces dorsiflexion weakness and foot drop.",
    fiber_type_pct: { I: 55, IIa: 30, IIx: 15 },
    insertion: "Medial cuneiform and base of first metatarsal",
    opensim: {
      max_iso_force_N: 905,
      opt_fiber_length_m: 0.073,
      tendon_slack_m: 0.223,
    },
    origin: "Lateral condyle and proximal lateral tibia, interosseous membrane",
    pennation_pattern: "unipennate",
  },
  vastus_lateralis: {
    action: "Knee extension",
    blood_supply:
      "Lateral circumflex femoral artery and perforating branches of profunda femoris",
    clinical:
      "Common biopsy site for fiber-type studies and a major contributor to patellofemoral tracking.",
    fiber_type_pct: { I: 42, IIa: 38, IIx: 20 },
    insertion:
      "Patella and tibial tuberosity via quadriceps tendon and patellar ligament",
    opensim: {
      max_iso_force_N: 1871,
      opt_fiber_length_m: 0.084,
      tendon_slack_m: 0.157,
    },
    origin: "Greater trochanter and lateral lip of linea aspera",
    pennation_pattern: "unipennate",
  },
};

const MUSCLE_ALIASES: Record<string, string> = {
  biceps_brachii: "biceps_brachii_long_head",
  biceps_femoris_lh: "biceps_femoris_long_head",
  deltoid_anterior: "deltoid",
};

function inferAction(region: string): string {
  if (region.includes("anterior_thigh")) {
    return "Knee extension or hip flexion depending on muscle line of action";
  }

  if (region.includes("posterior_thigh")) {
    return "Hip extension and knee flexion";
  }

  if (region.includes("posterior_leg")) {
    return "Ankle plantarflexion or toe flexion";
  }

  if (region.includes("anterior_leg")) {
    return "Ankle dorsiflexion or toe extension";
  }

  if (region.includes("forearm")) {
    return "Wrist and digit movement";
  }

  return "Regional skeletal movement";
}

function inferBloodSupply(region: string): string {
  if (region.includes("thigh") || region === "hip" || region === "gluteal") {
    return "Regional branches of femoral, profunda femoris, or gluteal arteries";
  }

  if (region.includes("leg")) {
    return "Regional branches of anterior tibial, posterior tibial, fibular, or popliteal arteries";
  }

  if (region.includes("arm") || region.includes("forearm")) {
    return "Regional branches of brachial, radial, or ulnar arteries";
  }

  return "Regional segmental arterial supply";
}

function makeBaselineDetail(muscle: MuscleCatalogEntry): MuscleDetail {
  const override = DETAILED_MUSCLES[muscle.id];

  return {
    ...muscle,
    action: override?.action ?? inferAction(muscle.region),
    blood_supply: override?.blood_supply ?? inferBloodSupply(muscle.region),
    clinical:
      override?.clinical ??
      "Clinically relevant through weakness, overload, nerve injury, or regional strain patterns.",
    fiber_type_pct: override?.fiber_type_pct,
    fully_detailed: Boolean(override),
    insertion:
      override?.insertion ??
      "Documented bony insertion to be refined from source atlas landmarks.",
    opensim: override?.opensim,
    origin:
      override?.origin ??
      "Documented bony origin to be refined from source atlas landmarks.",
    pennation_pattern: override?.pennation_pattern ?? "parallel",
  };
}

export const MUSCLE_DATABASE: MuscleDetail[] = (
  muscleCatalog as MuscleCatalogEntry[]
).map(makeBaselineDetail);

export const FULLY_DETAILED_MUSCLE_IDS = MUSCLE_DATABASE.filter(
  (muscle) => muscle.fully_detailed,
).map((muscle) => muscle.id);

export function resolveMuscleId(id: string): string {
  return MUSCLE_ALIASES[id] ?? id;
}

export function getMuscleDetail(id: string): MuscleDetail {
  const resolvedId = resolveMuscleId(id);
  const muscle = MUSCLE_DATABASE.find((entry) => entry.id === resolvedId);

  if (!muscle) {
    throw new Error(`Unknown muscle: ${id}`);
  }

  return muscle;
}

export function getMusclesForRegion(regionId: string): MuscleDetail[] {
  if (regionId === ANTERIOR_THIGH_REGION.id) {
    return ANTERIOR_THIGH_REGION.muscles.map((muscleId) =>
      getMuscleDetail(muscleId),
    );
  }

  return MUSCLE_DATABASE.filter((muscle) => muscle.region === regionId);
}

export function hasCompleteMuscleMetadata(muscle: MuscleDetail): boolean {
  return Boolean(
    muscle.origin &&
      muscle.insertion &&
      muscle.innervation &&
      muscle.blood_supply &&
      muscle.action &&
      muscle.fiber_length_cm > 0 &&
      muscle.pennation_deg >= 0 &&
      muscle.pcsa_cm2 > 0 &&
      muscle.fiber_type_pct &&
      muscle.opensim &&
      muscle.clinical,
  );
}

export function getPennationArrowCount(muscleId: string): number {
  const muscle = getMuscleDetail(muscleId);
  const sideCount =
    muscle.pennation_pattern === "bipennate" ||
    muscle.pennation_pattern === "multipennate"
      ? 2
      : 1;

  return sideCount * 5;
}

export function getGrossBreadcrumbLabels(nodeId: string): string[] {
  const baseMolecularLabels = [
    "Body",
    "Lower Limb",
    "Anterior Thigh",
    "Rectus femoris",
    "Fascicle",
    "Fiber",
    "Myofibril",
    "Sarcomere",
  ];

  if (isDomainId(nodeId)) {
    const domain = getDomainStructure(nodeId);
    const protein = getProteinStructure(domain.proteinId);

    return [...baseMolecularLabels, protein.displayName, domain.displayName];
  }

  if (isProteinId(nodeId)) {
    const protein = getProteinStructure(nodeId);

    return [...baseMolecularLabels, protein.displayName];
  }

  const isFascicle = nodeId.endsWith("_fascicle");
  const isFiber = nodeId.endsWith("_fiber");
  const isMyofibril = nodeId.endsWith("_myofibril");
  const isSarcomere = nodeId.endsWith("_sarcomere");
  const resolvedId = resolveMuscleId(
    nodeId
      .replace("_fascicle", "")
      .replace("_fiber", "")
      .replace("_myofibril", "")
      .replace("_sarcomere", ""),
  );

  if (
    resolvedId === "rectus_femoris" ||
    ANTERIOR_THIGH_REGION.muscles.includes(resolvedId)
  ) {
    const muscle = getMuscleDetail(resolvedId);
    const labels = ["Body", "Lower Limb", "Anterior Thigh", muscle.name];

    if (isFascicle) {
      return [...labels, "Fascicle"];
    }

    if (isFiber) {
      return [...labels, "Fascicle", "Fiber"];
    }

    if (isMyofibril) {
      return [...labels, "Fascicle", "Fiber", "Myofibril"];
    }

    if (isSarcomere) {
      return [...labels, "Fascicle", "Fiber", "Myofibril", "Sarcomere"];
    }

    return labels;
  }

  if (nodeId === ANTERIOR_THIGH_REGION.id) {
    return ["Body", "Lower Limb", "Anterior Thigh"];
  }

  if (nodeId === "lower_limb" || nodeId === "musculoskeletal_system") {
    return ["Body", "Lower Limb"];
  }

  return ["Body"];
}
