from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Existing, unchanged -- core app config remains required, since
    # task management itself cannot function without a database or a
    # working JWT secret. This is a DIFFERENT situation from the AI key.
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ENVIRONMENT: str = "development"

    # AI config -- now OPTIONAL, deliberately, per Step 3's requirement:
    # core task management must never depend on AI being configured.
    # Optional[str] = None (not a required field) means a completely
    # missing OPENAI_API_KEY no longer prevents Settings() from being
    # constructed at all -- the app can start normally either way.
    OPENAI_API_KEY: Optional[str] = None
    AI_MODEL: str = "gpt-4o-mini"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @property
    def ai_enabled(self) -> bool:
        """
        Distinguishes all three states Step 3 asked for:
        1. Completely missing   -> OPENAI_API_KEY is None           -> False
        2. Present but empty    -> OPENAI_API_KEY is "" or "   "    -> False
           (a blank .env line, or an accidentally emptied value)
        3. Configured correctly -> a real, non-blank string         -> True
        This is the SINGLE place that answers "is AI available right
        now" -- every other file (ai_service.py, routes, health checks)
        asks THIS property, rather than re-deriving the logic themselves.
        """
        return bool(self.OPENAI_API_KEY and self.OPENAI_API_KEY.strip())


settings = Settings()