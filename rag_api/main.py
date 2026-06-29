from fastapi import FastAPI

from rag_api.api.router import api_router

app = FastAPI(
    title = "RAG API",
)

app.include_router(api_router)