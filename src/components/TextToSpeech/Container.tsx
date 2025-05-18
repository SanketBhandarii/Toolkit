"use client";

import React, { useState } from "react";
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
import { getSpeech } from "./utils/getSpeech";
import "./styles.css";

type Status = "idle" | "generating" | "speaking";

const MAX_CHARS = 400;

const Container = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("US-Male");
  const [status, setStatus] = useState<Status>("idle");

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
    <div className="bg-neutral-800 drop-shadow-xl rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h1 className="font-semibold text-2xl text-center text-gray-300">
        In Browser Text to Speech
      </h1>

      <div className="mt-4">
        <Label className="text-sm text-gray-300">Write your text here</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here."
          className="border-neutral-500 text-gray-300 mt-2 outline-none resize-none min-h-[100px] max-h-[250px] overflow-auto textarea"
          maxLength={MAX_CHARS}
        />
        <div className="text-right text-xs text-neutral-500 mt-1">
          {text.length}/{MAX_CHARS}
        </div>
      </div>

      <Select value={voice} onValueChange={setVoice}>
        <SelectTrigger className="w-[180px] cursor-pointer textarea border-neutral-500 text-white mt-4">
          <SelectValue>{voice}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-neutral-800 border-neutral-500">
          {["US-Male", "US-Female"].map((v) => (
            <SelectItem
              key={v}
              value={v}
              className="cursor-pointer text-gray-300 hover:bg-neutral-700"
            >
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleGenerateSpeech}
        disabled={status !== "idle" || !text.trim()}
        className="mt-6 bg-neutral-700 text-white cursor-pointer w-full sm:w-auto"
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
