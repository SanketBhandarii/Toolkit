"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Loader2, Download } from "lucide-react";
import ImageUploader from "./ImageUploader";

type Segment = { url: string };

export default function ImageSegmenter() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [modelLoading, setModelLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const imageBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./utils/segmenter.worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;

      switch (type) {
        case "PROGRESS":
          setProgress(payload);
          break;
        case "MODEL_LOADED":
          setModelLoading(false);
          break;
        case "SEGMENT_RESULT":
          // Convert result to blob URL
          const canvas = document.createElement("canvas");
          const mask = payload.mask; // Assuming HuggingFace returns this
          canvas.width = mask.width;
          canvas.height = mask.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const imageData = new ImageData(
            new Uint8ClampedArray(mask.data),
            mask.width,
            mask.height
          );

          ctx.putImageData(imageData, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setSegments([{ url }]);
            }
            setLoading(false);
          });
          break;
        case "ERROR":
          console.error("Segmentation error:", payload);
          setLoading(false);
          break;
      }
    };

    workerRef.current.postMessage({ type: "LOAD_MODEL" });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleImageSelected = (file: File, url: string) => {
    imageBlobRef.current = file;
    setImageUrl(url);
    setSegments([]);
  };

  const handleSegment = () => {
    if (!imageBlobRef.current || !workerRef.current) return;
    setLoading(true);
    workerRef.current.postMessage({
      type: "SEGMENT_IMAGE",
      payload: imageBlobRef.current,
    });
  };

  const handleClear = () => {
    setImageUrl(null);
    setSegments([]);
  };

  const handleDownload = () => {
    if (!segments.length) return;
    const link = document.createElement("a");
    link.href = segments[0].url;
    link.download = `segment-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 flex justify-center items-center">
      <Card className="w-full max-w-7xl shadow-lg border-none">
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold text-center text-gray-200 mb-8">
            AI Image Segmenter
          </h2>

          {modelLoading ? (
            <div className="flex justify-center items-center py-12 text-gray-200">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading model... {progress}%</span>
            </div>
          ) : !imageUrl ? (
            <ImageUploader onImageSelected={handleImageSelected} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="border rounded overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="max-w-full max-h-[500px] object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="bg-neutral-700 text-gray-200 border-0 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Start Over
                  </Button>
                  <Button
                    onClick={handleSegment}
                    disabled={loading}
                    className="bg-neutral-700 text-white cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2 text-gray-200" />
                    ) : (
                      "Segment"
                    )}
                  </Button>
                  {segments.length > 0 && (
                    <Button
                      onClick={handleDownload}
                      className="bg-neutral-700 text-gray-200 cursor-pointer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {segments.map((seg, i) => (
                  <div
                    key={i}
                    className="border border-slate-600 rounded overflow-hidden shadow-sm"
                  >
                    <img
                      src={seg.url}
                      alt={`Segment ${i}`}
                      className="w-full object-contain max-h-56"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
