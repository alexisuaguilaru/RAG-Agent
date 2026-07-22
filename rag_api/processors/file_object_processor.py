from typing import List, Any

from mypy_boto3_s3.type_defs import ObjectTypeDef, GetObjectOutputTypeDef

from rag_api.schemas.responses import StoredEmbedFile

def clean_file_object_data(
        file_object_data: ObjectTypeDef,
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
        "file_id": file_object_data["Key"],
        "filename": file_object_data["Metadata"]["filename"],
        "last_modification": file_object_data["LastModified"],
        "content_type": file_object_data["ContentType"],
        "description": file_object_data["Metadata"]["description"],
        "tags": file_object_data["Metadata"]["tags"].split(","),
    }

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