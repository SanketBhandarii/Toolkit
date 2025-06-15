"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { DepthMapViewer } from "./DepthMapViewer";
import { Loader2, RotateCcw, Download, Image as ImageIcon } from "lucide-react";

export const DepthEstimatorController = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [depthUrl, setDepthUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      workerRef.current = new Worker(
        new URL("./utils/depth-worker.ts", import.meta.url)
      );

      workerRef.current.onmessage = (event) => {
        const { type, payload } = event.data;

        switch (type) {
          case "MODEL_LOADED":
            setModelLoading(false);
            break;
          case "RESULT":
            processDepthResult(payload);
            break;
          case "ERROR":
            setErrorMessage(payload);
            setModelLoading(false);
            setLoading(false);
            break;
        }
      };

      workerRef.current.postMessage({ type: "LOAD_MODEL" });
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processDepthResult = (raw: {
    data: Uint8ClampedArray;
    width: number;
    height: number;
  }) => {
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
      workerRef.current.postMessage({
        type: "PROCESS_IMAGE",
        payload: objectURL,
      });
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
    location.reload();
  };

  return (
    <div className="min-h-screen pt-10 w-full bg-gradient-to-br from-[#012b28] via-black to-teal-950 overflow-hidden">
      <div className="relative z-10 p-4 md:p-8">
        <div className="w-full max-w-2xl lg:max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center items-center mb-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Depth Estimation
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-lg">
              Upload an image and estimate its depth map directly in your
              browser
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
            <div className="space-y-4 md:space-y-6">
              {modelLoading && (
                <div className="flex items-center justify-center space-x-3 p-4 bg-slate-800/80 rounded-xl backdrop-blur-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
                  <span className="text-gray-300">Loading AI model</span>
                </div>
              )}

              {errorMessage && (
                <div className="text-red-400 bg-red-900/20 p-3 rounded-xl border border-red-800/50 backdrop-blur-sm">
                  {errorMessage}
                </div>
              )}

              <div className="bg-slate-900/80 border border-slate-600/50 rounded-xl p-4 backdrop-blur-sm">
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>

              {imageUrl && (
                <div className="grid md:grid-cols-2 gap-4 bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 backdrop-blur-sm">
                  <div>
                    <ImagePreview imageUrl={imageUrl} />
                  </div>
                  {depthUrl && (
                    <div>
                      <DepthMapViewer depthUrl={depthUrl} />
                    </div>
                  )}
                </div>
              )}

              {imageFile && (
                <div className="flex justify-center pt-2 md:pt-4">
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Button
                      onClick={handleEstimate}
                      disabled={modelLoading || loading}
                      className="h-12 bg-gradient-to-r from-teal-600 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer px-6 md:px-8"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin w-4 md:w-5 h-4 md:h-5" />
                          Estimating...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                          Estimate Depth
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleReset}
                      className="h-12 bg-slate-700/80 hover:bg-slate-600/80 text-white font-semibold rounded-xl transition-all duration-300 cursor-pointer px-6 md:px-8"
                    >
                      <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
                      Reset
                    </Button>

                    {depthUrl && (
                      <a
                        href={depthUrl}
                        download="depth-map.png"
                        className="h-12 text-sm inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:opacity-50 shadow-lg hover:shadow-xl cursor-pointer px-6 md:px-8"
                      >
                        <Download className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
