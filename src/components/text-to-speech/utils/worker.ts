import { KokoroTTS } from "kokoro-js";
import WavEncoder from "wav-encoder";

let tts: KokoroTTS | null = null;
const cache = new Map<string, { audio: Float32Array; sampling_rate: number }>();

self.onmessage = async ({ data }: MessageEvent) => {
  try {
    switch (data.type) {
      case "LOAD_MODEL":
        if (!tts) {
          tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-ONNX", { dtype: "q8" });
        }
        self.postMessage({ type: "MODEL_LOADED" });
        return;

      case "GENERATE_SPEECH":
        if (!tts) throw new Error("Model not loaded");

        const { text, voice } = data.payload;
        const key = `${text}_${voice}`;
        const result = cache.get(key) ?? (await tts.generate(text, { voice }));
        if (!cache.has(key)) cache.set(key, result);

        const wavBuffer = await WavEncoder.encode({
          sampleRate: result.sampling_rate,
          channelData: [result.audio],
        });

        self.postMessage(
          {
            type: "SPEECH_RESULT",
            audio: result.audio,
            sampling_rate: result.sampling_rate,
            wavBuffer,
          },
          [wavBuffer] // use Transferable for performance
        );
        return;
    }
  } catch (e: any) {
    self.postMessage({ type: "ERROR", message: e?.message ?? "Unknown error" });
  }
};
