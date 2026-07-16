from math import ceil
import asyncio
import json
from typing import List, Dict, Any

from rag_api.database.vector_store import get_vector_store
from rag_api.core.config import settings

vector_store = get_vector_store()

async def embed_content(
        content_blocks: List[List[Dict[str, Any]]],
        tags: List[str],
    ) -> List[str]:
    """
    Function to embed the content blocks based on 
    the uploaded file. The embedding process is 
    performed in batches and the blocks (list of 
    dicts) are transformed to a JSON string, this 
    process is required by LangChain's Document class.

    Args:
        content_blocks (List[List[Dict[str, Any]]]): Formatted list of content blocks based on the given file
        tags (List[str]): Tags associated to the uploaded file

    Returns:
        list_embeddings_ids (List[str]): List of IDs of every embedding vector created

    Raises:
        Exception (Content not JSON serializable): The content blocks do not have the expected JSON format
        Exception (Dismatch between the number of inputs/blocks and list of metadata): There are different number of content blocks or metadatas
        Exception (Dismatch between number of content_blocks and embeddings_ids): The expected number of embeddings is different to the current number of embeddings
    """

    batch_size = settings.EMBEDDING_BATCH_SIZE
    num_batches = ceil(len(content_blocks)/batch_size)

    list_embeddings_ids = []
    for batch in range(num_batches):
        content_inputs = content_blocks[batch_size*batch:batch_size*(batch+1)]
        num_content_inputs = len(content_inputs)
        
        try:
            embeddings_ids = await _generate_embeddings(content_inputs, [{"tags": tags}]*num_content_inputs)
        except Exception as e:
            raise e

        list_embeddings_ids.extend(embeddings_ids)

    if len(list_embeddings_ids) != len(content_blocks): 
        await vector_store.adelete(list_embeddings_ids)
        raise Exception("Dismatch between number of content_blocks and embeddings_ids")
    
    return list_embeddings_ids

async def delete_embeddings(
        embedding_ids: List[str],
    ):
    """
    Function to delete a list of embeddings based 
    on theirs IDs from the vector database.

    Args:
        embedding_ids: List[str]: List of embedding IDs to delete

    Raises:
        Exception (Not exists the given IDs): The IDs were not found in the database
    """

    try:
       await vector_store.adelete(embedding_ids) 
    except:
        raise Exception("Not exists the given IDs")

async def _generate_embeddings(
        content_inputs: List[List[Dict[str, Any]]],
        list_tags: List[Dict[str, List[str]]],
    ):
    """
    Function to call `aadd_texts` method of a `vector_store` 
    with the JSON string of every content block (input) as 
    texts. For each input is added their file's tags.
    """

    try:
        formatted_inputs = [json.dumps(content_input) for content_input in content_inputs]
    except:
        raise Exception("Content not JSON serializable")

    try:
        embeddings_ids = await vector_store.aadd_texts(formatted_inputs, list_tags)
    except:
        raise Exception("Dismatch between the number of inputs/blocks and list of metadata")

    return embeddings_ids