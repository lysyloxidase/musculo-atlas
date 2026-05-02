# Rendering

MusculoAtlas renders different biological content at each semantic level.

## Gross Anatomy

Levels 1-4 are prepared for glTF meshes with LOD manifests. Whole body, skeleton, muscles, connective tissue, joints, regions, and individual muscles are selectable. The target is under 500 ms level load, 60fps, and fewer than 100 draw calls.

## Procedural Micro-Anatomy

Levels 5-6 use procedural and instanced geometry:

- Fascicles: honeycomb fibers, perimysium, endomysium, capillaries, cross-section slicing.
- Fibers: sarcolemma shell, peripheral nuclei, myofibrils, T-tubules, sarcoplasmic reticulum, mitochondria, satellite cells, glycogen, lipid droplets.
- ECC: the active step is highlighted inside the Level 6 scene with ion-flow markers.

Instancing keeps 100+ fibers and organelles at the 60fps target.

## Sarcomere Ultrastructure

Levels 7-8 render banded myofibrils and explicit sarcomere filaments:

- Thick filaments stay fixed at 1.65 um.
- Thin filaments slide with sarcomere length.
- Titin stretches from Z-disc to M-line.
- Cross-bridge heads follow the five-step biochemical cycle.
- A synchronized length-tension marker is rendered in scene and in the UI chart.

## Molecular Rendering

Levels 9-10 support Molstar iframe loading and custom R3F molecular modes:

- molecular surface
- cartoon
- ball-and-stick
- Molstar PDB view

Molstar targets are lazy-loaded with a 3 s budget, while custom R3F atoms use CPK colors and Van der Waals radii.

## Performance

Initial JavaScript target is under 5 MB. Heavy assets are lazy-loaded by level, and `LevelRenderer` preloads only the active level and adjacent levels.
