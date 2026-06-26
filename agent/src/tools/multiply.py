from langchain_core.tools import tool

@tool
def multiply_tool(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b