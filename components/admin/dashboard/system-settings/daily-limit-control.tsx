'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function DailyLimitControl({ value, onChange }: { 
  value: number; 
  onChange: (value: number) => void;
}) {
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