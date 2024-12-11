'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Setting {
  id: number;
  settingKey: string;
  settingValue: string;
}

export function SystemSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [newSetting, setNewSetting] = useState({ key: '', value: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSetting = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newSetting.key,
          value: newSetting.value,
        }),
      });

      if (response.ok) {
        setNewSetting({ key: '', value: '' });
        fetchSettings();
        toast({
          title: 'Setting added',
          description: 'The new setting has been saved successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to add setting:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add new setting',
      });
    }
  };

  const handleDeleteSetting = async (key: string) => {
    try {
      const response = await fetch(`/api/settings?key=${key}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSettings();
        toast({
          title: 'Setting deleted',
          description: 'The setting has been removed successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to delete setting:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete setting',
      });
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">System Settings</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="settingKey">Setting Key</Label>
            <Input
              id="settingKey"
              placeholder="Enter setting key"
              value={newSetting.key}
              onChange={(e) =>
                setNewSetting({ ...newSetting, key: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="settingValue">Setting Value</Label>
            <Input
              id="settingValue"
              placeholder="Enter setting value"
              value={newSetting.value}
              onChange={(e) =>
                setNewSetting({ ...newSetting, value: e.target.value })
              }
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddSetting} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Setting
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{setting.settingKey}</p>
                <p className="text-sm text-gray-600">{setting.settingValue}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteSetting(setting.settingKey)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}