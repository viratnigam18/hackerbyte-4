"""
Global MongoDB Singleton Connector
-----------------------------------
Every module in the project imports `client` and `db` from here.
Zero duplicate connections. Single reusable MongoClient instance.
"""
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://viratnigam18june_db_user:Hiu95771NT8p2UZh@cluster0.mongodb.net/"
DB_NAME = "hackabyte_db"

client = None
db = None

try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=10000,
        retryWrites=True,
    )
    client.admin.command("ping")
    db = client[DB_NAME]
    print(f"[MongoDB] Connected to Atlas -> database '{DB_NAME}'")
except Exception as e:
    print(f"[MongoDB] Connection FAILED: {e}")
    client = None
    db = None
