# CCSM Community Resources

Static, mobile-first community resource directory for Community Corporation of Santa Monica.

The site is designed for a QR-code journey: residents scan a flyer, search or choose a support area, then call or visit a provider directly.

Live site:

https://mwitham-gif.github.io/CCSM/

## Project Files

- `index.html` - page shell, metadata, CSP, and static layout
- `styles.css` - visual design, responsive layout, accessibility states
- `app.js` - Google Sheet loading, CSV parsing, search/filter/share behavior
- `analytics.js` - Google Analytics bootstrap and custom events, kept out of `index.html` so the
  Content Security Policy does not need to allow inline scripts
- `ccsm_logo_web.png` - logo and social preview image

## How It Works

1. Staff update the Google Sheet.
2. The sheet is published as CSV.
3. `app.js` fetches the CSV, normalizes rows, and renders resource cards.
4. GitHub Pages serves the static files from `main`.

The app intentionally does not use a backend, build step, external font request, or client-side framework. The only third-party script is Google Analytics.

## Privacy And Security Defaults

- Google Analytics 4 (property `G-FT2K5G6SYR`) records page views. It sets its
  own cookies and reports to Google. `analytics.js` also pushes three custom
  events to `dataLayer`: `resource_click` (call, website, email, and report
  links on a card), `filter_select` (support-area filter buttons), and
  `resource_search` (the search box, 1.5s after typing stops). Search terms
  are sent to Google as typed, so anything a visitor enters there leaves the
  site. This is the one exception to the rules
  below, and it is worth keeping in mind for an audience that reaches the site
  by scanning a flyer for housing, food, or legal help.
- No other third-party tracking, and no advertising tags.
- No external fonts.
- Search terms are not stored in the URL after initial load.
- A Content Security Policy limits scripts and styles to this site, with
  `googletagmanager.com` allowed for the analytics loader. Analytics code lives
  in `analytics.js` rather than inline, so the policy still forbids inline
  scripts.
- Apart from analytics, live data fetches are limited to the published Google
  Sheet host.
- If analytics is blocked, by a content blocker or a network, the directory
  loads and works normally. Nothing about finding a resource depends on it.
- If the sheet cannot load, the site shows an outage message with Resident Services contact information instead of sample/demo data.

## Recommended Sheet Columns

Use these column headers in row 1:

- `name`
- `name_es`
- `category`
- `description`
- `description_es`
- `address`
- `phone`
- `website`
- `hours`
- `notes`
- `notes_es`
- `tags`
- `tags_es`

Only `name` is required, but each resource works best with `category`, `description`, and either `phone` or `website`.

The importer accepts common variations like `Name`, `Resource Name`, `Phone Number`, `URL`, and `Location`, but the recommended names above are more predictable.

## Recommended Categories

Use one of these values in the `category` column:

- `Food`
- `Mental`
- `Rental`
- `Legal`
- `Benefits`
- `Transportation`
- `Education`
- `Employment`
- `Childcare`
- `Youth`
- `Seniors`
- `Housing`
- `Disability`
- `Medical`
- `Domestic Violence`
- `Other`

The app normalizes close matches like `food pantry`, `mental health`, and `public benefits`, but exact values are best.

## Data Entry Tips

- Put one resource per row.
- Keep descriptions short and plain-language.
- Use readable phone numbers like `(310) 555-1212`.
- Use full website URLs when possible, like `https://example.org`.
- Use Spanish columns only when Spanish text is available.
- Use `tags` for short labels like `Walk-ins welcome`, `Appointment required`, `Santa Monica residents`, or `Families`.
- Separate multiple tags with commas or vertical bars.
- Leave fields blank if they do not apply.

## Updating The Google Sheet Source

The CSV source lives in `app.js`:

```js
const SHEET_URL = '...';
```

Update that value only when moving to a different Google Sheet, changing the published tab, or setting up publishing for the first time.

## Local Preview

From this folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploying

GitHub Pages updates automatically when changes are pushed to `main`:

```bash
git add index.html styles.css app.js README.md
git commit -m "Describe the change"
git push origin main
```

Pages can take a minute or two to refresh.

### Bump The Asset Version When Markup And Script Change Together

`index.html` loads the assets with a version query:

```html
<link rel="stylesheet" href="styles.css?v=2">
<script src="app.js?v=2" defer></script>
```

**If a change edits `index.html` and `app.js` together, raise both numbers
to the next version in the same commit.**

Pages serves `index.html` with a short cache lifetime, but a visitor's
browser can hold `app.js` and `styles.css` for much longer. Without the
bump, a returning visitor can end up running yesterday's script against
today's markup. Changing the number makes the URL a cache miss, so the two
always arrive as a matched pair.

This matters most when an element is removed from `index.html`. A script
that still expects it will write to something that is not there. `app.js`
guards its lookups so a missing element is skipped rather than fatal, but
the version bump is what keeps the pair honest; the guards are the safety
net underneath it.

A CSS-only or script-only change does not need a bump, though one is
harmless.

## Pre-Flyer QA Checklist

Before printing or distributing a flyer QR code:

- Scan the QR code on an iPhone.
- Scan the QR code on an Android phone if available.
- Confirm the page loads on cellular data.
- Search for `food`.
- Tap a support-area filter.
- Tap a call button.
- Tap a website button.
- Switch to Spanish and back to English.
- Reload once with a hard refresh and once normally, so a cached copy of the
  previous `app.js` would show up.
- Text the live link to yourself and confirm the preview looks right.
- Try a broken shared URL like `?share=missing-resource` and confirm the fallback is helpful.

## If Something Looks Wrong

- If no resources load, check whether the Google Sheet is still published as CSV.
- If analytics stops reporting, check that the CSP in `index.html` still allows
  `googletagmanager.com` under `script-src`, and that `analytics.js` is loaded.
  A console message beginning "Refused to load the script" means the CSP is the
  cause.
- If a resource is missing, make sure the row has a `name`.
- If a filter looks odd, check the `category` spelling.
- If a call or website button is missing, check whether `phone` or `website` is blank.
- If the page looks stale after a push, wait a minute and hard refresh.
- If the page loads but shows no resources and no outage message, suspect a
  cached `app.js` running against newer markup. Open the browser console: a
  `TypeError` naming a null element confirms it. Bump the asset version in
  `index.html` as described under Deploying.
