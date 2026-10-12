import { useEffect, useRef } from 'react';

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal review dialog.
 *  - role="dialog" + aria-modal + labelled/described
 *  - focus moves to the dialog heading on open (so the title is read first)
 *  - Tab / Shift+Tab are contained while open; Escape and "Edit details" always exit
 *  - focus returns to the element that opened it on close
 */
export default function ReviewDialog({ details, onConfirm, onClose, returnFocusRef }) {
  const headingRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
    const returnTo = returnFocusRef?.current;
    return () => {
      returnTo?.focus();
    };
  }, [returnFocusRef]);

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === headingRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="modal-backdrop">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        aria-describedby="review-desc"
        className="modal"
        onKeyDown={onKeyDown}
      >
        <h2 id="review-title" ref={headingRef} tabIndex={-1}>Review your booking</h2>
        <p id="review-desc" className="muted">Check these details. You can still edit them before confirming.</p>
        <dl className="summary">
          <dt>Name</dt><dd>{details.name}</dd>
          <dt>Email</dt><dd>{details.email}</dd>
          <dt>Mobile</dt><dd>{details.phone || 'Not provided'}</dd>
          <dt>Service</dt><dd>{details.serviceName}</dd>
          <dt>Practitioner</dt><dd>{details.practitionerName}</dd>
          <dt>Date</dt><dd>{details.date}</dd>
          <dt>Access needs</dt><dd>{details.access || 'None stated'}</dd>
        </dl>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onConfirm}>Confirm booking</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Edit details</button>
        </div>
      </div>
    </div>
  );
}
