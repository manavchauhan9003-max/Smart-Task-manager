from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:Manav9003@localhost:5432/smart_task_manager"
    SECRET_KEY: str = "571c0fa7ae8fbecb123985261cdd1099221119d34754f25303191c4281c808c1"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()