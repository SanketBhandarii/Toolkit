import { rawImageToDataURL } from "../utils/rawImageToDataUrl";

export function runUpscaleWorker(
  imageUrl: string,
  factor: "2x" | "3x"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../utils/upscale.worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    worker.onmessage = (event) => {
      const { success, result, error } = event.data;

      if (success) {
        try {
          // ✅ Convert raw image result to data URL on main thread
          const dataUrl = rawImageToDataURL(result);
          resolve(dataUrl);
        } catch (err) {
          reject(new Error("Failed to convert image to data URL: " + err));
        }
      } else {
        console.log("ASDFASDF", error);

        reject(new Error(error));
      }

      worker.terminate();
    };

    worker.onerror = (err) => {
      console.error("Worker error:", err);
      reject(err);
      worker.terminate();
    };

    worker.postMessage({ imageUrl, factor });
  });
}
