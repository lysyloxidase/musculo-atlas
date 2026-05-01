import { getMuscleDetail } from "@/lib/grossAnatomy";
import { getGrossMesh } from "@/lib/meshManifest";
import MeshAsset from "../shared/MeshAsset";
import PennationArrows from "../shared/PennationArrows";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

export default function L4Muscle({ dispatch, state }: GrossLevelProps) {
  const muscle = getMuscleDetail(state.selectedMuscleId);
  const mesh = getGrossMesh("l4_rectus_femoris");

  return (
    <MeshAsset lod={mesh.lods[0]} name={mesh.semantic}>
      <group name={`L4 muscle ${muscle.id}`} userData={{ muscleId: muscle.id }}>
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            dispatch({ muscleId: muscle.id, type: "select_muscle_belly" });
          }}
          rotation={[0, 0, Math.PI / 2]}
          userData={{ selectable: "muscle-belly" }}
        >
          <capsuleGeometry args={[0.18, 1.35, 16, 36]} />
          <meshStandardMaterial
            color="#ee7664"
            roughness={0.82}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0, 0, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.42, 16]} />
          <meshStandardMaterial color="#30302d" roughness={0.65} />
        </mesh>
        <PennationArrows muscleId={muscle.id} />
      </group>
    </MeshAsset>
  );
}
