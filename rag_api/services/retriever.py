from rag_api.database.vector_store import get_vector_store
from rag_api.core.config import settings

vector_store = get_vector_store()

def get_retriever():
    """
    """

    retriever = vector_store.as_retriever(
        search_type = "similarity",
        k = settings.DOCUMENTS_TO_RETRIEVE,
    )

    return retriever