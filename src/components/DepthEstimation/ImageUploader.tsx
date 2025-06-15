"use client";

import { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface Props {
  onImageSelect: (file: File) => void;
}

export const ImageUploader = ({ onImageSelect }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  return (
    <div className="flex justify-center">
      <Button 
        onClick={handleClick} 
        className="h-12 bg-gradient-to-r from-teal-600 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 hover:opacity-50 shadow-lg hover:shadow-xl cursor-pointer px-6 md:px-8"
      >
        <Upload className="w-4 md:w-5 h-4 md:h-5 mr-2" />
        Upload Image
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};