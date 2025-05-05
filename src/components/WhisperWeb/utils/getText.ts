"use client";
// utils/getText.ts
import { pipeline } from "@xenova/transformers";

// Cache the transcriber across
export const getTextFromAudio = async (audioFile: File | Blob) => {
  try {
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en"
    );
    // const result = await transcriber(audioFile);
    // return result;
  } catch (error) {
    console.error("Error initializing transcriber:", error);
    throw new Error("Failed to initialize speech recognition model");
  }
};
