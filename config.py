import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
import dotenv


class Settings:
    load_dotenv()  # Load environment variables from .env file
    ALGORITHM: str = os.getenv("ALGORITHM")
    SECRET_KEY: str = os.getenv("SECRET_KEY")


settings = Settings()
print(settings.ALGORITHM)


def get_auth_data():
    return {"secret_key": settings.SECRET_KEY, "algorithm": settings.ALGORITHM}
