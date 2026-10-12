import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import App from '../App.jsx';

const TODAY = new Date(2026, 9, 12); // Monday

async function openBooking(user) {
  render(<App today={TODAY} />);
  await user.click(screen.getByRole('button', { name: 'Book an appointment' }));
}

async function fillValid(user) {
  await user.type(screen.getByLabelText(/^Full name/), 'Nomsa Dlamini');
  await user.type(screen.getByLabelText(/^Email address/), 'nomsa@example.com');
  await user.selectOptions(screen.getByLabelText(/^Service/), 'vax-child');
  await user.selectOptions(screen.getByLabelText(/^Practitioner/), 'khumalo');
  await user.type(screen.getByLabelText(/^Preferred date/), '2026-10-14');
}

describe('Accessible booking form', () => {
  it('has no axe violations when pristine', async () => {
    const user = userEvent.setup();
    await openBooking(user);
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('associates every input with a label and helper text', async () => {
    const user = userEvent.setup();
    await openBooking(user);
    const email = screen.getByLabelText(/^Email address/);
    expect(email).toHaveAccessibleDescription(/confirmation here/);
    for (const name of [/^Full name/, /^Email address/, /^Mobile number/, /^Service/, /^Practitioner/, /^Preferred date/, /^Access needs/]) {
      expect(screen.getByLabelText(name)).toBeInTheDocument();
    }
  });

  it('shows linked, announced errors after a failed submit and moves focus to the summary', async () => {
    const user = userEvent.setup();
    await openBooking(user);
    await user.click(screen.getByRole('button', { name: 'Review booking' }));

    const summary = screen.getByRole('alert');
    expect(summary).toHaveAttribute('aria-live', 'assertive');
    expect(summary).toHaveFocus();
    expect(within(summary).getByRole('heading')).toHaveTextContent('There are 5 problems');

    const name = screen.getByLabelText(/^Full name/);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription(/Enter your full name/);
    expect(document.getElementById('name-error')).toHaveAttribute('aria-live', 'polite');

    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('summary links move focus to the invalid field', async () => {
    const user = userEvent.setup();
    await openBooking(user);
    await user.click(screen.getByRole('button', { name: 'Review booking' }));
    await user.click(within(screen.getByRole('alert')).getByRole('link', { name: /Email address/ }));
    expect(screen.getByLabelText(/^Email address/)).toHaveFocus();
  });

  it('validates on blur and clears the error as soon as the value is fixed', async () => {
    const user = userEvent.setup();
    await openBooking(user);
    const email = screen.getByLabelText(/^Email address/);
    await user.type(email, 'nomsa@');
    await user.tab();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription(/name@example\.com/);
    await user.type(email, 'example.com');
    expect(email).toHaveAttribute('aria-invalid', 'false');
  });

  it('opens a review dialog, traps Tab, closes on Escape and restores focus', async () => {
    const user = userEvent.setup();
    await openBooking(user);
    await fillValid(user);
    const submit = screen.getByRole('button', { name: 'Review booking' });
    await user.click(submit);

    const dialog = screen.getByRole('dialog', { name: 'Review your booking' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByRole('heading', { name: 'Review your booking' })).toHaveFocus();
    expect(await axe(document.body)).toHaveNoViolations();

    // Tab sequence stays inside the dialog: Confirm -> Edit -> back to Confirm
    await user.tab();
    expect(within(dialog).getByRole('button', { name: 'Confirm booking' })).toHaveFocus();
    await user.tab();
    expect(within(dialog).getByRole('button', { name: 'Edit details' })).toHaveFocus();
    await user.tab();
    expect(within(dialog).getByRole('button', { name: 'Confirm booking' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(within(dialog).getByRole('button', { name: 'Edit details' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(submit).toHaveFocus();
  });

  it('confirms the booking, updates the title and focuses the confirmation heading', async () => {
    const user = userEvent.setup();
    await openBooking(user);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Review booking' }));
    await user.click(screen.getByRole('button', { name: 'Confirm booking' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Booking confirmed' })).toHaveFocus();
    expect(document.title).toBe('Booking confirmed - Community Healthcare Clinic');
    expect(screen.getByRole('status')).toHaveTextContent(/Nomsa Dlamini/);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
