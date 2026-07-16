from typing import Annotated, List

from fastapi import APIRouter, File, Form, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from rag_api.schemas.requests import DeleteFileEmbeddings
from rag_api.processors.file_processor import file_processor
from rag_api.processors.content_processor import get_formatted_content_blocks
from rag_api.services.embedding import embed_content, delete_embeddings

router = APIRouter()

@router.post(
    "/create-embed",
    description = "Generate the file's embeddings and load it into the vector store with their tags."
)
async def embed_files(
        file: Annotated[UploadFile, File()],
        description: Annotated[str, Form()] =  "",
        tags: Annotated[List[str], Form()] = [],
    ) -> List[str]:
    """
    Embed the content of text files and every page of a PDF file is embedded like an image. 
    The texts and images are fused with the provided description. And the tags are passed 
    to the vector store as file's metadata.

    Args:
        file (UploadFile): Expected a file with the formats of md, txt, jpg, png and pdf
        description (srt): Brief description or caption about the file
        tags (List[str]): Tags associated with the file's content

    Returns:
        embeddings_ids (List[str]): List of IDs of every embedding vector created. One ID for plain text and image, and many IDs for a PDF file
        
    Raises:
        HTTPException[415]: File format is incompatible or unsupported
        HTTPException[500]: Internal fail to process input file
    """
    
    try:
        content_blocks = await file_processor(file)
    except:
        raise HTTPException(
            status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail = "File format not supported.",
        )
    
    content_blocks = get_formatted_content_blocks(content_blocks)

    try:
        embedding_ids = await embed_content(content_blocks, tags)
    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = "Issue to embed files",
        )
    
    return embedding_ids

@router.delete(
    "/delete-embed",
    description = "Delete the file's embeddings"
)
async def delete_embed(
        file_embeddings: DeleteFileEmbeddings,
    ):
    """
    """

    try:
        await delete_embeddings(file_embeddings.embedding_ids)
        return JSONResponse(
            status_code = status.HTTP_200_OK,
            content = {"detail": "File's embeddings deleted"},
        )
    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Embedding IDs not found",
        )