import { describe, expect, it } from 'vitest';

import { parsePredictionResponse } from '@/lib/schemas/prediction';
import { predictionFixture } from '@/tests/fixtures';

describe('prediction response schema', () => {
  it('accepts a valid backend payload', () => {
    const parsed = parsePredictionResponse(predictionFixture);

    expect(parsed.land_cover.name).toBe('Boreal Forest Edge');
    expect(parsed.selected_berry.name).toBe('Blueberry');
  });

  it('rejects invalid probability values', () => {
    expect(() =>
      parsePredictionResponse({
        ...predictionFixture,
        berry_probabilities: [
          {
            ...predictionFixture.berry_probabilities[0],
            probability: 1.5,
          },
        ],
      }),
    ).toThrow();
  });
});
