export default function L5Fascicle() {
  return (
    <group name="L5 fascicle">
      {[-0.26, 0, 0.26].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.08, 1.2, 12, 32]} />
          <meshStandardMaterial color="#d7b95d" roughness={0.78} />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.34, 0.012, 8, 64]} />
        <meshStandardMaterial color="#5fd0c5" roughness={0.62} />
      </mesh>
    </group>
  );
}
