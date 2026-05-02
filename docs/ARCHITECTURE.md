# Architecture

MusculoAtlas is split into four workspaces:

- `apps/web`: Next.js 15 atlas viewer and canonical TypeScript model.
- `apps/api`: FastAPI service for anatomy, protein, and search endpoints.
- `packages/data-pipeline`: Python ingestion and processing helpers.
- `packages/mesh-tools-rs`: Rust mesh decimation and LOD routines.

## Web Stack

The web app owns the canonical hierarchy because tests, viewer state, and educational copy consume the same typed data. `AtlasWorkspace` hosts the reducer-driven state machine, side rail, search, breadcrumb, and R3F canvas.

`ZoomController` keeps a single continuous `zoomValue` in `[0, 1]`. Thresholds in `zoom.ts` map that value to Levels 1-10. On threshold crossing, `semanticZoom.ts` creates a 300 ms transition, `LevelRenderer` renders the outgoing and incoming levels, and `TransitionFade` interpolates material opacity.

## Rendering By Level

- Levels 1-4: gross anatomy meshes, LOD manifests, region and muscle picking.
- Levels 5-6: procedural fascicles, instanced fibers, organelles, and ECC highlights.
- Levels 7-8: myofibril banding, sarcomere filaments, titin stretch, cross-bridge heads, length-tension marker.
- Levels 9-10: Molstar iframe targets plus custom R3F molecular surface, cartoon, and ball-and-stick modes.

## Phase 7 Systems

- `physiology.ts`: ECC sequence, cross-bridge biochemistry, length-tension points, fiber type comparison.
- `connectiveTissue.ts`: tendon T1-T6, bone B1-B5, cartilage zones, synovial joint metadata.
- `production.ts`: accessibility, performance budgets, and release breadcrumb trail.

The physiology and tissue overlays are side-rail panels so they remain keyboard accessible and do not block orbit, pan, or semantic scroll gestures.
