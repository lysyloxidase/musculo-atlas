import type { FiberType } from "./microAnatomy";

export type CrossBridgeStepId =
  | "weak_attachment"
  | "power_stroke"
  | "rigor"
  | "detachment"
  | "recovery_stroke";

export interface BandGeometry {
  aBandWidthUm: number;
  halfIbandWidthUm: number;
  hZoneWidthUm: number;
  iBandWidthUm: number;
  mLineWidthUm: number;
  overlapPerSideUm: number;
  sarcomereLengthUm: number;
  thickFilamentLengthUm: number;
  thinFilamentLengthUm: number;
  titinExtensionUm: number;
  zDiscThicknessUm: number;
  zLeftUm: number;
  zRightUm: number;
}

export interface CrossBridgeStep {
  id: CrossBridgeStepId;
  label: string;
  leverArmDeg: number;
  slidingNm: number;
}

export interface SarcomereRenderBudget {
  s1Heads: number;
  thickFilaments: number;
  thinFilaments: number;
  titinFilaments: number;
}

export const THICK_FILAMENT_LENGTH_UM = 1.65;
export const THICK_FILAMENT_DIAMETER_UM = 0.015;
export const THIN_FILAMENT_LENGTH_UM = 1.0;
export const THIN_FILAMENT_DIAMETER_UM = 0.007;
export const M_LINE_WIDTH_UM = 0.075;
export const CROWN_SPACING_UM = 0.01433;
export const THICK_HELIX_REPEAT_UM = 0.043;
export const TROPONIN_SPACING_UM = 0.0385;
export const MYOSINS_PER_THICK_FILAMENT = 294;
export const TITINS_PER_THICK_FILAMENT = 6;

export const VISIBLE_FILAMENT_BUDGET: SarcomereRenderBudget = {
  s1Heads: 180,
  thickFilaments: 50,
  thinFilaments: 100,
  titinFilaments: 30,
};

export const CROSS_BRIDGE_CYCLE: CrossBridgeStep[] = [
  {
    id: "weak_attachment",
    label: "M.ADP.Pi weak attachment",
    leverArmDeg: 25,
    slidingNm: 0,
  },
  {
    id: "power_stroke",
    label: "Pi release and power stroke",
    leverArmDeg: 67,
    slidingNm: 7,
  },
  {
    id: "rigor",
    label: "ADP release and rigor",
    leverArmDeg: 70,
    slidingNm: 8,
  },
  {
    id: "detachment",
    label: "ATP binding detaches head",
    leverArmDeg: 18,
    slidingNm: 8,
  },
  {
    id: "recovery_stroke",
    label: "ATP hydrolysis re-cocks head",
    leverArmDeg: 32,
    slidingNm: 0,
  },
];

const Z_DISC_THICKNESS_BY_FIBER: Record<FiberType, number> = {
  type_I: 0.12,
  type_IIa: 0.075,
  type_IIx: 0.03,
};

export function clampSarcomereLength(lengthUm: number): number {
  if (!Number.isFinite(lengthUm)) {
    return 2.4;
  }

  return Math.min(3.5, Math.max(1.8, lengthUm));
}

export function getZDiscThicknessUm(fiberType: FiberType): number {
  return Z_DISC_THICKNESS_BY_FIBER[fiberType];
}

export function calculateBandGeometry(
  sarcomereLengthUm: number,
  fiberType: FiberType,
): BandGeometry {
  const length = clampSarcomereLength(sarcomereLengthUm);
  const halfLength = length / 2;
  const halfThick = THICK_FILAMENT_LENGTH_UM / 2;
  const iBandWidthUm = Math.max(0, length - THICK_FILAMENT_LENGTH_UM);
  const halfIbandWidthUm = iBandWidthUm / 2;
  const overlapPerSideUm = Math.max(
    0,
    Math.min(
      THIN_FILAMENT_LENGTH_UM,
      THIN_FILAMENT_LENGTH_UM - (halfLength - halfThick),
    ),
  );
  const hZoneWidthUm = Math.max(
    0,
    THICK_FILAMENT_LENGTH_UM - 2 * overlapPerSideUm,
  );

  return {
    aBandWidthUm: THICK_FILAMENT_LENGTH_UM,
    hZoneWidthUm,
    halfIbandWidthUm,
    iBandWidthUm,
    mLineWidthUm: M_LINE_WIDTH_UM,
    overlapPerSideUm,
    sarcomereLengthUm: length,
    thickFilamentLengthUm: THICK_FILAMENT_LENGTH_UM,
    thinFilamentLengthUm: THIN_FILAMENT_LENGTH_UM,
    titinExtensionUm: halfLength,
    zDiscThicknessUm: getZDiscThicknessUm(fiberType),
    zLeftUm: -halfLength,
    zRightUm: halfLength,
  };
}

export function getLengthTensionForce(sarcomereLengthUm: number): number {
  const length = clampSarcomereLength(sarcomereLengthUm);

  if (length < 2.0) {
    return Math.max(0, (length - 1.6) / 0.4);
  }

  if (length <= 2.2) {
    return 1;
  }

  if (length >= 3.5) {
    return 0;
  }

  if (length <= 3.5) {
    return Math.max(0, 1 - (length - 2.2) / 1.3);
  }

  return 0;
}

export function getCrossBridgeStep(index: number): CrossBridgeStep {
  const normalizedIndex =
    ((Math.round(index) % CROSS_BRIDGE_CYCLE.length) +
      CROSS_BRIDGE_CYCLE.length) %
    CROSS_BRIDGE_CYCLE.length;

  return CROSS_BRIDGE_CYCLE[normalizedIndex];
}

export function estimateSarcomereFps(budget = VISIBLE_FILAMENT_BUDGET): number {
  const instances =
    budget.thickFilaments +
    budget.thinFilaments +
    budget.titinFilaments +
    budget.s1Heads;

  if (instances <= 400) {
    return 60;
  }

  return Math.max(35, Math.floor(60 - (instances - 400) / 40));
}
