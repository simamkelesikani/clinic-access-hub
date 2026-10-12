// Runs axe-core against each static wireframe page using jsdom.
// Note: jsdom has no layout engine, so the colour-contrast rule is disabled here.
// Contrast is verified separately by scripts/contrast.mjs (computed ratios) and, in a real browser, by Lighthouse.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'wireframes');
const pages = readdirSync(dir).filter((f) => f.endsWith('.html')).sort();
let failed = 0;

for (const page of pages) {
  const html = readFileSync(join(dir, page), 'utf8');
  if (/<script/i.test(html)) {
    console.log(`FAIL ${page}: contains <script> (wireframes must be JavaScript-free)`);
    failed++;
    continue;
  }
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.eval(axe.source);
  const results = await dom.window.axe.run(dom.window.document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
    rules: { 'color-contrast': { enabled: false } },
  });
  console.log(`${results.violations.length === 0 ? 'PASS' : 'FAIL'} ${page}: ${results.violations.length} violations, ${results.passes.length} rules passed, ${results.incomplete.length} need review`);
  for (const v of results.violations) {
    failed++;
    console.log(`  - ${v.id} (${v.impact}): ${v.help}`);
    for (const n of v.nodes) console.log(`      ${n.target.join(' ')}`);
  }
}
process.exit(failed ? 1 : 0);
