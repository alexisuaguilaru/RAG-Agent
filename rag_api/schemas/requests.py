from pydantic import BaseModel

class QuerySearchDocuments(BaseModel):
    """
    Class for formatting the request's payload for /query/search 
    endpoint. This class stores the user's query being resolved.
    """

    query: str