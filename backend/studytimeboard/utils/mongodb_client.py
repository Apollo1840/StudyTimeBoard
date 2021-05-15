# 
import pymongo
import datetime
import bcrypt
from bson.json_util import dumps
from dotenv import load_dotenv
import json
import os

load_dotenv()
JWT_DURATION = os.getenv('JWT_DURATION')
JWT_SECRET = os.getenv('JWT_SECRET')
MONGODB_SRV = os.getenv('MONGODB_SRV')

# Instantiate database object and collection object
client = pymongo.MongoClient(MONGODB_SRV)
database = pymongo.database.Database(client, 'dev')
users_collection = pymongo.collection.Collection(database, 'users')
