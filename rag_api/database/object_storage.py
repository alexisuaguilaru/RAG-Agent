import boto3
from mypy_boto3_s3.client import S3Client

from rag_api.core.config import settings

def get_object_storage() -> S3Client:
    """
    Function to get the S3-Garage client interface 
    based on the implementation of boto3

    Returns:
        object_storage (S3Client): S3-compatible client connected to Garage 
    """

    s3_endpoint = f"http://{settings.S3_HOST}:{settings.S3_PORT}"
    object_storage  = boto3.client(
        "s3",
        endpoint_url = s3_endpoint,
        region_name = "garage",
        aws_access_key_id = settings.AWS_ID,
        aws_secret_access_key = settings.AWS_SECRET,
    )
    
    return object_storage