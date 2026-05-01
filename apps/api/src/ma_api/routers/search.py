from fastapi import APIRouter, Query

router = APIRouter(prefix="/search", tags=["search"])

INDEX = [
    {"id": "body", "name": "Body", "level": 1},
    {"id": "rectus_femoris", "name": "Rectus femoris", "level": 4},
    {"id": "rectus_femoris_sarcomere", "name": "Sarcomere", "level": 8},
    {"id": "titin", "name": "Titin", "level": 9},
    {"id": "titin_ig_domain", "name": "Titin Ig domain", "level": 10},
]


@router.get("")
def search(q: str = Query(min_length=1)) -> list[dict[str, int | str]]:
    needle = q.casefold()
    return [item for item in INDEX if needle in str(item["name"]).casefold()]
