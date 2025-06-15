import { Pipeline } from "@xenova/transformers";

let model: any | null = null;

self.onmessage = async (e) => {
  try {
    if (e.data.type === "LOAD") {
      const { pipeline } = await import("@huggingface/transformers");
      model = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-base.en"
      );
      self.postMessage({ type: "LOADED" });
    }
    if (e.data.type === "TRANSCRIBE") {
      if (!model) throw new Error("Model not loaded yet");
      const result = await model(e.data.audio);
      self.postMessage({ type: "RESULT", text: result.text });
    }
  } catch (err: any) {
    self.postMessage({ type: "ERROR", error: err.message });
  }
};
