"use client";

import React, { useRef, useState, useEffect } from "react";
import * as deeplab from "@tensorflow-models/deeplab";
import "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

type Segment = { url: string };
type DeepLabModelType = Awaited<ReturnType<typeof deeplab.load>>;

export default function ImageSegmenter() {
  const [model, setModel] = useState<DeepLabModelType | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    deeplab.load({ base: "pascal", quantizationBytes: 4 }).then(setModel);
  }, []);

  const handleImageSelected = (_: File, url: string) => {
    setImageUrl(url);
    setSegments([]);
  };

  const handleSegment = async () => {
    if (!model || !imageRef.current || !canvasRef.current) return;
    setLoading(true);

    const { segmentationMap, width, height } = await model.segment(imageRef.current);
    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    ctx?.drawImage(imageRef.current, 0, 0, width, height);
    const originalData = ctx?.getImageData(0, 0, width, height);

    const validLabels = Array.from(new Set(segmentationMap)).filter(
      (label) => label >= 0 && label < 21
    );

    const results: Segment[] = [];

    for (const label of validLabels) {
      const segCanvas = document.createElement("canvas");
      segCanvas.width = width;
      segCanvas.height = height;
      const segCtx = segCanvas.getContext("2d");
      const newImage = segCtx?.createImageData(width, height);
      if (!newImage || !originalData) continue;

      for (let i = 0; i < segmentationMap.length; i++) {
        const offset = i * 4;
        if (segmentationMap[i] === label) {
          newImage.data[offset] = originalData.data[offset];
          newImage.data[offset + 1] = originalData.data[offset + 1];
          newImage.data[offset + 2] = originalData.data[offset + 2];
          newImage.data[offset + 3] = 255;
        } else {
          newImage.data[offset + 3] = 0;
        }
      }

      segCtx?.putImageData(newImage, 0, 0);
      results.push({ url: segCanvas.toDataURL() });
    }

    setSegments(results);
    setLoading(false);
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
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <Card className="w-full max-w-7xl shadow-lg border-none">
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold text-center mb-8">AI Image Segmenter</h2>

          {!model ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading model...</span>
            </div>
          ) : !imageUrl ? (
            <ImageUploader onImageSelected={handleImageSelected} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="border rounded overflow-hidden">
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Uploaded"
                    className="max-w-full max-h-[500px] object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={handleClear} variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Start Over
                  </Button>
                  <Button onClick={handleSegment} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Segment
                  </Button>
                  {segments.length > 0 && (
                    <Button onClick={handleDownload}>
                      Download
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {segments.map((seg, i) => (
                  <div key={i} className="border rounded overflow-hidden shadow-sm bg-white">
                    <img src={seg.url} alt={`Segment ${i}`} className="w-full object-contain max-h-56" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </CardContent>
      </Card>
    </div>
  );
}
