from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    EMBEDDING_SERVICE_URL: str = "http://127.0.0.1:8001"
    EMBEDDING_SERVICE_APIKEY: str = "EMPTY"
    EMBEDDING_BATCH_SIZE: int = 5

    RERANKER_SERVICE_URL: str = "http://127.0.0.1:8002"
    RERANKER_SERVICE_APIKEY: str = "EMPTY"

    S3_HOST: str = "127.0.0.1"
    S3_PORT: int = 3900
    AWS_ID: str = "GKa1b4212a8f2148af41167561e101731e"
    AWS_SECRET: str = "8909a19b1049212ec3dcfa0714a28a4c33a66c1909a748cf086cfdc55812a44d"
    
    CHROMA_HOST: str = "127.0.0.1"
    CHROMA_PORT: int = 7890
    CHROMA_TOKEN: str = "efb53c4aa6952909dad18ee9bbe134922d339c4bea78fb757348f5b6f780840c"
    
    DOCUMENTS_TO_RETRIEVE: int = 10
    TOP_K_DOCUMENTS: int = 3

settings = Settings()