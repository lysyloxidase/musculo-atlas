from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class LodTarget:
    name: str
    ratio: float


DEFAULT_LOD_TARGETS = (
    LodTarget("lod0", 1.0),
    LodTarget("lod1", 0.5),
    LodTarget("lod2", 0.2),
)


def plan_gltf_lods(source: Path, output_dir: Path) -> list[Path]:
    """Return deterministic output paths for BodyParts3D to glTF LOD exports."""
    stem = source.stem
    return [output_dir / f"{stem}_{target.name}.gltf" for target in DEFAULT_LOD_TARGETS]
