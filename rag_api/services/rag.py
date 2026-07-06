from typing import List

from langchain_core.documents import Document

from rag_api.services.retriever import get_retriever

retriever = get_retriever()

async def retrieve_documents(query: str) -> List[Document]:
    """
    Function to retrieve relevant documents based on 
    the user's query. The query and search is done by 
    the contextual retriever with a document 
    compression. The query is not preprocessed.

    Args: 
        query (str): User's query to retrieve the relevant documents

    Raises:
        Exception (Internal server to resolve query): Retriever does not work correctly
    """
    
    try:
        return await retriever.ainvoke(query)
    except Exception as e:
        raise Exception("Internal server to resolve query")