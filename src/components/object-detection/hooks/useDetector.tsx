import { useState, useCallback } from "react";
import { useWorker } from "./useWorker";

export type Detection = {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
};

type DetectorMessage = {
  status: "initiate" | "progress" | "ready" | "complete";
  progress?: number;
  result?: Detection[];
};

export function useDetector() {
  const [result, setResult] = useState<Detection[] | null>(null);
  const [ready, setReady] = useState<boolean>(false);
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

  const initialize = useCallback(() => {
    if (worker) worker.postMessage({ initialize: true });
  }, [worker]);

  return {
    result,
    setResult,
    ready,
    progress,
    status,
    setStatus,
    start,
    initialize,
  };
}
