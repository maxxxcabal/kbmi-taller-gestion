from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any, List
from decimal import Decimal

class NestedCliente(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    nombre: str
    telefono: Optional[str] = None

class NestedEquipo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    marca: str
    modelo: str
    imei: Optional[str] = None
    pin_patron: Optional[str] = None

class EquipoBase(BaseModel):
    marca: str
    modelo: str
    imei: Optional[str] = None
    pin_patron: Optional[str] = None

class EquipoCreate(EquipoBase):
    pass

class Equipo(EquipoBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    tenant_id: UUID
    created_at: datetime

class OrdenBase(BaseModel):
    problema: str
    checklist: Dict[str, bool] = {}
    precio_estimado: Optional[Decimal] = 0.0
    diagnostico_ia: Optional[str] = None
    fotos: Optional[str] = None
    sena: Optional[Decimal] = 0.0

class OrdenCreate(OrdenBase):
    cliente_id: Optional[UUID] = None # Si es None, se espera que se cree el cliente tb
    # Datos para crear cliente y equipo si no existen
    cliente_nombre: Optional[str] = None
    cliente_telefono: Optional[str] = None
    
    equipo_marca: Optional[str] = "Genérico"
    equipo_modelo: Optional[str] = "Desconocido"
    equipo_imei: Optional[str] = None
    equipo_pin: Optional[str] = None
    
    signature_data: Optional[str] = None

class OrdenUpdate(BaseModel):
    estado: Optional[str] = None
    diagnostico_ia: Optional[str] = None
    precio_estimado: Optional[Decimal] = None
    comentarios: Optional[str] = None
    costo_repuesto: Optional[Decimal] = None
    fotos: Optional[str] = None
    sena: Optional[Decimal] = None

class Orden(OrdenBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    tenant_id: UUID
    token_seguimiento: UUID
    codigo: str
    cliente_id: UUID
    equipo_id: UUID
    estado: str
    signature_data: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Nested relations
    cliente: Optional[NestedCliente] = None
    equipo: Optional[NestedEquipo] = None
