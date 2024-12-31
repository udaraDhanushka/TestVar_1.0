'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function MaintenanceMode() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Mode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Enable Maintenance Mode</Label>
          <Button 
            variant="destructive"
            onClick={() => setIsEnabled(!isEnabled)}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Enabling maintenance mode will temporarily disable new flashcard creation
          and user registration
        </p>
      </CardContent>
    </Card>
  );
}