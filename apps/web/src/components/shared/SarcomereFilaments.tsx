"use client";

import type {
  SarcomereStructureLayer,
  StructureVisibility,
} from "@/lib/atlasState";
import {
  type BandGeometry,
  CROWN_SPACING_UM,
  VISIBLE_FILAMENT_BUDGET,
  getCrossBridgeStep,
} from "@/lib/sarcomere";
import { useEffect, useRef } from "react";
import { type InstancedMesh, Object3D } from "three";

interface SarcomereFilamentsProps {
  bandGeometry: BandGeometry;
  crossBridgeStep: number;
  onSelectFilament: (filamentId: string) => void;
  visibility: StructureVisibility<SarcomereStructureLayer>;
}

const SCENE_SCALE = 0.72;

function latticePosition(
  index: number,
  count: number,
  radius: number,
): [number, number] {
  const angle = index * 2.399963;
  const normalized = index / Math.max(1, count - 1);
  const shell = 0.04 + radius * Math.sqrt(normalized);

  return [Math.cos(angle) * shell, Math.sin(angle) * shell];
}

function ThickFilaments({
  bandGeometry,
  onSelectFilament,
}: Pick<SarcomereFilamentsProps, "bandGeometry" | "onSelectFilament">) {
  const meshRef = useRef<InstancedMesh>(null);
  const length = bandGeometry.thickFilamentLengthUm * SCENE_SCALE;

  useEffect(() => {
    const object = new Object3D();

    for (
      let index = 0;
      index < VISIBLE_FILAMENT_BUDGET.thickFilaments;
      index += 1
    ) {
      const [y, z] = latticePosition(
        index,
        VISIBLE_FILAMENT_BUDGET.thickFilaments,
        0.34,
      );
      object.position.set(0, y, z);
      object.rotation.set(0, 0, Math.PI / 2);
      object.scale.set(0.012, length, 0.012);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [length]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, VISIBLE_FILAMENT_BUDGET.thickFilaments]}
      name="thick-myosin-filaments"
      onClick={(event) => {
        event.stopPropagation();
        onSelectFilament("myosin_ii");
      }}
      userData={{
        diameterUm: 0.015,
        fixedLengthUm: bandGeometry.thickFilamentLengthUm,
        myosinsPerThick: 294,
      }}
    >
      <cylinderGeometry args={[1, 1, 1, 6]} />
      <meshStandardMaterial color="#d84d75" roughness={0.62} />
    </instancedMesh>
  );
}

function ThinFilaments({
  bandGeometry,
  onSelectFilament,
}: Pick<SarcomereFilamentsProps, "bandGeometry" | "onSelectFilament">) {
  const meshRef = useRef<InstancedMesh>(null);
  const thinLength = bandGeometry.thinFilamentLengthUm * SCENE_SCALE;

  useEffect(() => {
    const object = new Object3D();
    const half = VISIBLE_FILAMENT_BUDGET.thinFilaments / 2;

    for (
      let index = 0;
      index < VISIBLE_FILAMENT_BUDGET.thinFilaments;
      index += 1
    ) {
      const side = index < half ? -1 : 1;
      const localIndex = index % half;
      const [y, z] = latticePosition(localIndex, half, 0.38);
      const zDisc = side < 0 ? bandGeometry.zLeftUm : bandGeometry.zRightUm;
      const centerUm = zDisc - side * (bandGeometry.thinFilamentLengthUm / 2);
      object.position.set(centerUm * SCENE_SCALE, y, z);
      object.rotation.set(0, 0, Math.PI / 2);
      object.scale.set(0.005, thinLength, 0.005);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [
    bandGeometry.zLeftUm,
    bandGeometry.zRightUm,
    bandGeometry.thinFilamentLengthUm,
    thinLength,
  ]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, VISIBLE_FILAMENT_BUDGET.thinFilaments]}
      name="thin-actin-filaments"
      onClick={(event) => {
        event.stopPropagation();
        onSelectFilament("actin");
      }}
      userData={{
        diameterUm: 0.007,
        nebulin: true,
        troponinSpacingUm: 0.0385,
      }}
    >
      <cylinderGeometry args={[1, 1, 1, 6]} />
      <meshStandardMaterial color="#56d2be" roughness={0.55} />
    </instancedMesh>
  );
}

