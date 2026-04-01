from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.deps import get_db, get_current_tenant_id, ADMIN_EMAIL, ADMIN_TENANT_ID, MOCK_TENANT_ID
from uuid import UUID
from typing import Optional

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
async def get_me(tenant_id: UUID = Depends(get_current_tenant_id)):
    return {
        "tenant_id": tenant_id,
        "is_admin": tenant_id == ADMIN_TENANT_ID
    }
