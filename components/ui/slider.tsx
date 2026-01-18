"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  minLabel?: string;
  maxLabel?: string;
}

function Slider({ className, defaultValue, value, min = 0, max = 100, minLabel, maxLabel, ...props }: SliderProps) {
  const values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );

  const currentValue = values[0];

  return (
    <div className="w-full space-y-4 min-w-40">
      {/* Top labels */}
      <div className="relative flex justify-between text-xs text-muted-foreground">
        <span>{minLabel ?? min}</span>
        <span className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-foreground">
          {currentValue} x {currentValue}
        </span>
        <span>{maxLabel ?? max}</span>
      </div>

      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        {/* Track */}
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-1 w-full overflow-hidden rounded-full bg-background"
        >
          {/* Active range */}
          <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>

        {/* Thumbs */}
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            className={cn(
              "group relative block h-5 w-5 rounded-full border border-border bg-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            )}
          >
            {/* Inner primary dot (active state) */}
            <span
              className={cn(
                "absolute inset-1.25 rounded-full bg-primary opacity-0 transition-opacity",
                "group-focus-visible:opacity-100 group-active:opacity-100",
              )}
            />
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider };
