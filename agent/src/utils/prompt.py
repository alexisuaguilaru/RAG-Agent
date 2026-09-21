from langchain.agents.middleware import dynamic_prompt, ModelRequest

@dynamic_prompt
def init_system_prompt(request: ModelRequest) -> str:
    # Get values from the static/runtime context
    keyword = request.runtime.context.keyword or "UNKNOWN"

    return (
        "You are a helpful AI assistant.\n "
        "You can use a tool to retrieve specific, verified information to answer the user's question. Always use this tool with every user question.\n "
    )