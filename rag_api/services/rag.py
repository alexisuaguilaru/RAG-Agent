from typing import List, Dict, Any

from langchain_core.documents import Document

from rag_api.services.retriever import get_retriever

retriever = get_retriever()

async def retrieve_documents(
        query: str,
        tags: List[str] = [],
    ) -> List[Document]:
    """
    Function to retrieve relevant documents based on 
    the user's query. The query and search is done by 
    the contextual retriever with a document 
    compression. The query is not preprocessed and uses 
    a list of tags to improve the search.

    Args: 
        query (str): User's query to retrieve the relevant documents
        tags: List[str]: List of tags to filters the documents

    Raises:
        Exception (Internal server to resolve query): Retriever does not work correctly
    """
    
    try:
        if not tags:
            query_documents = await retriever.ainvoke(query)
        else:
            q_filter = _get_filter_from_tags(tags)
            query_documents = await retriever.ainvoke(
                query,
                filter = q_filter,
            )
        return query_documents
    except Exception as e:
        print(e)
        raise Exception("Internal server to resolve query")
    
def _get_filter_from_tags(tags: List[str]) -> Dict[str, Any]:
    """
    Function to get the filter for ChromaDB based on 
    a list of tags.
    """

    if 1==len(tags):
        q_filter = {"tags": {"$contains": tags[0]}}
    else:
         q_filter = {"$or": [{"tags": {"$contains": tag}} for tag in tags]}
    return q_filter