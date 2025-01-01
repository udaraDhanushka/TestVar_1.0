"use client";

import { CheckCircle2, Library, Trophy } from 'lucide-react';
import { CompletionStats } from '@/lib/types/index';
import { motion } from 'framer-motion';
import { useConfetti } from '@/hooks/useConfetti';
import { RatingSelector } from './RatingSelector';

interface CompletionScreenProps {
  stats: CompletionStats;
  onRatingSubmit: (rating: number, feedback?: string) => void;
}

export default function CompletionScreen({ stats, onRatingSubmit }: CompletionScreenProps) {
  const totalCards = stats.gotIt + stats.knewIt;
  useConfetti(true);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[400px] space-y-12 py-8"
    >
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="flex justify-center"
        >
          <Trophy className="text-yellow-500 w-16 h-16" />
        </motion.div>

        <div className="space-y-2">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-700"
          >
            Congratulations! 🎉
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            You've completed all {totalCards} flashcards!
          </motion.p>
        </div>

        <div className="flex justify-center gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 bg-green-50 px-6 py-3 rounded-xl"
          >
            <CheckCircle2 className="text-green-500" size={24} />
            <div className="text-left">
              <p className="text-sm font-bold text-green-600">
                Already Know: {stats.gotIt}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-xl"
          >
            <Library className="text-blue-500" size={24} />
            <div className="text-left">
              <p className="text-sm font-bold text-blue-600">
                Still Learning: {stats.knewIt}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-md mx-auto"
      >
        <RatingSelector onRatingSubmit={onRatingSubmit} />
      </motion.div>
    </motion.div>
  );
}