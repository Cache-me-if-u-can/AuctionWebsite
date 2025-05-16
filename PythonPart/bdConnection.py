import pymongo
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB URI from environment variables
mongodb_uri = os.getenv("MONGODB_URI")
db_name = os.getenv("DB_NAME")

client = pymongo.MongoClient(mongodb_uri)
db = client[db_name]
