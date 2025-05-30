'use client'
import { useEffect, useRef, useState } from "react";

interface Detection {
  label: string;
  score: number;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
}

export default function LiveDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [processing, setProcessing] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL("./utils/worker.ts", import.meta.url));

    worker.onmessage = (e) => {
      const { type, result } = e.data;

      if (type === "ready") setLoading(false);
      if (type === "result") {
        if (result && result.length > 0) setHasResult(true);
        setDetections(result || []);
        setProcessing(false);
      }
    };

    worker.postMessage({ type: "init" });
    workerRef.current = worker;

    return () => worker.terminate();
  }, []);

  const start = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    videoRef.current.onloadedmetadata = () => {
      if (!videoRef.current || !canvasRef.current) return;
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      setStreaming(true);
      detectLoop();
    };

    await videoRef.current.play();
  };

  const detectLoop = () => {
    if (processing) {
      setTimeout(detectLoop, 1000);
      return;
    }

    setProcessing(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !videoRef.current) return;

    canvas.width = 640;
    canvas.height = 480;
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);

    canvas.toBlob((blob) => {
      if (workerRef.current && blob) {
        workerRef.current.postMessage({ type: "detect", data: blob });
      }
    });

    setTimeout(detectLoop, 2000);
  };

  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const draw = () => {
      if (!streaming) return;

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !videoRef.current) return;

      ctx.drawImage(videoRef.current, 0, 0);

      ctx.strokeStyle = "#0f0";
      ctx.fillStyle = "#0f0";
      ctx.font = "16px Arial";
      ctx.lineWidth = 2;

      detections.forEach(({ label, score, box }) => {
        const x = box.xmin * ctx.canvas.width;
        const y = box.ymin * ctx.canvas.height;
        const w = (box.xmax - box.xmin) * ctx.canvas.width;
        const h = (box.ymax - box.ymin) * ctx.canvas.height;

        ctx.strokeRect(x, y, w, h);
        ctx.fillText(`${label} ${Math.round(score * 100)}%`, x, y - 5);
      });

      requestAnimationFrame(draw);
    };

    if (streaming) draw();
  }, [streaming, detections]);

  const stop = () => {
    const video = videoRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setStreaming(false);
    setDetections([]);
    setHasResult(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 min-h-screen">
      <h1 className="text-2xl text-white text-center mb-4">Object Detection</h1>

      <div className="relative bg-black rounded mb-4">
        <video ref={videoRef} className="w-full" autoPlay muted />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-blue-400">Loading...</p>
        </div>
      ) : (
        <div className="flex gap-4 justify-center mb-4">
          <button onClick={start} disabled={streaming} className="px-6 py-2 bg-green-600 text-white rounded">
            {streaming ? "Running" : "Start"}
          </button>
          <button onClick={stop} disabled={!streaming} className="px-6 py-2 bg-red-600 text-white rounded">
            Stop
          </button>
        </div>
      )}

      {streaming && (
        <div className="bg-gray-800 rounded p-4">
          {!hasResult && processing ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-green-400">Processing...</span>
            </div>
          ) : detections.length > 0 ? (
            <div className="space-y-2">
              {detections.map((d, i) => (
                <div key={i} className="flex justify-between bg-gray-700 rounded p-2">
                  <span className="text-white">{d.label}</span>
                  <span className="text-green-400">{Math.round(d.score * 100)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-yellow-400">Scanning...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
