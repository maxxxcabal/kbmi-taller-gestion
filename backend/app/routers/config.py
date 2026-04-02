from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas.config import Configuracion, ConfiguracionUpdate
from app.models.config import Configuracion as ConfigModel
from app.deps import get_db, get_current_tenant_id
from uuid import UUID

router = APIRouter(prefix="/config", tags=["config"])

@router.get("", response_model=Configuracion)
@router.get("/", response_model=Configuracion)
async def get_config(
    db: AsyncSession = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    result = await db.execute(select(ConfigModel).where(ConfigModel.tenant_id == tenant_id).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        # Create default config for this tenant
        config = ConfigModel(
            nombre_taller="KBMI REPARACIONES",
            direccion="Barrio Caa Guazu F 1",
            telefono="3772573870",
            mensaje_recibo="Gracias por su confianza. Garantía de 30 días en repuestos.",
            tenant_id=tenant_id
        )
        db.add(config)
        await db.commit()
        await db.refresh(config)
    
    return config

@router.patch("", response_model=Configuracion)
@router.patch("/", response_model=Configuracion)
async def update_config(
    obj_in: ConfiguracionUpdate, 
    db: AsyncSession = Depends(get_db),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    result = await db.execute(select(ConfigModel).where(ConfigModel.tenant_id == tenant_id).limit(1))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    
    update_data = obj_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(config, key, value)
    
    await db.commit()
    await db.refresh(config)
    return config
