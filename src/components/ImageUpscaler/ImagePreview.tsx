"use client";

import { useEffect, useState } from "react";

type Props = {
  factor: "2x" | "3x";
  original: string;
  upscale: string | null;
};

export default function ImagePreview({ original, factor, upscale }: Props) {
  const [size, setSize] = useState("");

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setSize(`${img.width} × ${img.height}`);
    };
    img.src = upscale || original;
  }, [original, upscale]);

  return (
    <div className="text-center">
      <p className="text-sm font-medium mb-2 text-gray-300">
        {upscale ? `Upscaled (${factor})` : "Original"}{" "}
        <span className="text-xs">({size})</span>
      </p>
      <img
        src={upscale || original}
        alt={upscale ? "Upscaled" : "Original"}
        className="rounded-lg object-contain w-full max-h-[350px]"
      />
    </div>
  );
}
