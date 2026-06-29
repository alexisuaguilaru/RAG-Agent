from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # EMBEDDING_SERVICE_URL: str = "http://embedding-service:8001"
    EMBEDDING_SERVICE_URL: str = "http://127.0.0.1:8001"
    EMBEDDING_SERVICE_APIKEY: str = "EMPTY"
    EMBEDDING_BATCH_SIZE: int = 5

    # RERANKER_SERVICE_URL: str = "http://reranker-service:8002"
    RERANKER_SERVICE_URL: str = "http://127.0.0.1:8002"
    RERANKER_SERVICE_APIKEY: str = "EMPTY"
    
    DOCUMENTS_TO_RETRIEVE: int = 10
    TOP_K_DOCUMENTS: int = 3

settings = Settings()