import { render, screen } from '@testing-library/react';
import App from './App';

test('shows saved daily nutrition totals', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async (input) => {
    const url = String(input);
    const data = url.endsWith('/auth') ? { authenticated: true, protected: false }
      : url.includes('/log?')
        ? { date: '2026-09-25', entries: [], totals: { calories: 620, protein_in_grams: 32 } }
        : [];
    return { ok: true, status: 200, json: async () => data } as Response;
  });
  try {
    render(<App />);
    expect(await screen.findByText('620')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
  } finally {
    fetchMock.mockRestore();
  }
});
