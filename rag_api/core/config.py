from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    EMBEDDING_SERVICE_URL: str = "http://127.0.0.1:8001"
    EMBEDDING_SERVICE_APIKEY: str = "EMPTY"
    EMBEDDING_BATCH_SIZE: int = 5

    RERANKER_SERVICE_URL: str = "http://127.0.0.1:8002"
    RERANKER_SERVICE_APIKEY: str = "EMPTY"

    CHROMA_HOST: str = "127.0.0.1"
    CHROMA_PORT: int = 7890
    CHROMA_TOKEN: str = "efb53c4aa6952909dad18ee9bbe134922d339c4bea78fb757348f5b6f780840c"
    
    DOCUMENTS_TO_RETRIEVE: int = 10
    TOP_K_DOCUMENTS: int = 3

settings = Settings()