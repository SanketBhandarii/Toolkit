"use client";

import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ToolbarProps {
  onDownload: () => void;
  onClear: () => void;
  hasResult: boolean;
  resultUrl: string | null;
  setResultUrl: (url: string | null) => void;
}

export default function Toolbar({
  onDownload,
  onClear,
  hasResult,
  resultUrl,
  setResultUrl,
}: ToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="relative border rounded-lg overflow-hidden">
        <img
          src={resultUrl || ""}
          alt="Segmented"
          className="w-full object-contain max-h-80"
        />
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={() => setResultUrl(null)}
          variant="outline"
          className="flex-1"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={onDownload}
          className="flex-1 bg-sky-600 hover:bg-sky-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      <Button
        onClick={onClear}
        variant="ghost"
        className="w-full text-gray-500 cursor-pointer"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Start Over
      </Button>
    </div>
  );
}
