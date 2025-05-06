export async function getSpeech(text: string, voice: string) {
  const { KokoroTTS } = await import("kokoro-js");

  const model_id = "onnx-community/Kokoro-82M-ONNX";
  const tts = await KokoroTTS.from_pretrained(model_id, {
    dtype: "q8",
    
  });

  const audio = await tts.generate(text, {
    voice: voice === "US-Male" ? "am_adam" : "af_heart",
  });

  return audio;
}
