# RAG Agent
An initial solution to develop a multimodal RAG agent built on the LangChain ecosystem using local, open-weights models. This system provides an API for the RAG and agent compatible with the LangGraph SDK.

## Project Structure
```bash
├── docker-compose.yml      # Orchestration of the containers
├── agent                   # Aegra agent and tools
│   ├── aegra.json          # Config file for Aegra
│   └── src                 # Agent source code with LangChain
├── chroma                  # ChromaDB configuration
│   ├── config.yaml
├── rag_api                 # RAG API code
│   ├── api
│   ├── core
│   ├── database
│   ├── main.py
│   ├── models
│   ├── processors
│   ├── schemas
│   └── services
├── tests                   # Initial unit tests for the system
└── vllm_configs            # vLLM configurations for embedding and reranker models 
```

## System Architecture
```mermaid
flowchart RL
    frontend("`Frontend
    Client`")
    redis_db[(Redis)]

    subgraph "RAG API"
        rag_api([Entrypoint])
        langchain_retriever[Retriever]
        langchain_vector_store[Vector Store]
        service_reranker[[Reranker]]
        service_embedding[[Embedding]]

        rag_api -- service --> langchain_retriever & langchain_vector_store
        langchain_retriever -. get docs .-> langchain_vector_store
        langchain_vector_store -- emb docs --> service_embedding
        langchain_vector_store -- query docs --> vector_db 
        langchain_retriever -- score docs ---> service_reranker
    end 

    vector_db[(ChromaDB)]

    subgraph "Aegra Service"
       aegra_api([Entrypoint])
       langchain_agent[Agent]
       agent_tools[[Tools]]
       chat_model[[Chat Model]]

       aegra_api -- service --> langchain_agent
       aegra_api -- query threads --> sql_db
       langchain_agent -. query messages .-> sql_db
       langchain_agent -- tool callings --> agent_tools
       langchain_agent -- chat --> chat_model

       agent_tools -- request --> rag_api
    end

    frontend -- request --> aegra_api --> redis_db -. streaming .-> frontend
    frontend -- request --> rag_api

    sql_db[(Postgres)]
```
* Both embedding and reranker models are served using vLLM running on a GPU, and the chat model is served using llama-cpp running on a CPU. 
* Both the RAG and agent are developed with Python and LangChain.
* Aegra provides agent serving compatible with the LangGraph SDK (agent protocol).

### Tech Stack
Every folder (except for `tests`) has a README file that briefly explains the purpose of the source code contained in the folders and provides steps to modify/customize the code.
* [Aegra](https://github.com/aegra/aegra): Drop-in replacement for LangSmith Deployments serving the RAG agent using the Agent Protocol.
* [LangChain](https://github.com/langchain-ai/langchain): AI framework for building agents.
* [vLLM](https://github.com/vllm-project/vllm): Production, concurrent LLM inference and serving.
* [llama.cpp](https://github.com/ggml-org/llama.cpp): Local LLM inference.
* [FastAPI](https://github.com/fastapi/fastapi): Framework for building APIs
* [Redis](https://github.com/redis/redis)
* [Postgres](https://github.com/postgres/postgres)
* [ChromaDB](https://github.com/chroma-core/chroma)

## RAG Pipeline
Every file to embed (requested by the `/documents/create-embed` endpoint) is processed based on its MIME type:
* Plain text: Its textual content is extracted directly
* Image: It is encoded as base64
* PDF: Every page is encoded as a base64 image

These content types are sent to the multimodal (text+image) embedding model service, and their vector representations are loaded to the vector database (ChromaDB). These representations are used to perform semantic similarity search based on the user's query (received by the `/query/search` endpoint).

The content of each retrieved document by the RAG is a JSON string representing a list of LangChain's content blocks. These blocks allow preserving the multimodal information of the original document and adding it to the agent's context.

## Installation &  Usage
### Environment
Currently, this project is tested using the following resources:
* 16GB DDR5 RAM
* 6GB GDDR6 VRAM

### Local Development Stage
```bash
pip install uv
uv pip install -r requirements.txt
```

### Testing and Deployment Stage
```bash
cp .env.example .env
```
Set the `HF_TOKEN` and `TOKEN_CHROMA` values.

```bash
docker compose up
```

### Web Interface
This project has a UI to interact with the RAG agent based on Next.js (React) and was developed enterily using Antigravity (Gemini 3.5 Flash). Follow the instructions in [README.md](./frontend/README.md) to run it and test the agent. 

Also you can use [Agent Chat UI](https://github.com/langchain-ai/agent-chat-ui) by LangChain. Set the API URL to point at `http://localhost:2026` and the assistant ID equal to `rag_agent`.

## Run Tests
To execute the basic, initial tests, use the next command:
```bash
pytest tests
```

## Author, Affiliation & Contact
Alexis Aguilar [Student of Bachelor's Degree in "Tecnologías para la Información en Ciencias" at Universidad Nacional Autónoma de México [UNAM](https://www.unam.mx/)]: alexis.uaguilaru@gmail.com

Project developed as component for my Bachelor's thesis: "Desarrollo de un Agente de Inteligencia Artificial para Optimizar el Trámite de Titulación para los Estudiantes de la [ENES Unidad Morelia](https://www.enesmorelia.unam.mx/)".

## License
Project under [MIT License](LICENSE)