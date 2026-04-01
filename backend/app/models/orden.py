from sqlalchemy import Column, String, ForeignKey, DateTime, func, JSON, Numeric, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base

class Orden(Base):
    __tablename__ = "ordenes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False)
    token_seguimiento = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    
    # Correlativo para el taller (ej: #0081)
    codigo = Column(String(20), nullable=False)
    
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id"), nullable=False)
    equipo_id = Column(UUID(as_uuid=True), ForeignKey("equipos.id"), nullable=False)
    
    problema = Column(String(500), nullable=False)
    checklist = Column(JSON, server_default='{}') # { "screen": true, "touch": true, ... }
    
    diagnostico_ia = Column(String(500))
    
    precio_estimado = Column(Numeric(10, 2))
    estado = Column(String(50), default="ingresado") # ingresado, diagnostico, reparacion, listo, entregado
    
    signature_data = Column(Text, nullable=True) # Base64 signature
    fotos = Column(Text, nullable=True) # JSON array of filenames
    sena = Column(Numeric(10, 2), default=0.0) # Down payment / Deposit
    comentarios = Column(Text, nullable=True) # Technical notes
    costo_repuesto = Column(Numeric(10, 2), default=0.0) # Spare part cost
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    cliente = relationship("Cliente")
    equipo = relationship("Equipo", back_populates="ordenes")
    logs = relationship("OrdenEstadoLog", back_populates="orden")

class OrdenEstadoLog(Base):
    __tablename__ = "orden_estado_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    orden_id = Column(UUID(as_uuid=True), ForeignKey("ordenes.id"), nullable=False)
    
    estado_anterior = Column(String(50))
    estado_nuevo = Column(String(50), nullable=False)
    notas = Column(String(255))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    orden = relationship("Orden", back_populates="logs")
