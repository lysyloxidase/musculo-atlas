import { getLevelTwoLayerMesh } from "@/lib/meshManifest";
import MeshAsset from "../shared/MeshAsset";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

function LongStructure({
  color,
  name,
  onSelectRegion,
  position,
  radius,
  rotationZ = 0,
  scaleZ = 1,
}: {
  color: string;
  name: string;
  onSelectRegion: () => void;
  position: [number, number, number];
  radius: number;
  rotationZ?: number;
  scaleZ?: number;
}) {
  return (
    <mesh
      name={name}
      onClick={onSelectRegion}
      position={position}
      rotation={[0, 0, rotationZ]}
      scale={[1, 1, scaleZ]}
      userData={{
        anatomicalName: name,
        targetRegion: "anterior_thigh_compartment",
      }}
    >
      <capsuleGeometry args={[radius, 0.42, 8, 18]} />
      <meshStandardMaterial color={color} roughness={0.62} />
    </mesh>
  );
}

function SkeletonLayer({ onSelectRegion }: { onSelectRegion: () => void }) {
  const axial = "#f4f1ea";
  const appendicular = "#d7b95d";

  return (
    <group
      name="skeletal-layer"
      userData={{ axialBones: 80, appendicularBones: 126, totalBones: 206 }}
    >
      <mesh name="skull" onClick={onSelectRegion} position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.09, 28, 20]} />
        <meshStandardMaterial color={axial} roughness={0.55} />
      </mesh>
      <mesh name="rib-cage" onClick={onSelectRegion} position={[0, 0.36, 0]}>
        <torusGeometry args={[0.25, 0.012, 10, 58]} />
        <meshStandardMaterial
          color={axial}
          opacity={0.82}
          roughness={0.56}
          transparent
        />
      </mesh>
      <mesh
        name="vertebral-column"
        onClick={onSelectRegion}
        position={[0, 0.2, -0.02]}
      >
        <capsuleGeometry args={[0.025, 0.82, 10, 18]} />
        <meshStandardMaterial color={axial} roughness={0.58} />
      </mesh>
      <mesh name="pelvis" onClick={onSelectRegion} position={[0, -0.2, 0]}>
        <torusGeometry args={[0.19, 0.018, 10, 58]} />
        <meshStandardMaterial color={axial} roughness={0.62} />
      </mesh>
      <LongStructure
        color={appendicular}
        name="left-humerus"
        onSelectRegion={onSelectRegion}
        position={[-0.32, 0.35, 0]}
        radius={0.016}
        rotationZ={-0.32}
      />
      <LongStructure
        color={appendicular}
        name="right-humerus"
        onSelectRegion={onSelectRegion}
        position={[0.32, 0.35, 0]}
        radius={0.016}
        rotationZ={0.32}
      />
      <LongStructure
        color={appendicular}
        name="left-radius-ulna"
        onSelectRegion={onSelectRegion}
        position={[-0.45, 0.06, 0]}
        radius={0.012}
        rotationZ={-0.18}
      />
      <LongStructure
        color={appendicular}
        name="right-radius-ulna"
        onSelectRegion={onSelectRegion}
        position={[0.45, 0.06, 0]}
        radius={0.012}
        rotationZ={0.18}
      />
      <LongStructure
        color={appendicular}
        name="left-femur"
        onSelectRegion={onSelectRegion}
        position={[-0.13, -0.48, 0]}
        radius={0.026}
        rotationZ={0.08}
      />
      <LongStructure
        color={appendicular}
        name="right-femur"
        onSelectRegion={onSelectRegion}
        position={[0.13, -0.48, 0]}
        radius={0.026}
        rotationZ={-0.08}
      />
      <LongStructure
        color={appendicular}
        name="left-tibia-fibula"
        onSelectRegion={onSelectRegion}
        position={[-0.15, -0.94, 0]}
        radius={0.017}
        rotationZ={0.03}
      />
      <LongStructure
        color={appendicular}
        name="right-tibia-fibula"
        onSelectRegion={onSelectRegion}
        position={[0.15, -0.94, 0]}
        radius={0.017}
        rotationZ={-0.03}
      />
    </group>
  );
}

