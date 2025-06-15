"use client";

import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Download, Play, Pause, X } from "lucide-react";
import { AudioClip, VOICES } from "./Container";

interface Props {
  audioClips: AudioClip[];
  playingId: string | null;
  setPlayingId: (id: string | null) => void;
  currentAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setAudioClips: (clips: AudioClip[]) => void;
}

const AudioClipList: React.FC<Props> = ({
  audioClips,
  playingId,
  setPlayingId,
  currentAudioRef,
  setAudioClips,
}) => {
  const playClip = (clip: AudioClip) => {
    if (playingId === clip.id) {
      currentAudioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    currentAudioRef.current?.pause();
    const audio = new Audio(clip.blobUrl);
    currentAudioRef.current = audio;
    setPlayingId(clip.id);
    audio.onended = () => {
      setPlayingId(null);
      currentAudioRef.current = null;
    };
    audio.play();
  };

  const deleteClip = (clipId: string) => {
    const updated = audioClips.filter(c => c.id !== clipId);
    setAudioClips(updated);
    if (playingId === clipId) {
      setPlayingId(null);
      currentAudioRef.current?.pause();
    }
  };

  const downloadClip = (clip: AudioClip) => {
    const a = document.createElement("a");
    a.href = clip.blobUrl;
    a.download = `speech_${clip.id}.wav`;
    a.click();
  };

  if (audioClips.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
      <Label className="text-sm font-medium text-gray-300 mb-4 block">Previous Audio Clips</Label>
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {audioClips.map((clip) => (
          <div
            key={clip.id}
            className="flex items-center gap-3 p-3 md:p-4 bg-slate-900/60 border border-slate-600/30 rounded-xl backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300"
          >
            <Button
              onClick={() => playClip(clip)}
              className="flex-shrink-0 bg-gradient-to-r text-white from-teal-800 to-blue-600 hover:opacity-80 w-8 h-8 md:w-10 md:h-10 p-0 rounded-lg"
            >
              {playingId === clip.id ? (
                <Pause className="w-3 h-3 md:w-4 md:h-4" />
              ) : (
                <Play className="w-3 h-3 md:w-4 md:h-4" />
              )}
            </Button>

            <div className="flex-grow min-w-0">
              <p className="text-xs md:text-sm text-gray-300 truncate">
                {clip.text.slice(0, 60)}{clip.text.length > 60 ? "..." : ""}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {VOICES.find(v => v.id === clip.voice)?.label.split(' – ')[1] || 'Voice'}
              </p>
            </div>

            <Button
              onClick={() => downloadClip(clip)}
              className="flex-shrink-0 cursor-pointer bg-slate-700/80 hover:bg-slate-600/80 w-8 h-8 md:w-10 md:h-10 p-0 rounded-lg"
            >
              <Download className="w-3 h-3 md:w-4 md:h-4 text-gray-300" />
            </Button>

            <Button
              onClick={() => deleteClip(clip.id)}
              className="flex-shrink-0 text-white cursor-pointer bg-red-600/80 hover:bg-red-500/80 w-8 h-8 md:w-10 md:h-10 p-0 rounded-lg"
            >
              <X className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioClipList;