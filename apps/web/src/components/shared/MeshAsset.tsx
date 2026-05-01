"use client";

import type { MeshLod } from "@/lib/meshManifest";
import { useLoader } from "@react-three/fiber";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface MeshAssetProps extends PropsWithChildren {
  lod: MeshLod;
  name: string;
}

export default function MeshAsset({ children, lod, name }: MeshAssetProps) {
  const gltf = useLoader(GLTFLoader, lod.path);
  const loadedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return (
    <group name={name} userData={{ lod: lod.label, triangles: lod.triangles }}>
      <primitive object={loadedScene} visible={false} />
      {children}
    </group>
  );
}
