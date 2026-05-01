"use client";

import {
  type FascicleConfig,
  buildFascicleConfig,
  generateHoneycombFibers,
} from "@/lib/microAnatomy";
import { useEffect, useMemo, useRef } from "react";
import { type InstancedMesh, Object3D } from "three";

interface EndomysiumNetworkProps {
  config?: FascicleConfig;
}

export default function EndomysiumNetwork({
  config = buildFascicleConfig(),
}: EndomysiumNetworkProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const fibers = useMemo(() => generateHoneycombFibers(config), [config]);

  useEffect(() => {
    const object = new Object3D();

    fibers.forEach((fiber, index) => {
      object.position.set(0.33, fiber.x, fiber.y);
      object.rotation.set(0, Math.PI / 2, 0);
      object.scale.set(
        fiber.radius * 1.08,
        fiber.radius * 1.08,
        fiber.radius * 1.08,
      );
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [fibers]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, fibers.length]}
      name="endomysium-membranes"
      userData={{ layer: "endomysium", visibleBetweenFibers: true }}
    >
      <torusGeometry args={[1, 0.025, 6, 18]} />
      <meshStandardMaterial
        color="#efe6d1"
        roughness={0.7}
        transparent
        opacity={0.42}
      />
    </instancedMesh>
  );
}
