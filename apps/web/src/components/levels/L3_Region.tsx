import { ANTERIOR_THIGH_REGION, getMusclesForRegion } from "@/lib/grossAnatomy";
import { getGrossMesh } from "@/lib/meshManifest";
import MeshAsset from "../shared/MeshAsset";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

const muscleLayout: Record<
  string,
  {
    functionGroup: string;
    length: number;
    radius: number;
    rotationZ: number;
    x: number;
    y: number;
    z: number;
  }
> = {
  rectus_femoris: {
    functionGroup: "extensor",
    length: 0.82,
    radius: 0.072,
    rotationZ: Math.PI / 2,
    x: 0,
    y: 0.08,
    z: 0.17,
  },
  sartorius: {
    functionGroup: "flexor",
    length: 1.02,
    radius: 0.026,
    rotationZ: -0.72,
    x: -0.22,
    y: 0.01,
    z: 0.24,
  },
  vastus_intermedius: {
    functionGroup: "extensor",
    length: 0.78,
    radius: 0.075,
    rotationZ: Math.PI / 2,
    x: 0,
    y: -0.02,
    z: 0.02,
  },
  vastus_lateralis: {
    functionGroup: "extensor",
    length: 0.86,
    radius: 0.082,
    rotationZ: Math.PI / 2,
    x: -0.2,
    y: -0.02,
    z: 0.1,
  },
  vastus_medialis: {
    functionGroup: "extensor",
    length: 0.72,
    radius: 0.07,
    rotationZ: Math.PI / 2,
    x: 0.19,
    y: -0.06,
    z: 0.13,
  },
};

export default function L3Region({ dispatch }: GrossLevelProps) {
  const mesh = getGrossMesh("l3_anterior_thigh");
  const muscles = getMusclesForRegion(ANTERIOR_THIGH_REGION.id);

  return (
    <MeshAsset lod={mesh.lods[0]} name={mesh.semantic}>
      <group
        name="L3 anterior thigh"
        userData={{
          bones: ANTERIOR_THIGH_REGION.bones,
          compartment: ANTERIOR_THIGH_REGION.compartment,
          fidelity: "one-mesh-per-visible-anterior-thigh-structure",
          muscles: ANTERIOR_THIGH_REGION.muscles,
          nerves: ANTERIOR_THIGH_REGION.nerves,
          vessels: ANTERIOR_THIGH_REGION.vessels,
        }}
      >
        <mesh
          name="femur"
          position={[0, 0.02, -0.16]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <capsuleGeometry args={[0.034, 1.08, 12, 24]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.55} />
        </mesh>
        <mesh name="patella" position={[0, -0.5, 0.19]} scale={[1, 0.75, 0.45]}>
          <sphereGeometry args={[0.055, 22, 16]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.52} />
        </mesh>
        <mesh
          name="femoral-nerve"
          position={[-0.09, 0.03, 0.28]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <capsuleGeometry args={[0.01, 0.95, 8, 16]} />
          <meshStandardMaterial color="#d7b95d" roughness={0.45} />
        </mesh>
        <mesh
          name="femoral-artery"
          position={[0.1, 0.03, 0.27]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <capsuleGeometry args={[0.012, 0.92, 8, 16]} />
          <meshStandardMaterial color="#ee7664" roughness={0.45} />
        </mesh>
        <mesh
          name="femoral-vein"
          position={[0.15, 0.02, 0.27]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <capsuleGeometry args={[0.012, 0.9, 8, 16]} />
          <meshStandardMaterial color="#5fd0c5" roughness={0.45} />
        </mesh>
        <mesh
          name="fascia-lata"
          position={[0, 0, 0.29]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <torusGeometry args={[0.39, 0.008, 8, 96]} />
          <meshStandardMaterial
            color="#9d8df1"
            opacity={0.42}
            roughness={0.5}
            transparent
          />
        </mesh>
        {[-0.27, 0.27].map((x) => (
          <mesh
            key={x}
            name={
              x < 0
                ? "lateral-intermuscular-septum"
                : "medial-intermuscular-septum"
            }
            position={[x, -0.02, 0.22]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <boxGeometry args={[0.72, 0.012, 0.025]} />
            <meshStandardMaterial
              color="#9d8df1"
              opacity={0.42}
              roughness={0.5}
              transparent
            />
          </mesh>
        ))}
        {muscles.map((muscle) => {
          const layout = muscleLayout[muscle.id];
          const color =
            ANTERIOR_THIGH_REGION.functionColorMap[layout.functionGroup];

          return (
            <mesh
              key={muscle.id}
              name={muscle.id}
              onClick={(event) => {
                event.stopPropagation();
                dispatch({ muscleId: muscle.id, type: "select_muscle" });
              }}
              position={[layout.x, layout.y, layout.z]}
              rotation={[0, 0, layout.rotationZ]}
              userData={{
                functionGroup: layout.functionGroup,
                muscleId: muscle.id,
                oneToOneStructure: true,
              }}
            >
              <capsuleGeometry args={[layout.radius, layout.length, 14, 30]} />
              <meshStandardMaterial
                color={color}
                opacity={0.9}
                roughness={0.78}
                transparent
              />
            </mesh>
          );
        })}
      </group>
    </MeshAsset>
  );
}
