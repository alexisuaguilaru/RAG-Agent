# -------------
# Base definition
# -------------
FROM python:3.13.10-slim-trixie AS base

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /rag_api

RUN addgroup --system app && adduser --system --ingroup app app

# -------------
# Builder stage
# -------------
FROM base AS builder

COPY --from=ghcr.io/astral-sh/uv:0.11.27 /uv /bin/uv

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
COPY uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \ 
    uv sync --no-dev --no-install-project

COPY . .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# -------------
# Final stage
# -------------
FROM base AS final

WORKDIR /rag_api

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    poppler-utils \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder --chown=app:app /rag_api/ /rag_api/

ENV PATH="/rag_api/.venv/bin:$PATH"
ENV UVICORN_NUM_WORKERS=2 \
    HOST=0.0.0.0 \
    PORT=6060

EXPOSE ${PORT}

USER app

CMD ["sh", "-c", "exec fastapi run --proxy-headers --host ${HOST} --port ${PORT} --workers ${UVICORN_NUM_WORKERS}"]