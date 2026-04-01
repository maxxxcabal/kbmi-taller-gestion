from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base

class Equipo(Base):
    __tablename__ = "equipos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    
    marca = Column(String(100), nullable=False)
    modelo = Column(String(100), nullable=False)
    imei = Column(String(50))
    pin_patron = Column(String(100)) # Pin o patrón de desbloqueo
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    ordenes = relationship("Orden", back_populates="equipo")
