import React, { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TranscriptionDisplay = ({
  audioFile,
  sendAudio,
}: {
  audioFile: File | null;
  sendAudio: boolean;
}) => {
  const [transcription, setTranscription] = useState("");

  useEffect(() => {
    const transcribe = async () => {
      if (!audioFile || !sendAudio) return;
      const formData = new FormData();
      formData.append("file", audioFile);
      try {
        const { data } = await axios.post("/api/transcribe", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTranscription(data?.text);
      } catch {
        alert("Error transcribing audio");
      }
    };

    transcribe();
  }, [sendAudio]);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    alert("Text copied to clipboard!");
  };

  if (!transcription) return null;

  return (
    <div className="mt-6 space-y-4">
      <Textarea
        value={transcription}
        readOnly
        className="w-full p-4 border border-neutral-400 rounded-lg bg-neutral-200 text-netural-600"
        rows={5}
      />
      <Button
        variant="outline"
        onClick={handleCopy}
        className="w-full text-white bg-zinc-600 hover:bg-zinc-700 transition-colors duration-300 cursor-pointer"
      >
        Copy Text
      </Button>
    </div>
  );
};

export default TranscriptionDisplay;
