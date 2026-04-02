from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.orden import Orden
from app.models.cliente import Cliente
from app.models.equipo import Equipo
from app.schemas.orden import Orden as OrdenSchema, OrdenCreate, OrdenUpdate
from app.schemas.conocimiento import MetodoSearchResult
from app.services import orden_service
from app.routers.auth import get_current_tenant_id
from uuid import UUID
from typing import List, Optional

router = APIRouter(prefix="/ordenes", tags=["ordenes"])


@router.post("", response_model=OrdenSchema)
@router.post("/", response_model=OrdenSchema)
async def create_new_order(
    obj_in: OrdenCreate,
    db: AsyncSession = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    Crea una nueva orden de reparación.
    Incluye creación automática de cliente y equipo si es necesario.
    """
    return await orden_service.create_order(db=db, obj_in=obj_in, tenant_id=tenant_id)

@router.get("", response_model=List[OrdenSchema])
@router.get("/", response_model=List[OrdenSchema])
async def read_ordenes(
    q: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    query = select(Orden).options(
        selectinload(Orden.cliente),
        selectinload(Orden.equipo)
    ).where(Orden.tenant_id == tenant_id)
    
    if q:
        search = f"%{q}%"
        query = query.join(Cliente).join(Equipo).where(
            or_(
                Cliente.nombre.ilike(search),
                Equipo.modelo.ilike(search),
                Equipo.marca.ilike(search),
                Equipo.imei.ilike(search),
                Orden.codigo.ilike(search),
                Orden.problema.ilike(search)
            )
        )
    
    result = await db.execute(query.order_by(Orden.created_at.desc()))
    ordenes_db = result.scalars().all()
    return [OrdenSchema.model_validate(o) for o in ordenes_db]

@router.get("/{orden_id}", response_model=OrdenSchema)
async def read_order(orden_id: UUID, db: AsyncSession = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant_id)):
    result = await db.execute(
        select(Orden)
        .options(selectinload(Orden.cliente), selectinload(Orden.equipo))
        .where(Orden.id == orden_id, Orden.tenant_id == tenant_id)
    )
    db_order = result.scalar_one_or_none()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return db_order

@router.patch("/{orden_id}", response_model=OrdenSchema)
async def update_order(
    orden_id: UUID, 
    order_update: OrdenUpdate, 
    db: AsyncSession = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    result = await db.execute(select(Orden).where(Orden.id == orden_id, Orden.tenant_id == tenant_id))
    db_order = result.scalar_one_or_none()
    if not db_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    update_data = order_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_order, key, value)
    
    await db.commit()
    await db.refresh(db_order)
    
    # Reload with relations for the response model
    result = await db.execute(
        select(Orden)
        .options(selectinload(Orden.cliente), selectinload(Orden.equipo))
        .where(Orden.id == orden_id, Orden.tenant_id == tenant_id)
    )
    return result.scalar_one()

@router.get("/public/{token}", response_model=OrdenSchema)
async def read_order_public(token: UUID, db: AsyncSession = Depends(get_db)):
    """
    Endpoint público para que el cliente consulte su estado sin registrarse.
    """
    result = await db.execute(
        select(Orden)
        .options(selectinload(Orden.cliente), selectinload(Orden.equipo))
        .where(Orden.token_seguimiento == token)
    )
    db_order = result.scalar_one_or_none()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return db_order

@router.get("/{orden_id}/ai-suggestion", response_model=List[MetodoSearchResult])
async def get_ai_suggestion(orden_id: UUID, db: AsyncSession = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant_id)):
    """
    Busca sugerencias en la base de conocimientos basadas en el problema de la orden.
    """
    from app.schemas import conocimiento
    result = await db.execute(select(Orden).where(Orden.id == orden_id, Orden.tenant_id == tenant_id))
    db_order = result.scalar_one_or_none()
    if not db_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    from app.services import conocimiento_service
    return await conocimiento_service.buscar_metodos(
        db=db, 
        query_text=db_order.problema, 
        tenant_id=db_order.tenant_id, 
        limit=3
    )
@router.delete("/{orden_id}")
async def delete_order(
    orden_id: UUID, 
    db: AsyncSession = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    from app.models.orden import OrdenEstadoLog
    # 1. Verificar existencia y pertenencia
    result = await db.execute(select(Orden).where(Orden.id == orden_id, Orden.tenant_id == tenant_id))
    db_order = result.scalar_one_or_none()
    if not db_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    # 2. Borrar logs asociados
    await db.execute(
        select(OrdenEstadoLog).where(OrdenEstadoLog.orden_id == orden_id).delete()
    )
    
    # 3. Borrar orden
    await db.delete(db_order)
    await db.commit()
    
    return {"status": "success", "message": "Orden eliminada correctamente"}
