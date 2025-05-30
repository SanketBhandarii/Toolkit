"use client";

interface Props {
  imageUrl: string;
  onReset: () => void;
}

export default function PreviewImage({ imageUrl, onReset }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <img
        src={imageUrl}
        alt="Preview"
        className="max-w-xs rounded-xl shadow-md"
      />
      <button
        onClick={onReset}
        className="text-left text-sm text-red-300 hover:underline cursor-pointer"
      >
        Remove Image
      </button>
    </div>
  );
}
