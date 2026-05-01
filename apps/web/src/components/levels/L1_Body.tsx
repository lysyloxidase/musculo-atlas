export default function L1Body() {
  return (
    <group name="L1 body">
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#d7b95d" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.22, 0.34, 0.9, 32]} />
        <meshStandardMaterial color="#ee7664" roughness={0.8} />
      </mesh>
      <mesh position={[-0.28, -0.55, 0]} rotation={[0.12, 0, 0.08]}>
        <cylinderGeometry args={[0.08, 0.1, 1.05, 24]} />
        <meshStandardMaterial color="#5fd0c5" roughness={0.75} />
      </mesh>
      <mesh position={[0.28, -0.55, 0]} rotation={[0.12, 0, -0.08]}>
        <cylinderGeometry args={[0.08, 0.1, 1.05, 24]} />
        <meshStandardMaterial color="#5fd0c5" roughness={0.75} />
      </mesh>
      <mesh position={[-0.44, 0.2, 0]} rotation={[0, 0, -0.72]}>
        <cylinderGeometry args={[0.055, 0.075, 0.9, 24]} />
        <meshStandardMaterial color="#9d8df1" roughness={0.75} />
      </mesh>
      <mesh position={[0.44, 0.2, 0]} rotation={[0, 0, 0.72]}>
        <cylinderGeometry args={[0.055, 0.075, 0.9, 24]} />
        <meshStandardMaterial color="#9d8df1" roughness={0.75} />
      </mesh>
    </group>
  );
}
