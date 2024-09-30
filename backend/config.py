import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('LOCAL_DB_URI')  # Local DB URI

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('PROD_DB_URI')  # Production DB URI