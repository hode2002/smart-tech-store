from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

# Establishing connection
try:
    uri = os.getenv('MONGODB_URL')
    client = MongoClient(uri)
    print('Connection established')
except ConnectionFailure as e:
    print("Could not connect to MongoDB")
    print(e)
