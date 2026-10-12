import { describe, expect, it } from 'vitest';
import { validateAll, validateField } from '../validation.js';

const monday = new Date(2026, 9, 12); // Mon 12 Oct 2026

describe('validateField', () => {
  it('requires a name', () => {
    expect(validateField('name', '')).toMatch(/Enter your full name/);
    expect(validateField('name', 'Nomsa Dlamini')).toBe('');
  });

  it('explains how to fix an invalid email', () => {
    expect(validateField('email', 'nomsa@')).toMatch(/name@example\.com/);
    expect(validateField('email', 'nomsa@example.com')).toBe('');
  });

  it('treats phone as optional but checks the format when present', () => {
    expect(validateField('phone', '')).toBe('');
    expect(validateField('phone', '12345')).toMatch(/10 digits/);
    expect(validateField('phone', '082 123 4567')).toBe('');
  });

  it('rejects past dates and weekends', () => {
    expect(validateField('date', '2026-10-09', monday)).toMatch(/past/);
    expect(validateField('date', '2026-10-17', monday)).toMatch(/weekends/); // Saturday
    expect(validateField('date', '2026-10-13', monday)).toBe(''); // Tuesday
  });
});

describe('validateAll', () => {
  it('returns an error for each missing required field', () => {
    const errors = validateAll({}, monday);
    expect(Object.keys(errors).sort()).toEqual(['date', 'email', 'name', 'practitioner', 'service']);
  });
});
