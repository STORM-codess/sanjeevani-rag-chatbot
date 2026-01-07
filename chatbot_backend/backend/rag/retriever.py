# backend/rag/retriever.py

import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

VECTOR_PATH = "backend/vector_store"


def get_retriever():
    """
    Loads the FAISS vector store using the SAME multilingual embedding model
    used during ingestion, and returns a retriever.
    Supports Hindi + English + Hinglish queries.
    """

    print("🌐 Loading multilingual embedding model (Hindi + English)...")

    # IMPORTANT: Must match ingest.py EXACTLY
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )

    print("📦 Loading FAISS Vector Store from:", VECTOR_PATH)

    try:
        vectorstore = FAISS.load_local(
            VECTOR_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )
        print("✅ FAISS Vector Store Loaded Successfully!")
    except Exception as e:
        print("❌ ERROR: Failed to load FAISS index →", str(e))
        raise ValueError(
            "Vector store could not be loaded. Did you run ingest.py after changing embedding model?"
        )

    print("🔎 Creating retriever...")

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}     # fetch top 4 best matching chunks
    )

    print("✨ Multilingual Retriever Ready!")
    return retriever
