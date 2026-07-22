from typing import Annotated, List, Any

from fastapi import APIRouter, File, Form, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from rag_api.schemas.requests import DeleteFilesEmbeddings
from rag_api.schemas.responses import CreateFileEmbed, StoredEmbedFile
from rag_api.processors.file_processor import file_processor
from rag_api.processors.content_processor import get_formatted_content_blocks
from rag_api.processors.file_object_processor import clean_file_object_data, get_file_embedding_ids
from rag_api.services.embedding import embed_content, delete_embeddings
from rag_api.services.object import upload_embed_file, gather_all_files, get_uploaded_file, delete_file_object

router = APIRouter()

@router.post(
    "/create-embed",
    description = "Generate the file's embeddings and load it into the vector store with their tags.",
    response_model = CreateFileEmbed
)
async def embed_file(
        file: Annotated[UploadFile, File()],
        description: Annotated[str, Form()] =  "",
        tags: Annotated[List[str], Form()] = [],
    ) -> Any:
    """
    Embed the content of text files and every page of a PDF file is embedded like an image. 
    The texts and images are fused with the provided description. And the tags are passed 
    to the vector store as file's metadata.

    Args:
        file (UploadFile): Expected a file with the formats of md, txt, jpg, png and pdf
        description (srt): Brief description or caption about the file
        tags (List[str]): Tags associated with the file's content

    Returns:
        response (CreateFileEmbed): Response schema with the file_id assigned to the embedded document.
        
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
            detail = "Issue to embed file",
        )
    
    try:
        file_id = await upload_embed_file(file, description, tags, embedding_ids)
    except Exception as e:
        await delete_embeddings(embedding_ids)
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = "Issue to upload file",
        )
    
    return {"file_id": file_id}

@router.get(
    "/",
    description = "Get all the uploaded, embedded files"
)
async def get_embed_files() -> List[StoredEmbedFile]:
    """
    Get and return a list of all the stored and embed files 
    in the databases. It is not necessary to provide more 
    information when this endpoint is used.

    Returns:
        file_objects_data (List[StoredEmbedFile]): List of schemas which represent the relevant data and metadata of every stored file in the databases
    """

    file_objects = await gather_all_files()
    file_objects_data = [await get_uploaded_file(file_object["Key"]) for file_object in file_objects]
    return list(map(clean_file_object_data, file_objects_data))


@router.delete(
    "/delete-embed",
    description = "Delete the file's embeddings"
)
async def delete_embed(
        file: DeleteFilesEmbeddings,
    ):
    """
    Delete a list of stored embeddings from the database 
    associated to a file's ID. The deletion operation fails 
    when the IDs not exist in the databases.

    Args:
        file (DeleteFileEmbeddings): Payload with the file's ID to delete

    Returns:
        JSONResponse[200]: Deletion of file and its embedding was done successfully
        
    Raises:
        HTTPException[404]: The file's ID was not found in the object storage
        HTTPException[404]: Some of the embedding IDs were not found in the database
    """

    try:
        file_object = await get_uploaded_file(file.file_id)
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "File ID not found",
        )

    embedding_ids = get_file_embedding_ids(file_object)

    try:
        await delete_embeddings(embedding_ids)
        await delete_file_object(file.file_id)
        return JSONResponse(
            status_code = status.HTTP_200_OK,
            content = {"detail": "File and its embeddings deleted"},
        )
    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Embedding IDs not found",
        )