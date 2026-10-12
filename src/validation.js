const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function parseDate(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Returns an error message (string) or '' when valid.
 * Messages say what is wrong AND how to fix it (WCAG 3.3.1 / 3.3.3).
 */
export function validateField(name, rawValue, today = new Date()) {
  const value = (rawValue ?? '').trim();
  switch (name) {
    case 'name':
      if (!value) return 'Enter your full name.';
      if (value.length < 2) return 'Full name must be at least 2 characters.';
      return '';
    case 'email':
      if (!value) return 'Enter your email address.';
      if (!EMAIL_RE.test(value)) return 'Email address is not valid. Use a format like name@example.com.';
      return '';
    case 'phone': {
      if (!value) return ''; // optional
      const digits = value.replace(/[\s-]/g, '');
      if (!/^\d{10}$/.test(digits)) return 'Mobile number must be 10 digits, for example 0821234567.';
      return '';
    }
    case 'service':
      return value ? '' : 'Choose a service.';
    case 'practitioner':
      return value ? '' : 'Choose a practitioner.';
    case 'date': {
      if (!value) return 'Choose a date for your appointment.';
      const chosen = parseDate(value);
      if (Number.isNaN(chosen.getTime())) return 'Date is not valid. Use the format year-month-day.';
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (chosen < start) return 'Date is in the past. Choose today or a later date.';
      const day = chosen.getDay();
      if (day === 0 || day === 6) return 'The clinic is closed at weekends. Choose a date from Monday to Friday.';
      return '';
    }
    default:
      return '';
  }
}

export const REQUIRED_FIELDS = ['name', 'email', 'service', 'practitioner', 'date'];
export const ALL_FIELDS = ['name', 'email', 'phone', 'service', 'practitioner', 'date'];

export function validateAll(values, today = new Date()) {
  const errors = {};
  for (const f of ALL_FIELDS) {
    const msg = validateField(f, values[f], today);
    if (msg) errors[f] = msg;
  }
  return errors;
}
