"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function UpscaleOptions({
  value,
  onChange,
}: {
  value: "2x" | "3x";
  onChange: (val: "2x" | "3x") => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-center font-medium mb-2">Upscale Factor</h3>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as "2x" | "3x")}
        className="flex justify-center gap-6"
      >
        {["2x", "3x"].map((val) => (
          <div key={val} className="flex items-center space-x-2">
            <RadioGroupItem value={val} id={val} className="cursor-pointer" />
            <Label htmlFor={val} className="font-semibold cursor-pointer">
              {val}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
