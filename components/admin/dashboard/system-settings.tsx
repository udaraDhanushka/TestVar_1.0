'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyLimitControl } from "./system-settings/daily-limit-control";
import { MaintenanceMode } from "./system-settings/maintenance-mode";
import { CheckCircle2 } from "lucide-react";

export function SystemSettings() {
  const [dailyLimit, setDailyLimit] = useState(20);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveSettings = () => {
    // Save settings logic 
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DailyLimitControl 
            value={dailyLimit} 
            onChange={setDailyLimit} 
          />
          <div className="space-y-2">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
            {showSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Settings saved successfully</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MaintenanceMode />
    </div>
  );
}