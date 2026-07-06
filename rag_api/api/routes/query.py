import json
from typing import List

from fastapi import APIRouter, HTTPException
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
    Search and retrieve relevant documents and files in the vector 
    database based on the user's query. To retrieve the documents 
    use a contextual compression retriever to reduce and filter the 
    relevant documents using a reranker.The query is not preprocessed 
    before invoke the contextual retriever.

    Args:
        query (str): Query to resolve provided by the user

    Returns:
        documents (List[Document]): List of relevant documents ordered by relevance to resolve the user's query

    Raises:
        exception_document (List[Document]): One document just with text content clarifying that there was a internal server issue
    """

    try:
        return await retrieve_documents(query)
    except Exception as e:
        return [Document(json.dumps([{"type": "text", "text": "Internal fail to retrieve documents."}]))]