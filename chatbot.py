from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage


PROMPT_TEMPLATE = """
You are a helpful YouTube video assistant. Answer questions based ONLY on the video transcript provided below.
If the context doesn't contain enough information, say "I don't have enough information from the video to answer this."
Keep your answers concise and relevant and also greet user appropriatly to the situation.

Context from video transcript:
{context}

Question: {question}

Answer:"""


def format_docs(retrieved_docs) -> str:
    return "\n\n".join(doc.page_content for doc in retrieved_docs)


def create_rag_chain(retriever, llm):
    prompt = PromptTemplate(
        template=PROMPT_TEMPLATE,
        input_variables=["context", "question"]
    )

    parallel_chain = RunnableParallel({
        "context": retriever | RunnableLambda(format_docs),
        "question": RunnablePassthrough()
    })

    parser = StrOutputParser()
    return parallel_chain | prompt | llm | parser


def get_response(chain, question: str, chat_history: list = None) -> str:
    if chat_history:
        history_context = "\n".join([
            f"{'User' if isinstance(msg, HumanMessage) else 'Assistant'}: {msg.content}"
            for msg in chat_history[-6:]
        ])
        enhanced_question = f"Previous conversation:\n{history_context}\n\nCurrent question: {question}"
        return chain.invoke(enhanced_question)
    return chain.invoke(question)
