import { loadSummarizer } from "./loadSummarizer";

let summarizer = null;

self.onmessage = async (event) => {
  const { status, payload } = event.data;

  if (status === "LOAD_MODEL") {
    try {
      summarizer = await loadSummarizer();
      self.postMessage({ status: "MODEL_LOADED" });
    } catch (error) {
      self.postMessage({
        status: "ERROR",
        summary: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (status === "SUMMARIZE_TEXT") {
    try {
      if (!summarizer) throw new Error("Model not loaded");
      if (!payload) throw new Error("No text provided");

      const result =
        (payload.trim(),
        {
          max_length: 150,
          min_length: 50,
          do_sample: false,
        });
      self.postMessage({
        status: "SUMMARY_RESULT",
        summary: result[0].summary_text,
      });
    } catch (error) {
      self.postMessage({
        status: "ERROR",
        summary: error instanceof Error ? error.message : String(error),
      });
    }
  }
};
