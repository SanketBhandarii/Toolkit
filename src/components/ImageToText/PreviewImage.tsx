"use client";

interface Props {
  imageUrl: string;
  onReset: () => void;
}

export default function PreviewImage({ imageUrl, onReset }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={imageUrl}
        alt="Preview"
        className="max-w-sm rounded-xl shadow-md"
      />
      <button
        onClick={onReset}
        className="text-left text-sm text-red-400 hover:underline cursor-pointer"
      >
        Remove Image
      </button>
    </div>
  );
}
