import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { predictionFixture } from '@/tests/fixtures';
import { renderWithProviders } from '@/tests/render';
import { server } from '@/tests/server';

const API_BASE_URL = 'http://localhost:8000';

describe('upload flow', () => {
  it('uploads an image and renders prediction success state', async () => {
    const { user } = renderWithProviders(<App />);

    const fileInput = screen.getByLabelText(/forest or soil image upload/i);
    const file = new File(['satellite-bytes'], 'forest-scene.png', { type: 'image/png' });

    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /find berries/i }));

    expect(await screen.findByText(predictionFixture.land_cover.name)).toBeInTheDocument();
    expect(screen.getAllByText(predictionFixture.selected_berry.name).length).toBeGreaterThan(0);
    expect(screen.getByText(predictionFixture.land_cover.soil)).toBeInTheDocument();
  });

  it('shows a client-side validation error for unsupported files', async () => {
    const { user } = renderWithProviders(<App />);

    const fileInput = screen.getByLabelText(/forest or soil image upload/i);
    const invalidFile = new File(['not-an-image'], 'readme.txt', { type: 'text/plain' });

    await user.upload(fileInput, invalidFile);

    expect(await screen.findByText(/only image uploads are supported/i)).toBeInTheDocument();
  });

  it('renders a user-friendly backend error state', async () => {
    server.use(
      http.post(`${API_BASE_URL}/predict`, () =>
        HttpResponse.json({ detail: 'Prediction worker unavailable' }, { status: 500 }),
      ),
    );

    const { user } = renderWithProviders(<App />);

    const fileInput = screen.getByLabelText(/forest or soil image upload/i);
    const file = new File(['satellite-bytes'], 'forest-scene.png', { type: 'image/png' });

    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /find berries/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/prediction worker unavailable/i);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry prediction/i })).toBeInTheDocument();
    });
  });
});
