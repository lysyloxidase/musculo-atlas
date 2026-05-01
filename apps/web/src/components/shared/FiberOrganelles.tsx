"use client";

import type {
  FiberStructureLayer,
  StructureVisibility,
} from "@/lib/atlasState";
import {
  type FiberType,
  getFiberOrganelleCounts,
  getFiberTypeProfile,
} from "@/lib/microAnatomy";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  type InstancedMesh,
  Object3D,
  PointsMaterial,
} from "three";

interface FiberOrganellesProps {
  fiberType: FiberType;
  onSelectMyofibril: () => void;
  visibility: StructureVisibility<FiberStructureLayer>;
}

function PeripheralNuclei({ fiberType }: { fiberType: FiberType }) {
  const meshRef = useRef<InstancedMesh>(null);
  const counts = getFiberOrganelleCounts(fiberType);

  useEffect(() => {
    const object = new Object3D();

    for (let index = 0; index < counts.nuclei; index += 1) {
      const angle = index * 2.399963;
      const x = -0.78 + (index / Math.max(1, counts.nuclei - 1)) * 1.56;
      object.position.set(x, Math.cos(angle) * 0.25, Math.sin(angle) * 0.25);
      object.rotation.set(0, 0, angle);
      object.scale.set(0.08, 0.024, 0.034);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [counts.nuclei]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, counts.nuclei]}
      name="peripheral-nuclei"
      userData={{ nuclei: counts.nuclei, placement: "peripheral" }}
    >
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial color="#9d8df1" roughness={0.55} />
    </instancedMesh>
  );
}

function MyofibrilBundle({
  fiberType,
  onSelectMyofibril,
}: {
  fiberType: FiberType;
  onSelectMyofibril: () => void;
}) {
  const meshRef = useRef<InstancedMesh>(null);
  const counts = getFiberOrganelleCounts(fiberType);

  useEffect(() => {
    const object = new Object3D();
    const columns = 10;

    for (let index = 0; index < counts.myofibrils; index += 1) {
      const row = Math.floor(index / columns);
      const column = index % columns;
      object.position.set(0, (column - 4.5) * 0.04, (row - 2) * 0.04);
      object.rotation.set(0, 0, Math.PI / 2);
      object.scale.set(0.012, 1.55, 0.012);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [counts.myofibrils]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, counts.myofibrils]}
      name="banded-myofibrils"
      onClick={(event) => {
        event.stopPropagation();
        onSelectMyofibril();
      }}
      userData={{ banded: true, renderedMyofibrils: counts.myofibrils }}
    >
      <cylinderGeometry args={[1, 1, 1, 6]} />
      <meshStandardMaterial color="#ee7664" roughness={0.72} />
    </instancedMesh>
  );
}

