import os
import re
import yt_dlp
import whisper
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from deep_translator import GoogleTranslator


def extract_video_id(url: str) -> str:
    patterns = [
        r'(?:v=|/v/|youtu\.be/)([a-zA-Z0-9_-]{11})',
        r'(?:embed/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_transcript(video_id: str) -> str:
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id, languages=["en"])
        return " ".join(snippet.text for snippet in transcript)
    except NoTranscriptFound:
        try:
            transcript_list = ytt_api.list(video_id)
            for t in transcript_list:
                if t.language_code in ["hi", "te", "ta", "bn", "mr", "gu", "kn", "ml", "pa"]:
                    transcript = ytt_api.fetch(video_id, languages=[t.language_code])
                    text = " ".join(snippet.text for snippet in transcript)
                    return translate_to_english(text)
            return None
        except Exception:
            return None
    except TranscriptsDisabled:
        return None
    except Exception:
        return None


def translate_to_english(text: str) -> str:
    try:
        chunks = [text[i:i+4500] for i in range(0, len(text), 4500)]
        translated_chunks = []
        for chunk in chunks:
            translated = GoogleTranslator(source='auto', target='en').translate(chunk)
            translated_chunks.append(translated)
        return " ".join(translated_chunks)
    except Exception:
        return text


def download_audio(video_url: str, output_path: str = "audio") -> str:
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': output_path,
        'quiet': True,
        'no_warnings': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
    return f"{output_path}.mp3"


def transcribe_with_whisper(audio_path: str) -> str:
    model = whisper.load_model("base")
    result = model.transcribe(audio_path, task="translate")
    return result["text"]


def format_timestamp(seconds: float) -> str:
    seconds = int(float(seconds))
    minutes, secs = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    if hours > 0:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"


def get_transcript_segments(video_id: str) -> list:
    """Return transcript as [{time, text}] with real timestamps when available."""
    segments = []
    try:
        ytt_api = YouTubeTranscriptApi()
        try:
            fetched = ytt_api.fetch(video_id, languages=["en"])
            for snippet in fetched:
                segments.append({
                    "time": format_timestamp(snippet.start),
                    "start": float(snippet.start),
                    "text": snippet.text.replace("\n", " ").strip(),
                })
            return segments
        except NoTranscriptFound:
            transcript_list = ytt_api.list(video_id)
            for t in transcript_list:
                if t.language_code in ["hi", "te", "ta", "bn", "mr", "gu", "kn", "ml", "pa"]:
                    fetched = ytt_api.fetch(video_id, languages=[t.language_code])
                    for snippet in fetched:
                        segments.append({
                            "time": format_timestamp(snippet.start),
                            "start": float(snippet.start),
                            "text": snippet.text.replace("\n", " ").strip(),
                        })
                    # Translate each segment back to English
                    translated = []
                    for seg in segments:
                        eng = translate_to_english(seg["text"])
                        translated.append({**seg, "text": eng})
                    return translated
            return []
    except Exception:
        return []


def get_video_text(video_url: str) -> str:
    video_id = extract_video_id(video_url)
    if not video_id:
        raise ValueError("Invalid YouTube URL")

    print(f"Fetching transcript for video: {video_id}")
    transcript = get_transcript(video_id)

    if transcript:
        print("Transcript found!")
        return transcript

    print("No transcript available. Falling back to Whisper...")
    audio_path = download_audio(video_url)
    text = transcribe_with_whisper(audio_path)

    if os.path.exists(audio_path):
        os.remove(audio_path)

    return text
