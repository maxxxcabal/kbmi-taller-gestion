from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class MetodoBase(BaseModel):
    titulo: str
    contenido: str
    tags: Optional[str] = None

class MetodoCreate(MetodoBase):
    pass

class Metodo(MetodoBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime

class MetodoSearchResult(Metodo):
    # Similitud: 1.0 = idéntico, 0.0 = nada que ver
    # Score devuelto por el query de pgvector (distancia o similitud)
    score: float 
