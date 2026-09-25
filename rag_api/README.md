## RAG API
Based on a template to develop an API following clean architecture principles, this folder contains the source code to initialize and execute a FastAPI server to deploy the multimodal RAG system.

### Env Vars
* `EMBEDDING_SERVICE_URL`: URL for the endpoints of Embedding service
* `EMBEDDING_SERVICE_APIKEY`: API key to use the endpoints of Embedding service
* `EMBEDDING_MODEL`: ID or name for the embedding model to use
* `DOCUMENTS_TO_RETRIEVE`: Number of documents to retrieve from ChromaDB
* `RERANKER_SERVICE_URL`: URL for the endpoints of Reranker service
* `RERANKER_SERVICE_APIKEY`: API key to use the endpoints of Reranker service
* `RERANKER_MODEL`: ID or name for the reranker model to use
* `TOP_K_DOCUMENTS`: Number of document to return after rerankering
* `AWS_ID`: Access key or ID for Garage service
* `AWS_SECRET`: Secret key or token to use Garage service
* `CHROMA_TOKEN`: Token to use ChromaDB

### Technical Aspects
The RAG uses the Cohere client to request the embedding and reranker models served by vLLM. This allows building a native multimodal RAG using ChromaDB as the vector store. 

The endpoint `POST /documents/create-embed` accepts a description and a list of tags associated with a file. Currently, the description is not fused with the file's content, and the tags are stored along with the file's embedding. 

When the `POST /query/search` endpoint is called, the system first retrieves the top 10 (by default) documents similar to the query, and then reranks them to return the top 3 (by default) relevant documents.