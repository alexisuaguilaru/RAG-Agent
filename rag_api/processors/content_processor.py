from typing import List, Dict, Any

def get_formatted_content_blocks(
        content_blocks: List[Dict[str, Any]],
        description: str,
    ):
    formatted_content_blocks = []
    description_content_block = _get_description_content_block(description)
    
    for content_block in content_blocks:
        formatted_content = [content_block]
        
        if description_content_block:
            formatted_content.append(description_content_block)
        
        formatted_content_blocks.append(formatted_content)

    return formatted_content_blocks

def _get_description_content_block(description: str):
    if description:
        return {
            "type": "text",
            "text": description,
        }
    else:
        return None