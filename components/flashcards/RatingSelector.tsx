"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface RatingSelectorProps {
  onRatingSubmit: (rating: number, feedback?: string) => void;
}

export function RatingSelector({ onRatingSubmit }: RatingSelectorProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onRatingSubmit(rating, feedback);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h3 className="text-xl font-semibold text-green-600">Thank you for your feedback! 🎉</h3>
        <p className="text-gray-600">Your rating helps us improve the learning experience.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-700">How was your learning experience?</h3>
        <p className="text-gray-600 text-sm">Your feedback helps us improve our flashcards</p>
      </div>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1"
          >
            <Star
              size={32}
              className={`${
                value <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } transition-colors`}
            />
          </motion.button>
        ))}
      </div>

      {rating > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Would you like to share any additional feedback? (optional)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none h-24"
          />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Submit your feedback
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}