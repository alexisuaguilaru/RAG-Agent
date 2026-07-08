# RAG Agent
An initial solution to develop a multimodal RAG agent build on LangChain ecosystem using local, open-weights models. This system provides an API for the RAG and agent compatible with the LangGraph SDK.

## Architecture
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
* Both embedding and reranker models are served with vLLM running on GPU, and chat model is served with llama-cpp running on CPU. 
* Both RAG and agent are developed with Python LangChain.
* Aegra provides an agent serving compatible with the LangGraph SDK (agent protocol).

### Tech Stack
Every folder (except for `tests`) has a README file which brief explains the purpose of the source code contained in the folders and some steps to modify/custom the code.
* [Aegra](https://github.com/aegra/aegra): Drop-in replacement for LangSmith Deployments serving the RAG agent using the Agent Protocol.
* [LangChain](https://github.com/langchain-ai/langchain): AI framework for building agents.
* [vLLM](https://github.com/vllm-project/vllm): Production, concurrent LLM inference and serving.
* [llama.cpp](https://github.com/ggml-org/llama.cpp): Local LLM inference.
* [FastAPI](https://github.com/fastapi/fastapi): Framework for building APIs
* [Redis](https://github.com/redis/redis)
* [Postgres](https://github.com/postgres/postgres)
* [ChromaDB](https://github.com/chroma-core/chroma)

## Environment
Currently, this project is testing with the next resources:
* 16GB DDR5 RAM
* 6GB GDDR6 VRAM

## Installation &  Usage
### Local Development Stage
```bash
pip install uv
uv pip install -r requirements.txt
```

### Testing and Deployment Stage
```bash
cp .env.example .env
```
set `HF_TOKEN`

```bash
docker compose up
```

### Web Interface
This project do not have an UI to interact with the RAG agent, but you can use [Agent Chat UI](https://github.com/langchain-ai/agent-chat-ui) by LangChain. Set the API URL to point at `http://localhost:2026` and the assistant ID equal to `rag_agent`.

## Run Tests
```bash
pytest tests
```

## Author, Affiliation and Contact
Alexis Aguilar [Student of Bachelor's Degree in "Tecnologías para la Información en Ciencias" at Universidad Nacional Autónoma de México [UNAM](https://www.unam.mx/)]: alexis.uaguilaru@gmail.com

Project developed as component for my Bachelor's thesis: "Desarrollo de un Agente de Inteligencia Artificial para Optimizar el Trámite de Titulación para los Estudiantes de la [ENES Unidad Morelia](https://www.enesmorelia.unam.mx/)".

## License
Project under [MIT License](LICENSE)