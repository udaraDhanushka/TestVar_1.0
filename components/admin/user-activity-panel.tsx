'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserActivity {
  id: number;
  name: string;
  email: string;
  lastActive: string;
  totalSessions: number;
  averageRating: number;
}

export function UserActivityPanel() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const fetchUserActivity = async () => {
    try {
      const response = await fetch('/api/admin/user-activity');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading user activity...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">User Activity</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Total Sessions</TableHead>
            <TableHead>Avg. Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.name}</TableCell>
              <TableCell>{activity.email}</TableCell>
              <TableCell>
                {new Date(activity.lastActive).toLocaleDateString()}
              </TableCell>
              <TableCell>{activity.totalSessions}</TableCell>
              <TableCell>{activity.averageRating.toFixed(1)}/5</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}