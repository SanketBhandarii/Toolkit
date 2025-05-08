import {
  pipeline,
  env,
  PipelineType,
  ProgressCallback,
} from "@huggingface/transformers";

env.allowLocalModels = false;

class Pipeline {
  static task: PipelineType = "object-detection";
  static model = "Xenova/detr-resnet-50";
  static instance: any = null;

  static async getInstance(progress_callback?: ProgressCallback) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (event: MessageEvent<{ image: any }>) => {
  const detector = await Pipeline.getInstance((x) => {
    self.postMessage(x);
  });

  const result = await detector(event.data.image, { percentage: true });
  self.postMessage({ status: "complete", result });
});
