import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import BoundingBox from "./BoundingBox";

type DetectionObject = {
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
  label: string;
};

type DropzoneProps = {
  status: string;
  setStatus: (status: string) => void;
  detector: (image: string | ArrayBuffer | null) => void;
  result: DetectionObject[] | null;
  setResult: (result: DetectionObject[] | null) => void;
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
  const [rejected, setRejected] = useState<FileRejection[]>([]);

  const onDrop = useCallback(
    (accepted: File[], rejectedFiles: FileRejection[]) => {
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
      if (rejectedFiles.length) setRejected(rejectedFiles);
    },
    [detector, setResult, setStatus]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop,
  });

  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  const remove = () => {
    setFiles([]);
    setRejected([]);
  };

  return (
    <>
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />
        <div className="text-center text-gray-600">
          {isDragActive
            ? "Drop the image here..."
            : "Drag & drop an image or click to upload"}
        </div>
      </div>

      <section className="mt-6 space-y-6">
        {files.length > 0 && (
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-lg shadow">
            <Image
              src={files[0].preview}
              alt={`Uploaded image: ${files[0].name ?? "unknown"}`}
              width={500}
              height={500}
              onLoad={() => URL.revokeObjectURL(files[0].preview)}
              className={cn(
                "aspect-video w-full object-cover",
                status !== "complete" && "animate-pulse"
              )}
            />
            {result?.map((object, i) => (
              <BoundingBox key={i} object={object} />
            ))}
            <button
              onClick={remove}
              className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-rose-400 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            {status !== "complete" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm font-medium">
                Detecting Objects...
              </div>
            )}
          </div>
        )}

        {rejected.length > 0 && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 shadow">
            <ul className="text-sm text-red-500">
              {rejected.map(({ file, errors }) => (
                <li key={file.name}>
                  <p className="font-medium">{file.name}</p>
                  <ul className="list-disc pl-5 text-xs">
                    {errors.map((e) => (
                      <li key={e.code}>{e.message}</li>
                    ))}
                  </ul>
                  <button
                    onClick={remove}
                    className="mt-2 text-xs text-red-600 cursor-pointer underline hover:text-red-800"
                  >
                    Upload Again
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
