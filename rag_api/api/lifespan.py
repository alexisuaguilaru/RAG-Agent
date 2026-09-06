from contextlib import AsyncExitStack, asynccontextmanager
from fastapi import FastAPI

from rag_api.database.object_storage import init_object_storage_connection, set_object_storage

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with AsyncExitStack() as async_stack:
        object_storage = await async_stack.enter_async_context(init_object_storage_connection())
        set_object_storage(object_storage)
    
        yield

        set_object_storage(None)