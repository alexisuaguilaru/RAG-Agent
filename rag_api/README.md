## RAG API
Based on a template to develop an API following clean architecture principles, this folder contains the source code to initialize and execute a FastAPI server to deploy the multimodal RAG system.

### Endpoints
* `GET /health`: Check if the service is healthy
* `POST /documents/create-embed`: Add a file to store it in the vector database as an embedding vector, and return a list of IDs of each vector added
* `DELETE /documents/delete-embed`: Delete a list of embedding IDs (can be associated to different files) from the vector database
* `POST /query/search`: Search, rerank, and return similar documents/files based on the user's query

### Technical Aspects
The RAG uses the Cohere client to request the embedding and reranker models served by vLLM. This allows building a native multimodal RAG using ChromaDB as the vector store. 

The endpoint `POST /documents/create-embed` accepts a description and a list of tags associated with a file. Currently, the description is not fused with the file's content, and the tags are stored along with the file's embedding. 

When the `POST /query/search` endpoint is called, the system first retrieves the top 10 (by default) documents similar to the query, and then reranks them to return the top 3 (by default) relevant documents.