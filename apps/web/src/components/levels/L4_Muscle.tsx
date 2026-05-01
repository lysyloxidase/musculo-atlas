export default function L4Muscle() {
  return (
    <group name="L4 muscle">
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.18, 1.35, 16, 36]} />
        <meshStandardMaterial color="#ee7664" roughness={0.82} />
      </mesh>
      {[-0.42, -0.14, 0.14, 0.42].map((x) => (
        <mesh key={x} position={[x, 0, 0.19]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 1.1, 12]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
}
