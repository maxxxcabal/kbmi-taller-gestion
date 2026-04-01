from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator, Optional
from pydantic import BaseModel
from uuid import UUID

from app.db.database import AsyncSessionLocal

# Constantes de Auth para Phase 2
ADMIN_EMAIL = "maxireloco94@gmail.com"
ADMIN_TENANT_ID = UUID("00000000-0000-0000-0000-000000000002")
MOCK_TENANT_ID = UUID("00000000-0000-0000-0000-000000000001")

class CurrentUser(BaseModel):
    tenant_id: UUID
    email: str
    role: str

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

async def get_current_tenant_id(
    x_user_email: Optional[str] = Header(None)
) -> UUID:
    if x_user_email == ADMIN_EMAIL:
        return ADMIN_TENANT_ID
    return MOCK_TENANT_ID

async def get_current_user(
    x_user_email: Optional[str] = Header(None)
) -> CurrentUser:
    if x_user_email == ADMIN_EMAIL:
        return CurrentUser(tenant_id=ADMIN_TENANT_ID, email=ADMIN_EMAIL, role="admin")
    return CurrentUser(tenant_id=MOCK_TENANT_ID, email="guest@demo.com", role="guest")
