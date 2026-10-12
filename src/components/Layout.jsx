export function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      Skip to main content
    </a>
  );
}

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Find a service' },
  { id: 'book', label: 'Book an appointment' },
];

export function Header({ view, onNavigate }) {
  return (
    <header className="site-header">
      <div className="inner">
        <p className="brand">Community Healthcare Clinic</p>
        <nav aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="nav-link"
                  aria-current={view === item.id ? 'page' : undefined}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <p>Community Healthcare Clinic. Prototype for Marlowe Digital, ticket MD-2026-0143.</p>
        <p>For emergencies call 10177.</p>
      </div>
    </footer>
  );
}

/* h1 is programmatically focusable (tabIndex -1) so a view change can move
   focus to it without adding it to the Tab sequence. */
export function PageHeading({ headingRef, children }) {
  return (
    <h1 ref={headingRef} tabIndex={-1}>
      {children}
    </h1>
  );
}