function TitinFilaments({
  bandGeometry,
  onSelectFilament,
}: Pick<SarcomereFilamentsProps, "bandGeometry" | "onSelectFilament">) {
  const meshRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    const object = new Object3D();
    const half = VISIBLE_FILAMENT_BUDGET.titinFilaments / 2;
    const halfLength = (bandGeometry.sarcomereLengthUm / 2) * SCENE_SCALE;

    for (
      let index = 0;
      index < VISIBLE_FILAMENT_BUDGET.titinFilaments;
      index += 1
    ) {
      const side = index < half ? -1 : 1;
      const localIndex = index % half;
      const [y, z] = latticePosition(localIndex, half, 0.29);
      object.position.set((side * halfLength) / 2, y, z);
      object.rotation.set(0, 0, Math.PI / 2);
      object.scale.set(0.0022, halfLength, 0.0022);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [bandGeometry.sarcomereLengthUm]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, VISIBLE_FILAMENT_BUDGET.titinFilaments]}
      name="titin-filaments"
      onClick={(event) => {
        event.stopPropagation();
        onSelectFilament("titin");
      }}
      userData={{
        stretchUm: bandGeometry.titinExtensionUm,
        titinsPerThick: 6,
      }}
    >
      <cylinderGeometry args={[1, 1, 1, 4]} />
      <meshStandardMaterial color="#d7b95d" roughness={0.42} />
    </instancedMesh>
  );
}

function S1Heads({
  bandGeometry,
  crossBridgeStep,
}: Omit<SarcomereFilamentsProps, "onSelectFilament" | "visibility">) {
  const meshRef = useRef<InstancedMesh>(null);
  const step = getCrossBridgeStep(crossBridgeStep);

  useEffect(() => {
    const object = new Object3D();
    const crownCount = Math.max(
      1,
      Math.floor(bandGeometry.thickFilamentLengthUm / CROWN_SPACING_UM),
    );
    const halfLength = bandGeometry.thickFilamentLengthUm / 2;

    for (let index = 0; index < VISIBLE_FILAMENT_BUDGET.s1Heads; index += 1) {
      const crownIndex = index % crownCount;
      const axialUm = -halfLength + crownIndex * CROWN_SPACING_UM;
      const angle = index * 2.094 + step.leverArmDeg * (Math.PI / 180);
      const radial = 0.13 + (step.slidingNm / 1000) * 2.4;
      object.position.set(
        axialUm * SCENE_SCALE,
        Math.cos(angle) * radial,
        Math.sin(angle) * radial,
      );
      object.scale.set(0.018, 0.018, 0.018);
      object.updateMatrix();
      meshRef.current?.setMatrixAt(index, object.matrix);
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [bandGeometry.thickFilamentLengthUm, step.leverArmDeg, step.slidingNm]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, VISIBLE_FILAMENT_BUDGET.s1Heads]}
      name="s1-cross-bridge-heads"
      userData={{
        projectsTowardThin: true,
        step: step.id,
      }}
    >
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#f08bb0" roughness={0.48} />
    </instancedMesh>
  );
}

export default function SarcomereFilaments({
  bandGeometry,
  crossBridgeStep,
  onSelectFilament,
  visibility,
}: SarcomereFilamentsProps) {
  return (
    <group name="sarcomere-filament-lattice">
      {visibility.titin ? (
        <TitinFilaments
          bandGeometry={bandGeometry}
          onSelectFilament={onSelectFilament}
        />
      ) : null}
      {visibility.thin ? (
        <ThinFilaments
          bandGeometry={bandGeometry}
          onSelectFilament={onSelectFilament}
        />
      ) : null}
      {visibility.thick ? (
        <>
          <ThickFilaments
            bandGeometry={bandGeometry}
            onSelectFilament={onSelectFilament}
          />
          <S1Heads
            bandGeometry={bandGeometry}
            crossBridgeStep={crossBridgeStep}
          />
        </>
      ) : null}
    </group>
  );
}
