import json

from langchain_core.embeddings import Embeddings
from cohere import ClientV2

from rag_api.core.config import settings

class EmbeddingModel(Embeddings):
    """
    Multimodal embedding interface compatible with LangChain's ecosystem.
    """

    def __init__(self):
        self._client_embedding = ClientV2(
            base_url = settings.EMBEDDING_SERVICE_URL,
            api_key = settings.EMBEDDING_SERVICE_APIKEY,
        )

        self._model_embedding = self._client_embedding.models.list().data[0]['id']

    def embed_documents(
            self, 
            documents: list[str],
        ) -> list[list[float]]:

        document_inputs = [{"content": json.loads(document)} for document in documents]

        embed_response = self._client_embedding.embed(
            model = self._model_embedding,
            inputs = document_inputs,
            input_type = None,
        )

        return embed_response.embeddings.float_
    
    def embed_query(
            self, 
            query: str,
        ) -> list[float]:

        embed_response = self._client_embedding.embed(
            model = self._model_embedding,
            texts = [query],
            input_type = None,
        )

        return embed_response.embeddings.float_[0]