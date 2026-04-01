from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Suponemos que la tabla tenants existe o usas RLS nativo de Supabase sin foreign key estricta.
    # Por el MVP, lo dejamos como Column UUID normal y filtramos por codigo.
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    nombre = Column(String(255), nullable=False)
    email = Column(String(255))
    telefono = Column(String(50))
    dni = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
