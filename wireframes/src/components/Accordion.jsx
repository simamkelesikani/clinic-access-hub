import { useId, useState } from 'react';

/**
 * Disclosure (accordion) header.
 * aria-expanded is derived from React state, so DOM and state can never drift.
 * Native <button> gives Enter and Space activation for free.
 */
export default function Accordion({ title, defaultOpen = false, children, level = 2 }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const Heading = `h${level}`;
  return (
    <div className="accordion">
      <Heading className="accordion-heading">
        <button
          type="button"
          className="accordion-button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{title}</span>
          <span aria-hidden="true" className="accordion-icon">{open ? '−' : '+'}</span>
        </button>
      </Heading>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} hidden={!open} className="accordion-panel">
        {children}
      </div>
    </div>
  );
}
