import asyncio
from app.db.database import engine
from sqlalchemy import text

async def update_schema():
    print("Actualizando esquema de base de datos...")
    async with engine.begin() as conn:
        # Create all tables if they don't exist
        from app.models.config import Configuracion
        from app.models.orden import Orden
        from app.models.cliente import Cliente
        from app.models.equipo import Equipo
        from app.models.conocimiento import MetodoConocimiento, MetodoEmbedding
        from app.db.base import Base
        
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Tablas verificadas/creadas.")
        
        try:
            await conn.execute(text("ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS comentarios TEXT"))
            print("✅ Columna 'comentarios' verificada.")
        except Exception: pass
        
        try:
            await conn.execute(text("ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS token_seguimiento UUID"))
            print("✅ Columna 'token_seguimiento' en 'ordenes' verificada.")
        except Exception: 
            try:
                await conn.execute(text("ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS token_seguimiento TEXT"))
            except Exception: pass
            
        try:
            await conn.execute(text("ALTER TABLE configuracion ADD COLUMN IF NOT EXISTS tenant_id UUID"))
            await conn.execute(text(f"UPDATE configuracion SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL"))
            print("✅ Columna 'tenant_id' en 'configuracion' verificada.")
        except Exception:
            try:
                await conn.execute(text("ALTER TABLE configuracion ADD COLUMN IF NOT EXISTS tenant_id TEXT"))
                await conn.execute(text(f"UPDATE configuracion SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL"))
            except Exception: pass
            
        try:
            await conn.execute(text("ALTER TABLE metodos_conocimiento ADD COLUMN IF NOT EXISTS tenant_id UUID"))
            await conn.execute(text(f"UPDATE metodos_conocimiento SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL"))
            print("✅ Columna 'tenant_id' en 'metodos_conocimiento' verificada.")
        except Exception:
            try:
                await conn.execute(text("ALTER TABLE metodos_conocimiento ADD COLUMN IF NOT EXISTS tenant_id TEXT"))
                await conn.execute(text(f"UPDATE metodos_conocimiento SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL"))
            except Exception: pass

if __name__ == "__main__":
    asyncio.run(update_schema())
