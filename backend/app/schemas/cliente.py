from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime

class ClienteCreate(BaseModel):
    nombre: str
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    dni: Optional[str] = None

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    dni: Optional[str] = None

class ClienteResponse(ClienteCreate):
    id: UUID
    tenant_id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True) 
