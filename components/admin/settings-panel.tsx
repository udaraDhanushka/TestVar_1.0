'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Save, Trash2 } from 'lucide-react';

interface Setting {
  id: number;
  settingKey: string;
  settingValue: string;
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [newSetting, setNewSetting] = useState({ key: '', value: '' });
  const [isLoading, setIsLoading] = useState(true);

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
      }
    } catch (error) {
      console.error('Failed to add setting:', error);
    }
  };

  const handleDeleteSetting = async (key: string) => {
    try {
      const response = await fetch(`/api/settings?key=${key}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSettings();
      }
    } catch (error) {
      console.error('Failed to delete setting:', error);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Global Settings</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Input
            placeholder="Setting Key"
            value={newSetting.key}
            onChange={(e) =>
              setNewSetting({ ...newSetting, key: e.target.value })
            }
          />
          <Input
            placeholder="Setting Value"
            value={newSetting.value}
            onChange={(e) =>
              setNewSetting({ ...newSetting, value: e.target.value })
            }
          />
          <Button onClick={handleAddSetting}>
            <Plus className="h-4 w-4 mr-2" />
            Add Setting
          </Button>
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