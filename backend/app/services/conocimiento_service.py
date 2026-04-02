from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from app.models.conocimiento import MetodoConocimiento # , MetodoEmbedding
from app.schemas.conocimiento import MetodoCreate
# from app.services.embedding_service import generate_embedding
from uuid import UUID
from typing import List

async def create_metodo(db: AsyncSession, obj_in: MetodoCreate, tenant_id: UUID):
    # 1. Crear el objeto de conocimiento
    nuevo_metodo = MetodoConocimiento(
        tenant_id=tenant_id,
        titulo=obj_in.titulo,
        contenido=obj_in.contenido,
        tags=obj_in.tags
    )
    db.add(nuevo_metodo)
    await db.flush()

    # 2. Generar embedding (Deshabilitado temporalmente)
    # vector = generate_embedding(texto_para_embedding)

    # 3. Guardar embedding (Deshabilitado temporalmente)
    # nuevo_embedding = MetodoEmbedding(...)
    
    await db.commit()
    await db.refresh(nuevo_metodo)
    return nuevo_metodo

async def buscar_metodos(db: AsyncSession, query_text: str, tenant_id: UUID, limit: int = 5):
    # Deshabilitado temporalmente para estabilización
    return []
