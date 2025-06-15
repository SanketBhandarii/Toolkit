"use client";

import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Transcript {
  id: string;
  audioUrl: string;
  text: string;
}

interface TranscriptListProps {
  transcripts: Transcript[];
  onDelete: (id: string) => void;
}

export default function TranscriptList({ transcripts, onDelete }: TranscriptListProps) {
  if (!transcripts.length) return null;

  return (
    <div className="mt-6 md:mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
      <h3 className="text-lg md:text-xl font-semibold text-teal-400 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Past Transcriptions
      </h3>
      <div className="space-y-4">
        {transcripts.map(({ id, text }) => (
          <div
            key={id}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm flex justify-between items-center hover:bg-slate-800/50 transition-all duration-300"
          >
            <p className="text-sm text-gray-200 line-clamp-2 mb-0 flex-1 mr-4 leading-relaxed">
              {text}
            </p>
            <Button
              onClick={() => onDelete(id)}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 rounded-lg p-2 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}