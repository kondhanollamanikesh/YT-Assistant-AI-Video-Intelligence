import json
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


SUMMARY_PROMPT_TEMPLATE = """
You are a helpful YouTube video assistant. Provide a concise and comprehensive summary of the following video transcript.
Include the main topics discussed, key points, and any important conclusions.

Return ONLY a valid JSON object with no extra text and no markdown code fences.
The object must have exactly these fields:
- "executive": a 3-5 sentence executive summary as plain text (no markdown headings or bullet symbols)
- "topics": a JSON array of 4-8 short strings naming the main topics covered
- "objectives": a JSON array of 3-6 short strings describing what a viewer learns from this video

Example format:
{{"executive": "This video introduces the structure of a simple neural network used to recognize handwritten digits.", "topics": ["Neural networks", "Digit recognition", "Hidden layers"], "objectives": ["Describe the layers of a simple neural network"]}}

Transcript:
{transcript}

JSON object:"""


def _extract_json(text: str) -> str:
    """Strip markdown fences and isolate the JSON payload."""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.lstrip().startswith("json"):
            text = text.lstrip()[4:]
    text = text.strip()
    start = min([i for i in (text.find("{"), text.find("[")) if i != -1], default=0)
    return text[start:].strip()


def generate_summary(llm, transcript: str) -> dict:
    if not transcript:
        return {"executive": "No transcript available to summarize.", "topics": [], "objectives": []}

    prompt = PromptTemplate(
        template=SUMMARY_PROMPT_TEMPLATE,
        input_variables=["transcript"]
    )

    parser = StrOutputParser()
    chain = prompt | llm | parser

    raw = chain.invoke({"transcript": transcript})

    try:
        data = json.loads(_extract_json(raw))
        executive = str(data.get("executive") or raw).strip()
        topics = [str(t) for t in (data.get("topics") or [])]
        objectives = [str(o) for o in (data.get("objectives") or [])]
    except (json.JSONDecodeError, AttributeError, TypeError):
        executive = str(raw).strip()
        topics = []
        objectives = []

    return {"executive": executive, "topics": topics, "objectives": objectives}
