from dataclasses import dataclass


@dataclass(frozen=True)
class FmaMapping:
    atlas_id: str
    fma_id: str
    preferred_name: str


def normalize_fma_id(raw: str) -> str:
    value = raw.strip().upper().replace("FMA:", "")
    if not value.isdigit():
        raise ValueError(f"Invalid FMA identifier: {raw}")
    return f"FMA:{value}"
