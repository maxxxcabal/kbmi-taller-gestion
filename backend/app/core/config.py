from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "FixLab API"
    SUPABASE_JWT_SECRET: str = "tu-supabase-jwt-secret-aqui"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost/fixlab"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
