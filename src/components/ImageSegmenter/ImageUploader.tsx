"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (file: File, url: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageSelected(file, url);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        onImageSelected(file, url);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`border-2 cursor-pointer border-dashed rounded-lg p-8 text-center ${
        dragActive ? "border-sky-500 bg-sky-50" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center">
        <Upload className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-1">
          Click or drag image to upload
        </p>
        <p className="text-sm text-gray-500">
          Support for JPG, PNG, WEBP
        </p>
      </div>
    </div>
  );
}