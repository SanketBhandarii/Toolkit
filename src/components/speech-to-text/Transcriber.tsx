"use client";

import { useEffect, useRef, useState } from "react";
import RecorderControls from "@/components/speech-to-text/RecorderControls";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Play, Upload, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import TranscriptList, {
  Transcript,
} from "@/components/speech-to-text/TranscriptList";

export default function Transcriber() {
  const [text, setText] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);

  const audioDataRef = useRef<Float32Array | null>(null);
  const worker = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("transcripts");
    if (stored) setTranscripts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const w = new Worker(new URL("./utils/worker.js", import.meta.url), {
      type: "module",
    });
    w.postMessage({ type: "LOAD" });
    w.onmessage = (e) => {
      if (e.data.type === "LOADED") {
        setModelLoading(false);
      }
      if (e.data.type === "RESULT") {
        const t = {
          id: Date.now().toString(),
          audioUrl: audioURL,
          text: e.data.text,
        };
        setText(e.data.text);
        setTranscripts((p) => {
          const u = [t, ...p];
          localStorage.setItem("transcripts", JSON.stringify(u));
          return u;
        });
      }
      if (e.data.type === "ERROR") {
        console.error(e.data.error);
        setErrorMessage("Error during transcription");
        setModelLoading(false);
      }
      setLoading(false);
    };
    worker.current = w;
    return () => w.terminate();
  }, [audioURL]);

  const transcribe = () => {
    if (!audioDataRef.current) return;
    setLoading(true);
    setErrorMessage(null);
    worker.current?.postMessage({
      type: "TRANSCRIBE",
      audio: audioDataRef.current,
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setText("");
    try {
      const buffer = await file.arrayBuffer();
      const decoded = await new AudioContext().decodeAudioData(buffer);
      const ctx = new OfflineAudioContext(1, decoded.duration * 16000, 16000);
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      source.start();
      const rendered = await ctx.startRendering();
      audioDataRef.current = rendered.getChannelData(0);
      setAudioURL(URL.createObjectURL(file));
    } catch {
      setErrorMessage("Error processing audio file");
    }
  };

  const handleDelete = (id: string) => {
    setTranscripts((p) => {
      const u = p.filter((t) => t.id !== id);
      localStorage.setItem("transcripts", JSON.stringify(u));
      return u;
    });
  };

  const handleReset = () => {
    setText("");
    setAudioURL("");
    setErrorMessage(null);
    audioDataRef.current = null;
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-10 w-full bg-gradient-to-br from-[#012b28] via-black to-teal-950 overflow-hidden">
      <div className="relative z-10 p-4 md:p-8">
        <div className="w-full max-w-2xl lg:max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center items-center mb-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Speech to Text
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-lg">
              In-browser voice transcription powered by AI
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
            <div className="space-y-4 md:space-y-6">
              {modelLoading && (
                <div className="flex items-center justify-center space-x-3 p-4 bg-slate-800/80 rounded-xl backdrop-blur-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
                  <span className="text-gray-300">Loading AI model...</span>
                </div>
              )}

              {errorMessage && (
                <div className="text-red-400 bg-red-900/20 p-3 rounded-xl border border-red-800/50 backdrop-blur-sm">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-center gap-4">
                <RecorderControls
                  onRecord={(blob, audio) => {
                    audioDataRef.current = audio;
                    setAudioURL(URL.createObjectURL(blob));
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 text-sm bg-slate-700/80 hover:bg-slate-600/80 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 px-6 md:px-8 flex items-center justify-center"
                >
                  <Upload className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  Upload Audio
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {audioURL && (
                <audio
                  controls
                  src={audioURL}
                  className="w-full rounded-xl border border-slate-600/50 bg-slate-900/80 backdrop-blur-sm"
                />
              )}

              {audioDataRef.current && (
                <div className="flex justify-center pt-2 md:pt-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={transcribe}
                      disabled={modelLoading || loading}
                      className="h-12 bg-gradient-to-r cursor-pointer from-teal-600 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 px-6 md:px-8"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin w-4 md:w-5 h-4 md:h-5 mr-2" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                          Transcribe
                        </>
                      )}
                    </Button>

                    {(text || audioURL) && (
                      <Button
                        onClick={handleReset}
                        className="h-12 bg-slate-700/80 hover:bg-slate-600/80 text-white font-semibold rounded-xl transition-all duration-300 px-6 md:px-8"
                      >
                        <RotateCcw className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <Textarea
                value={text}
                readOnly
                placeholder="Transcribed text will appear here..."
                className="resize-none h-32 md:h-[200px] bg-slate-900/80 border-slate-600/50 text-gray-100 placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 rounded-xl md:rounded-2xl leading-relaxed backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>

          <TranscriptList transcripts={transcripts} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}