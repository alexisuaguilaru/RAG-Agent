import json
from typing import Sequence

from langchain_core.documents.compressor import BaseDocumentCompressor
from langchain_core.callbacks import Callbacks
from langchain_core.documents import Document
from cohere import ClientV2

from rag_api.core.config import settings

class RerankerModel(BaseDocumentCompressor):
    """
    Multimodal reranker interface compatible with LangChain's ecosystem.
    """
    
    def __init__(self):
        self._client_reranker = ClientV2(
            base_url = settings.RERANKER_SERVICE_URL,
            api_key = settings.RERANKER_SERVICE_APIKEY,
        )

        self._model_reranker = self._client_reranker.models.list().data[0]['id']

    def compress_documents(
            self,
            documents: Sequence[Document],
            query: str,
            callbacks: Callbacks | None = None,
        ) -> Sequence[Document]:

        document_inputs = [{"content": json.loads(document.page_content)} for document in documents]
        
        rerank_response = self._client_reranker.rerank(
            model = self._model_reranker,
            query = query,
            documents = document_inputs,
        )

        relevance_scores = [(result.relevance_score, result.index) for result in rerank_response.results]
        relevance_scores.sort(key=lambda result: result[0])

        relevant_documents = [documents[result[1]] for result in relevance_scores[:settings.TOP_K_DOCUMENTS]]
        return relevant_documents