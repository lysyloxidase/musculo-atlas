# MusculoAtlas

MusculoAtlas is a 10-level hierarchical musculoskeletal anatomy atlas that spans whole-body anatomy down to protein domains and atomic-scale structural references.

This phase establishes the monorepo, canonical TypeScript data model, hierarchy tree, biological dimensions, and quality gates.

## Workspace

- `apps/web`: Next.js 15 atlas viewer
- `apps/api`: FastAPI data service
- `packages/data-pipeline`: Python mesh and catalog pipeline stubs
- `packages/mesh-tools-rs`: Rust mesh decimation crate
- `docs`: architecture and research-facing references

## Quality Gates

```bash
pnpm install
pnpm biome
pnpm typecheck
pnpm test
```

Rust validation is wired in CI through `cargo test --manifest-path packages/mesh-tools-rs/Cargo.toml`.

## Canonical Path

The hierarchy includes the required phase-1 traversal:

`Body -> Rectus femoris -> Fascicle -> Sarcomere -> Titin -> Ig domain`
