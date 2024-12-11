'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsOverview } from '@/components/admin/dashboard/stats-overview';
import { ActivityLog } from '@/components/admin/dashboard/activity-log';
import { SystemSettings } from '@/components/admin/dashboard/system-settings';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-8">
        <StatsOverview />
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="mb-8">
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <ActivityLog />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}