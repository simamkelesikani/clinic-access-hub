# Community Healthcare Clinic: Accessible Booking Portal

**Ticket:** MD-2026-0143 (Marlowe Digital) | **Candidate ID:** 6 (even, so the Community Healthcare Clinic domain)

A keyboard- and screen-reader-first prototype of a clinic booking portal: a clinical service directory with triage filters, practitioner availability updates, and an appointment booking form with live validation.

## Repository structure

| Path | Contents |
|---|---|
| `/wireframes` | **Part A.** `index.html`, `services.html`, `book.html` (semantic HTML5, no JavaScript), `main.css`, `persona.md`, `wcag-matrix.md` |
| `/src`, `index.html`, `vite.config.js` | **Part B.** React 19 single-page app built with Vite |
| `/src/__tests__` | Component tests (Vitest, Testing Library, vitest-axe) |
| `/scripts` | `axe-wireframes.mjs` (axe on the static pages), `contrast.mjs` (computed contrast ratios) |
| `netlify.toml`, `.github/workflows/ci.yml` | Deployment configuration and CI |
| `README.md` | **Part C.** This document |

## Run it

```bash
npm install
npm run dev            # development server
npm run test:run       # component tests, including axe checks
npm run audit:wireframes
npm run audit:contrast
npm run build && npm run preview   # production build on http://localhost:4173
```

Open the wireframes directly in a browser: `wireframes/index.html`.

## Deployment

`netlify.toml` builds with `npm run build` and publishes `dist/`. The GitHub Actions workflow runs the tests, both audit scripts and the build on every push and pull request.

---

# Part C: Architectural and Accessibility Decision Write-Up

## 1. Accessibility trade-off analysis

**Modal focus containment versus free keyboard flow.** The booking review dialog contains Tab and Shift+Tab while it is open. A focus trap can conflict with the spirit of WCAG 2.1.2 (No Keyboard Trap), so I made every exit explicit: Escape, an "Edit details" button, and focus returns to the "Review booking" button that opened it. I chose containment because `aria-modal` support is uneven across screen readers, and without it a user could tab into the form behind the dialog and lose context. The cost is extra code that must be kept correct, which is why the tab cycle and Escape behaviour are covered by tests.

**Live-region verbosity versus silence.** Filtering announces the result count through a polite live region, debounced by 400 ms. Without the debounce, a screen reader would speak "3 services found" on every keystroke. Without the region, a blind user would get no sign that the list changed. The price is a short delay before the announcement. Field errors use one always-mounted polite region per field, while a failed submit shows an assertive error summary that takes focus. Some screen readers may read that summary twice, once from the alert role and once from the focus move. I accepted that risk because a missed failed submit is worse than a repeated sentence, and I flagged it for the manual screen reader log.

**Native controls versus custom styling.** I used native `<select>`, `<input type="date">` and `<button>` elements instead of custom comboboxes or date pickers. Custom widgets would look more consistent but need a lot of ARIA and key handling, and each is a regression risk. Native date inputs behave differently between browsers and screen readers, so helper text and validation messages state the expected format. Filter chips are styled buttons with `aria-pressed`. Pressed chips also gain a check mark and bold text, so state is never conveyed by colour alone.

## 2. Assistive tech state architecture

All state lives in React hooks, and ARIA attributes are derived from that state in JSX rather than set imperatively, so the DOM accessibility tree cannot drift from the app. In `Accordion`, an `open` boolean drives both `aria-expanded` and the panel's `hidden` attribute, and `aria-controls` links header to panel. In `ServicesView`, a `Set` per filter group drives each chip's `aria-pressed`. In `BookingView`, an `errors` object drives `aria-invalid` and the text of the always-mounted polite region that `aria-describedby` points to. In `AvailabilityPanel`, a `loading` boolean drives `aria-busy` on the table region, so a screen reader does not read half-loaded data.

Focus is the one thing state cannot express, so refs and effects handle it. `App` holds an `h1` ref (with `tabIndex={-1}`) and an effect on `view` that moves focus to it and updates `document.title`. A failed submit focuses the error summary through `summaryRef`. `ReviewDialog` focuses its heading on mount and, in its effect cleanup, returns focus to the trigger ref.

