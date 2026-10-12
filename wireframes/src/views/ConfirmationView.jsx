import { PageHeading } from '../components/Layout.jsx';

export default function ConfirmationView({ headingRef, booking, onNavigate }) {
  return (
    <>
      <PageHeading headingRef={headingRef}>Booking confirmed</PageHeading>
      <div role="status" aria-live="polite" className="success-panel">
        <p>
          Thank you, {booking?.name}. Your {booking?.serviceName} appointment with {booking?.practitionerName} on{' '}
          {booking?.date} is booked. A confirmation will be sent to {booking?.email}.
        </p>
      </div>
      <p>
        <button type="button" className="btn" onClick={() => onNavigate('home')}>Back to home</button>{' '}
        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('book')}>Book another appointment</button>
      </p>
    </>
  );
}
