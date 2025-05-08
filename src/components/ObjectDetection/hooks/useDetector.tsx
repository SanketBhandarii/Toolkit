import { useState, useCallback } from "react";
import { useWorker } from "./useWorker";

type Detection = {
  bbox: [number, number, number, number];
  label: string;
  score: number;
};

type DetectorMessage = {
  status: "initiate" | "progress" | "ready" | "complete";
  progress?: number;
  result?: Detection[];
};

export function useDetector() {
  const [result, setResult] = useState<Detection[] | null>(null);
  const [ready, setReady] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const worker = useWorker((e: MessageEvent<DetectorMessage>) => {
    const { status, progress, result } = e.data;

    if (status === "initiate") {
      setStatus("initiate");
      setReady(false);
    } else if (status === "progress") {
      setStatus("progress");
      setProgress(progress ?? 0);
    } else if (status === "ready") {
      setStatus("ready");
      setReady(true);
    } else if (status === "complete") {
      setStatus("complete");
      setResult(result ?? []);
    }
  });

  const start = useCallback(
    (image: string | ArrayBuffer | null) => {
      if (worker) worker.postMessage({ image });
    },
    [worker]
  );

  return { result, setResult, ready, progress, status, setStatus, start };
}
