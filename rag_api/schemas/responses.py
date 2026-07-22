from pydantic import BaseModel

class CreateFileEmbed(BaseModel):
    """
    Class for formatting the response's payload for 
    /documents/create-embed endpoint. This class 
    stores a unique file id resulting of the upload 
    process.
    """

    file_id: str