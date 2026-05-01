export default function L10Atom() {
  return (
    <group name="L10 atom and domain detail">
      {[
        { color: "#ee7664", position: [0, 0, 0] as const, radius: 0.16 },
        { color: "#5fd0c5", position: [0.26, 0.12, 0] as const, radius: 0.1 },
        {
          color: "#d7b95d",
          position: [-0.24, -0.08, 0.08] as const,
          radius: 0.11,
        },
        {
          color: "#9d8df1",
          position: [0.05, -0.26, -0.02] as const,
          radius: 0.09,
        },
      ].map((atom) => (
        <mesh key={atom.color} position={atom.position}>
          <sphereGeometry args={[atom.radius, 32, 32]} />
          <meshStandardMaterial color={atom.color} roughness={0.38} />
        </mesh>
      ))}
      <mesh rotation={[0.4, 0.2, 0.7]}>
        <torusGeometry args={[0.34, 0.012, 8, 80]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.45} />
      </mesh>
    </group>
  );
}
