"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { DepthMapViewer } from "./DepthMapViewer";
import { Loader2 } from "lucide-react";

type DepthEstimator = (input: string) => Promise<{
  depth: {
    data: Uint8ClampedArray;
    width: number;
    height: number;
  };
}>;

export const DepthEstimatorController = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [depthUrl, setDepthUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pipelineRef = useRef<DepthEstimator | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoadingModel(true);
        const { pipeline } = await import("@huggingface/transformers");
        const depth_estimator = await pipeline(
          "depth-estimation",
          "onnx-community/depth-anything-v2-large"
        );
        pipelineRef.current = depth_estimator as DepthEstimator;
        setErrorMessage(null);
      } catch (error) {
        console.error("Model loading failed:", error);
        setErrorMessage(
          "Could not load model: " +
            (error instanceof Error ? error.message : String(error))
        );
      } finally {
        setLoadingModel(false);
      }
    };

    loadModel();
  }, []);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setDepthUrl(null);
    setErrorMessage(null);
  };

  const handleEstimate = async () => {
    if (!imageFile || !pipelineRef.current) return;

    setLoading(true);
    try {
      const objectURL = URL.createObjectURL(imageFile);
      const output = await pipelineRef.current(objectURL);

      const raw = output.depth;
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
    } catch (error) {
      console.error("Estimation failed:", error);
      setErrorMessage(
        "Failed to estimate depth: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
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

        {loadingModel && (
          <div className="space-y-2">
            <div className="text-green-500 text-sm font-medium">
              Loading depth estimation model...
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
              disabled={loadingModel || loading}
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
