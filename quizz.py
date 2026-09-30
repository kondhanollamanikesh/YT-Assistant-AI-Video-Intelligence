import json
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


QUIZ_PROMPT_TEMPLATE = """
You are a helpful YouTube video assistant. Create a multiple-choice quiz for the following video transcript.

Return ONLY a valid JSON array with no extra text and no markdown code fences.
Each element of the array must have exactly these fields:
- "question": the question text
- "options": a JSON array of exactly 4 answer strings
- "correctAnswer": an integer index (0-3) pointing at the correct option in "options"
- "explanation": one sentence explaining why that answer is correct

Example format:
[{{"question": "How many neurons are in the input layer?", "options": ["10", "16", "784", "28"], "correctAnswer": 2, "explanation": "Each of the 784 pixels becomes one input neuron."}}]

Generate 5 questions covering the most important ideas in the transcript.

Transcript:
{transcript}

JSON array:"""


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


def generate_quizz(llm, transcript: str) -> list:
    if not transcript:
        return []

    prompt = PromptTemplate(
        template=QUIZ_PROMPT_TEMPLATE,
        input_variables=["transcript"]
    )

    parser = StrOutputParser()
    chain = prompt | llm | parser

    raw = chain.invoke({"transcript": transcript})

    try:
        items = json.loads(_extract_json(raw))
    except (json.JSONDecodeError, TypeError):
        print("Error generating quiz: model did not return valid JSON")
        return []

    if isinstance(items, dict):
        items = items.get("quiz") or items.get("questions") or []

    quiz = []
    for item in items:
        if not isinstance(item, dict):
            continue
        options = item.get("options")
        correct = item.get("correctAnswer")
        if not isinstance(options, (list, str)) or not item.get("question"):
            continue
        if isinstance(options, str):
            options = [options]
        options = [str(o) for o in options]
        if not (0 <= len(options) <= 4):
            options = options[:4]
        if len(options) < 2:
            continue
        try:
            correct = int(correct)
        except (TypeError, ValueError):
            correct = 0
        if not 0 <= correct < len(options):
            correct = 0
        quiz.append({
            "id": str(len(quiz) + 1),
            "question": str(item["question"]),
            "options": options,
            "correctAnswer": correct,
            "explanation": str(item.get("explanation") or ""),
        })

    return quiz[:10]
