"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DropZone from "./DropZone";
import ImagePreview from "./ImagePreview";
import { Loader2 } from "lucide-react";
import UpscaleOptions from "./UpscaleOptions";
import { runUpscaleWorker } from "./hooks/useUpscale";

// File size limit in MB (let's say 5MB)
const MAX_FILE_SIZE_MB = 5;

export default function ImageUpscaler() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [upscaleFactor, setUpscaleFactor] = useState<"2x" | "3x">("2x");

  // Check if file size is within the allowed limit (in MB)
  const isFileSizeValid = (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB
    return fileSizeMB <= MAX_FILE_SIZE_MB;
  };

  const handleImageSelect = (file: File) => {
    if (!isFileSizeValid(file)) {
      setErrorMessage(
        `File size is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`
      );
      setImageFile(null);
      setImageUrl(null);
      setUpscaledUrl(null);
      return;
    }

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setUpscaledUrl(null);
    setErrorMessage(null);
  };

  const handleUpscale = async () => {
    if (!imageUrl) return;

    setLoading(true);
    try {
      const upscaledDataUrl = await runUpscaleWorker(imageUrl, upscaleFactor);
      setUpscaledUrl(upscaledDataUrl);
    } catch (error) {
      console.error("Upscaling failed:", error);
      setErrorMessage(
        "Upscaling failed: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLoading(false)
    setImageFile(null);
    setImageUrl(null);
    setUpscaledUrl(null);
    setErrorMessage(null);
    setUpscaleFactor("2x");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl p-6 space-y-6 shadow-lg rounded-2xl bg-white">
        <div>
          <h1 className="text-3xl font-bold">Image Upscaling</h1>
          <p className="text-muted-foreground text-sm">
            Upload an image and upscale it directly in your browser.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            <p>{errorMessage}</p>
          </div>
        )}

        {!imageUrl && <DropZone onSelect={handleImageSelect} />}

        {imageUrl && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 bg-slate-50 rounded-lg p-6">
            <div className="w-full md:w-[45%]">
              <ImagePreview
                original={imageUrl}
                factor={upscaleFactor}
                upscale={null}
              />
            </div>
            {upscaledUrl && (
              <div className="w-full md:w-[45%]">
                <ImagePreview
                  original={imageUrl}
                  factor={upscaleFactor}
                  upscale={upscaledUrl}
                />
              </div>
            )}
          </div>
        )}

        {imageFile && (
          <div className="space-y-4">
            <UpscaleOptions
              value={upscaleFactor}
              loading={loading}
              onChange={(val) => setUpscaleFactor(val)}
            />

            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={handleUpscale}
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upscaling...(Cooking)
                  </>
                ) : (
                  "Upscale Image"
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={handleReset}
                className="cursor-pointer"
              >
                Reset
              </Button>

              {upscaledUrl && (
                <a
                  href={upscaledUrl}
                  download="upscaled-image.png"
                  className="cursor-pointer inline-flex items-center rounded-md text-blue-400 border-blue-400 border px-4 py-2 text-sm font-medium shadow hover:bg-blue-50 transition"
                >
                  Download Upscaled Image
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
