# Architecture

MusculoAtlas is split into four workspaces:

- `apps/web`: Next.js 15 atlas viewer and canonical TypeScript model.
- `apps/api`: FastAPI service for anatomy, protein, and search endpoints.
- `packages/data-pipeline`: Python ingestion and processing helpers.
- `packages/mesh-tools-rs`: Rust mesh decimation and LOD routines.

The web app owns the phase-1 canonical hierarchy because tests, viewer state,
and educational copy all consume the same typed data.
