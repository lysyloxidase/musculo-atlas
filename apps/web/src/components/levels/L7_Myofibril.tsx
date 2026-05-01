import { calculateBandGeometry } from "@/lib/sarcomere";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

const SCENE_SCALE = 0.34;
const sarcomereOffsets = [-0.86, 0, 0.86];

function BandSegment({
  color,
  lengthUm,
  name,
  opacity = 0.8,
  xUm,
}: {
  color: string;
  lengthUm: number;
  name: string;
  opacity?: number;
  xUm: number;
}) {
  return (
    <mesh
      name={name}
      position={[xUm * SCENE_SCALE, 0, 0]}
      rotation={[0, 0, Math.PI / 2]}
    >
      <cylinderGeometry
        args={[0.08, 0.08, Math.max(0.012, lengthUm * SCENE_SCALE), 28]}
      />
      <meshStandardMaterial
        color={color}
        opacity={opacity}
        roughness={0.7}
        transparent
      />
    </mesh>
  );
}

export default function L7Myofibril({ dispatch, state }: GrossLevelProps) {
  const bands = calculateBandGeometry(state.sarcomereLengthUm, state.fiberType);

  return (
    <group
      name="L7 myofibril"
      userData={{
        aBandWidthUm: bands.aBandWidthUm,
        hZoneWidthUm: bands.hZoneWidthUm,
        iBandWidthUm: bands.iBandWidthUm,
        zDiscThicknessUm: bands.zDiscThicknessUm,
      }}
    >
      {sarcomereOffsets.map((offset, index) => (
        <group
          key={offset}
          name={`banded-sarcomere-${index + 1}`}
          onClick={(event) => {
            event.stopPropagation();
            dispatch({
              sarcomereId: `sarcomere_${index + 1}`,
              type: "select_sarcomere",
            });
          }}
          position={[offset, 0, 0]}
          userData={{ zToZ: true }}
        >
          <BandSegment
            color="#f4f1ea"
            lengthUm={bands.zDiscThicknessUm}
            name="left-z-disc"
            xUm={bands.zLeftUm}
          />
          <BandSegment
            color="#f4f1ea"
            lengthUm={bands.zDiscThicknessUm}
            name="right-z-disc"
            xUm={bands.zRightUm}
          />
          <BandSegment
            color="#5fd0c5"
            lengthUm={bands.halfIbandWidthUm}
            name="left-i-band"
            opacity={0.42}
            xUm={bands.zLeftUm + bands.halfIbandWidthUm / 2}
          />
          <BandSegment
            color="#5fd0c5"
            lengthUm={bands.halfIbandWidthUm}
            name="right-i-band"
            opacity={0.42}
            xUm={bands.zRightUm - bands.halfIbandWidthUm / 2}
          />
          <BandSegment
            color="#d84d75"
            lengthUm={bands.aBandWidthUm}
            name="a-band"
            opacity={0.78}
            xUm={0}
          />
          <BandSegment
            color="#30302d"
            lengthUm={bands.hZoneWidthUm}
            name="h-zone"
            opacity={0.68}
            xUm={0}
          />
          <BandSegment
            color="#d7b95d"
            lengthUm={bands.mLineWidthUm}
            name="m-line"
            opacity={0.95}
            xUm={0}
          />
        </group>
      ))}
      {[-0.32, 0.32].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.12, 0.004, 6, 48]} />
          <meshStandardMaterial
            color="#d7b95d"
            opacity={0.55}
            roughness={0.5}
            transparent
          />
        </mesh>
      ))}
      {[-0.7, 0.7].map((x) => (
        <mesh
          key={x}
          position={[x, 0.24, 0.16]}
          rotation={[0.4, 0, Math.PI / 2]}
        >
          <sphereGeometry args={[0.055, 14, 10]} />
          <meshStandardMaterial color="#d7b95d" roughness={0.58} />
        </mesh>
      ))}
    </group>
  );
}
