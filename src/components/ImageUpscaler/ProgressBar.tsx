"use client";

import { Progress } from "@/components/ui/progress";

type Props = {
  value: number;
};

export default function ProgressBar({ value }: Props) {
  return (
    <div className="space-y-2 w-full">
      <p className="text-sm font-medium text-gray-600">Progress: {value}%</p>
      <Progress value={value} />
    </div>
  );
}
