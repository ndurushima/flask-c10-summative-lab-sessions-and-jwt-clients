import os

class Config:
    Secret_Key = os.environ.get('SECRET_KEY', "default_secret_key")
    SQLALCHEMY_DATABSE_URI = set
    SQLALCHEMEY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ

class DevConfig(Config):
    DEBUG = True

config = DevConfig