## 3. Verification and testing audit

### Automated results (run in this repository)

| Check | Result |
|---|---|
| Component tests (`npm run test:run`) | 25 passed, 0 failed, in 4 files |
| axe-core via vitest-axe on the React app | 0 violations in 6 states: home, services with filters open, pristine form, form with errors, review dialog open, confirmation |
| axe-core on the 3 static wireframes (`npm run audit:wireframes`) | 0 violations on `index.html`, `services.html`, `book.html`; wireframes contain no `<script>` |
| Computed contrast (`npm run audit:contrast`) | All 18 colour pairs pass; lowest text ratio is 5.17:1, lowest non-text ratio is 5.42:1 |
| Focus indicator audit | No `outline: none` or `outline: 0` anywhere in the stylesheets or components |
| Production build (`npm run build`) | Succeeds |

**What these results do not cover.** jsdom has no layout engine, so axe's `color-contrast` rule cannot run in the automated tests. Contrast is covered by the computed ratios above instead. A Lighthouse accessibility report could not be generated in the build environment because no browser was available. **The assignment asks for a Lighthouse or axe report showing a 100% score, so please run Lighthouse yourself and paste the result here:**

```bash
npm run build && npm run preview
# in a second terminal:
npx lighthouse http://localhost:5174/
 --only-categories=accessibility --view
```

Lighthouse score: **____ / 100** (home), **____ / 100** (after navigating by hand to the booking form and running the Lighthouse panel in Chrome DevTools)

### Manual testing logs (to be completed by the tester)

These scripts have not been run yet. Record real observations; do not copy the expected results as findings.

**Environment:** OS ______ | Browser ______ | Screen reader and version ______ | Date ______ | Tester ______

**A. Keyboard-only tab sequence (no mouse).** Expected order is the DOM order. Items marked (T) are also asserted in the automated tests.

| Step | Expected focus order | Pass/Fail | Notes |
|---|---|---|---|
| Home | Skip link (T), Home (T), Find a service (T), Book an appointment (T), Browse services, Start booking, Check latest availability | | |
| Skip link | Enter on the skip link moves focus into main content | | |
| Services | Search box, Filters accordion button, chips (after opening with Enter or Space), Clear button, each Book button | | |
| Booking form | Name, email, mobile, service, practitioner, date, access needs, Review booking | | |
| Failed submit | Focus lands on the error summary (T); links in it move focus to the field (T) | | |
| Review dialog | Focus lands on dialog heading (T); Tab cycles Confirm and Edit only (T); Escape closes and returns focus to Review booking (T) | | |
| Confirmation | Focus lands on "Booking confirmed" heading (T) | | |
| Traps | No point where Tab or Shift+Tab cannot leave | | |

**B. Screen reader script (NVDA, VoiceOver or Orca).**

| Task | Expected announcement | Heard (exact words) | Pass/Fail |
|---|---|---|---|
| Open Home, press `D` to cycle landmarks | banner, navigation, main, complementary, contentinfo | | |
| Press `H` on each view | One level-1 heading, levels do not skip | | |
| Open the Filters accordion | "Filters, button, collapsed", then "expanded" | | |
| Toggle the Urgent chip | "Urgent, toggle button, pressed" | | |
| Type "vaccin" in search, then pause | "2 services found." once, after the pause | | |
| Press Check latest availability | "Checking latest availability." then "Availability updated. 3 practitioners listed." | | |
| Tab into the email field | Label, "required", helper text read | | |
| Submit an empty form | Error summary read; check whether it is read twice | | |
| Enter an invalid email and Tab away | "Error: Email address is not valid..." announced | | |
| Complete a valid booking | Dialog title and description read on open; confirmation read after confirming | | |

---

## Known limitations

- Availability, services and the booking submission are simulated in the client; there is no backend.
- The date input uses the browser's native control. Behaviour differs between browsers and screen readers.
- The review dialog contains focus but does not mark the rest of the page `inert`; it relies on `aria-modal` and the focus containment above.
- Lighthouse and screen reader results above are left for the tester, as explained in section 3.
