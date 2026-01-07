# # backend/rag/generator.py

# import os
# from dotenv import load_dotenv
# from langchain_groq import ChatGroq
# from langchain.chains import RetrievalQA

# from .retriever import get_retriever

# load_dotenv()


# def get_rag_qa():
#     """Create and return a RetrievalQA RAG chain using Groq + FAISS retriever."""
    
#     groq_api_key = os.getenv("GROQ_API_KEY")
#     if not groq_api_key:
#         raise ValueError("❌ GROQ_API_KEY is not set in .env")

#     print("🤖 Initializing Groq LLM (LLaMA-3)...")

#     # LLM initialization
#     llm = ChatGroq(
#         
#         # model="llama-3.3-70b-versatile",
#         temperature=0.2,
#     )

#     # Load multilingual retriever (Hindi + English)
#     print("🔍 Loading multilingual retriever...")
#     retriever = get_retriever()

#     print("🔗 Building RetrievalQA RAG chain...")
#     qa_chain = RetrievalQA.from_chain_type(
#         llm=llm,
#         retriever=retriever,
#         chain_type="stuff",            # simplest, fastest RAG type
#         return_source_documents=True,  # for citations in response
#     )

#     print("✅ RAG QA Chain ready (Multilingual Enabled!)")
#     return qa_chain
