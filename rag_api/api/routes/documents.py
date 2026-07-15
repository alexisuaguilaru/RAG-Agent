from typing import Annotated, List

from fastapi import APIRouter, File, Form, UploadFile, status
from fastapi.responses import JSONResponse

from rag_api.processors.file_processor import file_processor
from rag_api.processors.content_processor import get_formatted_content_blocks
from rag_api.services.embedding import embed_content

router = APIRouter()

@router.post(
    "/create-embed",
    description = "Generate the file's embeddings and load it into the vector store with their tags."
)
async def embed_files(
        file: Annotated[UploadFile, File()],
        description: Annotated[str, Form()] =  "",
        tags: Annotated[List[str], Form()] = [],
    ) -> JSONResponse:
    """
    Embed the content of text files and every page of a PDF file is embedded like an image. 
    The texts and images are fused with the provided description. And the tags are passed 
    to the vector store as file's metadata.

    Args:
        file (UploadFile): Expected a file with the formats of md, txt, jpg, png and pdf
        description (srt): Brief description or caption about the file
        tags (List[str]): Tags associated with the file's content

    Returns:
        JSONResponse[200]: Content file embedded correctly
        
    Raises:
        JSONResponse[415]: File format is incompatible or unsupported
        JSONResponse[500]: Internal fail to process input file
    """
    
    try:
        content_blocks = await file_processor(file)
    except:
        return JSONResponse(
            status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            content = {"message": "File format not supported."}
        )
    
    content_blocks = get_formatted_content_blocks(content_blocks)

    try:
        await embed_content(content_blocks, tags)
    except Exception as e:
        return JSONResponse(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            content = {"message": "Issue to embed files"}
        )
    
    return JSONResponse(
        status_code = status.HTTP_200_OK,
        content = {"message": "File embedded correctly."}
    )