from dataclasses import dataclass


@dataclass(frozen=True)
class PdbEntry:
    pdb_id: str
    molecule: str


def rcsb_download_url(pdb_id: str) -> str:
    normalized = pdb_id.strip().upper()
    if len(normalized) != 4:
        raise ValueError(f"Invalid PDB id: {pdb_id}")
    return f"https://files.rcsb.org/download/{normalized}.pdb"
