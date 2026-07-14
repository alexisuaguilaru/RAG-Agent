## Agent 
Based on the template provided by Aegra commands, this folder contains the source code to initialize and serve the agent in a production environment. The code is modularized to divide responsibilities and components.

This component is highly customizable to meet your requirements. In general, the agent's harness (tools, skills, and MCP) is the most relevant part to modify in order to change the agent's behavior. 

### Memory & State
To change how the agent behaves and what metadata it has access to, modify the context (metadata passed during the agent's invocation) and state (mutable information across the agent's execution) schemas defined in the [`./src/memory/`](./src/memory/) folder. 

### Add New Tools
1. Create a new Python file for your tool source code in [tools](./src/tools/)
2. Follow the [implementation rules of LangChain](https://docs.langchain.com/oss/python/langchain/tools) to code a new tool
3. Add the new tool function to the `TOOLS` constant in [\_\_init\_\_.py](./src/tools/__init__.py) 

### Modify System Prompt
1. Modify the return of `load_system_prompt` in [prompt.py](./src/utils/prompt.py)