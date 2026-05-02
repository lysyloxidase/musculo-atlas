export type TissueSystemId = "tendon" | "bone" | "cartilage" | "joint";

export interface TissueZoomLevel {
  diameterRange?: [number, number];
  id: string;
  label: string;
  order: number;
  renderFeature: string;
  scaleRange: string;
  source: string;
}

export interface TendonZoomLevel extends TissueZoomLevel {
  collagenArrangement: string;
  dBandingNm?: number;
}

export interface BoneZoomLevel extends TissueZoomLevel {
  lamellaeCount?: [number, number];
  mineral?: string;
}

export interface CartilageZone {
  collagenOrientation: string;
  feature: string;
  id: string;
  label: string;
  percentDepth?: [number, number];
}

export interface JointDetail {
  capsule: string;
  id: string;
  label: string;
  synovialFluid: string;
  synovialMembrane: string;
}

export interface TissueSystemSummary {
  accessibleFrom: string;
  id: TissueSystemId;
  label: string;
  levels: number;
}

export const TENDON_LEVELS: TendonZoomLevel[] = [
  {
    collagenArrangement: "parallel fascicles with epitenon and paratenon",
    diameterRange: [100, 500],
    id: "T1",
    label: "Tendon macro",
    order: 1,
    renderFeature: "gross tendon strap with insertion footprint",
    scaleRange: "100-500 um to mm",
    source: "Project brief tendon hierarchy; classic tendon histology",
  },
  {
    collagenArrangement: "endo/epitenon partitions around fascicles",
    diameterRange: [50, 300],
    id: "T2",
    label: "Tendon fascicle",
    order: 2,
    renderFeature: "bundle compartments with vessels in epitenon",
    scaleRange: "50-300 um",
    source: "Project brief tendon fascicle dimensions",
  },
  {
    collagenArrangement: "crimped collagen fiber bundles",
    diameterRange: [10, 80],
    id: "T3",
    label: "Collagen fiber",
    order: 3,
    renderFeature: "visible sinusoidal crimp pattern",
    scaleRange: ">10 um",
    source: "Project brief crimp and tendon fiber level",
  },
  {
    collagenArrangement: "quarter-staggered collagen fibrils",
    dBandingNm: 67,
    diameterRange: [10, 500],
    id: "T4",
    label: "Collagen fibril",
    order: 4,
    renderFeature: "67 nm D-banding stripes along fibril",
    scaleRange: "10-500 nm",
    source: "Project brief D-banding periodicity",
  },
  {
    collagenArrangement: "5-stranded tropocollagen supertwist",
    diameterRange: [3, 8],
    id: "T5",
    label: "Microfibril",
    order: 5,
    renderFeature: "five-strand rope geometry",
    scaleRange: "microfibril scale",
    source: "Project brief collagen microfibril architecture",
  },
  {
    collagenArrangement: "triple helix of tropocollagen",
    diameterRange: [1.5, 1.5],
    id: "T6",
    label: "Tropocollagen",
    order: 6,
    renderFeature: "300 nm long, 1.5 nm diameter triple helix",
    scaleRange: "300 nm x 1.5 nm",
    source: "Project brief tropocollagen dimensions",
  },
];

export const BONE_LEVELS: BoneZoomLevel[] = [
  {
    id: "B1",
    label: "Bone macro",
    order: 1,
    renderFeature: "cortical shell and cancellous trabecular core",
    scaleRange: "cm to mm",
    source: "Project brief cortical and cancellous bone level",
  },
  {
    diameterRange: [200, 350],
    id: "B2",
    label: "Osteon",
    lamellaeCount: [8, 15],
    order: 2,
    renderFeature: "Haversian canal, concentric lamellae, Volkmann links",
    scaleRange: "200-350 um osteon; 50-150 um central canal",
    source: "Project brief osteon and Haversian dimensions",
  },
  {
    id: "B3",
    label: "Lamella",
    order: 3,
    renderFeature: "plywood collagen orientation with osteocyte lacunae",
    scaleRange: "3-7 um lamellae",
    source: "Project brief lamellar bone microstructure",
  },
  {
    id: "B4",
    label: "Collagen plus hydroxyapatite",
    mineral: "Ca10(PO4)6(OH)2 plates, about 50 x 25 x 3 nm",
    order: 4,
    renderFeature: "mineralized fibrils with hydroxyapatite platelets",
    scaleRange: "10-100 nm",
    source: "Project brief hydroxyapatite crystal plate dimensions",
  },
  {
    id: "B5",
    label: "Hydroxyapatite crystal",
    mineral: "Ca10(PO4)6(OH)2 unit-cell lattice",
    order: 5,
    renderFeature: "atomic unit-cell crystal structure",
    scaleRange: "angstrom to nm",
    source: "Project brief hydroxyapatite crystal structure",
  },
];

