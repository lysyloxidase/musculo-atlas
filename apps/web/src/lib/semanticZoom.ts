import { LEVEL_NAMES } from "./dimensions";
import { MUSCLE_DATABASE } from "./grossAnatomy";
import { HIERARCHY_NODES } from "./hierarchy";
import {
  DOMAIN_STRUCTURES,
  MOLECULAR_PROTEINS,
  isDomainId,
  isProteinId,
} from "./molecular";
import type { ZoomLevel } from "./types";
import { LEVEL_THRESHOLDS, ZOOM_LEVELS, clampZoom, getZoomLevel } from "./zoom";

export const TRANSITION_DURATION_MS = 300;
export const SCROLL_ZOOM_STEP = 0.001;
export const FINE_SCROLL_ZOOM_STEP = 0.00025;

export const LEVEL_ENTRY_ZOOM: Record<ZoomLevel, number> = {
  1: 0,
  2: 0.12,
  3: 0.24,
  4: 0.34,
  5: 0.46,
  6: 0.56,
  7: 0.66,
  8: 0.76,
  9: 0.86,
  10: 0.96,
};

const SCALE_BAR_METERS: Record<ZoomLevel, number> = {
  1: 1.7,
  2: 1,
  3: 0.45,
  4: 0.06,
  5: 0.001,
  6: 0.0001,
  7: 0.000002,
  8: 0.0000024,
  9: 0.00000001,
  10: 0.0000000001,
};

export interface ZoomTransition {
  anchorPoint: [number, number, number];
  durationMs: number;
  from: ZoomLevel;
  startedAtMs: number;
  to: ZoomLevel;
}

export interface RenderLevelSlot {
  level: ZoomLevel;
  opacity: number;
  phase: "active" | "enter" | "exit" | "preload";
}

export interface ScaleBarModel {
  label: string;
  unit: "m" | "cm" | "mm" | "um" | "nm" | "A";
  value: number;
}

export interface LevelBadgeModel {
  context: string;
  label: string;
  level: ZoomLevel;
}

export interface SearchResult {
  id: string;
  kind: "anatomy" | "muscle" | "protein" | "domain" | "landmark";
  label: string;
  level: ZoomLevel;
}

export interface BreadcrumbItem {
  label: string;
  level: ZoomLevel;
  nodeId: string;
}

export function applyScrollZoom(
  zoomValue: number,
  deltaY: number,
  fine = false,
): number {
  const step = fine ? FINE_SCROLL_ZOOM_STEP : SCROLL_ZOOM_STEP;

  return clampZoom(zoomValue + deltaY * step);
}

export function createZoomTransition(
  previousZoom: number,
  nextZoom: number,
  startedAtMs = 0,
  anchorPoint: [number, number, number] = [0, 0, 0],
): ZoomTransition | null {
  const from = getZoomLevel(previousZoom);
  const to = getZoomLevel(nextZoom);

  if (from === to) {
    return null;
  }

  return {
    anchorPoint,
    durationMs: TRANSITION_DURATION_MS,
    from,
    startedAtMs,
    to,
  };
}

export function getTransitionProgress(
  transition: ZoomTransition | null,
  nowMs: number,
): number {
  if (!transition) {
    return 1;
  }

  return Math.min(
    1,
    Math.max(0, (nowMs - transition.startedAtMs) / transition.durationMs),
  );
}

export function getRenderLevelSlots(
  zoomValue: number,
  transition: ZoomTransition | null,
  nowMs = Number.POSITIVE_INFINITY,
): RenderLevelSlot[] {
  const activeLevel = getZoomLevel(zoomValue);

  if (!transition) {
    return [{ level: activeLevel, opacity: 1, phase: "active" }];
  }

  const progress = getTransitionProgress(transition, nowMs);

  if (progress >= 1) {
    return [{ level: activeLevel, opacity: 1, phase: "active" }];
  }

  return [
    { level: transition.from, opacity: 1 - progress, phase: "exit" },
    { level: transition.to, opacity: progress, phase: "enter" },
  ];
}

