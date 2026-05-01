from fastapi import APIRouter

router = APIRouter(prefix="/proteins", tags=["proteins"])

CANONICAL_PDB_IDS = [
    "2MYS",
    "5N69",
    "8G4L",
    "1BR1",
    "3I5G",
    "3MFP",
    "1ATN",
    "6KN8",
    "1TIT",
    "1TIU",
    "3B43",
    "1YA5",
    "5JLH",
    "5NOG",
    "5NOL",
    "6KLN",
    "7QIM",
    "4D1E",
    "1SU4",
    "3TLM",
    "5T15",
    "7M6L",
]


@router.get("/pdb-ids")
def pdb_ids() -> list[str]:
    return CANONICAL_PDB_IDS
