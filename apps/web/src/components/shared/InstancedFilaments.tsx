"use client";

import { useEffect, useRef } from "react";
import { type InstancedMesh, Object3D } from "three";

interface InstancedFilamentsProps {
  color: string;
  count: number;
  length: number;
  radius: number;
  yOffset: number;
}

export default function InstancedFilaments({
  color,
  count,
  length,
  radius,
  yOffset,
}: InstancedFilamentsProps) {
  const meshRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    const object = new Object3D();
    const rows = Math.ceil(Math.sqrt(count));

    for (let index = 0; index < count; index += 1) {
      const row = index % rows;
      const column = Math.floor(index / rows);
      object.position.set(0, yOffset + row * 0.06, column * 0.05 - 0.05);
      object.rotation.set(0, 0, Math.PI / 2);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, yOffset]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[radius, radius, length, 16]} />
      <meshStandardMaterial color={color} roughness={0.68} />
    </instancedMesh>
  );
}
