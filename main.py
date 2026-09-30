from llm import get_llm, get_embeddings
from transcript import get_video_text, extract_video_id
from vector_store import split_text, create_vector_store, get_retriever
from chatbot import create_rag_chain, get_response
from langchain_core.messages import HumanMessage, AIMessage


def main():
    video_url = input("Enter YouTube video URL: ").strip()
    video_id = extract_video_id(video_url)

    if not video_id:
        print("Invalid YouTube URL")
        return

    print(f"\nProcessing video: {video_id}")
    print("-" * 50)

    print("Fetching transcript...")
    text = get_video_text(video_url)
    if not text:
        print("Could not extract transcript")
        return

    print("Creating vector store...")
    documents = split_text(text)
    embeddings = get_embeddings()
    vector_store = create_vector_store(documents, embeddings)
    retriever = get_retriever(vector_store)

    print("Initializing chatbot...")
    llm = get_llm()
    chain = create_rag_chain(retriever, llm)

    print("\nChatbot ready! Type 'quit' to exit.")
    print("-" * 50)

    chat_history = []

    while True:
        question = input("\nYou: ").strip()
        if question.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        if not question:
            continue

        response = get_response(chain, question, chat_history)
        print(f"\nAssistant: {response}")

        chat_history.append(HumanMessage(content=question))
        chat_history.append(AIMessage(content=response))

        if len(chat_history) > 10:
            chat_history = chat_history[-10:]


if __name__ == "__main__":
    main()
