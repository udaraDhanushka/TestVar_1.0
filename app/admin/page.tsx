'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsOverview } from '@/components/admin/dashboard/stats-overview';
import { ActivityLog } from '@/components/admin/dashboard/activity-log';
import { SystemSettings } from '@/components/admin/dashboard/system-settings';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';


export default function AdminDashboard() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className='flex items-center space-x-4'>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <header className="mb-8">
            <h1 className="text-4xl font-bold">TestVar Admin</h1>
            <p className="text-muted-foreground mt-2">
              Manage your flashcard platform resources and monitor user activity
            </p>
          </header>
        </div>
        <div className="mb-8">
          <StatsOverview />
        </div>

        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">User Activity</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <ActivityLog />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}