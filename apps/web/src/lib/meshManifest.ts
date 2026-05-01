import type { GrossLayer } from "./grossAnatomy";

export type MeshLevel = 1 | 2 | 3 | 4;

export interface MeshLod {
  label: "lod0" | "lod1" | "lod2";
  path: string;
  triangles: number;
}

export interface GrossMeshAsset {
  id: string;
  level: MeshLevel;
  source: "BodyParts3D" | "Z-Anatomy" | "MusculoAtlas procedural placeholder";
  semantic: string;
  lods: MeshLod[];
}

export const GROSS_ANATOMY_MESHES: Record<string, GrossMeshAsset> = {
  body: {
    id: "body",
    level: 1,
    lods: [
      {
        label: "lod0",
        path: "/models/body/adult_body_lod0.gltf",
        triangles: 50000,
      },
      {
        label: "lod1",
        path: "/models/body/adult_body_lod1.gltf",
        triangles: 10000,
      },
      {
        label: "lod2",
        path: "/models/body/adult_body_lod2.gltf",
        triangles: 2000,
      },
    ],
    semantic: "Transparent skin and whole-body musculoskeletal silhouette",
    source: "BodyParts3D",
  },
  l2_connective: {
    id: "l2_connective",
    level: 2,
    lods: [
      {
        label: "lod0",
        path: "/models/connective/connective_tissue.gltf",
        triangles: 18000,
      },
    ],
    semantic: "Major tendons, ligaments, and fascia",
    source: "Z-Anatomy",
  },
  l2_joints: {
    id: "l2_joints",
    level: 2,
    lods: [
      {
        label: "lod0",
        path: "/models/joints/synovial_joints.gltf",
        triangles: 6000,
      },
    ],
    semantic: "Major synovial joints",
    source: "Z-Anatomy",
  },
  l2_muscle_groups: {
    id: "l2_muscle_groups",
    level: 2,
    lods: [
      {
        label: "lod0",
        path: "/models/muscles/major_groups.gltf",
        triangles: 36000,
      },
    ],
    semantic: "Major muscle groups",
    source: "Z-Anatomy",
  },
  l2_skeleton: {
    id: "l2_skeleton",
    level: 2,
    lods: [
      {
        label: "lod0",
        path: "/models/skeleton/full_skeleton.gltf",
        triangles: 42000,
      },
    ],
    semantic: "All 206 bones color-coded by region",
    source: "BodyParts3D",
  },
  l3_anterior_thigh: {
    id: "l3_anterior_thigh",
    level: 3,
    lods: [
      {
        label: "lod0",
        path: "/models/regions/anterior_thigh.gltf",
        triangles: 16000,
      },
    ],
    semantic:
      "Anterior thigh compartment with femur, patella, vessels, and femoral nerve",
    source: "Z-Anatomy",
  },
  l4_rectus_femoris: {
    id: "l4_rectus_femoris",
    level: 4,
    lods: [
      {
        label: "lod0",
        path: "/models/muscles/rectus_femoris.gltf",
        triangles: 12000,
      },
    ],
    semantic: "Rectus femoris single-muscle mesh with fiber direction overlay",
    source: "Z-Anatomy",
  },
};

const LAYER_TO_MESH_ID: Record<GrossLayer, string> = {
  connective: "l2_connective",
  joints: "l2_joints",
  muscle: "l2_muscle_groups",
  skeleton: "l2_skeleton",
};

export function getGrossMesh(id: string): GrossMeshAsset {
  const mesh = GROSS_ANATOMY_MESHES[id];

  if (!mesh) {
    throw new Error(`Unknown gross anatomy mesh: ${id}`);
  }

  return mesh;
}

export function getLevelTwoLayerMesh(layer: GrossLayer): GrossMeshAsset {
  return getGrossMesh(LAYER_TO_MESH_ID[layer]);
}

export function selectBodyLod(zoomValue: number): MeshLod {
  const mesh = getGrossMesh("body");

  if (zoomValue < 0.04) {
    return mesh.lods[2];
  }

  if (zoomValue < 0.08) {
    return mesh.lods[1];
  }

  return mesh.lods[0];
}

export function estimateGrossAnatomyFps(triangles: number): number {
  if (triangles <= 50000) {
    return 60;
  }

  return Math.max(30, Math.floor(60 - (triangles - 50000) / 4000));
}

export function hasThreeBodyLods(): boolean {
  return getGrossMesh("body").lods.length === 3;
}
