from typing import Optional

from pydantic import BaseModel , Field

class ContextSchema(BaseModel):
    keyword: Optional[str] = Field(
        default = ""
    )