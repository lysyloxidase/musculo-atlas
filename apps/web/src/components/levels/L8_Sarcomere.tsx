import InstancedFilaments from "../shared/InstancedFilaments";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

export default function L8Sarcomere(_props: GrossLevelProps) {
  return (
    <group name="L8 sarcomere">
      <mesh position={[-0.62, 0, 0]}>
        <boxGeometry args={[0.035, 0.6, 0.08]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.5} />
      </mesh>
      <mesh position={[0.62, 0, 0]}>
        <boxGeometry args={[0.035, 0.6, 0.08]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.5} />
      </mesh>
      <InstancedFilaments
        color="#ee7664"
        count={9}
        length={0.84}
        radius={0.009}
        yOffset={0.08}
      />
      <InstancedFilaments
        color="#5fd0c5"
        count={6}
        length={1.2}
        radius={0.015}
        yOffset={-0.12}
      />
    </group>
  );
}
