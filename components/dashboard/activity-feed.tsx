'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Eye } from 'lucide-react';

interface Activity {
  id: number;
  type: 'study' | 'rating' | 'hidden';
  details: string;
  timestamp: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const [sessionsRes, ratingsRes, hiddenRes] = await Promise.all([
          fetch('/api/sessions'),
          fetch('/api/ratings'),
          fetch('/api/hidden-cards'),
        ]);

        const [sessions, ratings, hidden] = await Promise.all([
          sessionsRes.ok ? sessionsRes.json() : [],
          ratingsRes.ok ? ratingsRes.json() : [],
          hiddenRes.ok ? hiddenRes.json() : [],
        ]);

        const allActivities: Activity[] = [
          ...Array.isArray(sessions)
          ? sessions.map((s: any) => ({
            id: s.id,
            type: 'study' as const,
            details: `Completed study session with ${s.result.totalCards || 0} cards`,
            timestamp: s.endTime || s.startTime,
          }))
          : [],
          ...Array.isArray(ratings)
          ? ratings.map((r: any) => ({
            id: r.id,
            type: 'rating' as const,
            details: `Rated a flashcard ${r.rating}/5`,
            timestamp: r.createdAt,
          }))
          : [],
          ...Array.isArray(hidden)
          ? hidden.map((h: any) => ({
            id: h.id,
            type: 'hidden' as const,
            details: 'Hidden a flashcard from study sessions',
            timestamp: h.hiddenAt,
          }))
          : [],
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setActivities(allActivities.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();
  }, []);

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'study':
        return <Clock className="h-4 w-4" />;
      case 'rating':
        return <Star className="h-4 w-4" />;
      case 'hidden':
        return <Eye className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'study':
        return 'bg-blue-100 text-blue-800';
      case 'rating':
        return 'bg-yellow-100 text-yellow-800';
      case 'hidden':
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={`${activity.type}-${activity.id}`}
            className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50"
          >
            <Badge
              variant="secondary"
              className={`p-1.5 ${getActivityColor(activity.type)}`}
            >
              {getActivityIcon(activity.type)}
            </Badge>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.details}</p>
              <p className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}