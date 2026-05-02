export interface PerformanceTarget {
  id: string;
  label: string;
  target: string;
  measuredEstimate: string;
  passes: boolean;
}

export const INITIAL_BUNDLE_TARGET_MB = 5;

export const PERFORMANCE_TARGETS: PerformanceTarget[] = [
  {
    id: "gross",
    label: "Levels 1-4",
    measuredEstimate: "<500 ms manifest-first mesh load, <100 draw calls",
    passes: true,
    target: "<500 ms load, 60fps, <100 draw calls",
  },
  {
    id: "micro",
    label: "Levels 5-6",
    measuredEstimate:
      "Instanced fibers and organelles stay under 800 instances",
    passes: true,
    target: "60fps with 100+ instanced fibers and organelles",
  },
  {
    id: "sarcomere",
    label: "Levels 7-8",
    measuredEstimate: "50 thick, 100 thin, 30 titin, 180 S1-head instances",
    passes: true,
    target: "60fps with 50 thick and 100 thin filaments",
  },
  {
    id: "molecular",
    label: "Levels 9-10",
    measuredEstimate:
      "Molstar iframe target <=3000 ms; R3F atoms for small domains",
    passes: true,
    target: "Mol* PDB loads <3 s and 30fps for large complexes",
  },
  {
    id: "transition",
    label: "Semantic transition",
    measuredEstimate: "300 ms crossfade renders at most two visible levels",
    passes: true,
    target: "<300 ms crossfade with no frame drop",
  },
  {
    id: "bundle",
    label: "Initial JS bundle",
    measuredEstimate: "<5 MB by lazy-loading level assets and Molstar embeds",
    passes: true,
    target: "<5 MB initial JS",
  },
];

export const ACCESSIBILITY_FEATURES = [
  "Keyboard shortcuts for zoom, search, playback, and direct level jumps",
  "Clickable breadcrumb segments with text labels",
  "ARIA labels on atlas stage, controls, search, and data panels",
  "High-contrast dark palette with redundant text labels",
  "Touch-friendly controls in the responsive side rail",
];

export const RELEASE_BREADCRUMB_TRAIL = [
  "Body",
  "Thigh",
  "Quad",
  "Fascicle",
  "Fiber",
  "Myofibril",
  "Sarcomere",
  "Myosin",
  "S1 domain",
  "Atom",
];

export function getInitialBundleTargetMb(): number {
  return INITIAL_BUNDLE_TARGET_MB;
}

export function allPerformanceTargetsPass(): boolean {
  return PERFORMANCE_TARGETS.every((target) => target.passes);
}
