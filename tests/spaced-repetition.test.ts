import { describe, it, expect } from 'vitest';

interface SM2Result {
  interval: number;
  repetitions: number;
  easeFactor: number;
}

function calculateSM2(
  quality: number,
  prevInterval: number,
  repetitions: number,
  easeFactor: number
): SM2Result {
  let newInterval: number;
  let newRepetitions: number;
  let newEaseFactor: number;

  if (quality >= 3) {
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(prevInterval * easeFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }

  newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
  };
}

function getQuality(correct: boolean, attempts: number): number {
  if (correct) {
    if (attempts === 1) return 5;
    if (attempts === 2) return 4;
    return 3;
  }
  return 0;
}

describe('SM-2 Spaced Repetition Algorithm', () => {
  describe('calculateSM2', () => {
    it('should start with interval 1 for first correct answer', () => {
      const result = calculateSM2(5, 0, 0, 2.5);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
    });

    it('should set interval 6 for second correct answer', () => {
      const result = calculateSM2(4, 1, 1, 2.5);
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    it('should multiply interval by ease factor for subsequent answers', () => {
      const result = calculateSM2(3, 6, 2, 2.5);
      expect(result.interval).toBe(15);
      expect(result.repetitions).toBe(3);
    });

    it('should reset repetitions on incorrect answer', () => {
      const result = calculateSM2(0, 15, 3, 2.5);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);
    });

    it('should not decrease ease factor below 1.3', () => {
      const result = calculateSM2(0, 1, 0, 1.3);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should increase ease factor on perfect answer', () => {
      const result = calculateSM2(5, 6, 2, 2.5);
      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it('should decrease ease factor on hard answer', () => {
      const result = calculateSM2(3, 6, 2, 2.5);
      expect(result.easeFactor).toBeLessThan(2.5);
    });
  });

  describe('getQuality', () => {
    it('should return 5 for first try correct', () => {
      expect(getQuality(true, 1)).toBe(5);
    });

    it('should return 4 for second try correct', () => {
      expect(getQuality(true, 2)).toBe(4);
    });

    it('should return 3 for multiple tries correct', () => {
      expect(getQuality(true, 3)).toBe(3);
    });

    it('should return 0 for incorrect', () => {
      expect(getQuality(false, 1)).toBe(0);
    });
  });

  describe('integration', () => {
    it('should simulate full learning cycle', () => {
      let interval = 0;
      let repetitions = 0;
      let easeFactor = 2.5;

      const correctSequence = [true, true, true, true];
      
      for (const correct of correctSequence) {
        const quality = correct ? 5 : 0;
        const result = calculateSM2(quality, interval, repetitions, easeFactor);
        interval = result.interval;
        repetitions = result.repetitions;
        easeFactor = result.easeFactor;
      }

      expect(interval).toBeGreaterThan(15);
      expect(repetitions).toBe(4);
    });

    it('should handle forgetting with reset', () => {
      let interval = 15;
      let repetitions = 3;
      let easeFactor = 2.5;

      const result = calculateSM2(0, interval, repetitions, easeFactor);
      
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);
    });
  });

  describe('real-world scenarios', () => {
    it('should schedule review in days', () => {
      const result = calculateSM2(5, 6, 2, 2.5);
      expect(result.interval).toBe(15);
    });

    it('should encourage frequent review for new items', () => {
      const first = calculateSM2(3, 0, 0, 2.5);
      const second = calculateSM2(3, 1, 1, first.easeFactor);
      
      expect(first.interval).toBe(1);
      expect(second.interval).toBe(6);
    });
  });
});
