// app/utils/segmenter.worker.ts
import { loadSegmenter } from "./loadModel";

let segmenter: Awaited<ReturnType<typeof loadSegmenter>> | null = null;

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case "LOAD_MODEL":
        [30, 60, 90].forEach((val, i) =>
          setTimeout(() => {
            self.postMessage({ type: "PROGRESS", payload: val });
          }, (i + 1) * 500)
        );
        segmenter = await loadSegmenter();
        self.postMessage({ type: "PROGRESS", payload: 100 });
        self.postMessage({ type: "MODEL_LOADED" });
        break;

      case "SEGMENT_IMAGE":
        if (!segmenter) throw new Error("Model not loaded");

        // payload should be an object with imageUrl
        const imageUrl = payload.imageUrl;
        const segmentation = await segmenter(imageUrl);
        self.postMessage({ type: "SEGMENT_RESULT", payload: segmentation });
        break;
    }
  } catch (err) {
    self.postMessage({
      type: "ERROR",
      payload: err instanceof Error ? err.message : String(err),
    });
  }
};

export {};
