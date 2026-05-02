# Hierarchy

The atlas uses ten semantic levels:

1. Body
2. Musculoskeletal system
3. Region or compartment
4. Muscle
5. Fascicle
6. Muscle fiber
7. Myofibril
8. Sarcomere
9. Protein
10. Domain or atomic detail

The canonical traversal remains:

`Body -> Rectus femoris -> Fascicle -> Sarcomere -> Titin -> Ig domain`

The release traversal for the final interactive path is:

`Body -> Thigh -> Quad -> Fascicle -> Fiber -> Myofibril -> Sarcomere -> Myosin -> S1 domain -> Atom`

## Parallel Tissue Tracks

Tendon is available from Level 4 muscle/tendon context:

`Tendon -> Tendon fascicle -> Collagen fiber -> Collagen fibril -> Microfibril -> Tropocollagen`

Bone is available from the Level 2 skeletal layer:

`Bone -> Osteon -> Lamella -> Collagen plus hydroxyapatite -> Hydroxyapatite crystal`

Cartilage is available from the Level 2 joint layer:

`Superficial zone -> Middle zone -> Deep zone -> Tidemark -> Calcified zone`

These tracks are modeled separately from ZoomLevels 1-10 so the primary muscle path remains continuous while connective tissues keep their own biologically meaningful sub-levels.
