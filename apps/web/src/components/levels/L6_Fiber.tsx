export default function L6Fiber() {
  return (
    <group name="L6 fiber">
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.2, 1.4, 16, 48]} />
        <meshStandardMaterial
          color="#5fd0c5"
          roughness={0.76}
          transparent
          opacity={0.82}
        />
      </mesh>
      {[-0.42, -0.21, 0, 0.21, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.02, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.9, 16]} />
          <meshStandardMaterial color="#ee7664" roughness={0.68} />
        </mesh>
      ))}
    </group>
  );
}
