from langchain.agents import create_agent

from src.utils import load_chat_model , load_system_prompt
from src.tools import TOOLS
from src.memory import StateSchema , ContextSchema

chat_model = load_chat_model()

agent = create_agent(
    chat_model,
    tools = TOOLS,
    system_prompt = load_system_prompt(),
    state_schema = StateSchema,
    context_schema = ContextSchema,
    name = "rag_agent",
)