import { calculateBandGeometry, getLengthTensionForce } from "@/lib/sarcomere";
import SarcomereFilaments from "../shared/SarcomereFilaments";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

const SCENE_SCALE = 0.72;

function UmBand({
  color,
  lengthUm,
  name,
  opacity,
  xUm,
  y = -0.42,
}: {
  color: string;
  lengthUm: number;
  name: string;
  opacity: number;
  xUm: number;
  y?: number;
}) {
  return (
    <mesh name={name} position={[xUm * SCENE_SCALE, y, -0.18]}>
      <boxGeometry
        args={[Math.max(0.01, lengthUm * SCENE_SCALE), 0.065, 0.035]}
      />
      <meshStandardMaterial
        color={color}
        opacity={opacity}
        roughness={0.65}
        transparent
      />
    </mesh>
  );
}

export default function L8Sarcomere({ dispatch, state }: GrossLevelProps) {
  const bands = calculateBandGeometry(state.sarcomereLengthUm, state.fiberType);
  const force = getLengthTensionForce(state.sarcomereLengthUm);

  return (
    <group
      name="L8 sarcomere"
      userData={{
        force,
        sarcomereLengthUm: state.sarcomereLengthUm,
        thickFilamentLengthUm: bands.thickFilamentLengthUm,
      }}
    >
      {state.sarcomereVisibility.zDisc ? (
        <>
          <mesh position={[bands.zLeftUm * SCENE_SCALE, 0, 0]}>
            <boxGeometry
              args={[
                Math.max(0.012, bands.zDiscThicknessUm * SCENE_SCALE),
                0.72,
                0.12,
              ]}
            />
            <meshStandardMaterial
              color="#f4f1ea"
              opacity={0.62}
              roughness={0.5}
              transparent
            />
          </mesh>
          <mesh position={[bands.zRightUm * SCENE_SCALE, 0, 0]}>
            <boxGeometry
              args={[
                Math.max(0.012, bands.zDiscThicknessUm * SCENE_SCALE),
                0.72,
                0.12,
              ]}
            />
            <meshStandardMaterial
              color="#f4f1ea"
              opacity={0.62}
              roughness={0.5}
              transparent
            />
          </mesh>
        </>
      ) : null}
      {state.sarcomereVisibility.mLine ? (
        <mesh position={[0, 0, 0]}>
          <boxGeometry
            args={[
              Math.max(0.01, bands.mLineWidthUm * SCENE_SCALE),
              0.62,
              0.08,
            ]}
          />
          <meshStandardMaterial
            color="#d7b95d"
            opacity={0.55}
            roughness={0.45}
            transparent
          />
        </mesh>
      ) : null}
      <UmBand
        color="#d84d75"
        lengthUm={bands.aBandWidthUm}
        name="a-band-width-marker"
        opacity={0.58}
        xUm={0}
      />
      <UmBand
        color="#30302d"
        lengthUm={bands.hZoneWidthUm}
        name="h-zone-width-marker"
        opacity={0.76}
        xUm={0}
        y={-0.52}
      />
      <UmBand
        color="#5fd0c5"
        lengthUm={bands.halfIbandWidthUm}
        name="left-i-band-width-marker"
        opacity={0.46}
        xUm={bands.zLeftUm + bands.halfIbandWidthUm / 2}
      />
      <UmBand
        color="#5fd0c5"
        lengthUm={bands.halfIbandWidthUm}
        name="right-i-band-width-marker"
        opacity={0.46}
        xUm={bands.zRightUm - bands.halfIbandWidthUm / 2}
      />
      <SarcomereFilaments
        bandGeometry={bands}
        crossBridgeStep={state.crossBridgeStep}
        onSelectFilament={(filamentId) =>
          dispatch({ filamentId, type: "select_filament" })
        }
        visibility={state.sarcomereVisibility}
      />
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[
            side * (state.sarcomereLengthUm / 2 - 0.2) * SCENE_SCALE,
            0.45,
            0,
          ]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.005, 0.005, 0.38, 6]} />
          <meshStandardMaterial color="#56d2be" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
