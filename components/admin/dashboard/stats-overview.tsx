'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, BookOpen, Clock, Settings } from 'lucide-react';

interface StatsData {
  totalUsers: number;
  totalFlashcards: number;
  totalSessions: number;
  activeUsers: number;
}

export function StatsOverview() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/analytics');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Total Flashcards',
      value: stats.totalFlashcards,
      icon: BookOpen,
      color: 'text-green-500',
    },
    {
      title: 'Study Sessions',
      value: stats.totalSessions,
      icon: Clock,
      color: 'text-purple-500',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Settings,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}