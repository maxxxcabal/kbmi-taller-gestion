import asyncio
from app.db.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.orden import Orden
from app.models.cliente import Cliente
from app.models.equipo import Equipo

async def check_data():
    async with AsyncSessionLocal() as db:
        # Check orders
        stmt = select(Orden)
        result = await db.execute(stmt)
        ordenes = result.scalars().all()
        print(f"Total Órdenes: {len(ordenes)}")
        for o in ordenes:
            print(f"- Orden ID: {o.id}, Código: {o.codigo}, Tenant: {o.tenant_id}")

        # Check clients
        stmt = select(Cliente)
        result = await db.execute(stmt)
        clientes = result.scalars().all()
        print(f"\nTotal Clientes: {len(clientes)}")
        for c in clientes:
            print(f"- Cliente: {c.nombre}, ID: {c.id}")

if __name__ == "__main__":
    asyncio.run(check_data())
