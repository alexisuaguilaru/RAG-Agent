from langchain_core.vectorstores import InMemoryVectorStore

from rag_api.models.embedding import EmbeddingModel
from rag_api.core.config import settings

def get_vector_store():
    vector_store = InMemoryVectorStore(
        embedding = EmbeddingModel()
    )

    return vector_store