import { getMuscleDetail } from "@/lib/grossAnatomy";
import { getGrossMesh } from "@/lib/meshManifest";
import MeshAsset from "../shared/MeshAsset";
import PennationArrows from "../shared/PennationArrows";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

function Tendon({
  name,
  position,
  rotationZ,
}: {
  name: string;
  position: [number, number, number];
  rotationZ: number;
}) {
  return (
    <mesh name={name} position={position} rotation={[0, 0, rotationZ]}>
      <capsuleGeometry args={[0.026, 0.34, 8, 18]} />
      <meshStandardMaterial
        color="#d7b95d"
        opacity={0.86}
        roughness={0.42}
        transparent
      />
    </mesh>
  );
}

export default function L4Muscle({ dispatch, state }: GrossLevelProps) {
  const muscle = getMuscleDetail(state.selectedMuscleId);
  const mesh = getGrossMesh("l4_rectus_femoris");
  const isRectus = muscle.id === "rectus_femoris";

  return (
    <MeshAsset lod={mesh.lods[0]} name={mesh.semantic}>
      <group
        name={`L4 muscle ${muscle.id}`}
        scale={[0.12, 0.12, 0.12]}
        userData={{
          fiberLengthCm: muscle.fiber_length_cm,
          fidelity: "single-muscle-with-separate-tendons-and-fiber-field",
          muscleId: muscle.id,
          pennationPattern: muscle.pennation_pattern,
        }}
      >
        <mesh
          name={`${muscle.id}-belly`}
          onClick={(event) => {
            event.stopPropagation();
            dispatch({ muscleId: muscle.id, type: "select_muscle_belly" });
          }}
          rotation={[0, 0, Math.PI / 2]}
          scale={isRectus ? [0.86, 1, 0.62] : [0.78, 1, 0.58]}
          userData={{ oneToOneStructure: true, selectable: "muscle-belly" }}
        >
          <capsuleGeometry args={[0.19, 1.18, 18, 44]} />
          <meshStandardMaterial
            color="#ee7664"
            opacity={0.9}
            roughness={0.82}
            transparent
          />
        </mesh>
        <Tendon
          name={`${muscle.id}-proximal-tendon-origin`}
          position={[-0.76, 0.03, 0.01]}
          rotationZ={Math.PI / 2}
        />
        <Tendon
          name={`${muscle.id}-distal-tendon-insertion`}
          position={[0.76, -0.03, 0.01]}
          rotationZ={Math.PI / 2}
        />
        <mesh
          name={`${muscle.id}-central-tendon-raphe`}
          rotation={[0, 0, Math.PI / 2]}
        >
          <capsuleGeometry args={[0.018, 1.06, 8, 20]} />
          <meshStandardMaterial
            color="#30302d"
            opacity={0.78}
            roughness={0.65}
            transparent
          />
        </mesh>
        {[-0.42, -0.21, 0, 0.21, 0.42].map((x) => (
          <mesh
            key={x}
            name={`${muscle.id}-fiber-striation-${x}`}
            position={[x, 0, 0.22]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <boxGeometry args={[0.34, 0.006, 0.01]} />
            <meshStandardMaterial
              color="#f4f1ea"
              opacity={0.4}
              roughness={0.45}
              transparent
            />
          </mesh>
        ))}
        <mesh
          name="proximal-bony-landmark"
          position={[-0.95, 0.18, -0.04]}
          scale={[1.25, 0.65, 0.5]}
        >
          <sphereGeometry args={[0.08, 20, 16]} />
          <meshStandardMaterial color="#f4f1ea" opacity={0.72} transparent />
        </mesh>
        <mesh
          name="distal-patellar-landmark"
          position={[0.95, -0.16, -0.04]}
          scale={[0.88, 0.62, 0.5]}
        >
          <sphereGeometry args={[0.07, 20, 16]} />
          <meshStandardMaterial color="#f4f1ea" opacity={0.72} transparent />
        </mesh>
        <PennationArrows muscleId={muscle.id} />
      </group>
    </MeshAsset>
  );
}
