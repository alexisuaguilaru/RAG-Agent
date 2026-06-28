## Agent 
Follow the template provided by Aegra commands, this folder contains the source code to init and serve the agent in a production environment. The code is modularized to divide responsibilities and components.

### Add New Tools
1. Create a new Python file for your tool source code in [tools](./src/tools/)
2. Follow the [implementation rules of LangChain](https://docs.langchain.com/oss/python/langchain/tools) to code a new tool
3. Add the new tool function at constant `TOOL` in [\_\_init\_\_.py](./src/tools/__init__.py) 

### Modify System Prompt
1. Modify the return of `load_system_prompt` in [prompt.py](./src/utils/prompt.py)