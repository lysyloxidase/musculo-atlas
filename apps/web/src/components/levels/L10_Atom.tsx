import {
  type DomainId,
  getAtomsForDomain,
  getCpkColor,
  getDomainStructure,
  getVdwRadiusAngstrom,
  isDomainId,
} from "@/lib/molecular";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

const ATOM_SCALE = 0.055;

function RibbonDomain({ domainId }: { domainId: DomainId }) {
  const domain = getDomainStructure(domainId);
  const strandCount = domain.secondaryStructure.length;

  return (
    <group name="domain-secondary-structure-ribbon">
      {domain.secondaryStructure.map((strand, index) => {
        const x = (index - (strandCount - 1) / 2) * 0.13;
        const y = Math.sin(index * 1.2) * 0.16;

        return (
          <mesh
            key={strand}
            name={`secondary-${strand}`}
            position={[x, y, -0.08]}
            rotation={[0.25, 0.15, index % 2 === 0 ? 0.22 : -0.22]}
          >
            <boxGeometry args={[0.08, 0.34, 0.018]} />
            <meshStandardMaterial
              color={domain.id === "titin_ig_domain" ? "#d7b95d" : "#9d8df1"}
              opacity={0.72}
              roughness={0.48}
              transparent
            />
          </mesh>
        );
      })}
      {domain.id === "titin_ig_domain" ? (
        <mesh name="mechanical-unfolding-a-to-b" position={[-0.36, -0.1, 0.02]}>
          <boxGeometry args={[0.28, 0.022, 0.022]} />
          <meshStandardMaterial color="#ee7664" roughness={0.42} />
        </mesh>
      ) : null}
    </group>
  );
}

function AtomCloud({
  domainId,
  onSelectAtom,
}: {
  domainId: DomainId;
  onSelectAtom: (atomId: string) => void;
}) {
  const atoms = getAtomsForDomain(domainId);

  return (
    <group
      name="ball-and-stick-atomic-selection"
      userData={{
        atomsVisible: atoms.length,
        cpkColoring: "C gray, N blue, O red, S yellow",
      }}
    >
      {atoms.map((atom) => (
        <mesh
          key={atom.id}
          name={`atom-${atom.element}-${atom.residue}${atom.residueIndex}`}
          onClick={(event) => {
            event.stopPropagation();
            onSelectAtom(atom.id);
          }}
          position={[
            atom.x * ATOM_SCALE,
            atom.y * ATOM_SCALE,
            atom.z * ATOM_SCALE,
          ]}
        >
          <sphereGeometry
            args={[getVdwRadiusAngstrom(atom.element) * 0.015, 16, 10]}
          />
          <meshStandardMaterial
            color={getCpkColor(atom.element)}
            roughness={0.36}
          />
        </mesh>
      ))}
      {atoms.slice(1).map((atom, index) => {
        const previous = atoms[index];
        const x = ((atom.x + previous.x) / 2) * ATOM_SCALE;
        const y = ((atom.y + previous.y) / 2) * ATOM_SCALE;
        const z = ((atom.z + previous.z) / 2) * ATOM_SCALE;

        return (
          <mesh key={`${previous.id}-${atom.id}`} position={[x, y, z]}>
            <sphereGeometry args={[0.006, 8, 6]} />
            <meshStandardMaterial color="#f4f1ea" roughness={0.44} />
          </mesh>
        );
      })}
    </group>
  );
}

function HydrogenBonds({ domainId }: { domainId: DomainId }) {
  const bonds =
    domainId === "titin_ig_domain"
      ? [
          { id: "a-b-clamp-1", position: [-0.28, 0.18, 0] as const },
          { id: "a-b-clamp-2", position: [-0.14, -0.18, 0] as const },
          { id: "core-hbond-1", position: [0.02, 0.18, 0] as const },
          { id: "core-hbond-2", position: [0.18, -0.18, 0] as const },
        ]
      : [
          { id: "domain-hbond-1", position: [-0.2, 0.14, 0] as const },
          { id: "domain-hbond-2", position: [0, -0.14, 0] as const },
          { id: "domain-hbond-3", position: [0.2, 0.14, 0] as const },
        ];

  return (
    <group name="hydrogen-bond-guides">
      {bonds.map((bond) => (
        <mesh
          key={bond.id}
          position={bond.position}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.004, 0.004, 0.32, 6]} />
          <meshStandardMaterial
            color="#5fd0c5"
            opacity={0.45}
            roughness={0.4}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

export default function L10Atom({ dispatch, state }: GrossLevelProps) {
  const selectedDomainId = isDomainId(state.selectedNodeId)
    ? state.selectedNodeId
    : state.selectedDomainId;
  const domain = getDomainStructure(selectedDomainId);

  return (
    <group
      name="L10 atom and domain detail"
      userData={{
        pdbId: domain.pdbId,
        residuesVisible: domain.residues,
        selectedDomainId,
      }}
    >
      {state.molecularRenderMode === "surface" ||
      state.molecularRenderMode === "molstar" ? (
        <mesh name="van-der-waals-domain-surface" scale={[0.72, 0.5, 0.38]}>
          <sphereGeometry args={[1, 40, 24]} />
          <meshStandardMaterial
            color="#30302d"
            opacity={0.34}
            roughness={0.7}
            transparent
          />
        </mesh>
      ) : null}
      <RibbonDomain domainId={selectedDomainId} />
      <HydrogenBonds domainId={selectedDomainId} />
      <AtomCloud
        domainId={selectedDomainId}
        onSelectAtom={(atomId) => dispatch({ atomId, type: "select_atom" })}
      />
    </group>
  );
}
