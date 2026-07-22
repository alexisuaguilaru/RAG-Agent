from typing import List

from pydantic import BaseModel

class DeleteFilesEmbeddings(BaseModel):
    """
    Class for formatting the request's payload for 
    /documents/delete-embed endpoint. This class 
    stores a file's ID to delete.
    """

    file_id: str

class QuerySearchDocuments(BaseModel):
    """
    Class for formatting the request's payload for /query/search 
    endpoint. This class stores the user's query being resolved.
    """

    query: str