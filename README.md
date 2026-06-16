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