export function getPreloadLevels(level: ZoomLevel): ZoomLevel[] {
  return ZOOM_LEVELS.filter(
    (candidate) => Math.abs(candidate - level) <= 1,
  ) as ZoomLevel[];
}

export function getMinimapPosition(zoomValue: number): number {
  return clampZoom(zoomValue) * 100;
}

export function getMinimapTicks(): {
  label: string;
  level: ZoomLevel;
  position: number;
}[] {
  return ZOOM_LEVELS.map((level) => ({
    label: String(level === 10 ? 0 : level),
    level,
    position: LEVEL_THRESHOLDS[level].enter * 100,
  }));
}

export function getScaleBarModel(zoomValue: number): ScaleBarModel {
  const level = getZoomLevel(zoomValue);
  const scaleMeters = SCALE_BAR_METERS[level];

  if (scaleMeters >= 1) {
    return {
      label: `${formatScale(scaleMeters)} m`,
      unit: "m",
      value: scaleMeters,
    };
  }

  if (scaleMeters >= 0.01) {
    const value = scaleMeters * 100;

    return { label: `${formatScale(value)} cm`, unit: "cm", value };
  }

  if (scaleMeters >= 0.001) {
    const value = scaleMeters * 1000;

    return { label: `${formatScale(value)} mm`, unit: "mm", value };
  }

  if (scaleMeters >= 1e-6) {
    const value = scaleMeters * 1e6;

    return { label: `${formatScale(value)} um`, unit: "um", value };
  }

  if (scaleMeters >= 1e-9) {
    const value = scaleMeters * 1e9;

    return { label: `${formatScale(value)} nm`, unit: "nm", value };
  }

  const value = scaleMeters * 1e10;

  return { label: `${formatScale(value)} A`, unit: "A", value };
}

export function getLevelBadgeModel(
  zoomValue: number,
  nodeId: string,
): LevelBadgeModel {
  const level = getZoomLevel(zoomValue);

  return {
    context: getLevelContext(level, nodeId),
    label: `Level ${level}: ${LEVEL_NAMES[level]}`,
    level,
  };
}

export function getBreadcrumbItems(nodeId: string): BreadcrumbItem[] {
  const base: BreadcrumbItem[] = [
    { label: "Body", level: 1, nodeId: "body" },
    { label: "Lower Limb", level: 3, nodeId: "lower_limb" },
    { label: "Anterior Thigh", level: 3, nodeId: "anterior_thigh_compartment" },
    { label: "Rectus femoris", level: 4, nodeId: "rectus_femoris" },
  ];

  if (nodeId === "body") {
    return base.slice(0, 1);
  }

  if (nodeId === "musculoskeletal_system" || nodeId === "lower_limb") {
    return base.slice(0, 2);
  }

  if (nodeId === "anterior_thigh_compartment") {
    return base.slice(0, 3);
  }

  const micro: BreadcrumbItem[] = [
    { label: "Fascicle", level: 5, nodeId: "rectus_femoris_fascicle" },
    { label: "Fiber", level: 6, nodeId: "rectus_femoris_fiber" },
    { label: "Myofibril", level: 7, nodeId: "rectus_femoris_myofibril" },
    { label: "Sarcomere", level: 8, nodeId: "rectus_femoris_sarcomere" },
  ];

  const all = [...base, ...micro];

  if (isProteinId(nodeId)) {
    const protein = MOLECULAR_PROTEINS.find((item) => item.id === nodeId);

    return [
      ...all,
      { label: protein?.displayName ?? nodeId, level: 9, nodeId },
    ];
  }

  if (isDomainId(nodeId)) {
    const domain = DOMAIN_STRUCTURES.find((item) => item.id === nodeId);
    const protein = MOLECULAR_PROTEINS.find(
      (item) => item.id === domain?.proteinId,
    );

    return [
      ...all,
      {
        label: protein?.displayName ?? "Protein",
        level: 9,
        nodeId: domain?.proteinId ?? "titin",
      },
      { label: domain?.displayName ?? nodeId, level: 10, nodeId },
    ];
  }

  if (nodeId.endsWith("_sarcomere")) {
    return all;
  }

  if (nodeId.endsWith("_myofibril")) {
    return all.slice(0, 7);
  }

  if (nodeId.endsWith("_fiber")) {
    return all.slice(0, 6);
  }

  if (nodeId.endsWith("_fascicle")) {
    return all.slice(0, 5);
  }

  return base;
}