function MuscleLayer({ onSelectRegion }: { onSelectRegion: () => void }) {
  const groups = [
    ["pectoralis-major", 0, 0.37, 0.17, 0.22, "#ee7664"],
    ["abdominal-wall", 0, 0.08, 0, 0.26, "#cf6a50"],
    ["deltoid-left", -0.31, 0.42, -0.22, 0.2, "#ee7664"],
    ["deltoid-right", 0.31, 0.42, 0.22, 0.2, "#ee7664"],
    ["quadriceps-left", -0.13, -0.52, 0.08, 0.48, "#ee7664"],
    ["quadriceps-right", 0.13, -0.52, -0.08, 0.48, "#ee7664"],
    ["hamstrings-left", -0.21, -0.52, 0.04, 0.42, "#9d8df1"],
    ["hamstrings-right", 0.21, -0.52, -0.04, 0.42, "#9d8df1"],
    ["gastrocnemius-left", -0.15, -0.98, -0.03, 0.28, "#5fd0c5"],
    ["gastrocnemius-right", 0.15, -0.98, 0.03, 0.28, "#5fd0c5"],
  ] as const;

  return (
    <group name="muscular-layer" userData={{ majorGroups: groups.length }}>
      {groups.map(([name, x, y, rotationZ, length, color]) => (
        <mesh
          key={name}
          name={name}
          onClick={onSelectRegion}
          position={[x, y, 0.03]}
          rotation={[0, 0, rotationZ]}
          userData={{ targetRegion: "anterior_thigh_compartment" }}
        >
          <capsuleGeometry args={[0.07, length, 12, 28]} />
          <meshStandardMaterial
            color={color}
            opacity={0.86}
            roughness={0.82}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function ConnectiveLayer({ onSelectRegion }: { onSelectRegion: () => void }) {
  const tendons = [
    ["achilles-left", -0.15, -1.2, 0.22],
    ["achilles-right", 0.15, -1.2, -0.22],
    ["patellar-left", -0.13, -0.72, 0],
    ["patellar-right", 0.13, -0.72, 0],
    ["iliotibial-band-left", -0.28, -0.5, 0.05],
    ["iliotibial-band-right", 0.28, -0.5, -0.05],
  ] as const;

  return (
    <group
      name="connective-tissue-layer"
      userData={{ structures: tendons.length }}
    >
      <mesh
        name="thoracolumbar-fascia"
        onClick={onSelectRegion}
        position={[0, 0.1, -0.04]}
        scale={[1.15, 1, 0.42]}
      >
        <capsuleGeometry args={[0.22, 0.42, 12, 26]} />
        <meshStandardMaterial
          color="#5fd0c5"
          opacity={0.24}
          roughness={0.52}
          transparent
        />
      </mesh>
      {tendons.map(([name, x, y, rotationZ]) => (
        <mesh
          key={name}
          name={name}
          onClick={onSelectRegion}
          position={[x, y, 0.04]}
          rotation={[0, 0, rotationZ]}
        >
          <capsuleGeometry args={[0.015, 0.32, 8, 18]} />
          <meshStandardMaterial
            color="#5fd0c5"
            opacity={0.64}
            roughness={0.44}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function JointLayer({ onSelectRegion }: { onSelectRegion: () => void }) {
  const joints = [
    ["shoulder-left", -0.28, 0.47, 0.06],
    ["shoulder-right", 0.28, 0.47, 0.06],
    ["elbow-left", -0.41, 0.2, 0.045],
    ["elbow-right", 0.41, 0.2, 0.045],
    ["hip-left", -0.14, -0.24, 0.06],
    ["hip-right", 0.14, -0.24, 0.06],
    ["knee-left", -0.14, -0.72, 0.052],
    ["knee-right", 0.14, -0.72, 0.052],
    ["ankle-left", -0.15, -1.16, 0.042],
    ["ankle-right", 0.15, -1.16, 0.042],
  ] as const;

  return (
    <group name="joint-layer" userData={{ synovialJoints: joints.length }}>
      {joints.map(([name, x, y, radius]) => (
        <mesh
          key={name}
          name={name}
          onClick={onSelectRegion}
          position={[x, y, 0.05]}
        >
          <sphereGeometry args={[radius, 24, 18]} />
          <meshStandardMaterial
            color="#d7b95d"
            opacity={0.86}
            roughness={0.42}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

export default function L2System({ dispatch, state }: GrossLevelProps) {
  const mesh = getLevelTwoLayerMesh(state.activeLayer);
  const lod = mesh.lods[0];
  const onSelectRegion = () =>
    dispatch({ regionId: "anterior_thigh_compartment", type: "select_region" });

  return (
    <MeshAsset lod={lod} name={mesh.semantic}>
      <group
        name="L2 musculoskeletal system"
        userData={{
          activeLayer: state.activeLayer,
          fidelity: "named-layer-structures",
        }}
      >
        {state.activeLayer === "skeleton" ? (
          <SkeletonLayer onSelectRegion={onSelectRegion} />
        ) : null}
        {state.activeLayer === "muscle" ? (
          <MuscleLayer onSelectRegion={onSelectRegion} />
        ) : null}
        {state.activeLayer === "connective" ? (
          <ConnectiveLayer onSelectRegion={onSelectRegion} />
        ) : null}
        {state.activeLayer === "joints" ? (
          <JointLayer onSelectRegion={onSelectRegion} />
        ) : null}
      </group>
    </MeshAsset>
  );
}
