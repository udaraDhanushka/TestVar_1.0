'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { StudyStats } from '@/components/dashboard/study-stats';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

export default function Dashboard() {
  const { data: session } = useSession();
  const [studyData, setStudyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/sessions');
        if (response.ok) {
          const sessions = await response.json();
          const processedData = sessions.map((session: any) => ({
            date: session.startTime,
            correctAnswers: session.result.correctAnswers || 0,
            totalCards: session.result.totalCards || 0,
          }));
          setStudyData(processedData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  const first_name = session?.user?.name?.split(' ')[0] || 'User';

  return (
    <div className="space-y-6 p-6 backdrop-blur-sm rounded-lg mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold">Welcome back, {first_name}</h1>
      {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StudyStats sessions={studyData} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
      </div>
    </div>
  );
}