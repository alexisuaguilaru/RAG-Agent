from datetime import datetime
from typing import List

from pydantic import BaseModel

class CreateFileEmbed(BaseModel):
    """
    Class for formatting the response's payload for 
    /documents/create-embed endpoint. This class 
    stores a unique file id resulting of the upload 
    process.
    """

    file_id: str

class StoredEmbedFile(BaseModel):
    """
    Class for formatting the response's payload for 
    /documents endpoint. This class stores certain 
    information from a embed file stored in the 
    S3-Garage.
    """

    file_id: str
    filename: str
    last_modification: datetime
    content_type: str
    description: str = ""
    tags: List[str] = []