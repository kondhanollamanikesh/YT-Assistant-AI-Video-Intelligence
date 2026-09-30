import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_core.documents import Document


def split_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> list:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    return splitter.create_documents([text])


def create_vector_store(documents: list, embeddings, save_path: str = "faiss_index") -> FAISS:
    vector_store = FAISS.from_documents(documents, embeddings)
    vector_store.save_local(save_path)
    return vector_store


def load_vector_store(save_path: str = "faiss_index", embeddings=None) -> FAISS:
    if os.path.exists(save_path) and embeddings:
        return FAISS.load_local(save_path, embeddings, allow_dangerous_deserialization=True)
    return None


def get_retriever(vector_store: FAISS, k: int = 4):
    return vector_store.as_retriever(search_type="similarity", search_kwargs={"k": k})
