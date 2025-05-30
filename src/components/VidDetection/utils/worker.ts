import { Pipeline, pipeline } from "@huggingface/transformers";

let detector: Pipeline | null = null; // Explicit type to avoid complex union type error

self.onmessage = async (event) => {
  const { type, data } = event.data;

  if (type === "init") {
    try {
      const pipe = await pipeline("object-detection", "Xenova/yolos-tiny");
      detector = pipe as Pipeline;
      self.postMessage({ type: "ready" });
    } catch (error) {
      console.error("Model error:", error); 
    }
  }

  if (type === "detect" && detector && data) {
    try {
      const url = URL.createObjectURL(data);
      const results = await detector(url);
      URL.revokeObjectURL(url);

      const detections = results
        .filter((d: { score: number }) => d.score > 0.3)
        .slice(0, 5)
        .map((d: { label: string; score: number; box: { xmin: number; ymin: number; xmax: number; ymax: number } }) => ({
          label: d.label,
          score: d.score,
          box: d.box,
        }));

      self.postMessage({ type: "result", result: detections });
    } catch (error) {
      console.error("Detection error:", error);
    }
  }
};