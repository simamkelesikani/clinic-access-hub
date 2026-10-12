import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import App from '../App.jsx';

async function openServices(user) {
  render(<App today={new Date(2026, 9, 12)} />);
  await user.click(screen.getByRole('button', { name: 'Find a service' }));
}

describe('Filterable resource listing with ARIA state', () => {
  it('has no axe violations (filters expanded)', async () => {
    const user = userEvent.setup();
    await openServices(user);
    await user.click(screen.getByRole('button', { name: /^Filters/ }));
    
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('updates aria-expanded on the filter accordion and links it to its panel', async () => {
    const user = userEvent.setup();
    await openServices(user);
    const header = screen.getByRole('button', { name: /^Filters/ });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    const panelId = header.getAttribute('aria-controls');
    expect(document.getElementById(panelId)).toBeInTheDocument();
    expect(document.getElementById(panelId)).not.toBeVisible();

    await user.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(panelId)).toBeVisible();

    await user.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles aria-pressed on chips and filters the list', async () => {
    const user = userEvent.setup();
    await openServices(user);
    await user.click(screen.getByRole('button', { name: /^Filters/ }));

    const urgent = screen.getByRole('button', { name: 'Urgent' });
    expect(urgent).toHaveAttribute('aria-pressed', 'false');
    await user.click(urgent);
    expect(urgent).toHaveAttribute('aria-pressed', 'true');

    const list = screen.getByRole('list', { name: 'Service results' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2); // urgent care + mental health urgent assessment

    await user.click(urgent);
    expect(urgent).toHaveAttribute('aria-pressed', 'false');
    expect(within(screen.getByRole('list', { name: 'Service results' })).getAllByRole('listitem')).toHaveLength(8);
  });

  it('announces the result count in a polite live region', async () => {
    const user = userEvent.setup();
    await openServices(user);
    const status = screen.getByTestId('results-status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    await user.type(screen.getByLabelText('Search services'), 'vaccin');
    await waitFor(() => expect(status).toHaveTextContent('2 services found.'));
  });

  it('shows a helpful empty state and announces it', async () => {
    const user = userEvent.setup();
    await openServices(user);
    await user.type(screen.getByLabelText('Search services'), 'zzzz');
    await waitFor(() => expect(screen.getByTestId('results-status')).toHaveTextContent('No services match'));
    expect(screen.getByText(/Try removing a filter/)).toBeInTheDocument();
  });

  it('operates with Enter and Space only', async () => {
    const user = userEvent.setup();
    await openServices(user);
    const header = screen.getByRole('button', { name: /^Filters/ });
    header.focus();
    await user.keyboard('{Enter}');
    expect(header).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('preselects the service when Book is activated', async () => {
    const user = userEvent.setup();
    await openServices(user);
    await user.click(screen.getByRole('button', { name: 'Book Childhood vaccinations' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Book an appointment' })).toHaveFocus();
    expect(screen.getByLabelText(/^Service/)).toHaveValue('vax-child');
  });
});
