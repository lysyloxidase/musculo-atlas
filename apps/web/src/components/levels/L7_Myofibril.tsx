import InstancedSarcomeres from "../shared/InstancedSarcomeres";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

export default function L7Myofibril(_props: GrossLevelProps) {
  return (
    <group name="L7 myofibril">
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.7, 32]} />
        <meshStandardMaterial
          color="#30302d"
          roughness={0.85}
          transparent
          opacity={0.55}
        />
      </mesh>
      <InstancedSarcomeres count={11} spacing={0.15} />
    </group>
  );
}
