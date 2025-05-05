import { KokoroTTS } from "kokoro-js";

const model_id = "onnx-community/Kokoro-82M-ONNX";
const tts = await KokoroTTS.from_pretrained(model_id, {
  dtype: "q8",
});

export async function getSpeech(text: string, voice: string) {
  try {
    const audio = await tts.generate(text, {
      voice: voice == "US-Male" ? "am_adam" : "af_heart",
    });
    return audio;
  } catch (error) {
    console.error("Error in getSpeech:", error);
    throw error;
  }
}
