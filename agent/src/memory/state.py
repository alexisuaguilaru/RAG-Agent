from typing import Optional

from langchain.agents import AgentState

class StateSchema(AgentState):
    current_value: Optional[int]