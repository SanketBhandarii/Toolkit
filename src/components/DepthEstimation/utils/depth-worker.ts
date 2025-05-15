import { loadDepthEstimator } from "./loadDepthEstimator";

// Define a type for the depth estimator function
type DepthEstimator = (image: string) => Promise<{
  depth: {
    data: Uint8ClampedArray;
    width: number;
    height: number;
  };
}>;

let depthEstimator: DepthEstimator | null = null;

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data as {
    type: "LOAD_MODEL" | "PROCESS_IMAGE";
    payload: any;
  };

  switch (type) {
    case "LOAD_MODEL":
      try {
        self.postMessage({ type: "PROGRESS", payload: 100 });

        const progressIntervals = [30, 50, 75];
        progressIntervals.forEach((progress, index) => {
          setTimeout(() => {
            self.postMessage({ type: "PROGRESS", payload: progress });
          }, (index + 1) * 800);
        });

        const pipeline = await loadDepthEstimator();
        depthEstimator = pipeline as DepthEstimator;

        self.postMessage({ type: "PROGRESS", payload: 100 });
        self.postMessage({ type: "MODEL_LOADED" });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          payload: error instanceof Error ? error.message : String(error),
        });
      }
      break;

    case "PROCESS_IMAGE":
      try {
        if (!depthEstimator) {
          throw new Error("Model not loaded");
        }

        const output = await depthEstimator(payload);
        self.postMessage({ type: "RESULT", payload: output.depth });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          payload: error instanceof Error ? error.message : String(error),
        });
      }
      break;
  }
};
