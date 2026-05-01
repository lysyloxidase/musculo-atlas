import {
  type MolecularRenderMode,
  type ProteinStructure,
  getDefaultDomainForProtein,
  getProteinStructure,
  getTroponinShiftNm,
  isProteinId,
} from "@/lib/molecular";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

function numberedItems(prefix: string, count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`,
    index,
  }));
}

const MYOSIN_HEAD_ATOMS = numberedItems("myosin-head-atom", 8);
const ACTIN_SUBUNITS = numberedItems("actin-subunit", 34);
const CALCIUM_IONS = numberedItems("calcium-ion", 4);
const SERCA_HELICES = numberedItems("serca-helix", 10);

function SurfaceEnvelope({
  mode,
  scale = [1, 0.42, 0.32],
}: {
  mode: MolecularRenderMode;
  scale?: [number, number, number];
}) {
  if (mode !== "surface" && mode !== "molstar") {
    return null;
  }

  return (
    <mesh name="molecular-surface-envelope" scale={scale}>
      <sphereGeometry args={[1, 40, 24]} />
      <meshStandardMaterial
        color={mode === "molstar" ? "#30302d" : "#5fd0c5"}
        opacity={mode === "molstar" ? 0.28 : 0.18}
        roughness={0.72}
        transparent
      />
    </mesh>
  );
}

function MyosinProtein({
  mode,
  onSelectDomain,
  protein,
}: {
  mode: MolecularRenderMode;
  onSelectDomain: () => void;
  protein: ProteinStructure;
}) {
  const showAtoms = mode === "ball_and_stick";

  return (
    <group
      name="myosin-ii-molecule"
      userData={{
        pdbIds: protein.pdbIds,
        s1HeadsVisible: true,
        wholeMolecule: "2 heavy chains + 4 light chains",
      }}
    >
      <SurfaceEnvelope mode={mode} scale={[1.25, 0.48, 0.32]} />
      <mesh name="myosin-lmm-rod" rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 1.55, 12]} />
        <meshStandardMaterial color="#d84d75" roughness={0.58} />
      </mesh>
      {[-1, 1].map((side) => (
        <group
          key={side}
          name="myosin-s1-head"
          position={[0.62, side * 0.16, 0]}
        >
          <mesh
            onClick={(event) => {
              event.stopPropagation();
              onSelectDomain();
            }}
            scale={[1.25, 0.78, 0.5]}
          >
            <sphereGeometry args={[0.11, 28, 18]} />
            <meshStandardMaterial color="#f08bb0" roughness={0.5} />
          </mesh>
          <mesh
            position={[-0.16, -side * 0.05, 0]}
            rotation={[0, 0, 0.5 * side]}
          >
            <cylinderGeometry args={[0.018, 0.018, 0.32, 10]} />
            <meshStandardMaterial color="#d7b95d" roughness={0.48} />
          </mesh>
          {showAtoms
            ? MYOSIN_HEAD_ATOMS.map((atom) => (
                <mesh
                  key={atom.id}
                  position={[
                    0.04 * Math.cos(atom.index),
                    0.04 * Math.sin(atom.index * 1.8),
                    0.05 * Math.sin(atom.index),
                  ]}
                >
                  <sphereGeometry args={[0.018, 12, 8]} />
                  <meshStandardMaterial
                    color={atom.index % 3 === 0 ? "#4d8dff" : "#8c8c8c"}
                    roughness={0.42}
                  />
                </mesh>
              ))
            : null}
        </group>
      ))}
      <mesh name="interacting-heads-motif" position={[0.48, 0, -0.08]}>
        <torusGeometry args={[0.2, 0.008, 8, 56]} />
        <meshStandardMaterial color="#9d8df1" roughness={0.52} />
      </mesh>
    </group>
  );
}

function ActinProtein({
  mode,
  onSelectDomain,
  protein,
  troponinShiftNm,
}: {
  mode: MolecularRenderMode;
  onSelectDomain: () => void;
  protein: ProteinStructure;
  troponinShiftNm: number;
}) {
  const shift = troponinShiftNm / 40;

  return (
    <group
      name="regulated-thin-filament"
      userData={{
        pdbIds: protein.pdbIds,
        troponinSpacingNm: 38.5,
        tropomyosinShiftNm: troponinShiftNm,
      }}
    >
      <SurfaceEnvelope mode={mode} scale={[1.18, 0.34, 0.34]} />
      <group name="f-actin-double-helix">
        {ACTIN_SUBUNITS.map((subunit) => {
          const index = subunit.index;
          const strand = index % 2 === 0 ? 0 : Math.PI;
          const angle = index * 0.58 + strand;
          const x = (index - 16.5) * 0.045;

          return (
            <mesh
              key={subunit.id}
              onClick={(event) => {
                event.stopPropagation();
                onSelectDomain();
              }}
              position={[x, Math.cos(angle) * 0.14, Math.sin(angle) * 0.14]}
            >
              <sphereGeometry
                args={[mode === "cartoon" ? 0.036 : 0.052, 20, 14]}
              />
              <meshStandardMaterial color="#56d2be" roughness={0.55} />
            </mesh>
          );
        })}
      </group>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="tropomyosin-regulatory-strand"
          position={[0, side * (0.18 + shift), 0.035 * side]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.012, 0.012, 1.45, 8]} />
          <meshStandardMaterial color="#d7b95d" roughness={0.46} />
        </mesh>
      ))}
      {[-0.48, 0, 0.48].map((x) => (
        <group key={x} name="troponin-calcium-switch" position={[x, 0.28, 0]}>
          <mesh>
            <sphereGeometry args={[0.06, 18, 12]} />
            <meshStandardMaterial color="#9d8df1" roughness={0.48} />
          </mesh>
          {CALCIUM_IONS.map((ion) => (
            <mesh
              key={ion.id}
              position={[
                Math.cos(ion.index * 1.57) * 0.055,
                Math.sin(ion.index * 1.57) * 0.055,
                0.065,
              ]}
            >
              <sphereGeometry args={[0.014, 10, 8]} />
              <meshStandardMaterial color="#5fd0c5" roughness={0.35} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function TitinProtein({
  mode,
  onSelectDomain,
  protein,
}: {
  mode: MolecularRenderMode;
  onSelectDomain: () => void;
  protein: ProteinStructure;
}) {
  return (
    <group
      name="titin-ig-beads-on-string"
      userData={{
        igDomainBeads: protein.renderHints.igDomainBeads,
        pdbIds: protein.pdbIds,
        pevkRegion: "disordered flexible chain",
      }}
    >
      <SurfaceEnvelope mode={mode} scale={[1.28, 0.25, 0.2]} />
      {numberedItems("titin-ig", protein.renderHints.igDomainBeads ?? 18).map(
        (bead) => (
          <mesh
            key={bead.id}
            name="titin-ig-domain-bead"
            onClick={(event) => {
              event.stopPropagation();
              onSelectDomain();
            }}
            position={[
              (bead.index - 8.5) * 0.08,
              Math.sin(bead.index * 0.9) * 0.06,
              0,
            ]}
          >
            <sphereGeometry args={[0.045, 18, 12]} />
            <meshStandardMaterial
              color={bead.index % 4 === 0 ? "#f4f1ea" : "#d7b95d"}
              roughness={0.5}
            />
          </mesh>
        ),
      )}
      <mesh
        name="pevk-flexible-chain"
        position={[0, -0.12, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.008, 0.008, 1.35, 6]} />
        <meshStandardMaterial color="#ee7664" roughness={0.54} />
      </mesh>
    </group>
  );
}

function GenericProtein({
  mode,
  protein,
}: {
  mode: MolecularRenderMode;
  protein: ProteinStructure;
}) {
  const count = protein.id === "ryr1" ? 4 : protein.id === "serca" ? 10 : 8;

  return (
    <group
      name={`${protein.id}-molecular-assembly`}
      userData={{ pdbIds: protein.pdbIds, primaryPdbId: protein.primaryPdbId }}
    >
      <SurfaceEnvelope mode={mode} scale={[0.78, 0.58, 0.44]} />
      {numberedItems(`${protein.id}-subunit`, count).map((subunit) => {
        const index = subunit.index;
        const angle = (index / count) * Math.PI * 2;
        const radius = protein.id === "ryr1" ? 0.22 : 0.16;

        return (
          <mesh
            key={subunit.id}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
          >
            <sphereGeometry args={[0.08, 20, 14]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#9d8df1" : "#5fd0c5"}
              roughness={0.5}
            />
          </mesh>
        );
      })}
      {protein.id === "serca"
        ? SERCA_HELICES.slice(
            0,
            protein.renderHints.transmembraneHelices ?? 10,
          ).map((helix) => (
            <mesh
              key={helix.id}
              position={[(helix.index - 4.5) * 0.045, -0.32, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
              <meshStandardMaterial color="#d7b95d" roughness={0.5} />
            </mesh>
          ))
        : null}
    </group>
  );
}

export default function L9Protein({ dispatch, state }: GrossLevelProps) {
  const selectedProteinId = isProteinId(state.selectedNodeId)
    ? state.selectedNodeId
    : state.selectedProteinId;
  const protein = getProteinStructure(selectedProteinId);
  const onSelectDomain = () =>
    dispatch({
      domainId: getDefaultDomainForProtein(protein.id),
      type: "select_domain",
    });

  return (
    <group
      name="L9 protein"
      userData={{
        mode: state.molecularRenderMode,
        pdbIds: protein.pdbIds,
        primaryPdbId: protein.primaryPdbId,
        protein: protein.id,
      }}
    >
      {protein.id === "myosin_ii" ? (
        <MyosinProtein
          mode={state.molecularRenderMode}
          onSelectDomain={onSelectDomain}
          protein={protein}
        />
      ) : null}
      {protein.id === "actin" || protein.id === "troponin" ? (
        <ActinProtein
          mode={state.molecularRenderMode}
          onSelectDomain={onSelectDomain}
          protein={protein}
          troponinShiftNm={getTroponinShiftNm(state.troponinState)}
        />
      ) : null}
      {protein.id === "titin" ? (
        <TitinProtein
          mode={state.molecularRenderMode}
          onSelectDomain={onSelectDomain}
          protein={protein}
        />
      ) : null}
      {protein.id !== "myosin_ii" &&
      protein.id !== "actin" &&
      protein.id !== "troponin" &&
      protein.id !== "titin" ? (
        <GenericProtein mode={state.molecularRenderMode} protein={protein} />
      ) : null}
    </group>
  );
}
