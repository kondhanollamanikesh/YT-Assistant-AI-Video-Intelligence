from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import sys

# Add parent directory to path to import existing modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm import get_llm, get_embeddings
from transcript import get_video_text, extract_video_id, get_transcript_segments
from vector_store import split_text, create_vector_store, get_retriever
from chatbot import create_rag_chain, get_response
from summary import generate_summary
from quizz import generate_quizz as generate_quiz
from keypoints import generate_key_points
from langchain_core.messages import HumanMessage, AIMessage

app = FastAPI(title="YouTube AI Assistant API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for active sessions
sessions = {}


class VideoRequest(BaseModel):
    url: str


class ChatRequest(BaseModel):
    session_id: str
    message: str


@app.get("/")
async def root():
    return {"message": "YouTube AI Assistant API"}


@app.get("/api/health")
async def health():
    return {"status": "ok", "sessions": len(sessions)}


def _fallback_segments(transcript_text: str) -> list:
    """Build approximate segments from a raw transcript string."""
    lines = [l.strip() for l in transcript_text.replace("! ", "!.\n").replace("? ", "?.\n").split("\n") if l.strip()]
    if len(lines) <= 1:
        lines = [s.strip() for s in transcript_text.split(". ") if s.strip()]
    total_words = sum(len(l.split()) for l in lines) or 1
    # Assume ~150 words per minute of speech
    seconds_per_word = 60.0 / 150.0
    elapsed = 0.0
    segments = []
    for line in lines:
        minutes, secs = divmod(int(elapsed), 60)
        segments.append({
            "time": f"{minutes}:{secs:02d}",
            "start": round(elapsed, 2),
            "text": line,
        })
        elapsed += len(line.split()) * seconds_per_word
    return segments


@app.post("/api/load-video")
def load_video(request: VideoRequest):
    video_id = extract_video_id(request.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    try:
        # Fetch transcript
        text = get_video_text(request.url)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract transcript")

        # Fetch timestamped segments (best effort)
        segments = get_transcript_segments(video_id)
        if not segments:
            segments = _fallback_segments(text)

        # Create vector store
        documents = split_text(text)
        embeddings = get_embeddings()
        vector_store = create_vector_store(documents, embeddings)
        retriever = get_retriever(vector_store)

        # Create RAG chain
        llm = get_llm()
        chain = create_rag_chain(retriever, llm)

        # Store session
        session_id = video_id
        sessions[session_id] = {
            "chain": chain,
            "chat_history": [],
            "video_url": request.url,
            "video_id": video_id,
            "transcript": text,
            "segments": segments,
        }

        return {
            "session_id": session_id,
            "video_id": video_id,
            "status": "success",
            "message": "Video loaded successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
def chat(request: ChatRequest):
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[request.session_id]

    try:
        response = get_response(
            session["chain"],
            request.message,
            list(session["chat_history"]),
        )

        session["chat_history"].append(HumanMessage(content=request.message))
        session["chat_history"].append(AIMessage(content=response))

        # Keep only last 10 messages
        if len(session["chat_history"]) > 10:
            session["chat_history"] = session["chat_history"][-10:]

        return {
            "response": response,
            "session_id": request.session_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/transcript/{session_id}")
async def get_transcript(session_id: str, search_query: Optional[str] = None):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    segments = session["segments"]

    if search_query:
        q = search_query.lower()
        segments = [
            seg for seg in segments
            if q in seg["text"].lower()
        ]

    return {
        "transcript": session["transcript"],
        "segments": segments,
        "search_query": search_query,
    }


@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    return {
        "session_id": session_id,
        "video_id": session["video_id"],
        "video_url": session["video_url"],
        "chat_history": [
            {
                "role": "user" if isinstance(msg, HumanMessage) else "assistant",
                "content": msg.content
            }
            for msg in session["chat_history"]
        ]
    }


@app.delete("/api/session/{session_id}")
async def delete_session(session_id: str):
    if session_id in sessions:
        del sessions[session_id]
    return {"status": "deleted"}


@app.get("/api/summary/{session_id}")
def get_summary(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    transcript = session["transcript"]

    try:
        llm = get_llm()
        summary_data = generate_summary(llm, transcript)

        return {
            "executive": summary_data.get("executive", ""),
            "topics": summary_data.get("topics", []),
            "objectives": summary_data.get("objectives", []),
            "readingTime": f"{max(1, len(transcript.split()) // 200 + 1)} min read"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/keypoints/{session_id}")
def get_keypoints(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    transcript = session["transcript"]

    try:
        llm = get_llm()
        points = generate_key_points(llm, transcript)
        return {"keyPoints": points}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/quiz/{session_id}")
def get_quiz(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    transcript = session["transcript"]

    try:
        llm = get_llm()
        quiz = generate_quiz(llm, transcript)
        return {"quiz": quiz}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
