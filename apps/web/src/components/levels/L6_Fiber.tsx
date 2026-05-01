import { getFiberTypeProfile } from "@/lib/microAnatomy";
import FiberOrganelles from "../shared/FiberOrganelles";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

export default function L6Fiber({ dispatch, state }: GrossLevelProps) {
  const profile = getFiberTypeProfile(state.fiberType);
  const bands = Array.from({ length: 18 }, (_, index) => index);

  return (
    <group
      name={`L6 fiber ${state.selectedFiberId}`}
      userData={{
        diameterUm: profile.diameter_um,
        fiberType: profile.id,
        sarcolemmaThicknessNm: 7.5,
      }}
    >
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 1.72, 48, 1, true]} />
        <meshStandardMaterial
          color={profile.color}
          opacity={0.24}
          roughness={0.76}
          transparent
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.335, 0.335, 1.74, 48, 1, true]} />
        <meshStandardMaterial
          color="#5fd0c5"
          roughness={0.52}
          transparent
          opacity={0.14}
        />
      </mesh>
      {bands.map((index) => (
        <mesh
          key={index}
          position={[-0.78 + index * 0.092, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry
            args={[0.22, index % 2 === 0 ? 0.004 : 0.002, 6, 40]}
          />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#30302d" : "#f4f1ea"}
            roughness={0.5}
            transparent
            opacity={0.44}
          />
        </mesh>
      ))}
      <FiberOrganelles
        fiberType={state.fiberType}
        onSelectMyofibril={() =>
          dispatch({ myofibrilId: "myofibril_1", type: "select_myofibril" })
        }
        visibility={state.fiberVisibility}
      />
    </group>
  );
}
