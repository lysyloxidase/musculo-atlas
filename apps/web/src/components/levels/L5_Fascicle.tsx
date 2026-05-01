import { buildFascicleConfig } from "@/lib/microAnatomy";
import EndomysiumNetwork from "../shared/EndomysiumNetwork";
import FascicleVasculature from "../shared/FascicleVasculature";
import InstancedFascicleFibers from "../shared/InstancedFascicleFibers";
import WavyPerimysium from "../shared/WavyPerimysium";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

export default function L5Fascicle({ dispatch, state }: GrossLevelProps) {
  const config = buildFascicleConfig();

  return (
    <group
      name={`L5 fascicle ${state.selectedMuscleId}`}
      userData={{
        crossSection: state.fascicleCrossSection,
        fascicleDiameterUm: config.diameter_um,
        fiberCount: config.fiberCount,
      }}
    >
      <mesh position={[-0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[
            1.18,
            1.18,
            state.fascicleCrossSection ? 0.78 : 1.82,
            56,
            1,
            true,
          ]}
        />
        <meshStandardMaterial
          color="#30302d"
          opacity={0.18}
          roughness={0.92}
          transparent
        />
      </mesh>
      <WavyPerimysium crossSection={state.fascicleCrossSection} />
      <InstancedFascicleFibers
        config={config}
        crossSection={state.fascicleCrossSection}
        onSelectFiber={(fiberId) => dispatch({ fiberId, type: "select_fiber" })}
      />
      {state.fascicleCrossSection ? (
        <EndomysiumNetwork config={config} />
      ) : null}
      <FascicleVasculature crossSection={state.fascicleCrossSection} />
      <mesh position={[state.fascicleCrossSection ? 0.4 : 0.88, 0, 0]}>
        <boxGeometry args={[0.012, 2.25, 2.25]} />
        <meshStandardMaterial color="#f4f1ea" opacity={0.12} transparent />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.22, 0.018, 10, 96]} />
        <meshStandardMaterial
          color="#efe6d1"
          roughness={0.6}
          transparent
          opacity={0.56}
        />
      </mesh>
    </group>
  );
}
