FROM python:3.13.10-slim-trixie

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /rag_api

RUN addgroup --system app && adduser --system --ingroup app app

COPY --from=docker.io/astral/uv:0.11.27 /uv /bin/

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN uv sync --no-dev --no-install-project

COPY . .

ENV PATH="/rag_api/.venv/bin:$PATH"
ENV UVICORN_NUM_WORKERS=2

EXPOSE 6060

USER app

CMD ["sh", "-c", "fastapi run --proxy-headers --port 6060 --workers $UVICORN_NUM_WORKERS"]