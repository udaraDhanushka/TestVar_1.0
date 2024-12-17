'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCw } from 'lucide-react';

export default function StudyResults({ params }: { params: Promise<{ setId: string }>}) {
  const router = useRouter();
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {setId} = use(params);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/sessions');
        if (response.ok) {
          const data = await response.json();
          // Get the most recent session for this set
          const latestSession = data[0];
          setResults(latestSession?.result);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [setId]);

  if (isLoading) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Set
      </Button>

      <Card className="mt-6 p-8">
        <h1 className="text-2xl font-bold mb-6">Study Session Complete!</h1>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Cards Studied</p>
              <p className="text-2xl font-bold">{results?.totalCards || 0}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className='text-2xl font-bold'>
                {(() => {
                  const ratings = Object.values(results?.ratings || {}) as number[];
                  const total = ratings.reduce((a, b) => a + b, 0);
                  const average = total / (ratings.length || 1);
                  return average.toFixed(2);
                })()}
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push(`/study/${setId}`)}>
              <RotateCw className="h-4 w-4 mr-2" />
              Study Again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}