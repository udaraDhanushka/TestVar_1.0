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
import { useToast } from '@/hooks/use-toast';

interface HiddenCardToggleProps {
  flashcardId: number;
  initialHidden?: boolean;
  onToggle?: (isHidden: boolean) => void;
}

export function HiddenCardToggle({
  flashcardId,
  initialHidden = false,
  onToggle,
}: HiddenCardToggleProps) {
  const [isHidden, setIsHidden] = useState(initialHidden);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hidden-cards', {
        method: isHidden ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flashcardId }),
      });

      if (response.ok) {
        setIsHidden(!isHidden);
        onToggle?.(!isHidden);
        
        toast({
          title: isHidden ? 'Card unhidden' : 'Card hidden',
          description: isHidden 
            ? 'This card will now appear in your study sessions'
            : 'This card will be skipped in future study sessions',
        });
      }
    } catch (error) {
      console.error('Failed to toggle card visibility:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update card visibility',
      });
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
            onClick={handleToggle}
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