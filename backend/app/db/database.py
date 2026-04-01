import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Fix database URL for asyncpg and handle Neon SSL requirements
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+asyncpg://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Remove 'sslmode' which causes TypeError in asyncpg
if "?sslmode=" in db_url:
    db_url = db_url.split("?sslmode=")[0]
elif "&sslmode=" in db_url:
    db_url = db_url.split("&sslmode=")[0]

# Add ssl=require if it's a Neon DB and we don't have it
if "neon.tech" in db_url:
    # We'll pass SSL config via connect_args for better stability
    engine = create_async_engine(
        db_url, 
        echo=True,
        connect_args={"ssl": True}
    )
else:
    engine = create_async_engine(db_url, echo=True)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

# Dependency to get DB session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
