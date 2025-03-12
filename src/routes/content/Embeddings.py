from sentence_transformers import SentenceTransformer
import pymongo
import sys
import os
from dotenv import load_dotenv
load_dotenv()
URL= os.getenv('MONGO_URL')
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

client = pymongo.MongoClient(URL)
db = client.vector_data
collection = db.content_embeddings
id = sys.argv[1]
data = sys.argv[2]
def generate_embedding(text: str) -> list[float]:
    embeddings = model.encode(text)
    return embeddings.tolist()
id1=int(id)
doc = collection.find_one({"content_id":id1})
embedding = generate_embedding(doc['title'])
collection.update_one({'content_id': id1}, {'$set': {'content_embedding_hf': embedding}})

print("Embeddings stored successfully!")