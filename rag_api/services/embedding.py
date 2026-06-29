from math import ceil
import json
from typing import List, Dict, Any

from rag_api.database.vector_store import get_vector_store
from rag_api.core.config import settings

vector_store = get_vector_store()

def embed_content(
        content_blocks: List[Dict[str, Any]],
        tags: List[str],
    ):
    batch_size = settings.EMBEDDING_BATCH_SIZE
    num_batches = ceil(len(content_blocks)/batch_size)

    list_embeddings_ids = []
    for batch in range(num_batches):
        content_inputs = content_blocks[batch_size*batch:batch_size*(batch+1)]
        num_content_inputs = len(content_inputs)
        
        try:
            embeddings_ids = _generate_embeddings(content_inputs, [{"tags": tags}]*num_content_inputs)
        except Exception as e:
            raise e

        list_embeddings_ids.extend(embeddings_ids)

    if len(list_embeddings_ids) != len(content_blocks): 
        vector_store.delete(list_embeddings_ids)
        raise Exception("Dismatch between number of content_blocks and embeddings_ids")

def _generate_embeddings(
        content_inputs: List[Dict[str, Any]],
        list_tags: List[Dict[str, List[str]]],
    ):
    try:
        formatted_inputs = [json.dumps(content_input) for content_input in content_inputs]
    except:
        raise Exception("Content not JSON serializable")

    try:
        embeddings_ids = vector_store.add_texts(formatted_inputs, list_tags)
    except Exception as e:
        raise e

    return embeddings_ids