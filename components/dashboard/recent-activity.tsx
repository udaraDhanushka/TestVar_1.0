'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Session } from '@prisma/client';

export function RecentActivity() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch('/api/sessions');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)){
          setSessions(data.slice(0, 5)); // Get last 5 sessions
          }else {
            console.error('Unexpected data format:', data);
          }
        }else{
          console.error('Failed to fetch sessions. Status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessions();
  }, []);

  if (isLoading) {
    return <div>Loading recent activity...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-4">
      {Array.isArray(sessions) && sessions.length > 0 ? (
        sessions.map((session) => (
          <div
            key={session.id}
            className="flex justify-between items-center py-2 border-b last:border-0"
          >
            <div>
              <p className="font-medium">Study Session</p>
              <p className="text-sm text-gray-500">
              {session.startTime
                ? new Date(session.startTime).toLocaleDateString()
                : 'No start time'
              }
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {session.endTime ? 'Completed' : 'In Progress'}
            </div>
          </div>
        ))
      ):(
        <p className="text-sm text-gray-500">No recent activity available.</p>
      )}
      </div>
    </Card>
  );
}