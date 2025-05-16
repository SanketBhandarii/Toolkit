"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import UploadDropzone from "./UploadDropZone";
import PreviewImage from "./PreviewImage";
import ExtractedText from "./ExtractedText";

export default function ImageToText() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageUpload = (file: File) => {
    setImage(file);
    setText("");
    setImageUrl(URL.createObjectURL(file));
  };

  const handleReset = () => {
    setImage(null);
    setImageUrl("");
    setText("");
  };

  const handleProcess = () => {
    if (!image) return;
    setLoading(true);
    setText("");

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onload = async () => {
      try {
        const imgData = reader.result as string;
        const { data } = await Tesseract.recognize(imgData, "eng");
        setText(data.text || "No text found");
      } catch (err) {
        console.error("OCR error:", err);
        setText("Error processing the image.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      setText("Error reading the image.");
      setLoading(false);
    };
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 bg-gray-100 p-6">
      <div className="w-full max-w-md space-y-6">
        {!image ? (
          <UploadDropzone onImageUpload={handleImageUpload} />
        ) : (
          <>
            <PreviewImage imageUrl={imageUrl} onReset={handleReset} />
            <button
              onClick={handleProcess}
              disabled={loading}
              className="w-full bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "Processing..." : "Extract Text"}
            </button>
          </>
        )}
      </div>

      {text && (
        <div className="">
          <ExtractedText text={text} />
        </div>
      )}
    </div>
  );
}
