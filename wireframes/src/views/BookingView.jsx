import { useRef, useState } from 'react';
import { PageHeading } from '../components/Layout.jsx';
import ReviewDialog from '../components/ReviewDialog.jsx';
import { PRACTITIONERS, SERVICES } from '../data.js';
import { ALL_FIELDS, validateAll, validateField } from '../validation.js';

const LABELS = {
  name: 'Full name',
  email: 'Email address',
  phone: 'Mobile number',
  service: 'Service',
  practitioner: 'Practitioner',
  date: 'Preferred date',
};

/**
 * One form field wired for assistive tech:
 *   <label htmlFor>  +  helper text  +  always-mounted polite error region,
 *   all referenced from aria-describedby; aria-invalid reflects state.
 */
function Field({ id, label, required, hint, error, children }) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="required" aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {hint && <p id={hintId} className="hint">{hint}</p>}
      {children({
        id,
        'aria-describedby': hint ? `${hintId} ${errorId}` : errorId,
        'aria-invalid': error ? 'true' : 'false',
      })}
      {/* Mounted before it has content so screen readers announce text changes reliably. */}
      <p id={errorId} className="error-text" aria-live="polite">{error}</p>
    </div>
  );
}

export default function BookingView({ headingRef, initialService = '', onConfirm, today }) {
  const [values, setValues] = useState({
    name: '', email: '', phone: '', service: initialService, practitioner: '', date: '', access: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const summaryRef = useRef(null);
  const submitRef = useRef(null);

  const now = today ?? new Date();
  const minDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    // Once a field has been visited, re-validate as the user types so the error clears immediately.
    if (touched[name] || errors[name]) {
      setErrors((e) => ({ ...e, [name]: validateField(name, value, now) }));
    }
  }

  function onBlur(name) {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validateField(name, values[name], now) }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const found = validateAll(values, now);
    setErrors(found);
    setTouched(Object.fromEntries(ALL_FIELDS.map((f) => [f, true])));
    const count = Object.keys(found).length;
    if (count > 0) {
      setShowSummary(true);
      setStatus('');
      // Wait a tick so the summary is in the DOM, then move focus to it.
      setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    setShowSummary(false);
    setStatus('All details look good. Opening review.');
    setReviewing(true);
  }

  const errorEntries = ALL_FIELDS.filter((f) => errors[f]);

  const serviceName = SERVICES.find((s) => s.id === values.service)?.name ?? '';
  const practitionerName = PRACTITIONERS.find((p) => p.id === values.practitioner)?.name ?? '';

  return (
    <>
      <PageHeading headingRef={headingRef}>Book an appointment</PageHeading>
      <p>
        Fields marked <span aria-hidden="true" className="required">*</span>
        <span className="sr-only">with the word required</span> are required.
      </p>

      {showSummary && errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="error-summary"
          aria-labelledby="error-summary-title"
        >
          <h2 id="error-summary-title">
            There {errorEntries.length === 1 ? 'is 1 problem' : `are ${errorEntries.length} problems`} with your booking
          </h2>
          <ul>
            {errorEntries.map((f) => (
              <li key={f}>
                <a
                  href={`#${f}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(f)?.focus();
                  }}
                >
                  {LABELS[f]}: {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate aria-label="Appointment booking">
        <fieldset>
          <legend>Patient details</legend>

          <Field id="name" label={LABELS.name} required hint="As it appears on your ID or clinic card." error={errors.name}>
            {(p) => (
              <input {...p} name="name" type="text" autoComplete="name" value={values.name}
                onChange={(e) => setField('name', e.target.value)} onBlur={() => onBlur('name')} />
            )}
          </Field>

          <Field id="email" label={LABELS.email} required hint="We send your confirmation here, for example name@example.com." error={errors.email}>
            {(p) => (
              <input {...p} name="email" type="email" autoComplete="email" value={values.email}
                onChange={(e) => setField('email', e.target.value)} onBlur={() => onBlur('email')} />
            )}
          </Field>

          <Field id="phone" label={LABELS.phone} hint="Optional. 10 digits, for an SMS reminder." error={errors.phone}>
            {(p) => (
              <input {...p} name="phone" type="tel" autoComplete="tel" value={values.phone}
                onChange={(e) => setField('phone', e.target.value)} onBlur={() => onBlur('phone')} />
            )}
          </Field>
        </fieldset>

        <fieldset>
          <legend>Appointment details</legend>

          <Field id="service" label={LABELS.service} required error={errors.service}>
            {(p) => (
              <select {...p} name="service" value={values.service}
                onChange={(e) => setField('service', e.target.value)} onBlur={() => onBlur('service')}>
                <option value="">Select a service</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.minutes} min)</option>
                ))}
              </select>
            )}
          </Field>

          <Field id="practitioner" label={LABELS.practitioner} required error={errors.practitioner}>
            {(p) => (
              <select {...p} name="practitioner" value={values.practitioner}
                onChange={(e) => setField('practitioner', e.target.value)} onBlur={() => onBlur('practitioner')}>
                <option value="">Select a practitioner</option>
                {PRACTITIONERS.map((pr) => (
                  <option key={pr.id} value={pr.id}>{pr.name} - next free: {pr.next}</option>
                ))}
              </select>
            )}
          </Field>

          <Field id="date" label={LABELS.date} required hint="The clinic is open Monday to Friday." error={errors.date}>
            {(p) => (
              <input {...p} name="date" type="date" min={minDate} value={values.date}
                onChange={(e) => setField('date', e.target.value)} onBlur={() => onBlur('date')} />
            )}
          </Field>

          <Field id="access" label="Access needs" hint="Optional. For example: sign language interpreter, wheelchair access." error="">
            {(p) => (
              <textarea {...p} name="access" rows={3} value={values.access}
                onChange={(e) => setField('access', e.target.value)} />
            )}
          </Field>
        </fieldset>

        <button ref={submitRef} type="submit" className="btn">Review booking</button>
        <div role="status" aria-live="polite" className="sr-only">{status}</div>
      </form>

      {reviewing && (
        <ReviewDialog
          details={{ ...values, serviceName, practitionerName }}
          returnFocusRef={submitRef}
          onClose={() => { setReviewing(false); setStatus(''); }}
          onConfirm={() => {
            setReviewing(false);
            onConfirm({ ...values, serviceName, practitionerName });
          }}
        />
      )}
    </>
  );
}