export const CARTILAGE_ZONES: CartilageZone[] = [
  {
    collagenOrientation: "tangential collagen",
    feature: "flat chondrocytes and lubricin-rich articular surface",
    id: "superficial",
    label: "Superficial zone",
    percentDepth: [10, 20],
  },
  {
    collagenOrientation: "oblique collagen",
    feature: "spherical chondrocytes in hydrated proteoglycan matrix",
    id: "middle",
    label: "Middle zone",
    percentDepth: [40, 60],
  },
  {
    collagenOrientation: "perpendicular collagen",
    feature: "columnar chondrocytes aligned with compression axis",
    id: "deep",
    label: "Deep zone",
    percentDepth: [30, 30],
  },
  {
    collagenOrientation: "mineral transition line",
    feature: "tidemark separating uncalcified from calcified cartilage",
    id: "tidemark",
    label: "Tidemark",
  },
  {
    collagenOrientation: "anchoring collagen into subchondral bone",
    feature: "mineralized cartilage that fixes the articular layer to bone",
    id: "calcified",
    label: "Calcified zone",
  },
];

export const SYNOVIAL_JOINT_DETAIL: JointDetail = {
  capsule: "Outer fibrous capsule built from dense collagenous tissue.",
  id: "synovial_joint",
  label: "Synovial joint",
  synovialFluid:
    "hyaluronic acid about 3-4 mg/mL at 6-7 MDa plus lubricin PRG4 about 227 kDa.",
  synovialMembrane:
    "Inner intima is 1-4 cells thick with Type A macrophage-like and Type B fibroblast-like synoviocytes.",
};

export const TISSUE_SYSTEMS: TissueSystemSummary[] = [
  {
    accessibleFrom: "Level 4 muscle tendon insertion",
    id: "tendon",
    label: "Tendon",
    levels: TENDON_LEVELS.length,
  },
  {
    accessibleFrom: "Level 2 skeletal layer bone click",
    id: "bone",
    label: "Bone",
    levels: BONE_LEVELS.length,
  },
  {
    accessibleFrom: "Level 2 joint layer articular surface",
    id: "cartilage",
    label: "Cartilage",
    levels: CARTILAGE_ZONES.length,
  },
  {
    accessibleFrom: "Level 2 joint layer synovial joint",
    id: "joint",
    label: "Joint",
    levels: 1,
  },
];

export function getTendonZoomPath(
  direction: "macro_to_micro" | "micro_to_macro" = "macro_to_micro",
): TendonZoomLevel[] {
  return direction === "macro_to_micro"
    ? TENDON_LEVELS
    : [...TENDON_LEVELS].reverse();
}

export function getBoneZoomPath(): BoneZoomLevel[] {
  return BONE_LEVELS;
}

export function getOsteonLevel(): BoneZoomLevel {
  return BONE_LEVELS[1];
}

export function getCartilageStructuralZones(): CartilageZone[] {
  return CARTILAGE_ZONES;
}

export function hasCartilageTidemark(): boolean {
  return CARTILAGE_ZONES.some((zone) => zone.id === "tidemark");
}

export function hasTendonDBanding(): boolean {
  return TENDON_LEVELS.some((level) => level.dBandingNm === 67);
}

export function estimateTissueSystemFps(system: TissueSystemId): number {
  if (system === "cartilage" || system === "joint") {
    return 60;
  }

  return system === "bone" ? 60 : 60;
}
