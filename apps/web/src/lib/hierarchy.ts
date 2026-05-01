import type { HierarchyNode } from "./types";

export const HIERARCHY_NODES: HierarchyNode[] = [
  {
    children_ids: ["musculoskeletal_system"],
    description:
      "The complete adult human body as the atlas entry point for musculoskeletal anatomy.",
    dimensions: {
      count: 1,
      length: { unit: "m", value: 1.7 },
      scale_meters: 1.7,
      source:
        "Project research brief; Gray's Anatomy adult body and skeletal overview",
    },
    id: "body",
    level: 1,
    mesh_path: "/models/body/adult_body.gltf",
    name: "Body",
    parent_id: null,
    physiology:
      "Maintains posture, locomotion, respiration mechanics, and force transfer across joints.",
  },
  {
    children_ids: ["axial_skeleton", "appendicular_skeleton", "lower_limb"],
    description:
      "The integrated skeletal, muscular, tendon, ligament, and fascial system.",
    dimensions: {
      count: 1,
      scale_meters: 1,
      source:
        "Project research brief; Gray's Anatomy axial and appendicular skeletal counts",
    },
    id: "musculoskeletal_system",
    level: 2,
    mesh_path: "/models/skeleton/musculoskeletal_system.gltf",
    name: "Musculoskeletal system",
    parent_id: "body",
    physiology:
      "Coordinates lever mechanics, elastic energy storage, proprioception, and body support.",
  },
  {
    children_ids: [],
    description:
      "The skull, vertebral column, ribs, and sternum forming the central support axis.",
    dimensions: {
      count: 80,
      scale_meters: 0.9,
      source: "Gray's Anatomy adult axial skeleton count",
    },
    id: "axial_skeleton",
    level: 2,
    mesh_path: "/models/skeleton/axial_skeleton.gltf",
    name: "Axial skeleton",
    parent_id: "musculoskeletal_system",
  },
  {
    children_ids: [],
    description:
      "The limb girdles and limb bones that support reaching, grasping, stance, and gait.",
    dimensions: {
      count: 126,
      scale_meters: 1,
      source: "Gray's Anatomy adult appendicular skeleton count",
    },
    id: "appendicular_skeleton",
    level: 2,
    mesh_path: "/models/skeleton/appendicular_skeleton.gltf",
    name: "Appendicular skeleton",
    parent_id: "musculoskeletal_system",
  },
  {
    children_ids: ["thigh_region", "leg_region"],
    description:
      "The lower-limb region organized around hip, knee, ankle, and foot mechanics.",
    dimensions: {
      count: 2,
      length: { unit: "m", value: 0.9 },
      scale_meters: 0.9,
      source: "Standring, Gray's Anatomy lower-limb regional anatomy",
    },
    id: "lower_limb",
    level: 3,
    mesh_path: "/models/regions/lower_limb.gltf",
    name: "Lower limb",
    parent_id: "musculoskeletal_system",
    physiology:
      "Provides propulsion, balance, shock absorption, and stance-phase support.",
  },
  {
    children_ids: ["anterior_thigh_compartment", "posterior_thigh_compartment"],
    description:
      "The femoral segment between hip and knee, containing major locomotor compartments.",
    dimensions: {
      length: { unit: "m", value: 0.45 },
      scale_meters: 0.45,
      source: "Standring, Gray's Anatomy thigh compartment organization",
    },
    id: "thigh_region",
    level: 3,
    mesh_path: "/models/regions/thigh.gltf",
    name: "Thigh",
    parent_id: "lower_limb",
  },
  {
    children_ids: [
      "rectus_femoris",
      "vastus_lateralis",
      "vastus_medialis",
      "vastus_intermedius",
      "sartorius",
    ],
    description:
      "Anterior thigh extensor compartment dominated by the quadriceps femoris group.",
    dimensions: {
      count: 4,
      scale_meters: 0.3,
      source: "Standring, Gray's Anatomy anterior thigh compartment",
    },
    id: "anterior_thigh_compartment",
    level: 3,
    mesh_path: "/models/regions/anterior_thigh.gltf",
    name: "Anterior thigh compartment",
    parent_id: "thigh_region",
    physiology:
      "Extends the knee and contributes to hip flexion through rectus femoris.",
  },
  {
    children_ids: [],
    description:
      "Posterior thigh compartment containing the hamstrings for hip extension and knee flexion.",
    dimensions: {
      count: 3,
      scale_meters: 0.35,
      source: "Standring, Gray's Anatomy posterior thigh compartment",
    },
    id: "posterior_thigh_compartment",
    level: 3,
    mesh_path: "/models/regions/posterior_thigh.gltf",
    name: "Posterior thigh compartment",
    parent_id: "thigh_region",
  },
  {
    children_ids: [],
    description:
      "The lower-limb segment between knee and ankle, organized into anterior, lateral, and posterior compartments.",
    dimensions: {
      length: { unit: "m", value: 0.43 },
      scale_meters: 0.43,
      source: "Standring, Gray's Anatomy leg compartment organization",
    },
    id: "leg_region",
    level: 3,
    mesh_path: "/models/regions/leg.gltf",
    name: "Leg",
    parent_id: "lower_limb",
  },
  {
    children_ids: ["rectus_femoris_fascicle"],
    clinical_significance:
      "Rectus femoris strains are common in kicking and sprinting sports because the muscle crosses hip and knee.",
    description:
      "A biarticular quadriceps muscle that flexes the hip and extends the knee.",
    dimensions: {
      length: { unit: "cm", value: 6.6 },
      scale_meters: 0.066,
      source: "Ward et al. 2009 human lower-limb muscle architecture",
    },
    id: "rectus_femoris",
    latin_name: "Musculus rectus femoris",
    level: 4,
    mesh_path: "/models/muscles/rectus_femoris.gltf",
    name: "Rectus femoris",
    parent_id: "anterior_thigh_compartment",
    physiology:
      "Knee extension and hip flexion with fusiform-to-bipennate architecture.",
  },
  {
    children_ids: [],
    description:
      "The largest lateral quadriceps component, specialized for knee extension force.",
    dimensions: {
      length: { unit: "cm", value: 6.5 },
      scale_meters: 0.065,
      source: "Ward et al. 2009 human lower-limb muscle architecture",
    },
    id: "vastus_lateralis",
    latin_name: "Musculus vastus lateralis",
    level: 4,
    mesh_path: "/models/muscles/vastus_lateralis.gltf",
    name: "Vastus lateralis",
    parent_id: "anterior_thigh_compartment",
  },
  {
    children_ids: [],
    description:
      "The medial quadriceps component that extends the knee and contributes to patellar tracking.",
    dimensions: {
      length: { unit: "cm", value: 5.7 },
      scale_meters: 0.057,
      source: "Ward et al. 2009 human lower-limb muscle architecture",
    },
    id: "vastus_medialis",
    latin_name: "Musculus vastus medialis",
    level: 4,
    mesh_path: "/models/muscles/vastus_medialis.gltf",
    name: "Vastus medialis",
    parent_id: "anterior_thigh_compartment",
  },
  {
    children_ids: [],
    description:
      "The deep quadriceps component lying between vastus medialis and vastus lateralis on the femur.",
    dimensions: {
      length: { unit: "cm", value: 7 },
      scale_meters: 0.07,
      source: "Ward et al. 2009 human lower-limb muscle architecture",
    },
    id: "vastus_intermedius",
    latin_name: "Musculus vastus intermedius",
    level: 4,
    mesh_path: "/models/muscles/vastus_intermedius.gltf",
    name: "Vastus intermedius",
    parent_id: "anterior_thigh_compartment",
  },
  {
    children_ids: [],
    description:
      "A long strap muscle crossing hip and knee, contributing hip flexion, abduction, lateral rotation, and knee flexion.",
    dimensions: {
      length: { unit: "cm", value: 30 },
      scale_meters: 0.3,
      source: "Ward et al. 2009 human lower-limb muscle architecture",
    },
    id: "sartorius",
    latin_name: "Musculus sartorius",
    level: 4,
    mesh_path: "/models/muscles/sartorius.gltf",
    name: "Sartorius",
    parent_id: "anterior_thigh_compartment",
  },
  {
    children_ids: ["rectus_femoris_fiber"],
    description:
      "A bundled set of muscle fibers enclosed by perimysium within rectus femoris.",
    dimensions: {
      diameter: { unit: "um", value: 300 },
      length: { unit: "mm", value: 10 },
      scale_meters: 0.01,
      source: "Gillies and Lieber 2011 skeletal muscle extracellular matrix",
    },
    id: "rectus_femoris_fascicle",
    level: 5,
    name: "Rectus femoris fascicle",
    parent_id: "rectus_femoris",
    procedural_type: "fascicle_bundle",
    physiology:
      "Perimysial collagen couples fiber force laterally and longitudinally through the muscle belly.",
  },
  {
    children_ids: ["rectus_femoris_myofibril"],
    description:
      "A multinucleated skeletal muscle cell containing hundreds to thousands of myofibrils.",
    dimensions: {
      diameter: { unit: "um", value: 60 },
      length: { unit: "cm", value: 6.6 },
      scale_meters: 0.00006,
      source: "Lieber 2010 skeletal muscle structure and function",
    },
    id: "rectus_femoris_fiber",
    level: 6,
    name: "Rectus femoris muscle fiber",
    parent_id: "rectus_femoris_fascicle",
    procedural_type: "muscle_fiber",
    physiology:
      "Excitation-contraction coupling links sarcolemmal depolarization to calcium release and contraction.",
  },
  {
    children_ids: ["rectus_femoris_sarcomere"],
    description:
      "A cylindrical contractile organelle made from serial sarcomeres and filament lattices.",
    dimensions: {
      diameter: { unit: "um", value: 1.5 },
      scale_meters: 0.0000015,
      source: "Huxley 1969 skeletal myofibril ultrastructure",
    },
    id: "rectus_femoris_myofibril",
    level: 7,
    name: "Rectus femoris myofibril",
    parent_id: "rectus_femoris_fiber",
    procedural_type: "myofibril",
    physiology: "Serial sarcomere shortening sums into fiber shortening.",
  },
  {
    children_ids: ["myosin_ii", "actin", "titin"],
    biochemistry:
      "ATP-driven myosin-actin cycling, calcium-regulated troponin-tropomyosin switching, and titin elasticity produce active and passive force.",
    description:
      "The repeating contractile unit between Z-discs containing thick filaments, thin filaments, titin, and M-line proteins.",
    dimensions: {
      length: { unit: "um", value: 2.4 },
      scale_meters: 0.0000024,
      source:
        "Squire 1997 muscle filament lattice and sarcomere ultrastructure",
    },
    id: "rectus_femoris_sarcomere",
    level: 8,
    name: "Sarcomere",
    parent_id: "rectus_femoris_myofibril",
    procedural_type: "sarcomere_lattice",
    physiology: "The fundamental force-generating unit of striated muscle.",
  },
  {
    children_ids: [],
    biochemistry:
      "Hexameric type-II myosin converts ATP hydrolysis into lever-arm rotation and filament sliding.",
    description:
      "The thick-filament motor protein that forms bipolar filaments and drives cross-bridge cycling.",
    dimensions: {
      length: { unit: "nm", value: 150 },
      mass_kda: 520,
      scale_meters: 0.00000015,
      source: "RCSB PDB myosin II structures; Squire thick filament review",
    },
    id: "myosin_ii",
    level: 9,
    name: "Myosin II",
    parent_id: "rectus_femoris_sarcomere",
    pdb_id: "2MYS",
    procedural_type: "protein_structure",
  },
  {
    children_ids: [],
    biochemistry:
      "Globular actin polymerizes into helical F-actin thin filaments that expose myosin-binding sites under calcium control.",
    description: "The thin-filament backbone protein of the sarcomere.",
    dimensions: {
      mass_kda: 42,
      scale_meters: 0.0000000055,
      source: "RCSB PDB actin structures; Holmes actin filament geometry",
    },
    id: "actin",
    level: 9,
    name: "Actin",
    parent_id: "rectus_femoris_sarcomere",
    pdb_id: "1ATN",
    procedural_type: "protein_structure",
  },
  {
    children_ids: ["titin_ig_domain"],
    biochemistry:
      "Serial Ig and fibronectin-like domains form an extensible molecular spring spanning Z-disc to M-line.",
    clinical_significance:
      "TTN variants are associated with titinopathies and dilated cardiomyopathy; skeletal isoforms influence passive stiffness.",
    description:
      "A giant elastic protein that centers the thick filament and contributes passive sarcomere tension.",
    dimensions: {
      length: { unit: "um", value: 1 },
      scale_meters: 0.000001,
      source:
        "Tskhovrebova and Trinick 2003 titin elasticity; RCSB PDB titin Ig domains",
    },
    id: "titin",
    level: 9,
    name: "Titin",
    parent_id: "rectus_femoris_sarcomere",
    pdb_id: "1TIT",
    procedural_type: "protein_structure",
  },
  {
    children_ids: [],
    biochemistry:
      "A beta-sandwich Ig-like fold whose forced unfolding contributes to titin extensibility.",
    description:
      "An immunoglobulin-like titin domain resolved in atomic detail.",
    dimensions: {
      length: { unit: "nm", value: 4 },
      mass_kda: 10,
      scale_meters: 0.0000000001,
      source: "RCSB PDB 1TIT; single-molecule titin Ig unfolding force studies",
    },
    id: "titin_ig_domain",
    level: 10,
    name: "Titin Ig domain",
    parent_id: "titin",
    pdb_id: "1TIT",
    procedural_type: "domain_detail",
  },
];

