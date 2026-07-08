## RAG API
Based on the template to develop a API following the clean architecture principles, this folder contains the source code to init and execute a FastAPI server to deploy the multimodal RAG system.

### Endpoints
* `GET /health`: Check if the service is healthy
* `POST /documents/create-embed`: Add a file to store it in the vector database a embedding vector
* `POST /query/search`: Search and return similar documents, files based on the user's query