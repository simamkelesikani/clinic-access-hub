import { useEffect, useRef, useState } from 'react';
import { Footer, Header, SkipLink } from './components/Layout.jsx';
import HomeView from './views/HomeView.jsx';
import ServicesView from './views/ServicesView.jsx';
import BookingView from './views/BookingView.jsx';
import ConfirmationView from './views/ConfirmationView.jsx';

const TITLES = {
  home: 'Home',
  services: 'Find a service',
  book: 'Book an appointment',
  done: 'Booking confirmed',
};

export default function App({ today }) {
  const [view, setView] = useState('home');
  const [selectedService, setSelectedService] = useState('');
  const [booking, setBooking] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const headingRef = useRef(null);
  const firstRender = useRef(true);

  /* View switches: update the document title (SC 2.4.2) and move focus to the new
     <h1> (SC 2.4.3). Skipped on first load so the page starts at the top naturally. */
  useEffect(() => {
    document.title = `${TITLES[view]} - Community Healthcare Clinic`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [view]);

  function navigate(next) {
    if (next === 'book') setFormKey((k) => k + 1); // fresh form each time
    setView(next);
  }

  function selectService(id) {
    setSelectedService(id);
    setFormKey((k) => k + 1);
    setView('book');
  }

  return (
    <>
      <SkipLink />
      <Header view={view === 'done' ? '' : view} onNavigate={navigate} />
      <main id="main" tabIndex={-1}>
        {view === 'home' && <HomeView headingRef={headingRef} onNavigate={navigate} />}
        {view === 'services' && <ServicesView headingRef={headingRef} onSelectService={selectService} />}
        {view === 'book' && (
          <BookingView
            key={formKey}
            headingRef={headingRef}
            initialService={selectedService}
            today={today}
            onConfirm={(b) => {
              setBooking(b);
              setSelectedService('');
              setView('done');
            }}
          />
        )}
        {view === 'done' && <ConfirmationView headingRef={headingRef} booking={booking} onNavigate={navigate} />}
      </main>
      <Footer />
    </>
  );
}
