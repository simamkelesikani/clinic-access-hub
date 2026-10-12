import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';

describe('App shell: landmarks, skip link, focus on view change', () => {
  afterEach(() => vi.useRealTimers());

  it('has no axe violations on the home view', async () => {
    render(<App />);
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('exposes banner, navigation, main and contentinfo landmarks', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('makes the skip link the first Tab stop and targets main', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', '#main');
    expect(document.getElementById('main')).toBe(screen.getByRole('main'));
  });

  it('keeps DOM tab order logical in the header', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab(); // skip link
    await user.tab();
    expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Find a service' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Book an appointment' })).toHaveFocus();
  });

  it('marks the current page in navigation, updates the title and moves focus to the h1', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.title).toBe('Home - Community Healthcare Clinic');
    await user.click(screen.getByRole('button', { name: 'Find a service' }));
    expect(document.title).toBe('Find a service - Community Healthcare Clinic');
    expect(screen.getByRole('button', { name: 'Find a service' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('heading', { level: 1, name: 'Find a service' })).toHaveFocus();
  });
});

describe('Practitioner availability refresh uses aria-busy and a live region', () => {
  it('sets aria-busy while loading, then announces the update', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);
    const table = screen.getByRole('table').closest('[aria-busy]');
    expect(table).toHaveAttribute('aria-busy', 'false');

    await user.click(screen.getByRole('button', { name: 'Check latest availability' }));
    expect(table).toHaveAttribute('aria-busy', 'true');

    await act(async () => {
      vi.advanceTimersByTime(700);
    });
    expect(table).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByText('Availability updated. 3 practitioners listed.')).toBeInTheDocument();
    expect(screen.getByText('Today 13:45')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
