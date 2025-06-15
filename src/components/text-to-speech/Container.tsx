"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2, Volume2, Mic } from "lucide-react";
import AudioClipList from "./AudioClipList";
import "./styles.css";
import { base64ToBlob, blobToBase64 } from "./utils/convert";

const MAX_CHARS = 445;

export const VOICES = [
  { label: "American Female – Default", id: "af" },
  { label: "American Female – Bella", id: "af_bella" },
  { label: "American Female – Nicole", id: "af_nicole" },
  { label: "American Female – Sarah", id: "af_sarah" },
  { label: "American Female – Sky", id: "af_sky" },
  { label: "American Male – Adam", id: "am_adam" },
  { label: "American Male – Michael", id: "am_michael" },
  { label: "British Female – Emma", id: "bf_emma" },
  { label: "British Female – Isabella", id: "bf_isabella" },
  { label: "British Male – George", id: "bm_george" },
  { label: "British Male – Lewis", id: "bm_lewis" },
];

type Status = "idle" | "generating" | "speaking";
type VoiceId = (typeof VOICES)[number]["id"];

export interface AudioClip {
  id: string;
  text: string;
  voice: string;
  blobUrl: string;
  base64: string;
}

const Container = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<VoiceId>("am_michael");
  const [status, setStatus] = useState<Status>("idle");
  const [audioClips, setAudioClipsState] = useState<AudioClip[]>([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const lastSentTextRef = useRef("");
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const setAudioClips = (clips: AudioClip[]) => {
    setAudioClipsState(clips);
    localStorage.setItem("audioClips", JSON.stringify(clips));
  };

  useEffect(() => {
    const stored = localStorage.getItem("audioClips");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AudioClip[];
        setAudioClipsState(
          parsed.map((clip) => ({
            ...clip,
            blobUrl: URL.createObjectURL(base64ToBlob(clip.base64)),
          }))
        );
      } catch (e) {
        console.error("Load error:", e);
      }
    }
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL("./utils/worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.onmessage = async ({ data }) => {
      if (data.type === "MODEL_LOADED") return setModelLoaded(true);

      if (data.type === "SPEECH_RESULT") {
        const blob = new Blob([data.wavBuffer], { type: "audio/wav" });
        const base64 = await blobToBase64(blob);
        const clip: AudioClip = {
          id: Date.now().toString(),
          text: lastSentTextRef.current,
          voice,
          blobUrl: URL.createObjectURL(blob),
          base64,
        };
        playAudio(data.audio, data.sampling_rate);
        setAudioClips([clip, ...audioClips]);
        setStatus("idle");
      }

      if (data.type === "ERROR") {
        console.error(data.message);
        setStatus("idle");
      }
    };

    worker.postMessage({ type: "LOAD_MODEL" });
    return () => worker.terminate();
  }, [audioClips, voice]);

  const playAudio = (audio: Float32Array, rate: number) => {
    const ctx = new AudioContext();
    const buf = ctx.createBuffer(1, audio.length, rate);
    buf.copyToChannel(audio, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.onended = () => setStatus("idle");
    setStatus("speaking");
    src.start();
  };

  const handleSpeak = () => {
    if (!text.trim() || !workerRef.current || !modelLoaded) return;
    setStatus("generating");
    lastSentTextRef.current = text;
    workerRef.current.postMessage({
      type: "GENERATE_SPEECH",
      payload: { text, voice },
    });
  };

  return (
    <div className="min-h-screen pt-10 w-full bg-gradient-to-br from-[#012b28] via-black to-teal-950 overflow-hidden">
      <div className="relative z-10 p-4 md:p-8">
        <div className="w-full max-w-2xl lg:max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center items-center mb-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Voice Generation
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-lg">
              Transform your text into lifelike speech instantly
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
            <div className="space-y-4 md:space-y-6">
              <div className="relative">
                <Label className="text-sm font-medium text-gray-300 mb-3 block">
                  Enter your text
                </Label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={MAX_CHARS}
                  disabled={status !== "idle" || !modelLoaded}
                  placeholder="Type something amazing to convert to speech..."
                  className="resize-none h-32 md:h-[200px] bg-slate-900/80 border-slate-600/50 text-gray-100 placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 rounded-xl md:rounded-2xl leading-relaxed backdrop-blur-sm transition-all duration-300"
                />
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 px-2 md:px-3 py-1 bg-slate-700/80 rounded-full text-xs text-gray-400 backdrop-blur-sm">
                  {text.length}/{MAX_CHARS}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Voice Selection
                </Label>
                <Select
                  value={voice}
                  onValueChange={(v: VoiceId) => setVoice(v)}
                >
                  <SelectTrigger className="w-full bg-slate-900/80 border-slate-600/50 text-gray-100 rounded-xl md:rounded-2xl h-10 md:h-12 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300">
                    <SelectValue>
                      {VOICES.find((v) => v.id === voice)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 border-slate-600/50 rounded-xl backdrop-blur-xl max-h-[300px]">
                    {VOICES.map(({ id, label }) => (
                      <SelectItem
                        key={id}
                        value={id}
                        className="text-gray-300 hover:bg-slate-800/80 focus:bg-slate-800/80 rounded-lg"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center pt-2 md:pt-4">
                <Button
                  onClick={handleSpeak}
                  disabled={status !== "idle" || !text.trim() || !modelLoaded}
                  className="w-full max-w-xs h-12 md:h-14 bg-gradient-to-r from-teal-600 to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl md:rounded-2xl transition-all duration-300 transform hover:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer"
                >
                  {status === "generating" ? (
                    <>
                      <Loader2 className="animate-spin w-4 md:w-5 h-4 md:h-5 mr-2" />
                      Crafting audio magic...
                    </>
                  ) : status === "speaking" ? (
                    <>
                      <Volume2 className="w-4 md:w-5 h-4 md:h-5 mr-2 animate-pulse" />
                      Playing audio...
                    </>
                  ) : !modelLoaded ? (
                    <>
                      <Loader2 className="animate-spin w-4 md:w-5 h-4 md:h-5 mr-2" />
                      Loading AI model...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                      Generate Speech
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8">
            <AudioClipList
              audioClips={audioClips}
              playingId={playingId}
              setPlayingId={setPlayingId}
              currentAudioRef={currentAudioRef}
              setAudioClips={setAudioClips}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
