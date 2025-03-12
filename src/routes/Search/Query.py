from sentence_transformers import SentenceTransformer
import pymongo
import sys
import os
from dotenv import load_dotenv
load_dotenv()
URL= os.getenv('MONGO_URL')
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

client = pymongo.MongoClient(URL)
db = client.vector_data
collection = db.content_embeddings
query = sys.argv[1]

def generate_embedding(text: str) -> list[float]:
    embeddings = model.encode(text)
    return embeddings.tolist()


results = collection.aggregate([
  {"$vectorSearch": {
    "queryVector": generate_embedding(query),
    "path": "content_embedding_hf",
    "numCandidates": 100,
    "limit": 1,
    "index": "Brain_Search",
    }}
]);

Values=[];
for document in results:
    Values.append(document["content_id"])
print(Values)