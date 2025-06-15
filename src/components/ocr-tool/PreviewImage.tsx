"use client";

import { X } from "lucide-react";

interface Props {
  imageUrl: string;
  onReset: () => void;
}

export default function PreviewImage({ imageUrl, onReset }: Props) {
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full max-h-[300px] object-cover rounded-xl shadow-lg border border-slate-600/50"
      />
      <button
        onClick={onReset}
        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 transition-all duration-300 cursor-pointer backdrop-blur-sm"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}