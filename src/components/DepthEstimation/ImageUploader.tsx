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
      <Button onClick={handleClick} className="border border-neutral-300 cursor-pointer hover:bg-neutral-100 transition-colors duration-300">
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
