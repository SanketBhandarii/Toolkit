"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import UploadDropzone from "./UploadDropZone";
import PreviewImage from "./PreviewImage";
import ExtractedText from "./ExtractedText";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 bg-neutral-900 p-6">
      <div className="w-full max-w-md space-y-6">
        {!image ? (
          <UploadDropzone onImageUpload={handleImageUpload} />
        ) : (
          <>
            <PreviewImage imageUrl={imageUrl} onReset={handleReset} />
            <button
              onClick={handleProcess}
              disabled={loading}
              className="w-full bg-neutral-700 hover:opacity-70 text-white font-semibold py-2 px-4 rounded-md cursor-pointer disabled:opacity-50 transition-opacity duration-300"
            >
              {loading ? (
                <div className="flex gap-4 items-center justify-center">
                  <Loader2 className="animate-spin w-4" />
                  Extracting...
                </div>
              ) : (
                "Extract Text"
              )}
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
