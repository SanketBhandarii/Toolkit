"use client";

import { useEffect, useRef } from "react";

interface SegmentationCanvasProps {
  imageUrl: string;
  mask?: string; // Base64 PNG mask
  width: number;
  height: number;
}

export default function SegmentationCanvas({
  imageUrl,
  mask,
  width,
  height,
}: SegmentationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const baseImage = new Image();
    baseImage.src = imageUrl;

    baseImage.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(baseImage, 0, 0, width, height);

      if (mask) {
        const maskImg = new Image();
        maskImg.src = `data:image/png;base64,${mask}`;
        maskImg.onload = () => {
          ctx.drawImage(maskImg, 0, 0, width, height);
        };
      }
    };
  }, [imageUrl, mask, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full border rounded-md"
    />
  );
}
