from fastapi import FastAPI

from ma_api.routers import anatomy, proteins, search

app = FastAPI(
    title="MusculoAtlas API",
    version="0.1.0",
    description="Data service for the 10-level musculoskeletal anatomy atlas.",
)

app.include_router(anatomy.router)
app.include_router(proteins.router)
app.include_router(search.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
