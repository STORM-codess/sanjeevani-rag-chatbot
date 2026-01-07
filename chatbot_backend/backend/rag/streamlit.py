import streamlit as st
import requests
import time
import uuid

# API_URL = "http://127.0.0.1:8000/ask"

st.set_page_config(page_title="SIH RAG Chatbot", page_icon="🤖", layout="centered")

st.title("🤖 Sanjeevani Chatbot (Multilingual + Memory)")
st.write("Ask questions in **Hindi**, **English**, or **Hinglish**.")

# ------------------------------
# Unique Session ID
# ------------------------------
if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())

# ------------------------------
# Chat History
# ------------------------------
if "messages" not in st.session_state:
    st.session_state["messages"] = []

# Show previous messages
for msg in st.session_state["messages"]:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# ------------------------------
# USER INPUT (Typing Only)
# ------------------------------
user_input = st.chat_input("Type your question...")

# ------------------------------
# SEND QUERY TO BACKEND
# ------------------------------
if user_input:

    # Save and display user message
    st.session_state["messages"].append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.write(user_input)

    # Assistant response placeholder
    with st.chat_message("assistant"):
        placeholder = st.empty()
        bot_msg = ""

        try:
            payload = {
                "session_id": st.session_state["session_id"],
                "question": user_input
            }

            response = requests.post(API_URL, json=payload)

            if response.status_code == 200:
                answer = response.json().get("answer", "")

                # Typing animation
                for ch in answer:
                    bot_msg += ch
                    placeholder.write(bot_msg)
                    time.sleep(0.01)

                # Save bot reply
                st.session_state["messages"].append(
                    {"role": "assistant", "content": answer}
                )

            else:
                placeholder.write(f"⚠ Backend Error: {response.text}")

        except Exception as e:
            placeholder.write(f"❌ Error: {str(e)}")
