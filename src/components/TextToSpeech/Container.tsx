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
import "./styles.css";

const MAX_CHARS = 400;
type Status = "idle" | "speaking";

const Container = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        setVoices(allVoices);
        if (!selectedVoice) setSelectedVoice(allVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const handleSpeak = () => {
    if (!text.trim() || status === "speaking") return;

    window.speechSynthesis.cancel(); // cancel any ongoing

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      setStatus("speaking");
    };

    utterance.onend = () => {
      setStatus("idle");
    };

    utterance.onerror = () => {
      setStatus("idle");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleReset = () => {
    if(!text.trim()) return;
    if (window.confirm("This will reset the text. Continue?")) {
      window.speechSynthesis.cancel();
      setText("");
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

      <Label className="text-sm text-gray-300 mt-4 block">Select voice</Label>
      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
        <SelectTrigger className="w-full sm:w-[300px] mt-2 border-neutral-500 text-white cursor-pointer">
          <SelectValue placeholder="Select voice" />
        </SelectTrigger>
        <SelectContent className="bg-neutral-800 border border-neutral-600 max-h-[300px] overflow-y-auto">
          {voices.map((v) => (
            <SelectItem
              key={v.name}
              value={v.name}
              className="text-gray-300 cursor-pointer"
            >
              {v.name} — {v.lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleSpeak}
          disabled={!text.trim() || status === "speaking"}
          className="bg-neutral-700 text-white cursor-pointer w-full sm:w-auto"
        >
          {status === "speaking" ? "Speaking..." : "Speak"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border border-neutral-600 text-gray-300 cursor-pointer"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Container;
