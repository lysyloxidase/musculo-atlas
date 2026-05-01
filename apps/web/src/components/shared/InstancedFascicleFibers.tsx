"use client";

import {
  type FascicleConfig,
  buildFascicleConfig,
  generateHoneycombFibers,
} from "@/lib/microAnatomy";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { type InstancedMesh, Object3D } from "three";

interface InstancedFascicleFibersProps {
  config?: FascicleConfig;
  crossSection: boolean;
  onSelectFiber: (fiberId: string) => void;
}

export default function InstancedFascicleFibers({
  config = buildFascicleConfig(),
  crossSection,
  onSelectFiber,
}: InstancedFascicleFibersProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const fibers = useMemo(() => generateHoneycombFibers(config), [config]);
  const length = crossSection ? 0.62 : 1.55;

  useEffect(() => {
    const object = new Object3D();

    fibers.forEach((fiber, index) => {
      object.position.set(0, fiber.x, fiber.y);
      object.rotation.set(0, 0, Math.PI / 2);
      object.scale.set(fiber.radius, length, fiber.radius);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [fibers, length]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, fibers.length]}
      name="fascicle-fibers"
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        const instanceId = event.instanceId ?? 0;
        onSelectFiber(fibers[instanceId]?.id ?? "fiber_1");
      }}
      userData={{
        fiberCount: fibers.length,
        instanced: true,
        maxBiologicalFibers: 100,
        minBiologicalFibers: 10,
      }}
    >
      <cylinderGeometry args={[1, 1, 1, 10]} />
      <meshStandardMaterial color="#c9574b" roughness={0.82} />
    </instancedMesh>
  );
}
