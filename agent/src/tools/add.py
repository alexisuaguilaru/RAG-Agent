from langchain_core.tools import tool

@tool
def add_tool(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b