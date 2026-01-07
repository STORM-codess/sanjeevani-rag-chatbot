# backend/main.py

import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.rag.generator import get_rag_qa

# ------------------ ENV & CONSTANTS ------------------

load_dotenv()

GREETING_WORDS = {
    "hi", "hello", "hey", "namaste", "hii", "helo"
}

# ------------------ FASTAPI APP ------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 Initializing RAG backend...")
qa_chain = get_rag_qa()   # load once

# ------------------ MEMORY STORE ------------------

chat_sessions = {}

# ------------------ REQUEST SCHEMA ------------------

class Query(BaseModel):
    session_id: str
    question: str

# ------------------ CHAT ENDPOINT ------------------

@app.post("/ask")
async def ask_question(query: Query):
    """
    RAG chatbot endpoint
    - Handles greetings
    - Uses RAG for real questions
    - Forces bullet-point answers
    """

    try:
        original_question = query.question.strip()
        question_lower = original_question.lower()

        print("💬 User Query:", original_question)

        # ---------- GREETING HANDLER ----------
        if question_lower in GREETING_WORDS:
            return {
                "answer": "Hi 👋 Welcome to Sanjeevani. How can I help you?",
                "sources": []
            }

        # ---------- STORE USER MESSAGE ----------
        session = chat_sessions.get(query.session_id, [])
        session.append({"role": "user", "content": original_question})
        chat_sessions[query.session_id] = session

        # ---------- RAG QUERY (BULLET FORCED) ----------
        final_input = {
            "query": f"""
Answer the following question in clear, numbered bullet points.
Each point must be on a new line.
Do NOT repeat information.
If there are sub-points, use hyphen (-) bullets on new lines.

Question:
{original_question}
"""
        }

        response = qa_chain(final_input)
        answer = response["result"]

        # ---------- STORE BOT MESSAGE ----------
        session.append({"role": "assistant", "content": answer})
        chat_sessions[query.session_id] = session

        # ---------- SOURCES ----------
        sources = [
            {
                "file": doc.metadata.get("source", "unknown"),
                "content": doc.page_content[:300] + "..."
            }
            for doc in response.get("source_documents", [])
        ]

        return {
            "answer": answer,
            "sources": sources
        }

    except Exception as e:
        print("❌ Error:", e)
        return {
            "answer": "Something went wrong. Please try again.",
            "sources": []
        }

# ------------------ HEALTH CHECK ------------------

@app.get("/")
def root():
    return {"message": "RAG Chatbot Backend Running!"}
