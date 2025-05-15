"use client";

export const loadUpscaler = async (factor: "2x" | "3x") => {
  const { pipeline } = await import("@huggingface/transformers");

  let modelId = "Xenova/swin2SR-compressed-sr-x4-48"; // default

  if (factor === "2x") {
    modelId = "Xenova/swin2SR-classical-sr-x2-64";
  } else if (factor === "3x") {
    // No true "3x" model exists, but this can be a workaround
    modelId = "Xenova/swin2SR-compressed-sr-x4-48"; // fallback to 4x
  }

  return await pipeline("image-to-image", modelId);
};
