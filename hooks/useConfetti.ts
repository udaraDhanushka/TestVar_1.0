import { useEffect } from 'react';
import { fireConfetti } from '../lib/confetti';

export const useConfetti = (shouldFire: boolean) => {
  useEffect(() => {
    if (shouldFire) {
      fireConfetti();
    }
  }, [shouldFire]);
}