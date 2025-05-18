"use client";

import { useDetector } from "./hooks/useDetector";
import Dropzone from "./Dropzone";
import { Check, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function ObjectDetection() {
  const detector = useDetector();

  // Initialize model loading on component mount
  useEffect(() => {
    // Only try to initialize if not already ready
    if (!detector.ready) {
      detector.initialize();
    }
  }, []);

  return (
    <section className="py-12 bg-neutral-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-gray-200">
              Object Detection
            </h1>
          </div>

          <div className="text-center sm:text-right w-full sm:w-auto">
            {detector.ready ? (
              <div className="flex items-center justify-center sm:justify-end gap-2 text-emerald-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">Transformer Ready</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center sm:justify-end gap-2 text-gray-500">
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span className="font-medium">Loading model...</span>
                </div>

                <div className="w-full sm:w-36 bg-gray-200 h-2 rounded-full overflow-hidden mx-auto sm:ml-auto">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 ease-in-out"
                    style={{ width: `${detector.progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 font-medium text-right">
                  {Math.round(detector.progress)}%
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={!detector.ready ? "opacity-50 pointer-events-none" : ""}
        >
          <Dropzone
            status={detector.status}
            setStatus={detector.setStatus}
            detector={detector.start}
            result={detector.result}
            setResult={detector.setResult}
            className="mt-10 rounded-2xl border-4 border-dashed border-neutral-500 bg-neutral-800 p-10 shadow-sm transition duration-300 hover:border-emerald-500 cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
}
