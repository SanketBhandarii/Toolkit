"use client";

import React, { useRef, useState, useEffect } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import Toolbar from "./Toolbar";

export default function ImageSegmenter() {
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [model, setModel] = useState<bodyPix.BodyPix | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [segmentation, setSegmentation] =
    useState<bodyPix.SemanticPersonSegmentation | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function loadModel() {
      try {
        const net = await bodyPix.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        });
        setModel(net);
      } catch (error) {
        console.error("Failed to load model", error);
      } finally {
        setModelLoading(false);
      }
    }
    loadModel();
  }, []);

  useEffect(() => {
    if (segmentation && imageRef.current && canvasRef.current) {
      renderSegmentation();
    }
  }, [segmentation]);

  const handleImageSelected = (_file: File, url: string) => {
    setImageUrl(url);
    setResultUrl(null);
    setSegmentation(null);
  };

  const renderSegmentation = () => {
    if (!segmentation || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(imageRef.current, 0, 0);

    const mask = bodyPix.toMask(
      segmentation,
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 255, b: 0, a: 200 }
    );

    bodyPix.drawMask(canvas, imageRef.current, mask, 0);
    setResultUrl(canvas.toDataURL());
  };

  const handleSegment = async () => {
    if (!imageRef.current || !model || !canvasRef.current) return;

    setLoading(true);
    try {
      const newSegmentation = await model.segmentPerson(imageRef.current, {
        flipHorizontal: false,
        internalResolution: "medium",
        segmentationThreshold: 0.7,
      });

      setSegmentation(newSegmentation);
    } catch (error) {
      console.error("Segmentation failed", error);
      alert("Segmentation failed. The image may not contain a person.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `segmented-image-${Date.now()}.png`;
    link.click();
  };

  const handleClear = () => {
    setImageUrl(null);
    setResultUrl(null);
    setSegmentation(null);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-xl shadow-lg border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-2xl font-bold text-center">
              AI Image Segmenter
            </h2>
          </div>

          {modelLoading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-gray-500">Loading segmentation model...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {!imageUrl ? (
                <ImageUploader onImageSelected={handleImageSelected} />
              ) : !resultUrl ? (
                <>
                  <div className="relative border border-neutral-200 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      ref={imageRef}
                      alt="Selected image"
                      className="w-full object-contain max-h-80"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      className="flex-1 border-neutral-400 text-neutral-500 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                    <Button
                      onClick={handleSegment}
                      disabled={loading}
                      className="flex-1 bg-sky-500 hover:bg-sky-600 cursor-pointer text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Segment Image"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Toolbar
                    onDownload={handleDownload}
                    onClear={handleClear}
                    resultUrl={resultUrl}
                    setResultUrl={setResultUrl}
                  />
                </>
              )}
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </CardContent>
      </Card>
    </div>
  );
}
