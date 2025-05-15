import { loadDepthEstimator } from "./loadDepthEstimator";

// Define a type for the depth estimation result
type DepthData = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

// Define a type for the depth estimator function
type DepthEstimator = (image: string) => Promise<{ depth: DepthData }>;

// Define the message types
type WorkerRequest =
  | { type: "LOAD_MODEL"; payload: null }
  | { type: "PROCESS_IMAGE"; payload: string };

type WorkerResponse =
  | { type: "PROGRESS"; payload: number }
  | { type: "MODEL_LOADED" }
  | { type: "RESULT"; payload: DepthData }
  | { type: "ERROR"; payload: string };

let depthEstimator: DepthEstimator | null = null;

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { type, payload } = event.data;

  switch (type) {
    case "LOAD_MODEL":
      try {
        const progressIntervals = [30, 50, 75];
        progressIntervals.forEach((progress, index) => {
          setTimeout(() => {
            self.postMessage({
              type: "PROGRESS",
              payload: progress,
            } satisfies WorkerResponse);
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
