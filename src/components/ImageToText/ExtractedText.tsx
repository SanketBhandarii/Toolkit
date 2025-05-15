"use client";

import { Card } from "@/components/ui/card";
import { ClipboardCopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  text: string;
}

export default function ExtractedText({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="p-4 space-y-1 bg-white border-none overflow-scroll">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Extracted Text</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyText}
          className="cursor-pointer"
        >
          {copied ? (
            <p className="text-sm text-green-500 pr-2">Copied!</p>
          ) : (
            <ClipboardCopyIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
      <span className="whitespace-pre-wrap text-sm text-gray-800">
        {text.trim()}
      </span>
    </Card>
  );
}
