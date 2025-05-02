import React from "react";

const AudioPlayer = ({ src }: { src: string }) => {
  return (
    <div className="mt-4 w-full">
      <audio
        key={src}
        controls
        className="w-full rounded-lg border border-neutral-300"
      >
        <source src={src} type="audio/webm" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
