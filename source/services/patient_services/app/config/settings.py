from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    MONGODB_URI: str
    DB_NAME: str
    COLLECTION_NAME: str

    class Config:
        env_file = Path(__file__).resolve().parent.parent / ".env"


settings = Settings()
