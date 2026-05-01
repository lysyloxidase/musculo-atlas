export default function L2System() {
  return (
    <group name="L2 musculoskeletal system">
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 1.4, 0.08]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.34, 0.025, 12, 48]} />
        <meshStandardMaterial color="#d7b95d" roughness={0.6} />
      </mesh>
      <mesh position={[-0.24, -0.2, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.055, 0.07, 1.1, 24]} />
        <meshStandardMaterial color="#ee7664" roughness={0.75} />
      </mesh>
      <mesh position={[0.24, -0.2, 0]} rotation={[0, 0, -0.18]}>
        <cylinderGeometry args={[0.055, 0.07, 1.1, 24]} />
        <meshStandardMaterial color="#ee7664" roughness={0.75} />
      </mesh>
    </group>
  );
}
