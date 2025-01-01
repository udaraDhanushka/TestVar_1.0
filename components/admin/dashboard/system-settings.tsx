'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyLimitControl } from "./system-settings/daily-limit-control";
import { MaintenanceMode } from "./system-settings/maintenance-mode";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function SystemSettings() {
  const [dailyLimit, setDailyLimit] = useState(20); 
  const [showSuccess, setShowSuccess] = useState(false); 

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'daily_limit', value: dailyLimit }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Settings saved successfully.' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const error = await response.json();
        toast({ title: 'Error', description: error.message || 'Failed to save settings.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An error occurred while saving settings.' });
    }
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