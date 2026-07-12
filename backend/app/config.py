from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "AssetFlow API"
    environment: str = "development"
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_database: str = "assetflow"
    mongo_use_mock: bool = False
    jwt_secret_key: str = Field(default="dev-only-change-me", min_length=16)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 14
    cors_origins: list[str] = ["http://localhost:5173"]
    rate_limit_per_minute: int = 120
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-1.5-flash"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
