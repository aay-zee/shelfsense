import os
from dotenv import load_dotenv

load_dotenv()

# ── Auth settings ──
SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # 1 hour
