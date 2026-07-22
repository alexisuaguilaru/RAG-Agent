from typing import List

from fastapi import UploadFile
from mypy_boto3_s3.type_defs import GetObjectOutputTypeDef

from rag_api.database.object_storage import get_object_storage

object_storage = get_object_storage()

async def upload_embed_file(
        file: UploadFile,
        description: str, 
        tags: List[str], 
        embedding_ids: List[str],
    ) -> str:
    """
    Function to upload a previous embedded file 
    to the S3 Garage. This upload contains all 
    the available information about a processed 
    file.

    Args:
        file (UploadFile): Uploaded file by the client request
        description (str): Brief description or caption about the file
        tags (List[str]): Tags associated to the embedded file
        embedding_ids (List[str]): List of IDs of every embedding vector created

    Returns:
        file_id (str): File's ID associated to the key value uploaded to S3

    Raises:
        Exception: 
    """

    file_stream = file.file
    file_stream.seek(0)
    file_id = _get_file_id(file)

    extra_args = {
        "ContentType": file.content_type,
        "ContentDisposition": "inline",
        "Metadata": {
            "description": description,
            "tags": _stringify_list(tags),
            "embedding_ids": _stringify_list(embedding_ids),
        }
    }

    try:
        object_storage.upload_fileobj(
            file_stream,
            "rag-bucket",
            file_id,
            ExtraArgs = extra_args,
        )
    except Exception as e:
        raise e

    return file_id

async def get_uploaded_file(
        file_id: str,
    ) -> GetObjectOutputTypeDef:
    """
    Function to get the file's data and metadata based 
    on its ID. Return the information returned by 
    boto3.

    Args:
        file_id (str): File's ID associated to the file to retrieve

    Returns:
        file_object (GetObjectOutputTypeDef): Schema response with the information and data associated to the retrieved file
    """

    try:
        file_object = object_storage.get_object(Bucket="rag-bucket", Key=file_id)
        return file_object
    except Exception as e:
        raise Exception("File not found")
    
async def delete_file_object(
        file_id: str
    ) -> None:
    """
    Function to delete a file based on its ID. It is 
    removed permanently.

    Args:
        file_id (str): File's ID to delete
    """

    object_storage.delete_object(Bucket="rag-bucket", Key=file_id)

def _get_file_id(
        file: UploadFile
    ) -> str:
    """
    Function to get the file's id based on its name.
    """

    filename = file.filename
    filename = filename.lower()
    filename = filename.replace(" ", "-")
    return filename

def _stringify_list(
        items: List[str]
    ):
    """
    Function to stringify a list of items.
    """

    return ",".join(items)