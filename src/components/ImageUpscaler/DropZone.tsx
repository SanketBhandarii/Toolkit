"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";

type DropZoneProps = {
  onSelect: (file: File) => void;
};

export default function DropZone({ onSelect }: DropZoneProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 cursor-pointer"
      onClick={() => ref.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) onSelect(file);
      }}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={ref}
        onChange={handleChange}
      />
      <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-400 text-sm">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP</p>
    </div>
  );
}
