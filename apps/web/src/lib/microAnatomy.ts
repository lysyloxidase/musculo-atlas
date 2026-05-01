export type FiberType = "type_I" | "type_IIa" | "type_IIx";

export interface FascicleConfig {
  id: string;
  diameter_um: number;
  length_mm: number;
  fiberCount: number;
  fiberDiameterRange_um: [number, number];
  perimysiumLayers: 2;
  collagenPattern: "crossed_wavy";
  capillaryCount: number;
  source: string;
}

export interface FiberInstance {
  id: string;
  x: number;
  y: number;
  radius: number;
  ring: number;
}

export interface FiberTypeProfile {
  id: FiberType;
  label: string;
  myosinGene: "MYH7" | "MYH2" | "MYH1";
  diameter_um: number;
  length_cm: number;
  nucleiCount: number;
  renderedNuclei: number;
  myofibrilCount: number;
  renderedMyofibrils: number;
  mitochondriaVolumePct: number;
  mitochondriaRendered: number;
  glycogenParticleCount: number;
  lipidDropletCount: number;
  color: string;
  description: string;
}

export interface FiberOrganelleCounts {
  glycogenParticles: number;
  lipidDroplets: number;
  mitochondria: number;
  myofibrils: number;
  nuclei: number;
  satelliteCells: number;
  tTubuleDiscs: number;
}

export const DEFAULT_FASCICLE_CONFIG: FascicleConfig = {
  capillaryCount: 16,
  collagenPattern: "crossed_wavy",
  diameter_um: 240,
  fiberCount: 64,
  fiberDiameterRange_um: [35, 72],
  id: "rectus_femoris_fascicle",
  length_mm: 10,
  perimysiumLayers: 2,
  source:
    "Gillies and Lieber 2011 skeletal muscle extracellular matrix; project brief fascicle dimensions",
};

export const FIBER_TYPE_PROFILES: Record<FiberType, FiberTypeProfile> = {
  type_I: {
    color: "#b5443e",
    description:
      "Slow oxidative fiber with high mitochondrial density and lipid droplets.",
    diameter_um: 52,
    glycogenParticleCount: 280,
    id: "type_I",
    label: "Type I",
    length_cm: 6.6,
    lipidDropletCount: 26,
    mitochondriaRendered: 48,
    mitochondriaVolumePct: 6,
    myofibrilCount: 1200,
    myosinGene: "MYH7",
    nucleiCount: 420,
    renderedMyofibrils: 50,
    renderedNuclei: 42,
  },
  type_IIa: {
    color: "#cf6a50",
    description:
      "Fast oxidative-glycolytic fiber with intermediate mitochondrial and glycogen content.",
    diameter_um: 66,
    glycogenParticleCount: 430,
    id: "type_IIa",
    label: "Type IIa",
    length_cm: 6.6,
    lipidDropletCount: 12,
    mitochondriaRendered: 32,
    mitochondriaVolumePct: 4.5,
    myofibrilCount: 1500,
    myosinGene: "MYH2",
    nucleiCount: 520,
    renderedMyofibrils: 50,
    renderedNuclei: 52,
  },
  type_IIx: {
    color: "#e9b58f",
    description:
      "Fast glycolytic fiber with lower mitochondrial density and higher glycogen.",
    diameter_um: 78,
    glycogenParticleCount: 620,
    id: "type_IIx",
    label: "Type IIx",
    length_cm: 6.6,
    lipidDropletCount: 4,
    mitochondriaRendered: 16,
    mitochondriaVolumePct: 2.3,
    myofibrilCount: 1800,
    myosinGene: "MYH1",
    nucleiCount: 610,
    renderedMyofibrils: 50,
    renderedNuclei: 61,
  },
};

export const T_TUBULE_SPACING_UM = 1.2;
export const T_TUBULE_LUMEN_NM: [number, number] = [30, 40];
export const SARCOLEMMA_THICKNESS_NM = 7.5;
export const SATELLITE_CELL_NUCLEI_FRACTION = 0.01;

function clampFiberCount(count: number): number {
  return Math.min(100, Math.max(10, Math.round(count)));
}

export function buildFascicleConfig(
  overrides: Partial<FascicleConfig> = {},
): FascicleConfig {
  const fiberCount = clampFiberCount(
    overrides.fiberCount ?? DEFAULT_FASCICLE_CONFIG.fiberCount,
  );

  return {
    ...DEFAULT_FASCICLE_CONFIG,
    ...overrides,
    fiberCount,
    perimysiumLayers: 2,
  };
}

export function generateHoneycombFibers(
  config: FascicleConfig,
): FiberInstance[] {
  const fibers: FiberInstance[] = [];
  const radiusLimit = 0.88;
  const spacing = 0.16;
  const maxRing = 8;

  for (let q = -maxRing; q <= maxRing; q += 1) {
    for (let r = -maxRing; r <= maxRing; r += 1) {
      const x = spacing * (q + r / 2);
      const y = spacing * ((Math.sqrt(3) / 2) * r);
      const distance = Math.sqrt(x * x + y * y);

      if (distance < radiusLimit && fibers.length < config.fiberCount) {
        const normalized = fibers.length / Math.max(1, config.fiberCount - 1);
        const diameter =
          config.fiberDiameterRange_um[0] +
          (config.fiberDiameterRange_um[1] - config.fiberDiameterRange_um[0]) *
            ((Math.sin(normalized * Math.PI * 6) + 1) / 2);

        fibers.push({
          id: `fiber_${fibers.length + 1}`,
          radius: (diameter / config.diameter_um) * 0.25,
          ring: Math.round(distance / spacing),
          x,
          y,
        });
      }
    }
  }

  return fibers;
}

export function getFiberTypeProfile(fiberType: FiberType): FiberTypeProfile {
  return FIBER_TYPE_PROFILES[fiberType];
}

export function getFiberOrganelleCounts(
  fiberType: FiberType,
): FiberOrganelleCounts {
  const profile = getFiberTypeProfile(fiberType);
  const satelliteCells = Math.max(
    1,
    Math.round(profile.renderedNuclei * SATELLITE_CELL_NUCLEI_FRACTION),
  );

  return {
    glycogenParticles: profile.glycogenParticleCount,
    lipidDroplets: profile.lipidDropletCount,
    mitochondria: profile.mitochondriaRendered,
    myofibrils: profile.renderedMyofibrils,
    nuclei: profile.renderedNuclei,
    satelliteCells,
    tTubuleDiscs: 18,
  };
}

export function getMitochondriaDensityRank(): FiberType[] {
  return Object.values(FIBER_TYPE_PROFILES)
    .sort((a, b) => b.mitochondriaVolumePct - a.mitochondriaVolumePct)
    .map((profile) => profile.id);
}

export function estimateInstancedLevelFps(instanceCount: number): number {
  if (instanceCount <= 800) {
    return 60;
  }

  return Math.max(35, Math.floor(60 - (instanceCount - 800) / 120));
}

export function getLevelFiveInstanceBudget(
  config = DEFAULT_FASCICLE_CONFIG,
): number {
  return config.fiberCount + config.fiberCount + config.capillaryCount + 24;
}

export function hasWavyPerimysium(config = DEFAULT_FASCICLE_CONFIG): boolean {
  return (
    config.collagenPattern === "crossed_wavy" && config.perimysiumLayers === 2
  );
}
