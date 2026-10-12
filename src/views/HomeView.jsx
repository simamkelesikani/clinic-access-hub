import { useEffect, useRef, useState } from 'react';
import { PageHeading } from '../components/Layout.jsx';
import { PRACTITIONERS, REFRESHED_PRACTITIONERS } from '../data.js';

function AvailabilityPanel() {
  const [rows, setRows] = useState(PRACTITIONERS);
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function refresh() {
    setLoading(true);
    setAnnouncement('Checking latest availability.');
    // Simulated network call
    timer.current = setTimeout(() => {
      setRows(REFRESHED_PRACTITIONERS);
      setLoading(false);
      setAnnouncement(`Availability updated. ${REFRESHED_PRACTITIONERS.length} practitioners listed.`);
    }, 600);
  }

  return (
    <section aria-labelledby="availability-title">
      <h2 id="availability-title">Practitioner availability</h2>
      <button type="button" className="btn btn-secondary" onClick={refresh} disabled={loading}>
        {loading ? 'Checking...' : 'Check latest availability'}
      </button>
      <div role="status" aria-live="polite" className="sr-only">{announcement}</div>
      {/* aria-busy tells assistive tech the table is mid-update so it does not read half-loaded data */}
      <div aria-busy={loading} className="table-wrap">
        <table>
          <caption>Next free appointment by practitioner</caption>
          <thead>
            <tr>
              <th scope="col">Practitioner</th>
              <th scope="col">Role</th>
              <th scope="col">Next free slot</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <th scope="row">{p.name}</th>
                <td>{p.role}</td>
                <td>{p.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function HomeView({ headingRef, onNavigate }) {
  return (
    <>
      <PageHeading headingRef={headingRef}>Book your clinic visit, your way</PageHeading>
      <p>
        Browse our services, check practitioner availability and book an appointment. Every step works with a
        keyboard and a screen reader.
      </p>

      <section aria-labelledby="quick-start">
        <h2 id="quick-start">Start here</h2>
        <div className="grid">
          <article className="card">
            <h3>Find a service</h3>
            <p>Search the clinical service directory and filter by triage level or category.</p>
            <button type="button" className="btn" onClick={() => onNavigate('services')}>Browse services</button>
          </article>
          <article className="card">
            <h3>Book an appointment</h3>
            <p>Choose a service, practitioner and date. We confirm by email.</p>
            <button type="button" className="btn" onClick={() => onNavigate('book')}>Start booking</button>
          </article>
          <article className="card">
            <h3>Need help now?</h3>
            <p>For emergencies call <strong>10177</strong>. Clinic reception: <strong>021 555 0100</strong>.</p>
          </article>
        </div>
      </section>

      <AvailabilityPanel />

      <aside aria-labelledby="access-title" className="panel">
        <h2 id="access-title">Accessibility help</h2>
        <p>
          Need a sign language interpreter, wheelchair access or a longer appointment? Tell us in the access needs
          box on the booking form, or call reception.
        </p>
      </aside>
    </>
  );
}
