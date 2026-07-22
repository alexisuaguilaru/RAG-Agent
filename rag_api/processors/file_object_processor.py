from typing import List
from mypy_boto3_s3.type_defs import GetObjectOutputTypeDef

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