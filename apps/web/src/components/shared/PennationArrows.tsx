import { getMuscleDetail, getPennationArrowCount } from "@/lib/grossAnatomy";

interface PennationArrowsProps {
  muscleId: string;
}

export default function PennationArrows({ muscleId }: PennationArrowsProps) {
  const muscle = getMuscleDetail(muscleId);
  const angle = (muscle.pennation_deg * Math.PI) / 180;
  const arrowCount = getPennationArrowCount(muscleId);
  const sides =
    muscle.pennation_pattern === "bipennate" ||
    muscle.pennation_pattern === "multipennate"
      ? [-1, 1]
      : [1];

  return (
    <group name="pennation-arrows">
      {sides.flatMap((side) =>
        [-0.45, -0.22, 0, 0.22, 0.45].map((x) => (
          <group
            key={`${side}-${x}`}
            position={[x, side * 0.06, 0.23]}
            rotation={[0, 0, side * angle]}
          >
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.24, 10]} />
              <meshStandardMaterial color="#f4f1ea" roughness={0.45} />
            </mesh>
            <mesh position={[0.13, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.026, 0.06, 12]} />
              <meshStandardMaterial color="#d7b95d" roughness={0.45} />
            </mesh>
          </group>
        )),
      )}
      <mesh
        position={[0.58, 0.22, 0.23]}
        rotation={[0, 0, angle]}
        userData={{ arrowCount, pennationDeg: muscle.pennation_deg }}
      >
        <torusGeometry args={[0.08, 0.004, 8, 32, angle || 0.08]} />
        <meshStandardMaterial color="#d7b95d" roughness={0.45} />
      </mesh>
    </group>
  );
}
