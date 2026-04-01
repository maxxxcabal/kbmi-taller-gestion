from sqlalchemy import Column, String, Text, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
# from pgvector.sqlalchemy import Vector
import uuid
from app.db.base import Base

class MetodoConocimiento(Base):
    __tablename__ = "metodos_conocimiento"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    
    titulo = Column(String(255), nullable=False)
    contenido = Column(Text, nullable=False) # Pasos detallados
    tags = Column(String(255)) # "iphone,pantalla,cara"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relación con sus embeddings (Deshabilitado temporalmente para estabilización)
    # embeddings = relationship("MetodoEmbedding", back_populates="metodo", cascade="all, delete-orphan")

# class MetodoEmbedding(Base):
#     __tablename__ = "metodos_embeddings"
# 
#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     metodo_id = Column(UUID(as_uuid=True), ForeignKey("metodos_conocimiento.id"), nullable=False)
#     
#     # Vector de 384 dimensiones (MiniLM)
#     embedding = Column(Vector(384), nullable=False)
#     
#     metodo = relationship("MetodoConocimiento", back_populates="embeddings")
