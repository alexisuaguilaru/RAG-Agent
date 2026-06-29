from typing import Annotated, List

from fastapi import APIRouter, File, Form, UploadFile, status
from fastapi.responses import JSONResponse

from rag_api.processors.file_processor import file_processor_dispatch

router = APIRouter()

@router.post("/create-embed")
async def embed_files(
        file: Annotated[UploadFile, File()],
        tags: Annotated[List[str], Form()] = [],
        description: Annotated[str, Form()] =  "",
    ):
    """
    Args:
        file: md, txt, jpg, png, pdf formats

    Returns:
        HTTP 200: Content file embedded
        HTTP 415: File format incompatible or unsupported
    """

    # process file based on file.content_type --> list of contents block
    # process description based on file --> list of contents block

    # embed content blocks into vector_store + tags

    try:
        content_blocks = await file_processor_dispatch(file)
    except:
        return JSONResponse(
            status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            content = {"message": "File format not supported."}
        )
    
    return JSONResponse(
        status_code = status.HTTP_200_OK,
        content = {"message": "File embedded correctly."}
    )