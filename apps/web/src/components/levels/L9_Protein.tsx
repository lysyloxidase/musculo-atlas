import type { GrossLevelProps } from "../viewer/LevelRenderer";

export default function L9Protein(_props: GrossLevelProps) {
  return (
    <group name="L9 protein">
      {Array.from({ length: 12 }, (_, index) => {
        const angle = index * 0.72;
        const x = (index - 5.5) * 0.08;
        const y = Math.sin(angle) * 0.18;
        const z = Math.cos(angle) * 0.18;

        return (
          <mesh key={`${x}-${y}`} position={[x, y, z]}>
            <sphereGeometry args={[0.055, 24, 24]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#9d8df1" : "#d7b95d"}
              roughness={0.5}
            />
          </mesh>
        );
      })}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 1.05, 12]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.6} />
      </mesh>
    </group>
  );
}
