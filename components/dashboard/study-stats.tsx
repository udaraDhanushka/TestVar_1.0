'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StudyStatsProps {
  sessions: {
    date: string;
    correctAnswers: number;
    totalCards: number;
  }[];
}

export function StudyStats({ sessions }: StudyStatsProps) {
  const data = sessions.map(session => ({
    date: new Date(session.date).toLocaleDateString(),
    accuracy: ((session.correctAnswers / session.totalCards) * 100).toFixed(1),
    cards: session.totalCards,
  }));

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Study Progress</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#4f46e5"
              name="Accuracy (%)"
            />
            <Line
              type="monotone"
              dataKey="cards"
              stroke="#10b981"
              name="Cards Studied"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}