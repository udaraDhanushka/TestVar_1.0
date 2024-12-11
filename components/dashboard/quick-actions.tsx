'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  BookOpen,
  Clock,
  Settings,
  BarChart2,
} from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/collections/new">
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </Link>
        <Link href="/collections">
          <Button variant="outline" className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            Study Sets
          </Button>
        </Link>
        <Link href="/sessions">
          <Button variant="outline" className="w-full">
            <Clock className="h-4 w-4 mr-2" />
            Sessions
          </Button>
        </Link>
        <Link href="/stats">
          <Button variant="outline" className="w-full">
            <BarChart2 className="h-4 w-4 mr-2" />
            Statistics
          </Button>
        </Link>
      </div>
    </Card>
  );
}