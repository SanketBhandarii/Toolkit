"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import UploadDropzone from "./UploadDropZone";
import PreviewImage from "./PreviewImage";
import ExtractedText from "./ExtractedText";
import { Loader2, FileImage, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen pt-10 w-full bg-gradient-to-br from-[#012b28] via-black to-teal-950 overflow-hidden">
      <div className="relative z-10 p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center items-center mb-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Image to Text
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-lg">
              Extract text from images using advanced OCR technology
            </p>
          </div>

          {!image && !text ? (
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
                <UploadDropzone onImageUpload={handleImageUpload} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              <div className="w-full lg:w-1/2">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
                  <div className="space-y-4 md:space-y-6">
                    <PreviewImage imageUrl={imageUrl} onReset={handleReset} />
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleProcess}
                        disabled={loading}
                        className="h-12 bg-gradient-to-r from-teal-600 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer px-6 md:px-8"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin w-4 md:w-5 h-4 md:h-5" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <FileImage className="w-4 md:w-5 h-4 md:h-5" />
                            Extract Text
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleReset}
                        className="h-12 bg-slate-700/80 hover:bg-slate-600/80 text-white font-semibold rounded-xl transition-all duration-300 cursor-pointer px-6 md:px-8"
                      >
                        <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {text && (
                <div className="w-full lg:w-1/2">
                  <ExtractedText text={text} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}