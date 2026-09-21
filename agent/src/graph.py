from langchain.agents import create_agent
from langchain.agents.middleware import ToolCallLimitMiddleware

from src.utils import load_chat_model , init_system_prompt
from src.tools import TOOLS
from src.memory import StateSchema , ContextSchema

chat_model = load_chat_model()

agent = create_agent(
    chat_model,
    tools = TOOLS,
    state_schema = StateSchema,
    context_schema = ContextSchema,
    name = "rag_agent",
    middleware = [init_system_prompt, ToolCallLimitMiddleware(run_limit=3)],
)