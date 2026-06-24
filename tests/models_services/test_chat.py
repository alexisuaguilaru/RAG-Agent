from openai import OpenAI
from pathlib import Path

from utils import encode_image

MODEL_CHAT = None
URL_CHAT = "http://127.0.0.1:8000/v1"

client_chat = OpenAI(
    base_url = URL_CHAT,
    api_key = 'EMPTY',
)

try: 
    MODEL_CHAT = client_chat.models.list(timeout=0.5).data[0].id
    available_service = True
except:
    available_service = False

if available_service:

    def test_chat_text():
        text_message = [
            {"role": "user", "content": "What is Python"},
        ] 

        assert _send_messages(text_message)

    def test_chat_image():
        image = encode_image(Path('flower.jpg'))
        image_message = [
            {"role": "user", "content": [{"type": "image_url", "image_url": {"url": image}}]},
        ]

        assert _send_messages(image_message)

    def test_chat_multi():
        image = encode_image(Path('flower.jpg'))
        multi_messages = [
            {"role": "user", "content": [
                {"type": "image_url", "image_url": {"url": image}},
                {"type": "text", "text": "Describe the image."},
            ]}
        ]

        assert _send_messages(multi_messages)

def _send_messages(messages):
    try:
        response = client_chat.chat.completions.create(
            model = MODEL_CHAT,
            messages = messages,
            temperature = 0.1,
            max_tokens = 1024,
            reasoning_effort = "none",
        )
        return True
    
    except Exception as e:
        return False