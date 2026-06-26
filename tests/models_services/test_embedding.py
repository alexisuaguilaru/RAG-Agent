from pathlib import Path

from cohere import ClientV2

from utils import encode_image

MODEL_EMBEDDING = None
URL_EMBEDDING = "http://127.0.0.1:8001"

client_embedding = ClientV2(
    base_url = URL_EMBEDDING,
    api_key = "EMPTY",
)

try: 
    MODEL_EMBEDDING = client_embedding.models.list().data[0]['id']
    available_service = True
except:
    available_service = False

if available_service:
    def test_embedding_text():
        text_input = [{
            'content': [
                {"type": "text", "text": "Blue flower"},
            ]
        }]

        assert _create_embeddings(text_input)

    def test_embedding_image():
        image = encode_image(Path('flower.jpg'))
        image_input = [{
            'content': [
                {"type": "image_url", "image_url": {"url": image}},
            ]
        }]

        assert _create_embeddings(image_input)

    def test_embedding_multi():
        image = encode_image(Path('flower.jpg'))
        image_input = [{
            'content': [
                {"type": "text", "text": "Blue flower"},
                {"type": "image_url", "image_url": {"url": image}},
            ]
        }]

        assert _create_embeddings(image_input)

def _create_embeddings(inputs):
    try:
        response = client_embedding.embed(
            model = MODEL_EMBEDDING,
            inputs = inputs,
            input_type = None,
        )
        return True
    
    except Exception as e:
        return False