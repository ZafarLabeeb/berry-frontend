import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { alternativePredictionFixture, predictionFixture } from '@/tests/fixtures';
import { renderWithProviders } from '@/tests/render';
import { server } from '@/tests/server';

const API_BASE_URL = 'http://localhost:8000';

describe('prediction request lifecycle', () => {
  it('keeps the last successful result visible on failure and retries', async () => {
    const requestLog: Array<{ fileName: string | null }> = [];
    let predictCallCount = 0;

    server.use(
      http.post(`${API_BASE_URL}/predict`, async ({ request }) => {
        predictCallCount += 1;

        const formData = await request.formData();
        const file = formData.get('file');

        requestLog.push({
          fileName: file instanceof File ? file.name : null,
        });

        if (predictCallCount === 1) {
          return HttpResponse.json(predictionFixture);
        }

        if (predictCallCount === 2) {
          return HttpResponse.json({ detail: 'Temporary outage' }, { status: 500 });
        }

        return HttpResponse.json(alternativePredictionFixture);
      }),
    );

    const { user } = renderWithProviders(<App />);
    const fileInput = screen.getByLabelText(/forest or soil image upload/i);

    // First upload: should succeed
    await user.upload(fileInput, new File(['bytes-one'], 'first-scene.png', { type: 'image/png' }));
    await user.click(screen.getByRole('button', { name: /find berries/i }));

    expect(await screen.findByText(predictionFixture.land_cover.name)).toBeInTheDocument();
    expect(requestLog[0]).toEqual({ fileName: 'first-scene.png' });

    // Second upload: should fail but keep previous results visible
    await user.upload(fileInput, new File(['bytes-two'], 'second-scene.png', { type: 'image/png' }));
    await user.click(screen.getByRole('button', { name: /find berries/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/temporary outage/i);
    expect(screen.getByText(predictionFixture.land_cover.name)).toBeInTheDocument();
    expect(requestLog[1]).toEqual({ fileName: 'second-scene.png' });

    // Retry: should succeed with alternative fixture
    await user.click(screen.getByRole('button', { name: /retry prediction/i }));

    expect(await screen.findByText(alternativePredictionFixture.land_cover.name)).toBeInTheDocument();
    expect(requestLog[2]).toEqual({ fileName: 'second-scene.png' });
  });
});
