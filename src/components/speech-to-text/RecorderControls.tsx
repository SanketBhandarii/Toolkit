"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

export default function RecorderControls({
  onRecord,
}: {
  onRecord: (blob: Blob, audio: Float32Array) => void;
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | null>(null);

  async function resampleTo16k(audioBuffer: AudioBuffer): Promise<Float32Array> {
    const offlineCtx = new OfflineAudioContext(1, 16000 * audioBuffer.duration, 16000);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);
    const rendered = await offlineCtx.startRendering();
    return rendered.getChannelData(0);
  }

  const start = async () => {
    stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream.current);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);

    mediaRecorder.current.onstop = async () => {
      stream.current?.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const buffer = await blob.arrayBuffer();
      const audioBuffer = await new AudioContext().decodeAudioData(buffer);
      const float32Audio = await resampleTo16k(audioBuffer);
      onRecord(blob, float32Audio);
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <Button
      onClick={recording ? stop : start}
      className={`h-12 font-semibold rounded-xl transition-all duration-300 px-6 md:px-8 cursor-pointer ${
        recording
          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:opacity-80'
          : 'bg-gradient-to-r from-teal-600 to-blue-600 hover:opacity-80'
      } text-white`}
    >
      {recording ? (
        <>
          <Square className="w-4 md:w-5 h-4 md:h-5" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="w-4 md:w-5 h-4 md:h-5" />
          Record
        </>
      )}
    </Button>
  );
}
