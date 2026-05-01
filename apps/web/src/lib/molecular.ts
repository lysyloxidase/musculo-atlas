export type MolecularRenderMode =
  | "molstar"
  | "surface"
  | "cartoon"
  | "ball_and_stick";

export type TroponinState = "blocked" | "closed" | "open";

export type ProteinId =
  | "myosin_ii"
  | "actin"
  | "tropomyosin"
  | "troponin"
  | "titin"
  | "nebulin"
  | "alpha_actinin_2"
  | "serca"
  | "ryr1";

export type DomainId =
  | "titin_ig_domain"
  | "myosin_s1_motor"
  | "actin_monomer"
  | "alpha_actinin_spectrin_repeat";

export type AtomElement = "C" | "N" | "O" | "S" | "H" | "P" | "CA";

export interface MolecularAtom {
  chain: string;
  element: AtomElement;
  id: string;
  residue: string;
  residueIndex: number;
  x: number;
  y: number;
  z: number;
}

export interface ProteinStructure {
  components: string[];
  defaultDomainId?: DomainId;
  description: string;
  displayName: string;
  entryFilament: "thick" | "thin" | "titin" | "z_disc" | "sr";
  id: ProteinId;
  molecularMassKda?: number;
  pdbIds: string[];
  primaryPdbId: string;
  renderHints: {
    actinHelixTurns?: number;
    calciumSites?: number;
    igDomainBeads?: number;
    s1Heads?: number;
    transmembraneHelices?: number;
  };
  scaleNm: [number, number];
}

export interface DomainStructure {
  atoms: MolecularAtom[];
  description: string;
  displayName: string;
  fold: string;
  highlights: string[];
  id: DomainId;
  pdbId: string;
  proteinId: ProteinId;
  residues: number;
  scaleNm: [number, number, number];
  secondaryStructure: string[];
}

export interface PdbLoadTarget {
  id: string;
  proteinId: ProteinId | DomainId;
  timeoutMs: number;
  url: string;
}

export const MOLSTAR_LOAD_TARGET_MS = 3000;

export const CPK_COLORS: Record<AtomElement, string> = {
  C: "#8c8c8c",
  CA: "#2fb36d",
  H: "#f4f1ea",
  N: "#4d8dff",
  O: "#ee4f4f",
  P: "#ff9f43",
  S: "#d7b95d",
};

export const VDW_RADII_ANGSTROM: Record<AtomElement, number> = {
  C: 1.7,
  CA: 1.94,
  H: 1.2,
  N: 1.55,
  O: 1.52,
  P: 1.8,
  S: 1.8,
};

export const TROPONIN_STATES: Record<
  TroponinState,
  { label: string; tropomyosinShiftNm: number }
> = {
  blocked: {
    label: "B state - myosin sites sterically blocked",
    tropomyosinShiftNm: -3.5,
  },
  closed: {
    label: "C state - calcium-bound troponin begins exposure",
    tropomyosinShiftNm: 0,
  },
  open: {
    label: "M state - myosin-bound open thin filament",
    tropomyosinShiftNm: 4,
  },
};

