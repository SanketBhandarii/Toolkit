import Transcriber from "@/components/speech-to-text/Transcriber";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whisper Web",
  description: "voice-to-text tool where users can upload or record an audio clip, and the system will convert it into text",
};

export default function WhisperWebPage() {
  return (
    <div>
      <Transcriber />
    </div>
  );
}
