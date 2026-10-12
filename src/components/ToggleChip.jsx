/** Toggle button. aria-pressed mirrors the `pressed` prop at all times. */
export default function ToggleChip({ pressed, onToggle, children }) {
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={onToggle}>
      {children}
    </button>
  );
}
