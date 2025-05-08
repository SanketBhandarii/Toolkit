import TextToSpeech from "@/components/TextToSpeech";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Text to Speech",
  description:
    "text-to-speech tool where users can upload or record an audio clip, and the system will convert it into text",
};

const page = () => {
  return (
    <div>
      <TextToSpeech />
    </div>
  );
};

export default page;
