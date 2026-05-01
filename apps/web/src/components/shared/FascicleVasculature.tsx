import { buildFascicleConfig } from "@/lib/microAnatomy";

interface FascicleVasculatureProps {
  crossSection: boolean;
}

export default function FascicleVasculature({
  crossSection,
}: FascicleVasculatureProps) {
  const config = buildFascicleConfig();
  const length = crossSection ? 0.68 : 1.6;
  const capillaries = Array.from(
    { length: config.capillaryCount },
    (_, index) => index,
  );

  return (
    <group
      name="fascicle-vasculature"
      userData={{ capillaryCount: config.capillaryCount }}
    >
      {capillaries.map((index) => {
        const angle = (index / capillaries.length) * Math.PI * 2;
        const radius = index % 3 === 0 ? 0.76 : 0.44;

        return (
          <mesh
            key={index}
            position={[0, Math.cos(angle) * radius, Math.sin(angle) * radius]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.012, 0.012, length, 8]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#d9473f" : "#5b88d8"}
              roughness={0.5}
            />
          </mesh>
        );
      })}
      <mesh position={[-0.08, 0.98, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, length * 0.82, 16]} />
        <meshStandardMaterial color="#d9473f" roughness={0.48} />
      </mesh>
    </group>
  );
}
