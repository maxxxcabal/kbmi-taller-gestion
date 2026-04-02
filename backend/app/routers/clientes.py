from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.deps import get_db, get_current_user, CurrentUser
from app.schemas.cliente import ClienteCreate, ClienteResponse
from app.services.cliente_service import ClienteService

router = APIRouter(prefix="/clientes", tags=["clientes"])

@router.post("", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
async def create_cliente(
    cliente_in: ClienteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Crea un nuevo cliente vinculado específicamente al tenant del request actual.
    """
    try:
        cliente = await ClienteService.create_cliente(
            db=db, 
            obj_in=cliente_in, 
            tenant_id=current_user.tenant_id
        )
        return cliente
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[ClienteResponse])
async def read_clientes(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Lista los clientes del taller del current user.
    """
    clientes = await ClienteService.get_clientes(
        db=db, 
        tenant_id=current_user.tenant_id, 
        skip=skip, 
        limit=limit
    )
    return clientes
