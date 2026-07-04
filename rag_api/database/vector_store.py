from langchain_chroma import Chroma
from langchain_core.vectorstores import VectorStore

from rag_api.models.embedding import EmbeddingModel
from rag_api.core.config import settings

def get_vector_store() -> VectorStore:
    """
    Function to get the LangChain's vector store interface 
    based on the initialize embedding model and ChromaDB connection.

    Returns:
        vector_store (VectorStore): ChromaDB vector store initialize with the embedding model
    """

    vector_store = Chroma(
        embedding_function = EmbeddingModel(),
        host = settings.CHROMA_HOST,
        port = settings.CHROMA_PORT,
        headers = {'X-Chroma-Token': settings.CHROMA_TOKEN},
        collection_name = "rag_collection",
        create_collection_if_not_exists = True,
        collection_metadata = {"hnsw:space": "cosine"},
    )

    return vector_store