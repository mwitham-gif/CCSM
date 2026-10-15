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
- `favicon-32.png`, `apple-touch-icon.png` - browser tab and home-screen icons
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` - lets phones add the guide to the home screen like an app
- `sw.js` - service worker that saves the page and the sheet so the guide opens with no signal
- `flyer/ccsm-qr.svg`, `flyer/ccsm-qr.png` - QR code for this site (printouts and flyers)
- `tools/link-checker.gs` - monthly broken-link email, run from the Google Sheet (see "Monthly Link Check")
- `tests/check.cjs` - automated safety checks (see "Safety Checks")

## How It Works

1. Staff update the Google Sheet.
2. The sheet is published as CSV.
3. `app.js` fetches the CSV, normalizes rows, and renders resource cards.
4. GitHub Pages serves the static files from `main`.

The app intentionally does not use a backend, build step, external font request, or client-side framework. The only third-party script is Google Analytics. Google Tag Manager was removed in October 2026: its three tags duplicated every link tap and leaked search text.

## Features For Residents

- **Search that understands everyday words.** "groceries", "eviction",
  "can't pay my electric bill", "comida" or "médico" find the right support
  area even when a listing never uses that word. Search ignores accents and
  looks at English and Spanish text whichever language is showing. The word
  lists are `SEARCH_CONCEPTS` in `app.js`; to teach search a new word, add it
  to the right category's line. A listing whose name contains "Pantry
  Locator" is listed first for food searches and on Food support
  (`SEARCH_PINS`).
- **Works offline and installs like an app.** After one visit, the guide
  opens with no signal, showing the last list it saved and a note that
  details may have changed. On Android, Chrome offers "Install app"; on
  iPhone, use Share → Add to Home Screen. When online, the newest page and
  sheet always load first.
- **Print or save as PDF.** Every Share menu (one resource, or a whole
  support area) has "Print or save as PDF": a branded, large-type sheet with
  phone numbers and web addresses written out and a QR code back to the guide.
- **Larger text.** The A+ button in the header makes the whole page 20%
  bigger. The choice is remembered on that phone or computer.
- **Listings without hours** simply leave out the "When" line.

## Monthly Link Check

`tools/link-checker.gs` visits every website in the sheet on the 1st of each
month and emails help@communitycorp.org a list of links that look broken,
plus any sites that refused the automatic check and should be opened by hand.
It runs inside Google, as the account that sets it up, and only reads the
sheet. One-time setup (about five minutes):

1. Open the resource Google Sheet. Choose **Extensions → Apps Script**.
2. Delete the sample code, paste in the whole of `tools/link-checker.gs`, and
   click **Save**.
3. In the function menu at the top, choose `checkLinks` and click **Run**.
   Approve the permissions Google asks for. A first report arrives at
   help@communitycorp.org within a few minutes.
4. Choose `scheduleMonthlyCheck` and click **Run** once.

## Safety Checks

`tests/check.cjs` runs on GitHub after every push (the **Actions** tab, and a
green check or red X next to each commit). It fails if a change:

- weakens the Content Security Policy or adds inline scripts, inline styles
  or event handlers to `index.html`;
- lets text from the sheet run as code, or lets a website cell become a
  `javascript:`, `data:` or other unsafe link (it loads a deliberately hostile
  sheet, `tests/fixtures/hostile.csv`, to prove this);
- breaks a privacy rule: shared resource names or sensitive searches
  reaching Google Analytics;
- breaks Quick exit, the Browsing safely note, search, Spanish, printing or A+.

`tests/fixtures/sample.csv` holds made-up listings for the everyday checks.
To run it on a computer: `npm install --no-save playwright@1.56.1`,
`npx playwright install chromium`, then `node tests/check.cjs`.

A red X does not stop a push from going live: GitHub Pages publishes `main`
either way.

## Privacy And Security Defaults

- Google Analytics 4 (property `G-FT2K5G6SYR`; until October 2026 the Red Tail Crossing site also reported here, under page path `/CCSM-RedTail/`) records page views. It sets its
  own cookies and reports to Google. `analytics.js` also sends three custom
  events with `gtag()`: `resource_click` (call, website, email, and report
  links on a card), `filter_select` (support-area filter buttons), and
  `resource_search` (the search box, 1.5s after typing stops, with
  `result_count`), plus `search_no_results` when a search matched nothing,
  which shows needs the directory does not cover yet. Search terms
  are sent to Google as typed, so anything a visitor enters there leaves the
  site, with these exceptions: searches about abuse,
  immigration status, self-harm, or sexual and reproductive health, and
  searches containing an email address or a phone-length number, send
  `(withheld)` instead of the words typed; and page views of a shared link
  report `?share=(withheld)` with the title "Shared resource", so Google never
  learns which resource was shared. Google signals and ad personalization are
  turned off in the page code. This is the one exception to the rules
  below, and it is worth keeping in mind for an audience that reaches the site
  by scanning a flyer for housing, food, or legal help.
- Clicks are recorded in full for every listing, domestic violence listings
  included: `resource_click` sends the listing's name, category and link, and
  GA4's Enhanced measurement → Outbound clicks may stay on (it records the
  address of every link to another site). This was a deliberate choice in
  October 2026 so staff can see which resources residents use.
- To see the event parameters in reports, register them as event-scoped
  custom dimensions (Admin → Custom definitions): `resource_name`,
  `resource_category`, `click_type`, `filter_name`, `search_term`; and
  `result_count` as an event-scoped custom metric.
- No other third-party tracking, and no advertising tags.
- On domestic violence views only (the Domestic violence filter, or a shared
  domestic violence resource), a Quick exit button stays on screen (bottom
  right), with a short "Browsing safely" note (private windows, clearing
  history, safer devices, 911). Quick exit replaces the page in
  history with weather.com, so Back does not return here, and erases the
  offline copy of the guide that `sw.js` saved on the device. There is no
  keyboard shortcut on purpose: Esc already clears search and closes menus.
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
- `address_es`
- `phone`
- `website`
- `hours`
- `hours_es`
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
- Use Spanish columns only when Spanish text is available. Leave `address_es` blank for a street address (it reads the same in both languages); fill it for places like "Online" or "Los Angeles County – phone only". Each Spanish column falls back to the English one when blank.
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
