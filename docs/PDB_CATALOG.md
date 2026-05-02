# PDB Catalog

The canonical PDB catalog lives in `apps/web/src/data/pdb_catalog.json` and the richer molecular rendering model lives in `apps/web/src/lib/molecular.ts`.

## Canonical Structures

| Protein | Structures |
| --- | --- |
| Myosin II | 2MYS, 5N69, 3I5G, 8G4L, 1BR1 |
| F-actin | 3MFP, 1ATN |
| Actin + tropomyosin | 5JLH, 5NOG, 5NOL, 5NOJ |
| Troponin complex | 6KN8, 6KLN |
| Titin | 1TIT, 1TIU, 3B43, 1YA5 |
| Nebulin | 7QIM |
| Alpha-actinin-2 | 4D1E |
| SERCA | 1SU4, 3TLM |
| RyR1 | 5T15, 7M6L |

Each structure gets a Molstar URL through `getPdbLoadPlan()`, with a 3000 ms target for Level 9-10 molecular loading.

## Domain Entry Points

- Titin Ig domain I27: 1TIT
- Myosin S1 motor domain: 2MYS
- Actin monomer: 1ATN
- Alpha-actinin-2 spectrin repeat: 4D1E

Custom R3F atom rendering uses CPK coloring and Van der Waals radii in `molecular.ts`.
