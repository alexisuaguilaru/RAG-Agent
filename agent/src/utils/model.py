from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_core.language_models import BaseChatModel

from src.config import settings

client_service = OpenAI(
    base_url = settings.CHAT_SERVICE_URL,
    api_key = "EMPTY",
)

def load_chat_model() -> BaseChatModel:
    try: 
        MODEL_ID = settings.CHAT_MODEL or client_service.models.list(timeout=0.5).data[0].id
    except:
        raise Exception("Chat model service not available")
    
    chat_model = ChatOpenAI(
        base_url = settings.CHAT_SERVICE_URL,
        api_key = settings.CHAT_SERVICE_APIKEY.get_secret_value(),
        model = MODEL_ID,
        extra_body = {
            "chat_template_kwargs": {"enable_thinking": False}
        },
        timeout = None,
        stream_chunk_timeout = None,
    )

    return chat_model