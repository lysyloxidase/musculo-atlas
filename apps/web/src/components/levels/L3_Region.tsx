export default function L3Region() {
  return (
    <group name="L3 region">
      <mesh position={[-0.22, 0, 0]}>
        <capsuleGeometry args={[0.14, 0.95, 12, 24]} />
        <meshStandardMaterial color="#5fd0c5" roughness={0.75} />
      </mesh>
      <mesh position={[0.22, 0, 0]}>
        <capsuleGeometry args={[0.14, 0.95, 12, 24]} />
        <meshStandardMaterial color="#d7b95d" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.035, 12, 48]} />
        <meshStandardMaterial color="#ee7664" roughness={0.7} />
      </mesh>
    </group>
  );
}
