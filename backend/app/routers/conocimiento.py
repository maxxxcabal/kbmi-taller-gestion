from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.deps import get_db, get_current_tenant_id
from app.schemas.conocimiento import Metodo, MetodoCreate, MetodoSearchResult
from app.services import conocimiento_service
from uuid import UUID
from typing import List

router = APIRouter(prefix="/conocimiento", tags=["conocimiento"])

@router.post("/", response_model=Metodo)
async def add_metodo(
    obj_in: MetodoCreate,
    db: AsyncSession = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    Crea un nuevo método de conocimiento y genera su embedding IA.
    """
    return await conocimiento_service.create_metodo(db=db, obj_in=obj_in, tenant_id=tenant_id)

@router.get("/buscar", response_model=List[MetodoSearchResult])
async def search_metodos(
    q: str = Query(..., description="Texto de búsqueda semántica"),
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    Busca métodos de reparación usando similitud semántica (IA).
    """
    if not q:
        return []
    return await conocimiento_service.buscar_metodos(db=db, query_text=q, tenant_id=tenant_id, limit=limit)
