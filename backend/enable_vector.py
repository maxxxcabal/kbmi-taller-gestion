import asyncio
from sqlalchemy import text
from app.db.database import engine

async def enable_vector():
    print("Conectando a Neon para habilitar pgvector...")
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
    print("✅ Extensión pgvector habilitada (o ya existía).")

if __name__ == "__main__":
    asyncio.run(enable_vector())
