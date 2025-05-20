// app/utils/loadModel.ts
"use client";

import { pipeline } from "@huggingface/transformers";

export const loadSegmenter = async () => {
  // Using the YOLO segmentation model
  return await pipeline("image-segmentation", "wuchendi/MODNet");
};
