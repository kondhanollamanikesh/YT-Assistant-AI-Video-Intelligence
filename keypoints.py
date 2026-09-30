import json
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


KEYPOINTS_PROMPT_TEMPLATE = """
You are an expert note-taker for YouTube videos. Based on the following transcript, extract the 4-6 most important key points.

Return ONLY a valid JSON array with no additional text. Each object in the array must have exactly these fields:
- "title": a short heading for the key point (max 8 words)
- "explanation": 1-2 sentence explanation of the point
- "timestamp": approximate timestamp in the video as "M:SS" or "H:MM:SS" if mentioned, otherwise ""

Example format:
[
  {{"title": "Data Preparation is Critical", "explanation": "Clean and preprocess data before training. Handle missing values and normalize features.", "timestamp": "2:15"}},
  {{"title": "Start Simple", "explanation": "Begin with simple models to establish baseline performance before iterating.", "timestamp": "5:30"}}
]

Transcript:
{transcript}

Extract the key points:"""


def generate_key_points(llm, transcript: str) -> list:
    if not transcript:
        return []

    prompt = PromptTemplate(
        template=KEYPOINTS_PROMPT_TEMPLATE,
        input_variables=["transcript"]
    )

    parser = StrOutputParser()
    chain = prompt | llm | parser

    try:
        result = chain.invoke({"transcript": transcript})

        result = result.strip()
        if result.startswith("```json"):
            result = result[7:]
        elif result.startswith("```"):
            result = result[3:]
        if result.endswith("```"):
            result = result[:-3]
        result = result.strip()

        points_data = json.loads(result)

        validated = []
        for i, item in enumerate(points_data):
            if all(k in item for k in ["title", "explanation"]):
                validated.append({
                    "id": str(i + 1),
                    "number": i + 1,
                    "title": str(item["title"]),
                    "explanation": str(item["explanation"]),
                    "timestamp": str(item.get("timestamp", "") or ""),
                })

        return validated[:6]
    except Exception as e:
        print(f"Error generating key points: {e}")
        return []
