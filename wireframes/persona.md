# Primary Assistive Technology User Persona

## Nomsa Dlamini, 34, Cape Town

**Role:** Payroll administrator at a small logistics firm. Single mother of one child (age 6) who needs routine vaccinations and occasional urgent visits.
**Disability:** Blind since age 19. Uses a screen reader for all computer and phone use.

### Technical configuration

| Area | Setup |
|---|---|
| Desktop OS | Windows 11 |
| Browser | Firefox (latest), with Chrome as a fallback |
| Screen reader | NVDA with the eSpeak NG voice at roughly 330 words per minute |
| Braille | 40-cell refreshable braille display, connected over USB, used for reading form values |
| Mobile | iPhone with VoiceOver on, Safari |
| Input modalities | Keyboard only on desktop (no mouse); touch gestures plus VoiceOver rotor on mobile |
| Browser settings | Default zoom, high-contrast mode off, "reduce motion" on |

### How she navigates

- Jumps by landmarks (`D` in NVDA browse mode), headings (`H`, `1`-`6`), form fields (`F`) and buttons (`B`) rather than reading pages top to bottom.
- Opens the elements list (`NVDA+F7`) to scan links and headings quickly.
- Relies on the page `<title>` and the first `<h1>` to confirm she is on the right page.
- Uses Tab and Shift+Tab inside forms, and Enter/Space to activate controls.

### Pain points with conventional web design

1. **Unlabeled or placeholder-only inputs.** Hears "edit, blank" and has to guess the field purpose.
2. **Error messages that only appear visually.** Submits a form, hears nothing, and does not know it failed.
3. **Filters that change results silently.** Ticks a box and cannot tell whether the list updated or how many results remain.
4. **Custom dropdowns and accordions without state.** Hears "button" but not whether a section is open or closed.
5. **Focus loss.** After a dialog closes or the page changes, focus jumps to the top of the document and she must start again.
6. **Keyboard traps and mouse-only widgets,** such as date pickers she cannot leave.
7. **Time limits and auto-refreshing content** that interrupt her mid-reading.

### Primary goals

1. Find the right clinic service quickly using search and filters, and know how many results there are.
2. Book a vaccination appointment for her child without sighted help, completing the form in one pass.
3. Understand clearly when something she typed is wrong, and how to fix it.
4. Check a practitioner's availability without opening many pages.
5. Receive a confirmation she can read with her screen reader and keep for her records.

### Design implications

| Need | Design response |
|---|---|
| Understand page structure fast | Landmarks (`header`, `nav`, `main`, `aside`, `footer`), one `h1` per page, logical heading levels, skip link |
| Know what each field wants | Visible `<label>` for every input, helper text linked with `aria-describedby` |
| Hear validation outcomes | `aria-invalid`, error text linked to the field, `aria-live` status region and an error summary that receives focus |
| Know filter state | `aria-expanded` on accordion headers, `aria-pressed` on toggle chips, polite live region announcing result counts |
| Never lose her place | Programmatic focus management with `useRef` on view change, modal open and modal close |
| Operate without a mouse | Native elements first, every control reachable by Tab and operable by Enter/Space, no keyboard traps |

### Quote

> "I don't need it to be pretty for me. I need it to tell me what is happening, every time."
