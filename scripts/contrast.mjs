// Computes WCAG 2.1 contrast ratios for every colour pair used in src/styles.css and wireframes/main.css.
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [label, foreground, background, minimum required]
const pairs = [
  ['Body text on page', '#1A202C', '#FFFFFF', 4.5],
  ['Muted/helper text on page', '#4A5568', '#FFFFFF', 4.5],
  ['Body text on surface', '#1A202C', '#F7FAFC', 4.5],
  ['Muted text on surface', '#4A5568', '#F7FAFC', 4.5],
  ['Link on page', '#2B6CB0', '#FFFFFF', 4.5],
  ['Link on surface', '#2B6CB0', '#F7FAFC', 4.5],
  ['Primary button label', '#FFFFFF', '#2B6CB0', 4.5],
  ['Header text', '#FFFFFF', '#1A365D', 4.5],
  ['Error text on page', '#9B2C2C', '#FFFFFF', 4.5],
  ['Error text on error panel', '#9B2C2C', '#FFF5F5', 4.5],
  ['Success text on success panel', '#22543D', '#F0FFF4', 4.5],
  ['Tag text', '#1A365D', '#EBF4FF', 4.5],
  ['Pressed chip label', '#FFFFFF', '#1A4E8A', 4.5],
  ['Disabled button label', '#FFFFFF', '#4A5568', 4.5],
  ['Footer text', '#E2E8F0', '#1A202C', 4.5],
  ['Input border (non-text)', '#4A5568', '#FFFFFF', 3],
  ['Focus ring on page (non-text)', '#2B6CB0', '#FFFFFF', 3],
  ['Focus ring on header (non-text)', '#FBD38D', '#1A365D', 3],
];

let failed = 0;
for (const [label, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (min ${min}:1)  ${fg} on ${bg}  ${label}`);
}
process.exit(failed ? 1 : 0);
