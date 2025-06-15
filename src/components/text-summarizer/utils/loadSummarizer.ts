"use client";

export const loadSummarizer = async () => {
  const { pipeline } = await import("@huggingface/transformers");
  return await pipeline("summarization", "Xenova/bart-large-cnn");
};