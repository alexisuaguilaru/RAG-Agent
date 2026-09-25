from typing import Optional, List

from pydantic import BaseModel , Field

class ContextSchema(BaseModel):
    keyword: Optional[str] = Field(
        default = ""
    )

    tags: List = Field(
        default = []
    )