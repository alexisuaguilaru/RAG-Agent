# RAG Agent
An initial solution to develop a multimodal RAG agent build on LangChain ecosystem using local, no closed models. This system provides an API for the RAG and agent compatible with the LangGraph SDK.

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
* Open to add new tools to expand the agent harness.

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

## Run Tests
```bash
pytest tests
```

## Author, Affiliation and Contact
Alexis Aguilar [Student of Bachelor's Degree in "Tecnologías para la Información en Ciencias" at Universidad Nacional Autónoma de México [UNAM](https://www.unam.mx/)]: alexis.uaguilaru@gmail.com

Project developed as component for my Bachelor's thesis: "Desarrollo de un Agente de Inteligencia Artificial para Optimizar el Trámite de Titulación para los Estudiantes de la ENES Unidad Morelia"