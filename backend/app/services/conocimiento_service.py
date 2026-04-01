from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from app.models.conocimiento import MetodoConocimiento, MetodoEmbedding
from app.schemas.conocimiento import MetodoCreate
from app.services.embedding_service import generate_embedding
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

    # 2. Generar embedding (texto: Titulo + Contenido)
    texto_para_embedding = f"{obj_in.titulo}. {obj_in.contenido}"
    vector = generate_embedding(texto_para_embedding)

    # 3. Guardar embedding
    nuevo_embedding = MetodoEmbedding(
        metodo_id=nuevo_metodo.id,
        embedding=vector
    )
    db.add(nuevo_embedding)
    
    await db.commit()
    await db.refresh(nuevo_metodo)
    return nuevo_metodo

async def buscar_metodos(db: AsyncSession, query_text: str, tenant_id: UUID, limit: int = 5):
    # 1. Generar embedding del query
    query_vector = generate_embedding(query_text)

    # 2. Búsqueda semántica usando pgvector (Cosine Similarity <=> o Cosine Distance <->)
    # distance = embedding <=> query_vector
    # Requerimos el operador <=> para similitud de coseno
    
    stmt = (
        select(
            MetodoConocimiento,
            (1 - (MetodoEmbedding.embedding.cosine_distance(query_vector))).label("score")
        )
        .join(MetodoEmbedding)
        .where(MetodoConocimiento.tenant_id == tenant_id)
        .order_by(text("score DESC"))
        .limit(limit)
    )
    
    result = await db.execute(stmt)
    rows = result.all()
    
    # Formatear resultados
    resultados = []
    from app.schemas.conocimiento import Metodo
    for metodo, score in rows:
        metodo_dict = Metodo.model_validate(metodo).model_dump()
        metodo_dict['score'] = float(score)
        resultados.append(metodo_dict)
    
    return resultados
