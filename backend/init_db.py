import asyncio
from app.db.database import engine
from app.db.base import Base

# Import all models to ensure they are registered with Base metadata before creating tables
from app.models.cliente import Cliente
from app.models.equipo import Equipo
from app.models.orden import Orden, OrdenEstadoLog
from app.models.conocimiento import MetodoConocimiento

async def init_db():
    print("Iniciando creación de tablas en Neon...")
    async with engine.begin() as conn:
        # Crea la extensión vector si no existe (requerido para AI)
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        # IMPORTANTE: En producción usar Alembic, aquí creamos para testing local
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tablas creadas exitosamente.")

if __name__ == "__main__":
    from sqlalchemy import text
    asyncio.run(init_db())
