'use client';

import { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HideCardButtonProps {
  flashcardId: number;
}

export function HideCardButton({ flashcardId }: HideCardButtonProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleHidden = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hidden-cards', {
        method: isHidden ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        ...(isHidden
          ? { params: { flashcardId } }
          : { body: JSON.stringify({ flashcardId }) }),
      });

      if (response.ok) {
        setIsHidden(!isHidden);
      }
    } catch (error) {
      console.error('Failed to toggle card visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleHidden}
            disabled={isLoading}
            className={isHidden ? 'text-gray-400' : ''}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isHidden ? 'Unhide card' : 'Hide card'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}