"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex items-center gap-2 ", className)}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer "
      />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-6 w-24 md:text-xs"
        placeholder="#000000"
      />
    </div>
  );
}
