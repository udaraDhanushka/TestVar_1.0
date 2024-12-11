'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Rotate3D } from 'lucide-react';

interface FlashcardBodyProps {
  question: string;
  answer: string;
  onFlip: () => void;
  isFlipped: boolean;
}

export function FlashcardBody({ question, answer, onFlip, isFlipped }: FlashcardBodyProps) {
  return (
    <Card className="relative p-8 min-h-[300px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={isFlipped ? 'answer' : 'question'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 mb-4">
            {isFlipped ? 'Answer' : 'Question'}
          </p>
          <p className="text-xl font-medium">
            {isFlipped ? answer : question}
          </p>
        </motion.div>
      </AnimatePresence>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onFlip}
        className="absolute bottom-4 right-4"
      >
        <Rotate3D className="h-4 w-4 mr-2" />
        Flip Card
      </Button>
    </Card>
  );
}