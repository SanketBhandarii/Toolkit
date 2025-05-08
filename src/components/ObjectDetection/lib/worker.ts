import {
  pipeline,
  env,
  PipelineType,
  ProgressCallback,
  ObjectDetectionPipeline,
} from "@huggingface/transformers";

env.allowLocalModels = false;

class Pipeline {
  static task: PipelineType = "object-detection";
  static model = "Xenova/detr-resnet-50";
  static instance: ObjectDetectionPipeline | null = null;

  static async getInstance(progress_callback?: ProgressCallback) {
    if (this.instance === null) {
      const pipelineInstance = await pipeline(this.task, this.model, {
        progress_callback,
      });
      this.instance = pipelineInstance as ObjectDetectionPipeline;
    }
    return this.instance;
  }
}

self.addEventListener(
  "message",
  async (event: MessageEvent<{ image: string | ArrayBuffer | null }>) => {
    const detector = await Pipeline.getInstance((x) => {
      self.postMessage(x);
    });

    const result = await detector(event.data.image as string, {
      percentage: true,
    });
    self.postMessage({ status: "complete", result });
  }
);
