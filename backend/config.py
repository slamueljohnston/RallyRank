import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'  # Default value
    SESSION_COOKIE_SECURE = False # Default value

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('LOCAL_DB_URI')  # Local DB URI
    SESSION_COOKIE_SECURE = False  # Cookies can be sent over HTTP
    SESSION_COOKIE_SAMESITE = 'Lax'  # Adjust as needed

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('PROD_DB_URI')  # Production DB URI
    SESSION_COOKIE_SECURE = True  # Cookies are sent over HTTPS only
    SESSION_COOKIE_SAMESITE = 'None'  # Required for cross-site cookies