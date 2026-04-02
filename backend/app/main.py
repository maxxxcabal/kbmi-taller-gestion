import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db.base import Base
from app.db.database import engine
from app.routers import clientes, ordenes, conocimiento, uploads, config, auth

# Import models to register them with Base.metadata for automatic table creation
from app.models.cliente import Cliente
from app.models.equipo import Equipo
from app.models.orden import Orden, OrdenEstadoLog
from app.models.conocimiento import MetodoConocimiento
from app.models.config import Configuracion

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup if they don't exist
    try:
        async with engine.begin() as conn:
            # Habilitar extensión opcionalmente (ya no es obligatoria para arrancar)
            # await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            await conn.run_sync(Base.metadata.create_all)
        print("Base de datos inicializada correctamente! 🚀")
    except Exception as e:
        print(f"Error inicializando la base de datos: {e}")
        # No detenemos el servidor, permitimos que arranque para que el Dashboard no quede en blanco
    yield

app = FastAPI(
    title="FixLab API", 
    description="SaaS Multi-tenant backend para gestión de talleres",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False
)

@app.middleware("http")
async def add_cors_headers(request, call_next):
    # Definitive CORS & OPTIONS handling
    if request.method == "OPTIONS":
        from fastapi.responses import JSONResponse
        response = JSONResponse(
            status_code=200,
            content={"status": "ok", "message": "Preflight OK"}
        )
    else:
        try:
            response = await call_next(request)
        except Exception as e:
            from fastapi.responses import JSONResponse
            response = JSONResponse(
                status_code=500,
                content={"detail": f"Internal Server Error: {str(e)}"}
            )
    
    # Force Headers - The "Nuclear" way
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-User-Email, Authorization, Accept, Origin, X-Requested-With"
    response.headers["Access-Control-Max-Age"] = "86400"
    response.headers["Access-Control-Expose-Headers"] = "*"
    return response

# Global Exception Handlers to ensure CORS headers on errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    response = JSONResponse(
        status_code=422,
        content={"detail": "Error de validación de datos", "errors": exc.errors()},
    )
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    response = JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    response = JSONResponse(
        status_code=500,
        content={"detail": f"Error interno del servidor: {str(exc)}"},
    )
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Standard middleware removed to avoid conflicts with manual nuclear logic


# Crear carpeta de uploads si no existe
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Servir archivos estáticos
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Registrando los routers
app.include_router(auth.router)
app.include_router(clientes.router)
app.include_router(ordenes.router)
app.include_router(conocimiento.router)
app.include_router(uploads.router)
app.include_router(config.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FixLab API is running! 🚀"}

@app.get("/stats")
def read_stats():
    # Endpoint mínimo para evitar 404 en el dashboard frontend
    return {"total_ordenes": 0, "activas": 0, "listas": 0}

