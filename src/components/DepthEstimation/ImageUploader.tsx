"use client";

import { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";

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
    <div>
      <Button onClick={handleClick} className="text-white bg-neutral-700 cursor-pointer hover:opacity-65 transition-opacity duration-300">
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
