# Physiology

Phase 7 adds physiology and biochemistry overlays to the continuous atlas.

## Excitation-Contraction Coupling

The Level 6 fiber view exposes an 11-step user-controlled ECC sequence:

1. ACh release at neuromuscular junction
2. nAChR activation and end-plate potential
3. Action potential along sarcolemma
4. Action potential enters T-tubules
5. DHPR / Cav1.1 voltage sensor activates
6. DHPR mechanically couples to RyR1
7. Calcium release from SR terminal cisternae
8. Calcium binds troponin C
9. TnI releases actin and tropomyosin shifts B to C to M
10. Myosin binding sites are exposed
11. SERCA pumps calcium back into SR for relaxation

Each step has a structure target, ion-flow state, label, and active scene highlight in `apps/web/src/lib/physiology.ts`.

## Cross-Bridge Cycle

The Level 8 sarcomere view annotates the five-step cycle:

1. `M.ADP.Pi -> actin binding`
2. `Pi release -> power stroke`
3. `ADP release -> rigor`
4. `ATP binds -> detachment`
5. `ATP hydrolysis -> recovery`

The geometry remains synchronized with the Phase 4 lever-arm and sliding model.

## Length-Tension

The sarcomere slider drives `getLengthTensionPoint()`:

- Ascending limb below 2.0 um
- Plateau from 2.0-2.2 um
- Descending limb beyond 2.2 um
- Passive titin contribution rising at long sarcomere lengths

The UI chart and R3F scene dot read from the same model.

## Fiber Type Comparison

Level 6 compares:

- Type I / MYH7: oxidative, high mitochondria, lipid droplets, fatigue resistant
- Type IIa / MYH2: mixed oxidative-glycolytic, intermediate mitochondria
- Type IIx / MYH1: glycolytic, glycogen rich, lower mitochondria

The comparison uses the same organelle counts as the procedural fiber renderer.
