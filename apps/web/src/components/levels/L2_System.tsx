import { getLevelTwoLayerMesh } from "@/lib/meshManifest";
import MeshAsset from "../shared/MeshAsset";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

function SkeletonLayer({ onSelectRegion }: { onSelectRegion: () => void }) {
  return (
    <group name="skeletal-layer">
      <mesh onClick={onSelectRegion} position={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 1.4, 0.08]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.55} />
      </mesh>
      <mesh onClick={onSelectRegion} position={[0, 0.35, 0]}>
        <torusGeometry args={[0.34, 0.025, 12, 48]} />
        <meshStandardMaterial color="#d7b95d" roughness={0.6} />
      </mesh>
      <mesh
        onClick={onSelectRegion}
        position={[-0.24, -0.2, 0]}
        rotation={[0, 0, 0.18]}
      >
        <cylinderGeometry args={[0.055, 0.07, 1.1, 24]} />
        <meshStandardMaterial color="#ee7664" roughness={0.75} />
      </mesh>
      <mesh
        onClick={onSelectRegion}
        position={[0.24, -0.2, 0]}
        rotation={[0, 0, -0.18]}
      >
        <cylinderGeometry args={[0.055, 0.07, 1.1, 24]} />
        <meshStandardMaterial color="#ee7664" roughness={0.75} />
      </mesh>
    </group>
  );
}

function MuscleLayer({ onSelectRegion }: { onSelectRegion: () => void }) {
  return (
    <group name="muscular-layer">
      {[
        [-0.28, 0.16, "#ee7664"],
        [0.28, 0.16, "#ee7664"],
        [-0.22, -0.36, "#5fd0c5"],
        [0.22, -0.36, "#5fd0c5"],
      ].map(([x, y, color]) => (
        <mesh
          key={`${x}-${y}`}
          onClick={onSelectRegion}
          position={[Number(x), Number(y), 0]}
          rotation={[0, 0, Number(x) > 0 ? -0.12 : 0.12]}
          userData={{ targetRegion: "anterior_thigh_compartment" }}
        >
          <capsuleGeometry args={[0.13, 0.7, 12, 28]} />
          <meshStandardMaterial
            color={String(color)}
            roughness={0.8}
            transparent
            opacity={0.86}
          />
        </mesh>
      ))}
    </group>
  );
}

function ConnectiveLayer({ onSelectRegion }: { onSelectRegion: () => void }) {
  return (
    <group name="connective-tissue-layer">
      <mesh
        onClick={onSelectRegion}
        position={[0, -0.18, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.52, 0.022, 12, 64]} />
        <meshStandardMaterial
          color="#5fd0c5"
          roughness={0.5}
          transparent
          opacity={0.46}
        />
      </mesh>
      <mesh
        onClick={onSelectRegion}
        position={[0, 0.32, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.34, 0.018, 12, 64]} />
        <meshStandardMaterial
          color="#5fd0c5"
          roughness={0.5}
          transparent
          opacity={0.46}
        />
      </mesh>
    </group>
  );
}

function JointLayer({ onSelectRegion }: { onSelectRegion: () => void }) {
  return (
    <group name="joint-layer">
      {[
        [0, 0.48, 0.12],
        [-0.24, -0.14, 0.1],
        [0.24, -0.14, 0.1],
        [-0.24, -0.7, 0.08],
        [0.24, -0.7, 0.08],
      ].map(([x, y, radius]) => (
        <mesh
          key={`${x}-${y}`}
          onClick={onSelectRegion}
          position={[x, y, 0.04]}
        >
          <sphereGeometry args={[radius, 28, 28]} />
          <meshStandardMaterial
            color="#d7b95d"
            roughness={0.42}
            transparent
            opacity={0.82}
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
        userData={{ activeLayer: state.activeLayer }}
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
