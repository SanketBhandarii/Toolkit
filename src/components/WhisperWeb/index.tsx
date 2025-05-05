"use client";
import { useState } from "react";

import AudioUpload from "@/components/WhisperWeb/AudioUpload";
import AudioPlayer from "@/components/WhisperWeb/AudioPlayer";
import TranscriptionDisplay from "@/components/WhisperWeb/TranscriptionDisplay";

const Home = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [sendAudio, setSendAudio] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-5">
      <div className="px-6 py-14 max-w-3xl w-full bg-neutral-100 rounded-xl shadow-lg border-dashed border-1 border-neutral-300 space-y-6">
        <h1 className="text-3xl font-bold text-neutral-700 text-center">
          WhisperWeb <span className="text-neutral-300">(Speech to Text)</span>
        </h1>
        <AudioUpload
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          setSendAudio={setSendAudio}
        />
        {audioFile && (
          <p className="mt-2 text-gray-600 text-center">
            File: {audioFile.name}
          </p>
        )}
        {audioFile && <AudioPlayer src={URL.createObjectURL(audioFile)} />}
        {audioFile && (
          <TranscriptionDisplay audioFile={audioFile} sendAudio={sendAudio} />
        )}
      </div>
    </div>
  );
};

export default Home;