from typing import List, Any

from mypy_boto3_s3.type_defs import GetObjectOutputTypeDef

from rag_api.schemas.responses import StoredEmbedFile

def clean_file_object_data(
        file_object: GetObjectOutputTypeDef,
    ) -> dict[str, Any]:
    """
    Function to process and clean file object's data 
    to collect only relevant metadata values.

    Args: 
        file_object_data (ObjectTypeDef): Schema which represent the file object's data and information

    Returns:
        clean_file_object (dict[str, Any]): Dictionary with the extracted and processed fields of a object file
    """

    return {
        "file_id": file_object["Key"],
        "filename": file_object["Metadata"]["filename"],
        "last_modification": file_object["LastModified"],
        "content_type": file_object["ContentType"],
        "description": file_object["Metadata"]["description"],
        "tags": file_object["Metadata"]["tags"].split(","),
    }

def get_stream_headers(
        file_object: GetObjectOutputTypeDef,
    ) -> dict[str, str]:
    """
    Function to create the headers to stream a file 
    based on its object's data. 

    Args:
        file_object (ObjectTypeDef): File object to stream

    Returns:
        stream_headers (dict[str, str]): Headers of the file to stream 
    """

    stream_headers = {
        "Content-Disposition": file_object["ContentDisposition"],
        "Content-Length": str(file_object["ContentLength"]),
        "Cache-Control": "public, max-age=86400",
        "Accept-Ranges": "bytes",
    }

    return stream_headers

def get_file_embedding_ids(
        file_object: GetObjectOutputTypeDef,
    ) -> List[str]:
    """
    Function to process the get file object schema 
    to gather the embeddings IDs associated to the 
    file.

    Args: 
        file_object (GetObjectOutputTypeDef): File object schema returned by the get operation

    Returns:
        embedding_ids (List[str]): List of embedding IDs associated to the given file
    """

    string_embedding_ids = file_object["Metadata"]["embedding_ids"]
    return string_embedding_ids.split(",")