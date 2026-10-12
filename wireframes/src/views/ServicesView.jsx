import { useEffect, useMemo, useState } from 'react';
import { PageHeading } from '../components/Layout.jsx';
import Accordion from '../components/Accordion.jsx';
import ToggleChip from '../components/ToggleChip.jsx';
import { CATEGORIES, SERVICES, TRIAGE_LEVELS } from '../data.js';

function toggleInSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function ServicesView({ headingRef, onSelectService }) {
  const [query, setQuery] = useState('');
  const [triage, setTriage] = useState(new Set());
  const [categories, setCategories] = useState(new Set());
  const [announcement, setAnnouncement] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter((s) => {
      if (triage.size && !triage.has(s.triage)) return false;
      if (categories.size && !categories.has(s.category)) return false;
      if (q && !`${s.name} ${s.description} ${s.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, triage, categories]);

  const countText =
    results.length === 0
      ? 'No services match your search and filters.'
      : `${results.length} ${results.length === 1 ? 'service' : 'services'} found.`;

  /* Debounced polite announcement: typing in the search box would otherwise
     trigger a spoken update on every keystroke. */
  useEffect(() => {
    const t = setTimeout(() => setAnnouncement(countText), 400);
    return () => clearTimeout(t);
  }, [countText]);

  const activeFilters = triage.size + categories.size;

  function clearAll() {
    setQuery('');
    setTriage(new Set());
    setCategories(new Set());
  }

  return (
    <>
      <PageHeading headingRef={headingRef}>Find a service</PageHeading>

      <div className="two-col">
        <aside aria-labelledby="filters-title" className="panel">
          <h2 id="filters-title">Search and filter</h2>

          <div className="field" role="search">
            <label htmlFor="service-search">Search services</label>
            <p id="service-search-hint" className="hint">For example: vaccination, asthma, check-up.</p>
            <input
              id="service-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-describedby="service-search-hint"
            />
          </div>

          <Accordion title={`Filters${activeFilters ? ` (${activeFilters} active)` : ''}`} level={3}>
            <div role="group" aria-labelledby="triage-label" className="chip-group">
              <p id="triage-label" className="group-label">Triage level</p>
              {TRIAGE_LEVELS.map((t) => (
                <ToggleChip key={t} pressed={triage.has(t)} onToggle={() => setTriage((s) => toggleInSet(s, t))}>
                  {t}
                </ToggleChip>
              ))}
            </div>
            <div role="group" aria-labelledby="category-label" className="chip-group">
              <p id="category-label" className="group-label">Category</p>
              {CATEGORIES.map((c) => (
                <ToggleChip key={c} pressed={categories.has(c)} onToggle={() => setCategories((s) => toggleInSet(s, c))}>
                  {c}
                </ToggleChip>
              ))}
            </div>
          </Accordion>

          <p>
            <button type="button" className="btn btn-secondary" onClick={clearAll}>Clear search and filters</button>
          </p>
        </aside>

        <section aria-labelledby="results-title">
          <h2 id="results-title">Services</h2>
          {/* Always-mounted polite live region: results count is announced after the user stops typing. */}
          <p role="status" aria-live="polite" aria-atomic="true" className="muted" data-testid="results-status">
            {announcement}
          </p>
          {results.length === 0 ? (
            <p className="card">Try removing a filter or searching for a different word.</p>
          ) : (
            <ul className="result-list" aria-label="Service results">
              {results.map((s) => (
                <li key={s.id}>
                  <article className="card" aria-labelledby={`svc-${s.id}`}>
                    <h3 id={`svc-${s.id}`}>{s.name}</h3>
                    <p>
                      <span className="tag">{s.triage}</span> <span className="tag">{s.category}</span>{' '}
                      <span className="muted">{s.minutes} minutes</span>
                    </p>
                    <p>{s.description}</p>
                    <button type="button" className="btn" onClick={() => onSelectService(s.id)}>
                      Book {s.name}
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
