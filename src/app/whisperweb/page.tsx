import { Metadata } from "next";

import WhisperWeb from "@/components/WhisperWeb";

export const metadata: Metadata = {
  title: "Whisper Web",
  description:
    "voice-to-text tool where users can upload or record an audio clip, and the system will convert it into text",
};

const page = () => {
  return (
    <div>
      <WhisperWeb />
    </div>
  );
};

export default page;
