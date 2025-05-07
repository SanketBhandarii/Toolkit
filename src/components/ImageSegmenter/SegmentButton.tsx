"use client";

import { Button } from "@/components/ui/button";

interface SegmentButtonProps {
  disabled?: boolean;
  onClick: () => void;
  loading: boolean;
}

export default function SegmentButton({
  disabled,
  onClick,
  loading,
}: SegmentButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg cursor-pointer"
    >
      {loading ? "Segmenting..." : "Segment"}
    </Button>
  );
}
