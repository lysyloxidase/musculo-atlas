"use client";

import { useEffect, useRef } from "react";
import { type InstancedMesh, Object3D } from "three";

interface InstancedSarcomeresProps {
  count: number;
  spacing: number;
}

export default function InstancedSarcomeres({
  count,
  spacing,
}: InstancedSarcomeresProps) {
  const meshRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    const object = new Object3D();
    const offset = ((count - 1) * spacing) / 2;

    for (let index = 0; index < count; index += 1) {
      object.position.set(index * spacing - offset, 0, 0);
      object.scale.set(1, 1, 1);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, spacing]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.08, 0.42, 0.08]} />
      <meshStandardMaterial color="#ee7664" roughness={0.74} />
    </instancedMesh>
  );
}
