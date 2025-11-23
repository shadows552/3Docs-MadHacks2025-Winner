from tts import tts
import asyncio

async def test_basic():
    print("Running basic TTS test...")

    try:
        output_file = await tts("Hello, world!", "test_hash", 1, output_dir="volume", voice_id="60bd8f0f5bbc462a8fa1686dd81af336")
        print("TTS generated successfully:", output_file)
    except Exception as e:
        print("Test failed:", e)


if __name__ == "__main__":
    asyncio.run(test_basic())