import { getFiberTypeProfile } from "@/lib/microAnatomy";
import { getEccStep } from "@/lib/physiology";
import FiberOrganelles from "../shared/FiberOrganelles";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

function EccHighlight({ stepIndex }: { stepIndex: number }) {
  const step = getEccStep(stepIndex);
  const positions: Record<typeof step.highlight, [number, number, number]> = {
    nmj: [-0.86, 0.36, 0],
    sarcolemma: [-0.35, 0.32, 0.1],
    sr: [0.24, 0.12, -0.14],
    t_tubule: [0, 0.29, 0],
    thin_filament: [0.58, 0.04, 0.1],
  };
  const position = positions[step.highlight];

  return (
    <group
      name="ecc-step-highlight"
      position={position}
      userData={{
        highlight: step.highlight,
        ionFlow: step.ionFlow,
        stepId: step.id,
        stepIndex: step.index,
      }}
    >
      <mesh>
        <sphereGeometry args={[0.055, 20, 16]} />
        <meshStandardMaterial
          color={step.color}
          emissive={step.color}
          emissiveIntensity={0.35}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.035, 0.12, 18]} />
        <meshStandardMaterial color={step.color} roughness={0.42} />
      </mesh>
      <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.14, 10]} />
        <meshStandardMaterial color={step.color} roughness={0.42} />
      </mesh>
    </group>
  );
}

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
      <EccHighlight stepIndex={state.eccStepIndex} />
    </group>
  );
}
