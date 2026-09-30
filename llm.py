import os
from dotenv import load_dotenv
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings

load_dotenv()


def get_llm():
    return ChatNVIDIA(
        model="nvidia/nemotron-3-super-120b-a12b",
        api_key=os.getenv("NVIDIA_API_KEY"),
        temperature=1,
        top_p=1,
        max_completion_tokens=4096,
        timeout=300
    )


def get_embeddings():
    return NVIDIAEmbeddings(
        model="nvidia/nemotron-3-embed-1b",
        api_key=os.getenv("NVIDIA_API_KEY")
    )