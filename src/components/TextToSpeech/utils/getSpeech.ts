let tts: any;
let modelLoading: Promise<any> | null = null;

const audioCache = new Map();

async function loadModel() {
  if (tts) return tts;

  if (!modelLoading) {
    modelLoading = import("kokoro-js").then(async ({ KokoroTTS }) => {
      const model = await KokoroTTS.from_pretrained(
        "onnx-community/Kokoro-82M-ONNX",
        { dtype: "q8" }
      );
      tts = model;
      return model;
    });
  }

  return modelLoading;
}

export async function getSpeech(text: string, voice: string) {
  const cacheKey = `${text}_${voice}`;
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey);

  const tts = await loadModel();

  const audio = await tts.generate(text, {
    voice: voice === "US-Male" ? "am_adam" : "af_heart",
  });

  audioCache.set(cacheKey, audio);
  return audio;
}

export { loadModel };
