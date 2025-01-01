'use client';

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DailyLimitControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function DailyLimitControl({ value, onChange }: DailyLimitControlProps) {
  return (
    <div className="space-y-2">
      <Label>Daily Flashcard Set Creation Limit</Label>
      <div className="flex items-center space-x-4">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={50}
          step={1}
          className="flex-1"
        />
        <span className="w-12 text-right">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Maximum number of flashcard sets that can be created per day
      </p>
    </div>
  );
}