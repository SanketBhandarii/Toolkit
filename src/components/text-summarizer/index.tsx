"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, RotateCcw } from "lucide-react";
import "./styles.css";

export const TextSummarizerController = () => {
  const workerRef = useRef<Worker | null>(null);
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      workerRef.current = new Worker(
        new URL("./utils/summarize.worker.js", import.meta.url),
        { type: "module" }
      );

      workerRef.current.onmessage = (event) => {
        const { status, summary } = event.data;
        switch (status) {
          case "MODEL_LOADED":
            setModelLoading(false);
            break;
          case "SUMMARY_RESULT":
            setSummary(summary);
            setLoading(false);
            break;
          case "ERROR":
            setErrorMessage(summary);
            setLoading(false);
            setModelLoading(false);
            break;
        }
      };

      workerRef.current.postMessage({ status: "LOAD_MODEL", payload: null });
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleSummarize = () => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter text.");
      return;
    }
    setLoading(true);
    setSummary("");
    setErrorMessage(null);
    workerRef.current?.postMessage({
      status: "SUMMARIZE_TEXT",
      payload: inputText,
    });
  };

  const handleReset = () => {
    setInputText("");
    setSummary("");
    setErrorMessage(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-10 w-full bg-gradient-to-br from-[#012b28] via-black to-teal-950 overflow-hidden">
      <div className="relative z-10 p-4 md:p-8">
        <div className="w-full max-w-2xl lg:max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center items-center mb-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Text Summarizer
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-lg">
              Transform long text into concise summaries instantly
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
            <div className="space-y-4 md:space-y-6">
              {modelLoading && (
                <div className="flex items-center justify-center space-x-3 p-4 bg-slate-800/80 rounded-xl backdrop-blur-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
                  <span className="text-gray-300">Loading AI model. This may take some time</span>
                </div>
              )}

              {errorMessage && (
                <div className="text-red-400 bg-red-900/20 p-3 rounded-xl border border-red-800/50 backdrop-blur-sm">
                  {errorMessage}
                </div>
              )}

              <div className="relative">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here to get a summary..."
                  disabled={modelLoading || loading}
                  className="resize-none h-32 md:h-[200px] bg-slate-900/80 border-slate-600/50 text-gray-100 placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 rounded-xl md:rounded-2xl leading-relaxed backdrop-blur-sm transition-all duration-300 textarea"
                />
              </div>

              <div className="flex justify-center pt-2 md:pt-4">
                <div className="flex gap-3">
                  <Button
                    onClick={handleSummarize}
                    disabled={modelLoading || loading || !inputText.trim()}
                    className="h-12 bg-gradient-to-r from-teal-600 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer px-6 md:px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-4 md:w-5 h-4 md:h-5" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                        Summarize
                      </>
                    )}
                  </Button>
                  
                  {summary && (
                    <Button
                      onClick={handleReset}
                      className="h-12 bg-slate-700/80 hover:bg-slate-600/80 text-white font-semibold rounded-xl transition-all duration-300 cursor-pointer px-6 md:px-8"
                    >
                      <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {summary && (
            <div className="mt-6 md:mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
              <h3 className="text-lg md:text-xl font-semibold text-teal-400 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Summary
              </h3>
              <p className="text-gray-200 leading-relaxed">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};