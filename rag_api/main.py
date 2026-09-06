from fastapi import FastAPI

from rag_api.api.lifespan import lifespan
from rag_api.api.router import api_router

app = FastAPI(
    title = "RAG API",
    lifespan = lifespan,
)

app.include_router(api_router)