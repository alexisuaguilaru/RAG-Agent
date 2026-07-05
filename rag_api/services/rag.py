from typing import List

from langchain_core.documents import Document

from rag_api.services.retriever import get_retriever

retriever = get_retriever()

async def retrieve_documents(query: str) -> List[Document]:
    """
    """
    
    return await retriever.ainvoke(query)