export const MOLECULAR_PROTEINS: ProteinStructure[] = [
  {
    components: [
      "2 heavy chains",
      "4 light chains",
      "S1 motor heads",
      "S2 coiled-coil",
      "LMM rod",
      "interacting heads motif",
    ],
    defaultDomainId: "myosin_s1_motor",
    description:
      "Type-II myosin motor protein forming thick filaments, with ATPase S1 heads that bind actin and execute the power stroke.",
    displayName: "Myosin II",
    entryFilament: "thick",
    id: "myosin_ii",
    molecularMassKda: 520,
    pdbIds: ["2MYS", "5N69", "3I5G", "8G4L", "1BR1"],
    primaryPdbId: "2MYS",
    renderHints: { s1Heads: 2 },
    scaleNm: [16.5, 150],
  },
  {
    components: [
      "F-actin double helix",
      "G-actin subunits",
      "tropomyosin groove strand",
      "troponin complexes at 38.5 nm",
      "nebulin ruler contact",
    ],
    defaultDomainId: "actin_monomer",
    description:
      "Thin-filament actin backbone with tropomyosin and troponin regulating access to myosin-binding sites.",
    displayName: "F-actin",
    entryFilament: "thin",
    id: "actin",
    molecularMassKda: 42,
    pdbIds: ["3MFP", "1ATN", "5JLH", "5NOG", "5NOL", "5NOJ", "6KN8"],
    primaryPdbId: "3MFP",
    renderHints: { actinHelixTurns: 3 },
    scaleNm: [7, 38.5],
  },
  {
    components: ["coiled-coil dimer", "actin groove contacts", "B/C/M states"],
    description:
      "Thin-filament coiled-coil that shifts on actin after calcium binds troponin.",
    displayName: "Tropomyosin",
    entryFilament: "thin",
    id: "tropomyosin",
    molecularMassKda: 66,
    pdbIds: ["5JLH", "5NOG", "5NOL", "5NOJ"],
    primaryPdbId: "5JLH",
    renderHints: {},
    scaleNm: [2, 40],
  },
  {
    components: [
      "TnC calcium-binding lobe",
      "TnI inhibitory arm",
      "TnT Tm-binding arm",
    ],
    description:
      "Calcium-regulated thin-filament complex that moves tropomyosin from blocked to open states.",
    displayName: "Troponin complex",
    entryFilament: "thin",
    id: "troponin",
    molecularMassKda: 79,
    pdbIds: ["6KN8", "6KLN"],
    primaryPdbId: "6KN8",
    renderHints: { calciumSites: 4 },
    scaleNm: [9, 12],
  },
  {
    components: [
      "I-band tandem Ig domains",
      "PEVK disordered spring",
      "N2A/N2B elastic elements",
      "A-band super-repeats",
      "Z1Z2 telethonin anchor",
    ],
    defaultDomainId: "titin_ig_domain",
    description:
      "Giant molecular spring spanning Z-disc to M-line, centering thick filaments and storing passive elastic energy.",
    displayName: "Titin",
    entryFilament: "titin",
    id: "titin",
    molecularMassKda: 3500,
    pdbIds: ["1TIT", "1TIU", "3B43", "1YA5"],
    primaryPdbId: "1TIT",
    renderHints: { igDomainBeads: 18 },
    scaleNm: [4, 1000],
  },
  {
    components: [
      "simple repeats",
      "thin-filament contact sites",
      "actin length ruler",
    ],
    description:
      "Thin-filament molecular ruler that stabilizes and regulates actin filament length.",
    displayName: "Nebulin",
    entryFilament: "thin",
    id: "nebulin",
    molecularMassKda: 750,
    pdbIds: ["7QIM"],
    primaryPdbId: "7QIM",
    renderHints: {},
    scaleNm: [2, 1000],
  },
  {
    components: [
      "actin-binding domain",
      "spectrin repeats",
      "EF-hand domain",
      "antiparallel dimer",
    ],
    defaultDomainId: "alpha_actinin_spectrin_repeat",
    description:
      "Z-disc dimer cross-linking antiparallel actin filaments and binding titin Z-repeats.",
    displayName: "Alpha-actinin-2",
    entryFilament: "z_disc",
    id: "alpha_actinin_2",
    molecularMassKda: 200,
    pdbIds: ["4D1E"],
    primaryPdbId: "4D1E",
    renderHints: {},
    scaleNm: [5, 35],
  },
  {
    components: [
      "10 transmembrane helices",
      "nucleotide-binding domain",
      "actuator domain",
      "phosphorylation domain",
    ],
    description:
      "Sarcoplasmic-reticulum calcium ATPase that pumps calcium back into the SR after contraction.",
    displayName: "SERCA",
    entryFilament: "sr",
    id: "serca",
    molecularMassKda: 110,
    pdbIds: ["1SU4", "3TLM"],
    primaryPdbId: "1SU4",
    renderHints: { transmembraneHelices: 10 },
    scaleNm: [7, 10],
  },
  {
    components: [
      "homotetrameric channel",
      "cytosolic foot domain",
      "pore",
      "DHPR-coupled release complex",
    ],
    description:
      "Massive SR calcium-release channel forming the terminal cisterna feet at the triad.",
    displayName: "RyR1",
    entryFilament: "sr",
    id: "ryr1",
    molecularMassKda: 2200,
    pdbIds: ["5T15", "7M6L"],
    primaryPdbId: "5T15",
    renderHints: {},
    scaleNm: [27, 27],
  },
];

