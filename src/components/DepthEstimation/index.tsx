"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { DepthMapViewer } from "./DepthMapViewer";
import { Loader2 } from "lucide-react";

export const DepthEstimatorController = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [depthUrl, setDepthUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker(new URL('./utils/depth-worker.ts', import.meta.url));
      
      workerRef.current.onmessage = (event) => {
        const { type, payload } = event.data;
        
        switch (type) {
          case 'PROGRESS':
            setLoadingProgress(payload);
            break;
          case 'MODEL_LOADED':
            setModelLoading(false);
            break;
          case 'RESULT':
            processDepthResult(payload);
            break;
          case 'ERROR':
            setErrorMessage(payload);
            setModelLoading(false);
            setLoading(false);
            break;
        }
      };
      
      workerRef.current.postMessage({ type: 'LOAD_MODEL' });
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processDepthResult = (raw: { data: Uint8ClampedArray; width: number; height: number }) => {
    try {
      const depthData = raw.data;
      const width = raw.width;
      const height = raw.height;

      if (typeof width !== "number" || typeof height !== "number") {
        throw new Error("Invalid depth map dimensions");
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context is null");

      const imageData = ctx.createImageData(width, height);

      for (let i = 0; i < depthData.length; i++) {
        const val = depthData[i];
        imageData.data[i * 4 + 0] = val;
        imageData.data[i * 4 + 1] = val;
        imageData.data[i * 4 + 2] = val;
        imageData.data[i * 4 + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      const base64 = canvas.toDataURL("image/png");
      setDepthUrl(base64);
      setLoading(false);
    } catch (error) {
      console.error("Processing depth result failed:", error);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setDepthUrl(null);
    setErrorMessage(null);
  };

  const handleEstimate = async () => {
    if (!imageFile || !workerRef.current) return;

    setLoading(true);
    try {
      const objectURL = URL.createObjectURL(imageFile);
      workerRef.current.postMessage({ type: 'PROCESS_IMAGE', payload: objectURL });
    } catch (error) {
      console.error("Estimation failed:", error);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setDepthUrl(null);
    setErrorMessage(null);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl p-6 space-y-6 shadow-lg rounded-2xl bg-white">
        <div>
          <h1 className="text-3xl font-bold">Depth Estimation</h1>
          <p className="text-muted-foreground text-sm">
            Upload an image and estimate its depth map directly in your browser.
          </p>
        </div>

        {modelLoading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">
              Loading model: {loadingProgress}%
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            <p>{errorMessage}</p>
          </div>
        )}

        <ImageUploader onImageSelect={handleImageSelect} />

        {imageUrl && (
          <div className="grid md:grid-cols-2 mt-4 bg-slate-50 rounded-lg">
            <div className="w-[70%] mx-auto overflow-hidden py-5">
              <ImagePreview imageUrl={imageUrl} />
            </div>
            {depthUrl && (
              <div className="w-[70%] mx-auto overflow-hidden py-5">
                <DepthMapViewer depthUrl={depthUrl} />
              </div>
            )}
          </div>
        )}

        {imageFile && (
          <div className="space-x-4 mt-4">
            <Button
              onClick={handleEstimate}
              disabled={modelLoading || loading}
              className="cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Estimating...
                </>
              ) : (
                "Estimate Depth"
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              className="cursor-pointer"
            >
              Reset
            </Button>
            {depthUrl && (
              <a
                href={depthUrl}
                download="depth-map.png"
                className="cursor-pointer inline-flex items-center rounded-md text-blue-400 border-blue-400 border px-4 py-2 text-sm font-medium shadow hover:bg-blue-50 transition"
              >
                Download Depth Map
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
};