"use client";

import { ClipboardCopy, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import './styles.css'
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
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg md:text-xl font-semibold text-teal-400 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Extracted Text
        </h3>
        <Button
          onClick={copyText}
          className="bg-slate-700/80 hover:bg-slate-600/80 text-white rounded-xl transition-all duration-300 cursor-pointer h-10 px-4"
        >
          {copied ? (
            <span className="text-sm text-green-400">Copied!</span>
          ) : (
            <ClipboardCopy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 max-h-[400px] overflow-y-auto pre">
        <pre className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">
          {text.trim()}
        </pre>
      </div>
    </div>
  );
}