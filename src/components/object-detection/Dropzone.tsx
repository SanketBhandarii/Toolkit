import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
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

  const downloadImage = async () => {
    if (!imageRef.current) return;
    const element = imageRef.current;
    const canvas = await html2canvas(element, { backgroundColor: null });
    element.classList.add("border-neutral-600");
    const link = document.createElement("a");
    link.download = "detected.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const uniqueLabels = [...new Set(result?.map((r) => r.label) || [])];

  return (
    <>
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />
        <div className="text-center text-gray-400">
          {isDragActive
            ? "Drop the image here..."
            : "Drag & drop an image or click to upload"}
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col md:flex-row-reverse mt-4 gap-6 items-start">
          {/* Image and bounding boxes */}
          <div className="relative w-full md:w-[65%] max-w-[640px] overflow-hidden shadow">
            <div className="relative w-full h-auto" ref={imageRef}>
              <Image
                src={files[0].preview}
                alt={`Uploaded: ${files[0].name}`}
                width={640}
                height={480}
                className={cn(
                  "object-contain w-full bg-black",
                  status !== "complete" && "animate-pulse"
                )}
              />
              {result?.map((object, i) => (
                <BoundingBox key={i} object={object} />
              ))}
              {status !== "complete" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-xs z-10">
                  Detecting...
                </div>
              )}
              <button
                onClick={remove}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 z-20 cursor-pointer ui-only"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Download button */}
            {status === "complete" && (
              <div className="p-2">
                <button
                  onClick={downloadImage}
                  className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 cursor-pointer"
                >
                  Download Image with Detections
                </button>
              </div>
            )}
          </div>

          {/* Labels box */}
          {uniqueLabels.length > 0 && (
            <div className="w-full md:w-[35%] bg-neutral-800 text-white text-sm rounded p-3">
              <h3 className="font-semibold mb-2">
                Detected Objects ({uniqueLabels.length})
              </h3>
              <ul className="space-y-1 text-xs">
                {uniqueLabels.map((label, i) => (
                  <li key={i} className="bg-neutral-700 px-2 py-1 rounded">
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
