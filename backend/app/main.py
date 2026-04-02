import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
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
    if request.method == "OPTIONS":
        from fastapi.responses import Response
        response = Response()
    else:
        response = await call_next(request)
    
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Expose-Headers"] = "*"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"], 
    allow_headers=["*"], 
    expose_headers=["*"]
)


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

