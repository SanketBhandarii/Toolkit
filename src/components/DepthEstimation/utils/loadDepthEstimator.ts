// utils/loadDepthEstimator.ts
"use client";

export const loadDepthEstimator = async () => {
  const { pipeline } = await import("@huggingface/transformers");
  return await pipeline(
    "depth-estimation",
    "onnx-community/depth-anything-v2-large"
  );
};
