"use client";

import React, { useEffect, useState } from "react";
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
import { loadModel, getSpeech } from "./utils/getSpeech";

type Status = "idle" | "generating" | "speaking";

const MAX_CHARS = 400;

const Container = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("US-Male");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    loadModel();
  }, []);

  const handleGenerateSpeech = async () => {
    if (!text.trim()) return;
    setStatus("generating");

    try {
      const { audio, sampling_rate } = await getSpeech(text, voice);
      const context = new AudioContext();
      const buffer = context.createBuffer(1, audio.length, sampling_rate);
      buffer.copyToChannel(audio, 0);

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.onended = () => setStatus("idle");

      setStatus("speaking");
      source.start();
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="bg-white drop-shadow-xl border-2 border-neutral-200 rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h1 className="font-semibold text-2xl text-center text-neutral-700">
        In Browser Text to Speech
      </h1>

      <div className="mt-4">
        <Label className="text-sm text-neutral-500">Write your text here</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here."
          className="border-neutral-300 mt-2 outline-none resize-none min-h-[100px] max-h-[250px] overflow-auto"
          maxLength={MAX_CHARS}
        />
        <div className="text-right text-xs text-neutral-500 mt-1">
          {text.length}/{MAX_CHARS}
        </div>
      </div>

      <Select value={voice} onValueChange={setVoice}>
        <SelectTrigger className="w-[180px] cursor-pointer border-neutral-300 mt-4">
          <SelectValue>{voice}</SelectValue>
        </SelectTrigger>
        <SelectContent className="border-neutral-300 bg-white">
          {["US-Male", "US-Female"].map((v) => (
            <SelectItem
              key={v}
              value={v}
              className="cursor-pointer hover:bg-neutral-100"
            >
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleGenerateSpeech}
        disabled={status !== "idle" || !text.trim()}
        className={`mt-6 text-white cursor-pointer w-full sm:w-auto ${
          status === "generating"
            ? "bg-yellow-500"
            : status === "speaking"
            ? "bg-green-600"
            : "bg-neutral-800"
        }`}
      >
        {status === "generating"
          ? "Generating..."
          : status === "speaking"
          ? "Speaking..."
          : "Generate"}
      </Button>
    </div>
  );
};

export default Container;