function atom(
  id: string,
  element: AtomElement,
  residue: string,
  residueIndex: number,
  x: number,
  y: number,
  z: number,
): MolecularAtom {
  return { chain: "A", element, id, residue, residueIndex, x, y, z };
}

const TITIN_IG_DOMAIN_ATOMS: MolecularAtom[] = [
  atom("1tit-a1-n", "N", "VAL", 1, -7.2, -1.5, 0.6),
  atom("1tit-a1-c", "C", "VAL", 1, -6.5, -0.8, 0.2),
  atom("1tit-a2-o", "O", "THR", 6, -5.8, -0.1, -0.3),
  atom("1tit-a2-c", "C", "THR", 6, -5.0, 0.6, -0.1),
  atom("1tit-b-n", "N", "LYS", 12, -4.2, 1.0, 0.5),
  atom("1tit-b-c", "C", "LYS", 12, -3.4, 1.4, 0.1),
  atom("1tit-b-o", "O", "GLU", 18, -2.8, 1.0, -0.5),
  atom("1tit-c-n", "N", "ILE", 24, -2.0, 0.4, -0.2),
  atom("1tit-c-c", "C", "ILE", 24, -1.1, -0.2, 0.2),
  atom("1tit-c-o", "O", "ASP", 31, -0.4, -0.9, -0.2),
  atom("1tit-d-n", "N", "GLY", 38, 0.4, -1.3, 0.4),
  atom("1tit-d-c", "C", "GLY", 38, 1.2, -0.9, 0.1),
  atom("1tit-d-s", "S", "CYS", 44, 1.8, -0.2, -0.4),
  atom("1tit-e-s", "S", "CYS", 47, 2.2, 0.5, -0.3),
  atom("1tit-e-n", "N", "ASN", 53, 2.8, 1.1, 0.4),
  atom("1tit-e-c", "C", "ASN", 53, 3.6, 1.5, 0.1),
  atom("1tit-f-o", "O", "TYR", 61, 4.4, 1.0, -0.4),
  atom("1tit-f-c", "C", "TYR", 61, 5.2, 0.3, -0.1),
  atom("1tit-g-n", "N", "PHE", 73, 6.0, -0.4, 0.4),
  atom("1tit-g-c", "C", "PHE", 73, 6.8, -1.0, 0.1),
  atom("1tit-g-o", "O", "SER", 89, 7.4, -1.6, -0.3),
];

