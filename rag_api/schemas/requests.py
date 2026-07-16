from typing import List

from pydantic import BaseModel

class DeleteFilesEmbeddings(BaseModel):
    """
    Class for formatting the request's payload for 
    /documents/delete-embed endpoint. This class 
    stores a list of embedding IDs to delete which 
    can belong to different files
    """

    embedding_ids: List[str]

class QuerySearchDocuments(BaseModel):
    """
    Class for formatting the request's payload for /query/search 
    endpoint. This class stores the user's query being resolved.
    """

    query: str