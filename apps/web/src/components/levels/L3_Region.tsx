import { ANTERIOR_THIGH_REGION, getMusclesForRegion } from "@/lib/grossAnatomy";
import { getGrossMesh } from "@/lib/meshManifest";
import MeshAsset from "../shared/MeshAsset";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

const muscleLayout: Record<string, [number, number, number, string]> = {
  rectus_femoris: [0, 0.05, 0.12, "extensor"],
  sartorius: [-0.28, 0.02, 0.18, "flexor"],
  vastus_intermedius: [0, -0.08, -0.02, "extensor"],
  vastus_lateralis: [-0.18, -0.04, 0.08, "extensor"],
  vastus_medialis: [0.18, -0.04, 0.08, "extensor"],
};

export default function L3Region({ dispatch }: GrossLevelProps) {
  const mesh = getGrossMesh("l3_anterior_thigh");
  const muscles = getMusclesForRegion(ANTERIOR_THIGH_REGION.id);

  return (
    <MeshAsset lod={mesh.lods[0]} name={mesh.semantic}>
      <group name="L3 anterior thigh">
        <mesh position={[0, 0.05, -0.18]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 20]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.55} />
        </mesh>
        <mesh position={[0.18, 0.04, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 1.02, 12]} />
          <meshStandardMaterial color="#d7b95d" roughness={0.45} />
        </mesh>
        <mesh position={[0.24, -0.01, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.95, 12]} />
          <meshStandardMaterial color="#5fd0c5" roughness={0.45} />
        </mesh>
        {muscles.map((muscle) => {
          const [x, y, z, functionGroup] = muscleLayout[muscle.id];
          const color = ANTERIOR_THIGH_REGION.functionColorMap[functionGroup];

          return (
            <mesh
              key={muscle.id}
              onClick={(event) => {
                event.stopPropagation();
                dispatch({ muscleId: muscle.id, type: "select_muscle" });
              }}
              position={[x, y, z]}
              rotation={[0, 0, muscle.id === "sartorius" ? -0.66 : Math.PI / 2]}
              userData={{ functionGroup, muscleId: muscle.id }}
            >
              <capsuleGeometry
                args={[muscle.id === "sartorius" ? 0.045 : 0.09, 0.9, 12, 28]}
              />
              <meshStandardMaterial
                color={color}
                roughness={0.78}
                transparent
                opacity={0.88}
              />
            </mesh>
          );
        })}
        <mesh position={[0, 0, 0.24]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.36, 0.01, 8, 80]} />
          <meshStandardMaterial
            color="#9d8df1"
            roughness={0.5}
            transparent
            opacity={0.44}
          />
        </mesh>
      </group>
    </MeshAsset>
  );
}