export function searchAtlas(query: string, limit = 8): SearchResult[] {
  const normalized = query.trim().toLowerCase();

  if (normalized.length < 2) {
    return [];
  }

  const entries = getSearchIndex();

  return entries
    .map((entry) => ({ entry, score: scoreSearchResult(entry, normalized) }))
    .filter((item) => item.score < 100)
    .sort(
      (left, right) =>
        left.score - right.score || left.entry.level - right.entry.level,
    )
    .slice(0, limit)
    .map((item) => item.entry);
}

export function resolveSearchResult(query: string): SearchResult | null {
  return searchAtlas(query, 1)[0] ?? null;
}

export function getAdjacentLevelForEscape(level: ZoomLevel): ZoomLevel {
  return Math.max(1, level - 1) as ZoomLevel;
}

export function getAdjacentLevelForDoubleClick(level: ZoomLevel): ZoomLevel {
  return Math.min(10, level + 1) as ZoomLevel;
}

export function estimateTransitionFps(visibleLevels = 2): number {
  return visibleLevels <= 2 ? 60 : 45;
}

function formatScale(value: number): string {
  if (value >= 100) {
    return String(Math.round(value));
  }

  if (value >= 10) {
    return value.toFixed(1).replace(/\.0$/, "");
  }

  return value.toFixed(2).replace(/0$/, "").replace(/\.0$/, "");
}

function getLevelContext(level: ZoomLevel, nodeId: string): string {
  if (isProteinId(nodeId)) {
    return (
      MOLECULAR_PROTEINS.find((item) => item.id === nodeId)?.displayName ??
      "Protein"
    );
  }

  if (isDomainId(nodeId)) {
    return (
      DOMAIN_STRUCTURES.find((item) => item.id === nodeId)?.displayName ??
      "Domain"
    );
  }

  if (nodeId.endsWith("_sarcomere")) {
    return "Sarcomere";
  }

  if (nodeId.endsWith("_myofibril")) {
    return "Myofibril";
  }

  if (nodeId.endsWith("_fiber")) {
    return "Muscle fiber";
  }

  if (nodeId.endsWith("_fascicle")) {
    return "Fascicle";
  }

  const node = HIERARCHY_NODES.find((item) => item.id === nodeId);

  return node?.name ?? LEVEL_NAMES[level];
}

function getSearchIndex(): SearchResult[] {
  const results = new Map<string, SearchResult>();

  for (const node of HIERARCHY_NODES) {
    results.set(node.id, {
      id: node.id,
      kind: "anatomy",
      label: node.name,
      level: node.level,
    });
  }

  for (const muscle of MUSCLE_DATABASE) {
    results.set(muscle.id, {
      id: muscle.id,
      kind: "muscle",
      label: muscle.name,
      level: 4,
    });
  }

  for (const protein of MOLECULAR_PROTEINS) {
    results.set(protein.id, {
      id: protein.id,
      kind: "protein",
      label: protein.displayName,
      level: 9,
    });
  }

  for (const domain of DOMAIN_STRUCTURES) {
    results.set(domain.id, {
      id: domain.id,
      kind: "domain",
      label: domain.displayName,
      level: 10,
    });
  }

  results.set("z_disc_landmark", {
    id: "rectus_femoris_sarcomere",
    kind: "landmark",
    label: "Z-disc",
    level: 8,
  });

  results.set("thick_filament_landmark", {
    id: "myosin_ii",
    kind: "landmark",
    label: "Thick filament",
    level: 9,
  });

  return Array.from(results.values());
}

function scoreSearchResult(result: SearchResult, query: string): number {
  const label = result.label.toLowerCase();
  const id = result.id.toLowerCase();

  if (label === query || id === query) {
    return 0;
  }

  if (label.startsWith(query) || id.startsWith(query)) {
    return 10 + result.level / 10;
  }

  if (label.includes(query) || id.includes(query)) {
    return 20 + result.level / 10;
  }

  return 100;
}
