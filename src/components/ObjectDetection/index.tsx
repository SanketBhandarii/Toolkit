"use client";

import { useDetector } from "./hooks/useDetector";

import Dropzone from "./Dropzone";
import { Progress } from "../ui/progress";

import { Check, Loader2 } from "lucide-react";

export default function ObjectDetection() {
  const detector = useDetector();

  return (
    <section className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900">Object Detection</h1>
          
          </div>

          <div className="text-center sm:text-right w-full sm:w-auto">
            {detector.ready !== null && detector.ready ? (
              <div className="flex items-center justify-center sm:justify-end gap-2 text-emerald-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">Transformer Ready</span>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-end gap-2 text-gray-500">
                <Loader2 className="animate-spin w-5 h-5" />
                <span className="font-medium">Loading model...</span>
              </div>
            )}

            {!detector.ready && (
              <Progress value={detector.progress} className="mt-2 h-2" />
            )}
          </div>
        </div>

        <Dropzone
          status={detector.status}
          setStatus={detector.setStatus}
          detector={detector.start}
          result={detector.result}
          setResult={detector.setResult}
          className="mt-10 rounded-2xl border-4 border-dashed border-gray-300 bg-white p-10 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 curs"
        />
      </div>
    </section>
  );
}