function TTubules({ fiberType }: { fiberType: FiberType }) {
  const counts = getFiberOrganelleCounts(fiberType);
  const discs = Array.from(
    { length: counts.tTubuleDiscs },
    (_, index) => index,
  );

  return (
    <group
      name="t-tubules"
      userData={{ lumenNm: [30, 40], spacing: "A-I junctions" }}
    >
      {discs.map((index) => {
        const x = -0.78 + (index / Math.max(1, discs.length - 1)) * 1.56;

        return (
          <mesh key={index} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.28, 0.004, 6, 52]} />
            <meshStandardMaterial
              color="#5fd0c5"
              roughness={0.42}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function SarcoplasmicReticulum({ fiberType }: { fiberType: FiberType }) {
  const counts = getFiberOrganelleCounts(fiberType);
  const segments = Array.from(
    { length: Math.min(24, counts.myofibrils) },
    (_, index) => index,
  );

  return (
    <group name="sarcoplasmic-reticulum" userData={{ triads: true }}>
      {segments.map((index) => {
        const x = -0.72 + (index / Math.max(1, segments.length - 1)) * 1.44;
        const angle = index * 0.65;

        return (
          <mesh
            key={index}
            position={[x, Math.cos(angle) * 0.16, Math.sin(angle) * 0.16]}
          >
            <torusGeometry args={[0.035, 0.004, 5, 18]} />
            <meshStandardMaterial color="#d7b95d" roughness={0.45} />
          </mesh>
        );
      })}
    </group>
  );
}

function Mitochondria({ fiberType }: { fiberType: FiberType }) {
  const meshRef = useRef<InstancedMesh>(null);
  const counts = getFiberOrganelleCounts(fiberType);

  useEffect(() => {
    const object = new Object3D();

    for (let index = 0; index < counts.mitochondria; index += 1) {
      const angle = index * 1.618;
      const radius = index % 2 === 0 ? 0.21 : 0.11;
      const x = -0.72 + (index / Math.max(1, counts.mitochondria - 1)) * 1.44;
      object.position.set(
        x,
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
      );
      object.rotation.set(angle, 0, Math.PI / 2);
      object.scale.set(0.055, 0.022, 0.026);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [counts.mitochondria]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, counts.mitochondria]}
      name="mitochondria"
      userData={{ count: counts.mitochondria, densityDrivenByFiberType: true }}
    >
      <sphereGeometry args={[1, 14, 10]} />
      <meshStandardMaterial color="#d7b95d" roughness={0.58} />
    </instancedMesh>
  );
}

function SatelliteCells({ fiberType }: { fiberType: FiberType }) {
  const counts = getFiberOrganelleCounts(fiberType);
  const cells = Array.from(
    { length: counts.satelliteCells },
    (_, index) => index,
  );

  return (
    <group
      name="satellite-cells"
      userData={{ pax7Positive: true, satelliteCellPctNuclei: 1 }}
    >
      {cells.map((index) => (
        <mesh
          key={index}
          position={[-0.4 + index * 0.35, 0.32, index % 2 === 0 ? 0.08 : -0.08]}
        >
          <sphereGeometry args={[0.04, 16, 12]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function GlycogenPointCloud({ fiberType }: { fiberType: FiberType }) {
  const counts = getFiberOrganelleCounts(fiberType);
  const geometry = useMemo(() => {
    const positions = new Float32Array(counts.glycogenParticles * 3);

    for (let index = 0; index < counts.glycogenParticles; index += 1) {
      const angle = index * 2.17;
      const radius = 0.04 + ((index % 11) / 11) * 0.2;
      positions[index * 3] = -0.75 + (index / counts.glycogenParticles) * 1.5;
      positions[index * 3 + 1] = Math.cos(angle) * radius;
      positions[index * 3 + 2] = Math.sin(angle) * radius;
    }

    const bufferGeometry = new BufferGeometry();
    bufferGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    return bufferGeometry;
  }, [counts.glycogenParticles]);

  return (
    <points
      geometry={geometry}
      name="glycogen-granules"
      userData={{ betaParticleNm: [25, 30] }}
    >
      <primitive
        object={
          new PointsMaterial({
            color: "#f4f1ea",
            size: 0.012,
            sizeAttenuation: true,
          })
        }
        attach="material"
      />
    </points>
  );
}

function LipidDroplets({ fiberType }: { fiberType: FiberType }) {
  const counts = getFiberOrganelleCounts(fiberType);
  const droplets = Array.from(
    { length: counts.lipidDroplets },
    (_, index) => index,
  );

  return (
    <group name="lipid-droplets" userData={{ oxidativeFiberEnriched: true }}>
      {droplets.map((index) => {
        const angle = index * 1.31;
        return (
          <mesh
            key={index}
            position={[
              -0.66 + (index / Math.max(1, droplets.length - 1)) * 1.32,
              Math.cos(angle) * 0.19,
              Math.sin(angle) * 0.19,
            ]}
          >
            <sphereGeometry args={[0.018, 12, 10]} />
            <meshStandardMaterial color="#e8c46a" roughness={0.34} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function FiberOrganelles({
  fiberType,
  onSelectMyofibril,
  visibility,
}: FiberOrganellesProps) {
  const profile = getFiberTypeProfile(fiberType);

  return (
    <group
      name={`fiber-organelles-${profile.id}`}
      userData={{ fiberType: profile.id }}
    >
      <MyofibrilBundle
        fiberType={fiberType}
        onSelectMyofibril={onSelectMyofibril}
      />
      {visibility.tTubules ? <TTubules fiberType={fiberType} /> : null}
      {visibility.sr ? <SarcoplasmicReticulum fiberType={fiberType} /> : null}
      {visibility.mitochondria ? <Mitochondria fiberType={fiberType} /> : null}
      {visibility.nuclei ? <PeripheralNuclei fiberType={fiberType} /> : null}
      <SatelliteCells fiberType={fiberType} />
      <GlycogenPointCloud fiberType={fiberType} />
      <LipidDroplets fiberType={fiberType} />
    </group>
  );
}
