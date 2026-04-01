from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.orden import Orden, OrdenEstadoLog
from app.models.equipo import Equipo
from app.models.cliente import Cliente
from app.schemas.orden import OrdenCreate
from uuid import UUID

async def create_order(db: AsyncSession, obj_in: OrdenCreate, tenant_id: UUID) -> Orden:
    # 1. Obtener o crear Cliente
    if obj_in.cliente_id:
        cliente_id = obj_in.cliente_id
    else:
        nuevo_cliente = Cliente(
            tenant_id=tenant_id,
            nombre=obj_in.cliente_nombre or "Cliente Genérico",
            telefono=obj_in.cliente_telefono
        )
        db.add(nuevo_cliente)
        await db.flush()
        cliente_id = nuevo_cliente.id

    # 2. Crear Equipo
    nuevo_equipo = Equipo(
        tenant_id=tenant_id,
        marca=obj_in.equipo_marca,
        modelo=obj_in.equipo_modelo,
        imei=obj_in.equipo_imei,
        pin_patron=obj_in.equipo_pin
    )
    db.add(nuevo_equipo)
    await db.flush()

    # 3. Generar Código Correlativo (#0001...)
    # Nota: En un sistema real masivo esto requiere un lock o secuencia, 
    # aquí hacemos un count simple por tenant para el MVP.
    result = await db.execute(
        select(func.count(Orden.id)).where(Orden.tenant_id == tenant_id)
    )
    count = result.scalar() or 0
    codigo = f"#{str(count + 1).zfill(4)}"

    # 4. Crear Orden
    nueva_orden = Orden(
        tenant_id=tenant_id,
        codigo=codigo,
        cliente_id=cliente_id,
        equipo_id=nuevo_equipo.id,
        problema=obj_in.problema,
        checklist=obj_in.checklist,
        precio_estimado=obj_in.precio_estimado,
        diagnostico_ia=obj_in.diagnostico_ia,
        signature_data=obj_in.signature_data,
        fotos=obj_in.fotos,
        sena=obj_in.sena or 0.0,
        estado="ingresado"
    )
    db.add(nueva_orden)
    await db.flush()

    # 5. Log de estado inicial
    log = OrdenEstadoLog(
        orden_id=nueva_orden.id,
        estado_nuevo="ingresado",
        notas="Orden creada inicialmente"
    )
    db.add(log)
    
    await db.commit()
    await db.refresh(nueva_orden)
    return nueva_orden

async def get_orders(db: AsyncSession, tenant_id: UUID):
    result = await db.execute(
        select(Orden).where(Orden.tenant_id == tenant_id).order_by(Orden.created_at.desc())
    )
    return result.scalars().all()

from sqlalchemy.orm import joinedload

async def get_order_by_id(db: AsyncSession, orden_id: UUID, tenant_id: UUID):
    result = await db.execute(
        select(Orden)
        .options(joinedload(Orden.cliente), joinedload(Orden.equipo))
        .where(Orden.id == orden_id, Orden.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()
