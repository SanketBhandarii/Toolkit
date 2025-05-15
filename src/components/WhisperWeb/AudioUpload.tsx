import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AudioUpload = ({
  audioFile,
  setAudioFile,
  setSendAudio,
  processing,
  setProcessing,
}: {
  audioFile: File | null;
  setAudioFile: (file: File) => void;
  setSendAudio: (sendAudio: boolean) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  function handleSendAudio() {
    if (!processing) {
      setProcessing(true);
      setSendAudio(true);
    }
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "recorded-audio.webm", {
          type: "audio/webm",
        });
        setAudioFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access error: " + err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex max-[533px]:flex-col max-[533px]:gap-3 items-center justify-center gap-7">
      <Button
        size="lg"
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className="bg-neutral-400 text-white py-2 px-4 rounded hover:bg-neutral-500 cursor-pointer text-sm transition-colors duration-300"
      >
        {isRecording ? "Stop Recording" : "Record Audio"}
      </Button>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="bg-neutral-700 text-white py-2.5 px-4 text-sm rounded cursor-pointer hover:bg-neutral-800 transition-colors duration-300"
      >
        Upload Audio File
      </label>

      {audioFile && (
        <Button
          size="lg"
          onClick={handleSendAudio}
          className="bg-zinc-400 text-white py-2 px-4 rounded hover:bg-zinc-500 cursor-pointer text-sm transition-colors duration-300"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Text generating
            </div>
          ) : (
            <div>Send audio</div>
          )}
        </Button>
      )}
    </div>
  );
};

export default AudioUpload;