export const DOMAIN_STRUCTURES: DomainStructure[] = [
  {
    atoms: TITIN_IG_DOMAIN_ATOMS,
    description:
      "Canonical I27 immunoglobulin-like titin domain with mechanically loaded beta strands.",
    displayName: "Titin Ig domain I27",
    fold: "beta-sandwich, 7 beta strands",
    highlights: [
      "A strand peels first under AFM force",
      "A' and B strands form the early mechanical clamp",
      "150-300 pN unfolding force range",
    ],
    id: "titin_ig_domain",
    pdbId: "1TIT",
    proteinId: "titin",
    residues: 89,
    scaleNm: [4, 2.5, 2],
    secondaryStructure: ["A", "A'", "B", "C", "D", "E", "F", "G"],
  },
  {
    atoms: makeSyntheticDomainAtoms("myosin_s1_motor", "2MYS", 28),
    description:
      "Myosin S1 motor domain with nucleotide pocket, actin-binding interface, converter, and lever-arm base.",
    displayName: "Myosin S1 motor domain",
    fold: "P-loop NTPase motor with converter and actin-binding clefts",
    highlights: [
      "Mg-ATP pocket sits between 25-kDa and 50-kDa domains",
      "Loop 2 and CM loop engage actin",
      "Converter rotation drives the lever-arm swing",
    ],
    id: "myosin_s1_motor",
    pdbId: "2MYS",
    proteinId: "myosin_ii",
    residues: 843,
    scaleNm: [16.5, 6.5, 4],
    secondaryStructure: [
      "25kDa upper",
      "50kDa upper",
      "50kDa lower",
      "20kDa converter",
    ],
  },
  {
    atoms: makeSyntheticDomainAtoms("actin_monomer", "1ATN", 24),
    description:
      "Actin monomer with four subdomains surrounding the nucleotide-binding cleft.",
    displayName: "Actin monomer",
    fold: "actin fold with four subdomains",
    highlights: [
      "Nucleotide cleft between SD2 and SD4",
      "Barbed and pointed faces define filament polarity",
      "DNase-loop participates in F-actin contacts",
    ],
    id: "actin_monomer",
    pdbId: "1ATN",
    proteinId: "actin",
    residues: 375,
    scaleNm: [5.5, 5.5, 3.5],
    secondaryStructure: ["SD1 outer", "SD2 DNase loop", "SD3 inner", "SD4"],
  },
  {
    atoms: makeSyntheticDomainAtoms(
      "alpha_actinin_spectrin_repeat",
      "4D1E",
      22,
    ),
    description:
      "Triple-helix spectrin repeat from alpha-actinin-2, part of the Z-disc cross-linking rod.",
    displayName: "Alpha-actinin-2 spectrin repeat",
    fold: "triple-helix spectrin repeat",
    highlights: [
      "Rod stiffness spaces antiparallel actin filaments",
      "EF-hand tail modulates protein binding",
      "Titin Z-repeats bind near the Z-disc lattice",
    ],
    id: "alpha_actinin_spectrin_repeat",
    pdbId: "4D1E",
    proteinId: "alpha_actinin_2",
    residues: 110,
    scaleNm: [5, 2, 2],
    secondaryStructure: ["helix A", "helix B", "helix C"],
  },
];

function makeSyntheticDomainAtoms(
  domainId: string,
  chainSeed: string,
  count: number,
): MolecularAtom[] {
  const elements: AtomElement[] = ["C", "N", "O", "C", "S", "C"];

  return Array.from({ length: count }, (_, index) => {
    const turn = index * 0.62;
    const element = elements[index % elements.length];

    return {
      chain: "A",
      element,
      id: `${domainId}-${chainSeed.toLowerCase()}-${index}`,
      residue: index % 5 === 0 ? "GLY" : index % 3 === 0 ? "LYS" : "ALA",
      residueIndex: index + 1,
      x: Math.cos(turn) * 3 + (index - count / 2) * 0.18,
      y: Math.sin(turn) * 2,
      z: Math.sin(turn * 0.5) * 1.4,
    };
  });
}

export function isProteinId(id: string): id is ProteinId {
  return MOLECULAR_PROTEINS.some((protein) => protein.id === id);
}

export function isDomainId(id: string): id is DomainId {
  return DOMAIN_STRUCTURES.some((domain) => domain.id === id);
}

export function getProteinStructure(id: string): ProteinStructure {
  const protein = MOLECULAR_PROTEINS.find((item) => item.id === id);

  if (!protein) {
    throw new Error(`Unknown molecular protein: ${id}`);
  }

  return protein;
}

export function getDomainStructure(id: string): DomainStructure {
  const domain = DOMAIN_STRUCTURES.find((item) => item.id === id);

  if (!domain) {
    throw new Error(`Unknown molecular domain: ${id}`);
  }

  return domain;
}

