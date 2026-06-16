from cohere import ClientV2
from pathlib import Path

from utils import encode_image

MODEL_RERANKER = "Forturne/Qwen3-VL-Reranker-2B-FP8"
URL_RERANKER = "http://127.0.0.1:8002"

client_reranker = ClientV2(
    base_url = URL_RERANKER,
    api_key = 'EMPTY',
)

try: 
    client_reranker.models.list()
    available_service = True
except:
    available_service = False

if available_service:
    def test_rerank_texts():
        text_docs = [
            "Botanical researchers have finally mapped the genome of the rare Blue Orchid.",
            "The Himalayan Blue Poppy (Meconopsis gakyidiana) is a legendary exotic flower.",
        ]
        text_query = "Rare vibrant blue flowers or exotic uniquely colored blossoms in botanical gardens."

        assert _rerank_docs(text_docs,text_query)

    def test_rerank_multi():
        image = encode_image(Path('flower.jpg'))
        multi_docs = [
            {
                "content": [{"type": "image_url", "image_url": {"url": image}}]
            },
            {
                "content": [{"type": "text", "text": "The Flame Lily is an exotic climbing plant found in tropical gardens."}]
            },
        ]
        multi_query = "Rare vibrant blue flowers or exotic uniquely colored blossoms in botanical gardens."

        assert _rerank_docs(multi_docs,multi_query)

def _rerank_docs(docs, query):
    try:
        response = client_reranker.rerank(
            model = MODEL_RERANKER,
            documents = docs,
            query = query,
        )
        return True
    
    except Exception as e:
        return False