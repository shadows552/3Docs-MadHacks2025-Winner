import requests
import hashlib
import os

API_URL = "https://api.fish.audio/v1/tts"


def compute_pdf_hash(pdf_path):
    """Return a short SHA1 hash based on the PDF content."""
    sha1 = hashlib.sha1()
    with open(pdf_path, "rb") as f:
        sha1.update(f.read())

    return sha1.hexdigest()[:12]  # shorten for readability


def tts(text, pdf_path, step_number, voice_id="zh_CN-female-1"):
    api_key = os.getenv("FISH_AUDIO_API_KEY")
    if not api_key:
        raise ValueError("FISH_AUDIO_API_KEY environment variable is not set")

    # 🔥 output format: <hash>-<step>.mp3
    file_hash = compute_pdf_hash(pdf_path)
    output_file = f"{file_hash}-{step_number}.mp3"

    payload = {
        "text": text,
        "model": "fish-speech-1",
        "voice": voice_id,
        "format": "mp3"
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    response = requests.post(API_URL, json=payload, headers=headers)

    if response.status_code != 200:
        error_text = response.text.lower()
        if "voice" in error_text:
            raise ValueError(f"Invalid voice ID: {voice_id}")
        raise RuntimeError(
            f"API Error ({response.status_code}): {response.text}"
        )

    # Write output MP3
    with open(output_file, "wb") as f:
        f.write(response.content)

    print(f"Audio saved to {output_file}")
    return output_file


def tts_from_file(input_text_file, pdf_path, step_number, voice_id="zh_CN-female-1"):
    with open(input_text_file, "r", encoding="utf-8") as f:
        text = f.read().strip()

    return tts(text, pdf_path, step_number, voice_id)