export function resolveProteinIdFromFilament(id: string): ProteinId {
  if (isProteinId(id)) {
    return id;
  }

  if (id.includes("thin") || id.includes("actin")) {
    return "actin";
  }

  if (id.includes("titin")) {
    return "titin";
  }

  return "myosin_ii";
}

export function getDefaultDomainForProtein(id: ProteinId): DomainId {
  return getProteinStructure(id).defaultDomainId ?? "titin_ig_domain";
}

export function getMolstarUrl(pdbId: string): string {
  const normalized = pdbId.trim().toUpperCase();

  return `https://molstar.org/viewer/?pdb=${encodeURIComponent(normalized)}`;
}

export function getPdbLoadTarget(
  proteinId: ProteinId | DomainId,
  pdbId: string,
): PdbLoadTarget {
  return {
    id: pdbId.toUpperCase(),
    proteinId,
    timeoutMs: MOLSTAR_LOAD_TARGET_MS,
    url: getMolstarUrl(pdbId),
  };
}

export function getPdbLoadPlan(): PdbLoadTarget[] {
  const targets = new Map<string, PdbLoadTarget>();

  for (const protein of MOLECULAR_PROTEINS) {
    for (const pdbId of protein.pdbIds) {
      targets.set(pdbId, getPdbLoadTarget(protein.id, pdbId));
    }
  }

  for (const domain of DOMAIN_STRUCTURES) {
    targets.set(domain.pdbId, getPdbLoadTarget(domain.id, domain.pdbId));
  }

  return Array.from(targets.values()).sort((left, right) =>
    left.id.localeCompare(right.id),
  );
}

export function getAtomsForDomain(id: DomainId): MolecularAtom[] {
  return getDomainStructure(id).atoms;
}

export function getCpkColor(element: AtomElement): string {
  return CPK_COLORS[element];
}

export function getVdwRadiusAngstrom(element: AtomElement): number {
  return VDW_RADII_ANGSTROM[element];
}

export function getTroponinShiftNm(state: TroponinState): number {
  return TROPONIN_STATES[state].tropomyosinShiftNm;
}

export function getTroponinStateLabel(state: TroponinState): string {
  return TROPONIN_STATES[state].label;
}

export function parseMolecularRenderMode(
  value: string | null,
): MolecularRenderMode | null {
  if (
    value === "molstar" ||
    value === "surface" ||
    value === "cartoon" ||
    value === "ball_and_stick"
  ) {
    return value;
  }

  return null;
}

export function parseTroponinState(value: string | null): TroponinState | null {
  if (value === "blocked" || value === "closed" || value === "open") {
    return value;
  }

  return null;
}

export function parsePdbAtoms(pdbText: string): MolecularAtom[] {
  return pdbText
    .split(/\r?\n/)
    .map(parsePdbAtomLine)
    .filter((atom): atom is MolecularAtom => atom !== null);
}

export function parsePdbAtomLine(line: string): MolecularAtom | null {
  const recordType = line.slice(0, 6).trim();

  if (recordType !== "ATOM" && recordType !== "HETATM") {
    return null;
  }

  const rawElement = line.slice(76, 78).trim() || line.slice(12, 14).trim();
  const element = normalizeElement(rawElement);

  if (!element) {
    return null;
  }

  return {
    chain: line.slice(21, 22).trim() || "A",
    element,
    id: `${line.slice(6, 11).trim()}-${line.slice(12, 16).trim()}`,
    residue: line.slice(17, 20).trim(),
    residueIndex: Number(line.slice(22, 26).trim()),
    x: Number(line.slice(30, 38).trim()),
    y: Number(line.slice(38, 46).trim()),
    z: Number(line.slice(46, 54).trim()),
  };
}

function normalizeElement(value: string): AtomElement | null {
  const upper = value.toUpperCase();

  if (
    upper === "C" ||
    upper === "N" ||
    upper === "O" ||
    upper === "S" ||
    upper === "H" ||
    upper === "P" ||
    upper === "CA"
  ) {
    return upper;
  }

  return null;
}
