from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class ConfiguracionBase(BaseModel):
    nombre_taller: str
    direccion: str
    telefono: str
    email: Optional[str] = None
    mensaje_recibo: str
    mensaje_whatsapp_recepcion: str
    mensaje_whatsapp_listo: str
    logo_url: Optional[str] = None
    tenant_id: Optional[UUID] = None

class ConfiguracionUpdate(BaseModel):
    nombre_taller: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    mensaje_recibo: Optional[str] = None
    mensaje_whatsapp_recepcion: Optional[str] = None
    mensaje_whatsapp_listo: Optional[str] = None
    logo_url: Optional[str] = None

class Configuracion(ConfiguracionBase):
    id: int

    class Config:
        from_attributes = True
