"use client";

import { useDetector } from "./hooks/useDetector";
import Dropzone from "./Dropzone";
import { Check, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function ObjectDetection() {
  const detector = useDetector();

  useEffect(() => {
    if (!detector.ready) detector.initialize();
  }, []);

  return (
    <div className="min-h-screen pt-10 w-full bg-gradient-to-br from-[#012b28] via-black to-teal-950 overflow-hidden">
      <div className="relative z-10 p-4 md:p-8">
        <div className="w-full max-w-2xl lg:max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center items-center mb-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Object Detection
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-lg">
              Detect and identify objects in images with AI-powered recognition
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
            {detector.ready ? (
              <div className="flex items-center justify-center space-x-3 p-4 bg-slate-800/80 rounded-xl backdrop-blur-sm mb-6">
                <Check className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300 font-medium">AI Model Ready</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3 p-4 bg-slate-800/80 rounded-xl backdrop-blur-sm mb-6">
                <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
                <span className="text-gray-300">Loading AI model...</span>
               
              </div>
            )}

            <div className={!detector.ready ? "opacity-50 pointer-events-none" : ""}>
              <Dropzone
                status={detector.status}
                setStatus={detector.setStatus}
                detector={detector.start}
                result={detector.result}
                setResult={detector.setResult}
                className="rounded-xl border-2 border-dashed border-slate-600/50 bg-slate-900/50 backdrop-blur-sm p-8 md:p-12 transition-all duration-300 hover:border-teal-500/50 hover:bg-slate-800/30 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}