from typing import Optional

import aioboto3
from types_aiobotocore_s3 import S3Client

from rag_api.core.config import settings

_object_storage = None

def init_object_storage_connection():
    """
    Function to initialize connection to the object storage.

    Returns:
        object_storage_connection: Client context connection to S3-service like
    """

    s3_session = aioboto3.Session(
        aws_access_key_id = settings.AWS_ID.get_secret_value(),
        aws_secret_access_key = settings.AWS_SECRET.get_secret_value(),
        region_name = "garage",
    )

    s3_endpoint = f"http://{settings.S3_HOST}:{settings.S3_PORT}"
    object_storage_connection = s3_session.client("s3", endpoint_url=s3_endpoint)
    return object_storage_connection

def set_object_storage(object_storage_client: S3Client | None = None) -> None:
    """
    Function to set the reference to the object storage client. 
    This reference can be a current connection or a None reference

    Args:
        object_storage_client (S3Client | None): Reference to the S3 client to set
    """

    global _object_storage
    _object_storage = object_storage_client

def get_object_storage() -> S3Client:
    """
    Function to get the S3-Garage client interface 
    based on the implementation of aioboto3

    Returns:
        object_storage (S3Client): S3-compatible client connected to Garage 
    """

    if _object_storage is None:
        raise Exception("S3 service not available")
    else:
        return _object_storage