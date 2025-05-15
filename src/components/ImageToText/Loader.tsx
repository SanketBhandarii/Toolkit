"use client";

import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Loader() {
  return (
    <Card className="flex justify-center items-center p-8">
      <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      <span className="ml-3 text-gray-600">Processing image...</span>
    </Card>
  );
}
