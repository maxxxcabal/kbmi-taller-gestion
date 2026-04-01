from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import clientes, ordenes, conocimiento, uploads, config, auth
import os

app = FastAPI(
    title="FixLab API", 
    description="SaaS Multi-tenant backend para gestión de talleres",
    version="1.0.0"
)

# Crear carpeta de uploads si no existe
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Servir archivos estáticos
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3005", # just in case
    ],
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
