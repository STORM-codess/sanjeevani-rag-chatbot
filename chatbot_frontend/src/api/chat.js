const API = import.meta.env.VITE_API_URL;

// persistent session id
let sessionId = localStorage.getItem("session_id");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("session_id", sessionId);
}

export async function sendMessage(message) {
  const res = await fetch(`${API}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,   // ✅ REQUIRED
      question: message,       // ✅ REQUIRED
    }),
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }

  return res.json();
}
