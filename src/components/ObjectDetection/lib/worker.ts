import {
  pipeline,
  env,
  PipelineType,
  ProgressCallback,
  ObjectDetectionPipeline,
  ObjectDetectionPipelineOutput,
} from "@huggingface/transformers";

env.allowLocalModels = false;

interface WorkerMessageData {
  image?: string | ArrayBuffer | null;
  initialize?: boolean;
}

interface WorkerResponse {
  status: "initiate" | "progress" | "ready" | "complete";
  progress?: number;
  result?: ObjectDetectionPipelineOutput[];
}

class Pipeline {
  static task: PipelineType = "object-detection";
  static model = "Xenova/detr-resnet-50";
  static instance: ObjectDetectionPipeline | null = null;

  static async getInstance(progress_callback?: ProgressCallback) {
    if (this.instance === null) {
      // Signal initiation first
      self.postMessage({ status: "initiate" } as WorkerResponse);

      const pipelineInstance = await pipeline(this.task, this.model, {
        progress_callback,
      });
      this.instance = pipelineInstance as ObjectDetectionPipeline;

      // Signal ready when model is loaded
      self.postMessage({ status: "ready" } as WorkerResponse);
    }
    return this.instance;
  }
}

self.addEventListener(
  "message",
  async (event: MessageEvent<WorkerMessageData>) => {
    try {
      // If initialization message was received
      if (event.data.initialize) {
        await Pipeline.getInstance((progressData) => {
          self.postMessage(progressData);
        });
        return;
      }

      // Process image if one was sent
      if (event.data.image) {
        const detector = await Pipeline.getInstance();
        const result = await detector(event.data.image as string, {
          percentage: true,
        });
        self.postMessage({ status: "complete", result });
      }
    } catch (error) {
      console.error("Worker error:", error);
    }
  }
);
