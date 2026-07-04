from langchain_core.vectorstores import InMemoryVectorStore , VectorStore

from rag_api.models.embedding import EmbeddingModel
from rag_api.core.config import settings

def get_vector_store() -> VectorStore:
    """
    Function to get the LangChain's vector store interface 
    based on the initialize embedding model with in memory 
    storage.

    Returns
        vector_store (VectorStore): In memory storage vector store initialize with the embedding model
    """

    vector_store = InMemoryVectorStore(
        embedding = EmbeddingModel()
    )

    return vector_store