from typing import List, Dict, Any

def get_formatted_content_blocks(
        content_blocks: List[Dict[str, Any]],
    ) -> List[List[Dict[str, Any]]]:
    """
    Format every content block with the expected format for the consumption of 
    Cohere's endpoint.
    
    Args:
        content_blocks (List[Dict[str, Any]]): List of content blocks created with the file's content

    Returns:
        formatted_content_blocks (List[List[Dict[str, Any]]]): List content blocks with the expected format for the consumption of Cohere endpoint
    """

    return [[content_block] for content_block in content_blocks]