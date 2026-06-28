# RAG Agent
A multimodal RAG agent build on LangChain technologies and local, self-host models.

Agent built as part of my Bachelor's thesis for [Data Science degree](https://www.enesmorelia.unam.mx/licenciaturas/tecnologias-para-la-informacion-en-ciencias/) in [ENES Unidad Morelia](https://www.enesmorelia.unam.mx/).

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

       aegra_api -- service --> langchain_agent
       aegra_api -- query threads --> sql_db
       langchain_agent -. query messages .-> sql_db
       langchain_agent -- tool callings --> agent_tools

       agent_tools -- request --> rag_api
    end

    frontend -- request --> aegra_api --> redis_db -. streaming .-> frontend
    frontend -- request --> rag_api

    sql_db[(Postgres)]
```

## Installation
```bash
pip install uv
uv pip install -r requirements.txt
```

## Usage 
```bash
cp .env.example .env
```
set `HF_TOKEN`

```bash
docker compose up
```

## Testing
Each folder contains unit tests of each service and component
```bash
pytest tests
```