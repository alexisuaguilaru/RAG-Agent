from typing import List, Dict, Any

def get_formatted_content_blocks(
        content_blocks: List[Dict[str, Any]],
        description: str,
    ) -> List[List[Dict[str, Any]]]:
    """
    Format every content block with the expected format for the consumption of 
    Cohere's endpoint and they are merged with the text content block of the 
    file's description.
    
    Args:
        content_blocks (List[Dict[str, Any]]): List of content blocks created with the file's content
        description (str): Auxiliar text, summary or caption of the given submitted file

    Returns:
        formatted_content_blocks (List[List[Dict[str, Any]]]): List content blocks with the expected format for the consumption of Cohere endpoint. Every content block is merge with the file's description
    """

    formatted_content_blocks = []
    description_content_block = _get_description_content_block(description)
    
    for content_block in content_blocks:
        formatted_content = [content_block]
        
        if description_content_block:
            formatted_content.append(description_content_block)
        
        formatted_content_blocks.append(formatted_content)

    return formatted_content_blocks

def _get_description_content_block(description: str) -> Dict[str, str] | None:
    """
    Get the text content block with the given file's description.
    """

    if description:
        return {
            "type": "text",
            "text": description,
        }
    else:
        return None