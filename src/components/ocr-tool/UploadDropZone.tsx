"use client";

import { useRef } from "react";
import { Upload, FileImage } from "lucide-react";

interface Props {
  onImageUpload: (file: File) => void;
}

export default function UploadDropzone({ onImageUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div
      className="border-2 border-dashed border-slate-600/50 rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-teal-500/50 transition-all duration-300 bg-slate-800/30 backdrop-blur-sm"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-teal-500/20 rounded-full p-4">
            <Upload className="w-8 h-8 text-teal-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center justify-center gap-2">
            <FileImage className="w-5 h-5" />
            Upload Image
          </h3>
          <p className="text-gray-400 text-sm">
            Click to select an image or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Supports JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>
    </div>
  );
}