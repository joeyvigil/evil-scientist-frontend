from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException

from starlette.requests import Request
from starlette.responses import JSONResponse

from app.routers import users, items, chat, vector_ops, langgraph_ops, sql_ops
from app.services.db_connection import Base, engine

# Create DB tables on startup
Base.metadata.create_all(bind=engine)

# Set up FastAPI. We'll use this "app" variable to do FastAPI stuff below
app = FastAPI()

# Setting CORS (Cross Origin Resource Sharing) policy
# origins = ["*"] # Allow all origins (not recommended for production)
origins = ["http://localhost"] # Allows requests only from localhost

#TODO for Ben: CORS middleware setup

# Global custom Exception Handler
# All Exceptions raised in the routers get handled here
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request:Request, exception:HTTPException):
    return JSONResponse(
        status_code=exception.status_code,
        content={"message":exception.detail}
    )

# Import routers here
app.include_router(users.router)
app.include_router(items.router)
app.include_router(chat.router)
app.include_router(vector_ops.router)
app.include_router(langgraph_ops.router)
app.include_router(sql_ops.router)

# Generic sample endpoint (GET request that just returns a message)
@app.get("/")
async def sample_endpoint():
    return {"message":"Hello FastAPI!"}
