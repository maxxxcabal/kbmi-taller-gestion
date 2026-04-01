import asyncio
import uuid
from app.db.database import engine
from sqlalchemy import text, select
from app.models.orden import Orden

async def backfill_tokens():
    print("Iniciando backfill de tokens...")
    async with engine.begin() as conn:
        # Obtener ids de órdenes sin token
        result = await conn.execute(text("SELECT id FROM ordenes WHERE token_seguimiento IS NULL"))
        rows = result.fetchall()
        
        print(f"Encontradas {len(rows)} órdenes sin token.")
        
        for row in rows:
            new_token = str(uuid.uuid4())
            await conn.execute(
                text("UPDATE ordenes SET token_seguimiento = :token WHERE id = :id"),
                {"token": new_token, "id": row[0]}
            )
            print(f"Orden {row[0]} -> Token {new_token}")
            
    print("✅ Backfill completado.")

if __name__ == "__main__":
    asyncio.run(backfill_tokens())
