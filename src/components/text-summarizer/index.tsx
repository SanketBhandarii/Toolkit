"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import './styles.css'

export const TextSummarizerController = () => {
  const workerRef = useRef<Worker | null>(null);

  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // ✅ This matches YOUR pattern
      workerRef.current = new Worker(
        new URL("./utils/summarize.worker.js", import.meta.url),
        { type: "module" }
      );

      workerRef.current.onmessage = (event) => {
        const { type, payload } = event.data;

        switch (type) {
          case "PROGRESS":
            setLoadingProgress(payload);
            break;
          case "MODEL_LOADED":
            setModelLoading(false);
            break;
          case "SUMMARY_RESULT":
            setSummary(payload);
            setLoading(false);
            break;
          case "ERROR":
            setErrorMessage(payload);
            setLoading(false);
            setModelLoading(false);
            break;
        }
      };

      workerRef.current.postMessage({ type: "LOAD_MODEL", payload: null });
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
    setLoadingProgress(0);

    workerRef.current?.postMessage({
      type: "SUMMARIZE_TEXT",
      payload: inputText,
    });
  };

  const handleReset = () => {
    setInputText("");
    setSummary("");
    setErrorMessage(null);
    setLoadingProgress(0);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-900 p-6">
      <div className="w-full max-w-4xl p-6 space-y-6 shadow-lg rounded-2xl bg-neutral-800">
        <div>
          <h1 className="text-3xl font-bold text-white">Text Summarization</h1>
          <p className="text-muted-foreground text-sm text-white mt-3">
            Enter some text to get a concise summary using a browser-based ML
            model.
          </p>
        </div>

        {modelLoading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-400 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">
              Loading model: {loadingProgress}%
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or write your text here..."
          className="w-full h-48 border border-neutral-600 p-5 rounded-xl text-white placeholder:text-white  shadow-sm textarea"
        />

        <div className="flex gap-4">
          <Button
            onClick={handleSummarize}
            disabled={modelLoading || loading}
            className="cursor-pointer bg-neutral-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              "Summarize"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            className="cursor-pointer text-white"
          >
            Reset
          </Button>
        </div>

        {summary && (
          <div className="bg-gray-700 text-gray-200 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-2">Summary:</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </main>
  );
};
