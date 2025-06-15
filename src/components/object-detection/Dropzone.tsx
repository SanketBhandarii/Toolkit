import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { X, Download, Upload } from "lucide-react";
import html2canvas from "html2canvas";
import BoundingBox from "./BoundingBox";
import type { Detection } from "./hooks/useDetector";

type DropzoneProps = {
  status: string;
  setStatus: (status: string) => void;
  detector: (image: string | ArrayBuffer | null) => void;
  result: Detection[] | null;
  setResult: (result: Detection[] | null) => void;
  className: string;
};

export default function Dropzone({
  status,
  setStatus,
  detector,
  result,
  setResult,
  className,
}: DropzoneProps) {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length) {
        const file = accepted[0];
        const preview = URL.createObjectURL(file);
        setFiles([{ ...file, preview }]);
        setStatus("ready");
        setResult(null);

        const reader = new FileReader();
        reader.onload = (e) => detector(e.target?.result ?? null);
        reader.readAsDataURL(file);
      }
    },
    [detector, setStatus, setResult]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  const remove = () => {
    setFiles([]);
    setStatus("idle");
    setResult(null);
  };

  const uniqueLabels = [...new Set(result?.map((r) => r.label) || [])];

  return (
    <>
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="text-gray-300 text-lg mb-2">
            {isDragActive
              ? "Drop the image here..."
              : "Drag & drop an image or click to upload"}
          </div>
          <div className="text-gray-500 text-sm">
            Supported formats: JPG, PNG, GIF, WebP
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="relative w-full h-auto" ref={imageRef}>
                  <Image
                    src={files[0].preview}
                    alt={`Uploaded: ${files[0].name}`}
                    width={640}
                    height={480}
                    className={cn(
                      "object-contain w-full rounded-lg border border-slate-600/30",
                      status !== "complete" && "animate-pulse"
                    )}
                  />
                  {result?.map((object, i) => (
                    <BoundingBox key={i} object={object} />
                  ))}
                  {status !== "complete" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm z-10 rounded-lg">
                      Detecting objects...
                    </div>
                  )}
                  <button
                    onClick={remove}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors z-20 cursor-pointer backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {uniqueLabels.length > 0 && (
              <div className="lg:w-80">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-teal-400 mb-4">
                    Detected Objects ({uniqueLabels.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {uniqueLabels.map((label, i) => (
                      <div
                        key={i}
                        className="bg-slate-700/50 px-3 py-2 rounded-lg text-gray-200 text-sm"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
