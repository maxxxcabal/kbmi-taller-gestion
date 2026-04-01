from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
import uuid

class Configuracion(Base):
    __tablename__ = "configuracion"

    id = Column(Integer, primary_key=True, index=True)
    nombre_taller = Column(String, default="Mi Taller")
    direccion = Column(String, default="Calle Principal 123")
    telefono = Column(String, default="123456789")
    email = Column(String, nullable=True)
    mensaje_recibo = Column(Text, default="Gracias por confiar en nosotros.")
    mensaje_whatsapp_recepcion = Column(Text, default="Hola {cliente}, recibimos tu {equipo}. Aquí tienes el comprobante: {link}")
    mensaje_whatsapp_listo = Column(Text, default="Hola {cliente}, tu {equipo} está listo para retirar. El total es ${precio}.")
    logo_url = Column(String, nullable=True)
    tenant_id = Column(UUID(as_uuid=True), default=uuid.uuid4, index=True)
