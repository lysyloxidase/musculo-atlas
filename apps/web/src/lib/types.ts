export type ZoomLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Measurement {
  value: number;
  unit: string;
}

export interface Dimensions {
  scale_meters: number;
  length?: Measurement;
  diameter?: Measurement;
  count?: number;
  mass_kda?: number;
  source: string;
}

export type ProceduralType =
  | "fascicle_bundle"
  | "muscle_fiber"
  | "myofibril"
  | "sarcomere_lattice"
  | "protein_structure"
  | "domain_detail";

export interface HierarchyNode {
  id: string;
  level: ZoomLevel;
  name: string;
  latin_name?: string;
  parent_id: string | null;
  children_ids: string[];
  dimensions: Dimensions;
  description: string;
  mesh_path?: string;
  procedural_type?: ProceduralType;
  pdb_id?: string;
  physiology?: string;
  biochemistry?: string;
  clinical_significance?: string;
}

export interface MuscleCatalogEntry {
  id: string;
  name: string;
  latin_name?: string;
  region: string;
  fiber_length_cm: number;
  pennation_deg: number;
  pcsa_cm2: number;
  innervation: string;
  source: string;
}

export interface FiberTypeComposition {
  I: number;
  IIa: number;
  IIx: number;
}

export interface OpenSimParameters {
  max_iso_force_N: number;
  opt_fiber_length_m: number;
  tendon_slack_m: number;
}

export type PennationPattern =
  | "parallel"
  | "unipennate"
  | "bipennate"
  | "multipennate";

export interface MuscleDetail extends MuscleCatalogEntry {
  origin: string;
  insertion: string;
  action: string;
  blood_supply: string;
  clinical: string;
  fiber_type_pct?: FiberTypeComposition;
  opensim?: OpenSimParameters;
  pennation_pattern: PennationPattern;
  fully_detailed: boolean;
}

export interface PdbCatalogEntry {
  protein: string;
  display_name: string;
  pdb_ids: string[];
  level: 9 | 10;
  description: string;
  source: string;
}
