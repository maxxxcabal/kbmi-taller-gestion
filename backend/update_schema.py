import asyncio
from app.db.database import engine
from app.db.base import Base

# Import all models to ensure they are registered with Base.metadata
from app.models.cliente import Cliente
from app.models.equipo import Equipo
from app.models.orden import Orden, OrdenEstadoLog
from app.models.conocimiento import MetodoSolucion, CategoriaMetodo
from app.models.config import ConfigTaller

async def init_models():
    async with engine.begin() as conn:
        # # Para ambientes de desarrollo:
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_models())
    print("Base de datos inicializada correctamente! 🚀")
