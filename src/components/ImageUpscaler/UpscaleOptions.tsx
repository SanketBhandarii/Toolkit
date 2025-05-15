"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function UpscaleOptions({
  value,
  loading,
  onChange,
}: {
  value: "2x" | "3x";
  loading: boolean;
  onChange: (val: "2x" | "3x") => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <h3 className="text-lg font-semibold text-center">Upscale Factor</h3>
      <RadioGroup
        value={value}
        disabled={loading}
        onValueChange={(v) => onChange(v as "2x" | "3x")}
        className="flex gap-6"
      >
        {["2x", "3x"].map((val) => (
          <div key={val} className="flex items-center space-x-2">
            <RadioGroupItem value={val} id={val} className="cursor-pointer" />
            <Label htmlFor={val} className="font-medium cursor-pointer">
              {val}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
