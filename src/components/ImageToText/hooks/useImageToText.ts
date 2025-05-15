"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

export function useImageToText() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const processImage = async (file: File) => {
    setLoading(true);
    setText("");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const imgData = reader.result as string;
        const { data } = await Tesseract.recognize(imgData, "eng");
        setText(data.text || "No text found");
      } catch (err) {
        console.error("OCR error:", err);
        setText("Error processing the image.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      setText("Error reading the image file.");
      setLoading(false);
    };
  };

  return { text, loading, processImage };
}
