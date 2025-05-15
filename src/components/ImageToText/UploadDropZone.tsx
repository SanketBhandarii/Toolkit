"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";

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
    <Card
      className="p-20 border-dashed border-2 bg-white border-gray-300 text-center space-y-4 cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <UploadIcon className="mx-auto h-8 w-8 text-gray-500" />
      <p className="text-gray-600">Select an image to extract text</p>
      <Button className="cursor-pointer shadow-none">Upload Image</Button>
    </Card>
  );
}
