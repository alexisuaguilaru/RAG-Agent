from fastapi import APIRouter

from rag_api.api.routes import documents, query

api_router = APIRouter()
api_router.include_router(documents.router, prefix="/documents")
api_router.include_router(query.router, prefix="/query")

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}