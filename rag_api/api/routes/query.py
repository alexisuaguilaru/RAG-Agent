from typing import List

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from langchain_core.documents import Document

from rag_api.services.rag import retrieve_documents

router = APIRouter()

@router.post(
    "/search",
    description = "Search similar documents and files based on the user's query",
)
async def search_documents(
        query: str,
    ) -> List[Document]:
    """
    """

    return await retrieve_documents(query)