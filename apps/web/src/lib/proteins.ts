import pdbCatalog from "../data/pdb_catalog.json";
import type { PdbCatalogEntry } from "./types";

export const PDB_CATALOG = pdbCatalog as PdbCatalogEntry[];

export const CANONICAL_PDB_IDS = Array.from(
  new Set(PDB_CATALOG.flatMap((entry) => entry.pdb_ids)),
).sort();

export function getPdbIdsForProtein(protein: string): string[] {
  const normalized = protein.trim().toLowerCase();
  const entry = PDB_CATALOG.find(
    (item) =>
      item.protein.toLowerCase() === normalized ||
      item.display_name.toLowerCase() === normalized,
  );

  return entry?.pdb_ids ?? [];
}
