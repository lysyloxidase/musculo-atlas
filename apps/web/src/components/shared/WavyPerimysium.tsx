import { buildFascicleConfig } from "@/lib/microAnatomy";

interface WavyPerimysiumProps {
  crossSection: boolean;
}

export default function WavyPerimysium({ crossSection }: WavyPerimysiumProps) {
  const config = buildFascicleConfig();
  const radius = 1.05;
  const length = crossSection ? 0.7 : 1.7;
  const waves = Array.from({ length: 24 }, (_, index) => index);

  return (
    <group
      name="wavy-perimysium"
      userData={{
        collagenPattern: config.collagenPattern,
        perimysiumLayers: config.perimysiumLayers,
      }}
    >
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, length, 48, 1, true]} />
        <meshStandardMaterial
          color="#5fd0c5"
          roughness={0.9}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      {waves.map((index) => {
        const angle = (index / waves.length) * Math.PI * 2;
        const y = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const phase = index % 2 === 0 ? 0.18 : -0.18;

        return (
          <mesh
            key={index}
            position={[phase, y, z]}
            rotation={[Math.PI / 2, angle, Math.PI / 2 + phase]}
          >
            <cylinderGeometry args={[0.006, 0.006, length * 0.9, 6]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#5fd0c5" : "#d7b95d"}
              roughness={0.6}
            />
          </mesh>
        );
      })}
      <mesh position={[0.38, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius, 0.028, 10, 80]} />
        <meshStandardMaterial color="#5fd0c5" roughness={0.65} />
      </mesh>
    </group>
  );
}
