import { loadSummarizer } from "./loadSummarizer";

let summarizer = null;

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "LOAD_MODEL":
      try {
        [30, 60, 90].forEach((val, i) => {
          setTimeout(() => {
            self.postMessage({
              type: "PROGRESS",
              payload: val,
            });
          }, (i + 1) * 500);
        });

        summarizer = await loadSummarizer();
        self.postMessage({ type: "PROGRESS", payload: 100 });
        self.postMessage({ type: "MODEL_LOADED" });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          payload: error instanceof Error ? error.message : String(error),
        });
      }
      break;

    case "SUMMARIZE_TEXT":
      try {
        if (!summarizer) throw new Error("Model not loaded");
        const text = payload.trim();

        if (text.length < 100) {
          self.postMessage({
            type: "ERROR",
            payload: "Text too short (min 100 chars)",
          });
          return;
        }

        const options = {
          max_length: 200,
          do_sample: false,
        };

        const result = await summarizer(text, options);

        self.postMessage({
          type: "SUMMARY_RESULT",
          payload: result[0].summary_text,
        });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          payload: error instanceof Error ? error.message : String(error),
        });
      }
      break;
  }
};
