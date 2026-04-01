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
from app.models.conocimiento import MetodoConocimiento, MetodoEmbedding
from app.models.config import Configuracion

from sqlalchemy import text

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup if they don't exist
    async with engine.begin() as conn:
        # Habilitar extensión pgvector para la base de conocimiento
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="FixLab API", 
    description="SaaS Multi-tenant backend para gestión de talleres",
    version="1.0.0",
    lifespan=lifespan
)

# Crear carpeta de uploads si no existe
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Servir archivos estáticos
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Abrir temporalmente para asegurar conectividad total en Render
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

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
