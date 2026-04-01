import asyncio
from app.db.database import AsyncSessionLocal
from app.services import conocimiento_service
from app.schemas.conocimiento import MetodoCreate
from uuid import UUID

MOCK_TENANT_ID = UUID("00000000-0000-0000-0000-000000000001")

async def test_kb():
    async with AsyncSessionLocal() as db:
        # 1. Crear un método
        print("Creando método de prueba...")
        metodo_in = MetodoCreate(
            titulo="iPhone 11 - Falla de Táctil (IC Meson)",
            contenido="Si el táctil no responde y la pantalla es original, revisar voltajes de 5.7V en C5600. Reemplazar U8100 si es necesario.",
            tags="iphone,tactil,microelectronica"
        )
        await conocimiento_service.create_metodo(db, metodo_in, MOCK_TENANT_ID)
        print("✅ Método creado.")

        # 2. Buscar semánticamente
        print("Buscando 'pantalla de iphone no anda'...")
        resultados = await conocimiento_service.buscar_metodos(db, "pantalla de iphone no anda", MOCK_TENANT_ID)
        
        print("\nResultados encontrados:")
        for r in resultados:
            print(f"- {r['titulo']} (Score: {r['score']:.4f})")

if __name__ == "__main__":
    asyncio.run(test_kb())
