import io
import base64
from typing import List, Dict, Any, Callable

from pdf2image import convert_from_bytes

from fastapi import UploadFile

async def file_processor_dispatch(file: UploadFile) -> List[Dict[str, Any]]:
    content_type = file.content_type

    if content_type in _CONTENT_TYPE_DISPATCH:
        return await _CONTENT_TYPE_DISPATCH[content_type](file)
    else:
        print([{"content type": content_type}])
        raise Exception("file format without processor")

async def _text_processor(file: UploadFile) -> List[Dict[str, Any]]:
    content = await file.read()

    return [{
        "type": "text",
        "text": content.decode("utf-8"),
    }]

async def _image_processor(file: UploadFile) -> List[Dict[str, Any]]:
    content = await file.read()

    base64_image = base64.b64encode(content).decode("utf-8")
    image_url = f"data:{file.content_type};base64,{base64_image}"

    return [{
        "type": "image_url", 
        "image_url": {"url": image_url},
    }]

async def _pdf_processor(file: UploadFile) -> List[Dict[str, Any]]:
    content = await file.read()
    
    image_pages = convert_from_bytes(content)

    content_blocks = []
    for image_page in image_pages:
        image_buffer = io.BytesIO()
        image_page.save(image_buffer, "jpeg")

        base64_image = base64.b64encode(image_buffer.getvalue()).decode("utf-8")
        image_url = f"data:image/jpeg;base64,{base64_image}"

        content_blocks.append({
            "type": "image_url", 
            "image_url": {"url": image_url},
        })

    return content_blocks

_CONTENT_TYPE_DISPATCH: dict[str, Callable] = {
    "text/markdown": _text_processor,
    "text/plain": _text_processor,
    "image/jpeg": _image_processor,
    "image/png": _image_processor,
    "application/pdf": _pdf_processor,
}