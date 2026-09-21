from pydantic_settings import BaseSettings
from pydantic import SecretStr

class Settings(BaseSettings):
    CHAT_SERVICE_URL: str = "http://127.0.0.1:8000/v1"
    CHAT_SERVICE_APIKEY: SecretStr = "EMPTY"
    CHAT_MODEL: str = ""
    MAX_CHAT_CONTEXT_LENGHT: int = 16384

settings = Settings()