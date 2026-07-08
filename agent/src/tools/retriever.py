import requests
import json
from typing import List, Dict

from langchain_core.tools import tool
from langchain_core.messages.content import ContentBlock

RAG_SERVICE_URL = "http://rag-api:6060/query/search"

@tool
def retriever_rag_tool(query: str) -> List[Dict]:
    """
    Retrieve information (text plain and image with content) 
    from the knowledge database to answer the user's question.

    Args:
        query (str): User's query rewrite to be specific and concise
    """

    try:
        response_retriever = requests.post(
            RAG_SERVICE_URL,
            json = {"query": query},
        )
        if response_retriever.status_code != 200: raise 

        response_content = json.loads(response_retriever.content)

        documents = [json.loads(document['page_content']) for document in response_content]
        return _process_documents(documents)

    except:
        return [{"type": "text", "text": "Tool failed. No available."}]

def _process_documents(documents: List[List[ContentBlock]]) -> List[Dict]:
    content_blocks = []
    for document in documents:
        for content in document:
            if content["type"] == "text":
                content_blocks.append(content)
            elif content["type"] == "image_url":
                content_blocks.append({"type": "image", "url": content["image_url"]["url"]})
    return content_blocks