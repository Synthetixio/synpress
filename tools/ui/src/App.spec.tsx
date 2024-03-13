import './installSesLockdown';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App.tsx', () => {
  it('renders app title', async () => {
    render(<App />);

    const titleElement = await screen.findByText('Items Listed on Offer Up', {
      selector: 'h1',
    });
    expect(titleElement).toBeTruthy();
  });

  it('renders the wallet connection button', async () => {
    render(<App />);
    const buttonEl = await screen.findByRole('button', {
      name: 'Connect Wallet',
    });
    expect(buttonEl).toBeTruthy();
  });
});
