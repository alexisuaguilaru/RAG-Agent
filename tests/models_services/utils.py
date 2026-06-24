from pathlib import Path
from PIL import Image
from io import BytesIO
import base64

from typing import Union
    
def encode_image(
        image_repr: Union[Path,Image.Image],
    ) -> str:

    if isinstance(image_repr,Path):
        with open(image_repr,'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
            extension = image_repr.suffix[1:]
    
    if isinstance(image_repr,Image.Image):
        image_buffer = BytesIO()
        extension = image_repr.format.lower()
        image_repr.save(image_buffer,extension)
        encoded_string = base64.b64encode(image_buffer.getvalue()).decode("utf-8")
    
    return f"data:image/{extension};base64,{encoded_string}"