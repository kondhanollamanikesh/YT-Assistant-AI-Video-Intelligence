import streamlit as st
from langchain_core.messages import HumanMessage, AIMessage
from llm import get_llm, get_embeddings
from transcript import get_video_text, extract_video_id
from vector_store import split_text, create_vector_store, get_retriever
from chatbot import create_rag_chain, get_response


st.set_page_config(page_title="YouTube AI Assistant", page_icon="🎬", layout="wide")
st.title("YouTube AI Assistant")

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "chain" not in st.session_state:
    st.session_state.chain = None
if "video_loaded" not in st.session_state:
    st.session_state.video_loaded = False

with st.sidebar:
    st.header("Video Settings")
    video_url = st.text_input("YouTube Video URL", placeholder="https://youtube.com/watch?v=...")

    if st.button("Load Video", type="primary"):
        if video_url:
            video_id = extract_video_id(video_url)
            if video_id:
                with st.spinner("Processing video..."):
                    try:
                        text = get_video_text(video_url)
                        if text:
                            documents = split_text(text)
                            embeddings = get_embeddings()
                            vector_store = create_vector_store(documents, embeddings)
                            retriever = get_retriever(vector_store)
                            llm = get_llm()
                            st.session_state.chain = create_rag_chain(retriever, llm)
                            st.session_state.video_loaded = True
                            st.session_state.chat_history = []
                            st.success("Video loaded successfully!")
                            st.video(video_url)
                        else:
                            st.error("Could not extract transcript from video.")
                    except Exception as e:
                        st.error(f"Error: {str(e)}")
            else:
                st.error("Invalid YouTube URL")
        else:
            st.warning("Please enter a video URL")

    st.divider()
    if st.button("Clear Chat"):
        st.session_state.chat_history = []
        st.rerun()

if st.session_state.video_loaded:
    for message in st.session_state.chat_history:
        with st.chat_message(message.type):
            st.write(message.content)

    if question := st.chat_input("Ask anything about the video..."):
        with st.chat_message("user"):
            st.write(question)
        st.session_state.chat_history.append(HumanMessage(content=question))

        with st.spinner("Thinking..."):
            response = get_response(
                st.session_state.chain,
                question,
                st.session_state.chat_history[:-1]
            )

        with st.chat_message("assistant"):
            st.write(response)
        st.session_state.chat_history.append(AIMessage(content=response))
else:
    st.info("Enter a YouTube video URL in the sidebar to get started!")
