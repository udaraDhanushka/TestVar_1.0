import { useState } from 'react';
import { Flashcard } from '@/lib/types/index';
import { CheckCircle, Library } from 'lucide-react';

interface SingleFlashcardProps {
  flashcard: Flashcard;
  onGotIt: () => void;
  onKnewIt: () => void;
  disabled?: boolean;
}

export default function SingleFlashcard({ flashcard, onGotIt, onKnewIt, disabled = false }: SingleFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className={`cursor-pointer perspective-1000 ${disabled ? 'pointer-events-none' : ''}`} onClick={handleClick}>
      <div
        className={`relative w-full transform-style-3d transition-transform duration-500 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        <div className='bg-white rounded-xl shadow-lg p-8 min-h-[200px] backface-hidden bg-gradient-to-r'>
          <div className='flex flex-col items-center justify-center align-middle h-full min-h-[200px]'>
            <h3 className='text-xl font-medium text-gray-800 text-center'>{flashcard.question}</h3>
            <p className='mt-4 text-gray-500 text-sm'>Click to flip</p>
          </div>
        </div>

        {/* Back of card */}
        <div className='absolute inset-0 bg-white rounded-xl shadow-lg p-8 min-h-[200px] rotate-y-180 backface-hidden'>
          <div className='flex flex-col items-center justify-center align-middle h-full min-h-[200px]'>
            <div className='text-center'>
              <h3 className='text-xl font-medium text-gray-800'>{flashcard.answer}</h3>
            </div>

            <div className='flex gap-4 mt-6'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGotIt();
                }}
                className='flex flex-row items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
              >
                <CheckCircle size={20} />
                I Know
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onKnewIt();
                }}
                className='flex flex-row items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
              >
                <Library size={20} />I&apos;m Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}