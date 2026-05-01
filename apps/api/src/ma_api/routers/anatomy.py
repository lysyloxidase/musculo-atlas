from fastapi import APIRouter

router = APIRouter(prefix="/anatomy", tags=["anatomy"])


@router.get("/levels")
def levels() -> list[dict[str, int | str]]:
    return [
        {"level": 1, "name": "Body"},
        {"level": 2, "name": "System"},
        {"level": 3, "name": "Region"},
        {"level": 4, "name": "Muscle"},
        {"level": 5, "name": "Fascicle"},
        {"level": 6, "name": "Fiber"},
        {"level": 7, "name": "Myofibril"},
        {"level": 8, "name": "Sarcomere"},
        {"level": 9, "name": "Protein"},
        {"level": 10, "name": "Domain / atom"},
    ]
