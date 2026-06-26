from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_core.language_models import BaseChatModel

URL_CHAT = "http://chat-service:8000/v1"

client_service = OpenAI(
    base_url = URL_CHAT,
    api_key = "EMPTY",
)

def load_chat_model() -> BaseChatModel:
    try: 
        MODEL_ID = client_service.models.list(timeout=0.5).data[0].id
    except:
        raise Exception("chat docker service not available")
    
    chat_model = ChatOpenAI(
        base_url = URL_CHAT,
        api_key = "EMPTY",
        model = MODEL_ID,
        extra_body = {
            "chat_template_kwargs": {"enable_thinking": False}
        },
    )

    return chat_model