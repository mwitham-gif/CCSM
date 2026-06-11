# CCSM Community Resources

Static, mobile-first community resource directory for Community Corporation of Santa Monica.

The site is designed for a QR-code journey: residents scan a flyer, search or choose a support area, then call or visit a provider directly.

Live site:

https://mwitham-gif.github.io/CCSM/

## Project Files

- `index.html` - page shell, metadata, CSP, and static layout
- `styles.css` - visual design, responsive layout, accessibility states
- `app.js` - Google Sheet loading, CSV parsing, search/filter/share behavior
- `ccsm_logo_web.png` - logo and social preview image

## How It Works

1. Staff update the Google Sheet.
2. The sheet is published as CSV.
3. `app.js` fetches the CSV, normalizes rows, and renders resource cards.
4. GitHub Pages serves the static files from `main`.

The app intentionally does not use a backend, build step, analytics script, external font request, or client-side framework.

## Privacy And Security Defaults

- No Google Analytics or third-party tracking.
- No external fonts.
- Search terms are not stored in the URL after initial load.
- A Content Security Policy limits scripts and styles to this site.
- Live data fetches are limited to the published Google Sheet host.
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
- Text the live link to yourself and confirm the preview looks right.
- Try a broken shared URL like `?share=missing-resource` and confirm the fallback is helpful.

## If Something Looks Wrong

- If no resources load, check whether the Google Sheet is still published as CSV.
- If a resource is missing, make sure the row has a `name`.
- If a filter looks odd, check the `category` spelling.
- If a call or website button is missing, check whether `phone` or `website` is blank.
- If the page looks stale after a push, wait a minute and hard refresh.
