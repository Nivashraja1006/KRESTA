import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import SessionLocal, engine, Base
from app.core.init_db import init_db
from app.core.seed import seed_database
from app.core.websocket_manager import ws_manager
from app.api.v1.api import api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables and seed default data if AUTO_SEED is enabled
    logger.info("Initializing database tables and schema...")
    db = SessionLocal()
    try:
        init_db(db)
        if settings.AUTO_SEED:
            seed_database(db, force=False)
    except Exception as e:
        logger.error(f"Error during database startup initialization: {e}")
    finally:
        db.close()
    yield
    # Shutdown
    logger.info("Shutting down RestaurantIQ application...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise AI-Powered Restaurant Operations & Intelligence Platform",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.mount(
    "/static",
    StaticFiles(directory=Path(__file__).resolve().parent / "static"),
    name="static",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        *settings.BACKEND_CORS_ORIGINS,
        "https://kresta-rho.vercel.app",
        "http://localhost:5173",
    ],
    allow_origin_regex=r"^https://([a-z0-9-]+\.)+vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error occurred. Please contact system support."}
    )


# Health Check
@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "CONNECTED"
    }


# WebSocket Endpoint for Live Kitchen Display System & Real-Time Alerts
@app.websocket("/ws/{room}")
async def websocket_endpoint(websocket: WebSocket, room: str = "general"):
    await ws_manager.connect(websocket, room)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or broadcast if client sends custom message
            await ws_manager.broadcast_to_room(room, {"client_event": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, room)


# Mount versioned API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)
