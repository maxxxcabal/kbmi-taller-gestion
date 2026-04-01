from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteUpdate

class ClienteService:
    @staticmethod
    async def create_cliente(db: AsyncSession, obj_in: ClienteCreate, tenant_id: UUID) -> Cliente:
        db_obj = Cliente(
            **obj_in.model_dump(),
            tenant_id=tenant_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    @staticmethod
    async def get_clientes(db: AsyncSession, tenant_id: UUID, skip: int = 0, limit: int = 100):
        result = await db.execute(
            select(Cliente)
            .where(Cliente.tenant_id == tenant_id)
            .offset(skip)
            .limit(limit)
            .order_by(Cliente.nombre)
        )
        return result.scalars().all()