export const HIERARCHY_BY_ID = new Map(
  HIERARCHY_NODES.map((node) => [node.id, node]),
);

export const REQUIRED_PHASE_ONE_TRAVERSAL = [
  "body",
  "rectus_femoris",
  "rectus_femoris_fascicle",
  "rectus_femoris_sarcomere",
  "titin",
  "titin_ig_domain",
] as const;

export function getNode(id: string): HierarchyNode {
  const node = HIERARCHY_BY_ID.get(id);

  if (!node) {
    throw new Error(`Unknown hierarchy node: ${id}`);
  }

  return node;
}

export function getChildren(id: string): HierarchyNode[] {
  return getNode(id).children_ids.map((childId) => getNode(childId));
}

export function getAncestors(id: string): HierarchyNode[] {
  const ancestors: HierarchyNode[] = [];
  let current = getNode(id);

  while (current.parent_id) {
    current = getNode(current.parent_id);
    ancestors.unshift(current);
  }

  return ancestors;
}

export function getBreadcrumb(id: string): HierarchyNode[] {
  return [...getAncestors(id), getNode(id)];
}

export function findPath(
  startId: string,
  targetId: string,
): HierarchyNode[] | null {
  const start = getNode(startId);

  if (start.id === targetId) {
    return [start];
  }

  for (const childId of start.children_ids) {
    const childPath = findPath(childId, targetId);

    if (childPath) {
      return [start, ...childPath];
    }
  }

  return null;
}

export function isDescendant(
  ancestorId: string,
  descendantId: string,
): boolean {
  return findPath(ancestorId, descendantId) !== null;
}

export function getRequiredTraversalMilestones(): HierarchyNode[] {
  return REQUIRED_PHASE_ONE_TRAVERSAL.map((id) => getNode(id));
}
