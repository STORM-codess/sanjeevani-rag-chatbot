# backend/rag/ingest.py

import os
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

DATA_PATH = "backend/data"
VECTOR_PATH = "backend/vector_store"


def build_vector_store():
    print("📥 Loading dataset from:", DATA_PATH)

    documents = []

    # Load all text files
    for filename in os.listdir(DATA_PATH):
        if filename.endswith(".txt"):
            file_path = os.path.join(DATA_PATH, filename)
            print(f"✔ Reading: {filename}")
            loader = TextLoader(file_path, encoding="utf-8")
            docs = loader.load()
            documents.extend(docs)

    if not documents:
        print("⚠ No text files found in /data. Add website content first!")
        return

    # Split long documents into small chunks
    print("✂️ Splitting documents into chunks...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len  
    )
    chunks = splitter.split_documents(documents)

    print(f"📄 Total chunks created: {len(chunks)}")

    # Create embeddings using HuggingFace (FREE + FAST)
# Create embeddings using HuggingFace (FREE + FAST)
    print("🧠 Generating embeddings using MULTILINGUAL Sentence Transformers...")
    embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


    # Create FAISS vector store
    print("📦 Building FAISS Vector Store...")
    vectorstore = FAISS.from_documents(chunks, embeddings)

    # Save vector store to disk
    print("💾 Saving FAISS index to:", VECTOR_PATH)
    vectorstore.save_local(VECTOR_PATH)

    print("✅ Vector Store Created Successfully!")


if __name__ == "__main__":
    build_vector_store()
