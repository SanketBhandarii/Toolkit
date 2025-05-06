"use client";

import React from "react";
import dynamic from "next/dynamic";
const TextToSpeech = () => {
  const HeavyComponent = dynamic(() => import("./Container"), {
    ssr: false,
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <HeavyComponent />
    </div>
  );
};

export default TextToSpeech;
