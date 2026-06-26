from dataclasses import dataclass
from typing import Optional

@dataclass
class ContextSchema:
    keyword: Optional[str]