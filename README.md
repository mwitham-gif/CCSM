# CCSM Community Resources

This project is a simple static web page that displays community resources for Community Corporation of Santa Monica.

The site reads its data from a published Google Sheet, so non-technical staff can update listings without editing code.

## How It Works

1. Staff update the Google Sheet.
2. The sheet is published as CSV.
3. The website loads that CSV and turns each row into a resource card.

The website file is [`index.html`](/Users/michaelwitham/Desktop/Resource%20Directory/CCSM/index.html).

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

Only `name` is truly required, but a resource works best when it also has `category`, `description`, and either a `phone` or `website`.

The importer is forgiving and also accepts some common variations like `Name`, `Resource Name`, `Phone Number`, `URL`, and `Location`, but using the recommended column names will keep things more predictable.

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

The app will try to normalize close matches like `food pantry`, `mental health`, or `public benefits`, but using the exact category names above is best.

## Data Entry Tips

- Put one resource per row.
- Keep phone numbers in a normal readable format like `(310) 555-1212`.
- For websites, use the full URL when possible, like `https://example.org`.
- Keep descriptions short and plain-language.
- Use `name_es`, `description_es`, and `notes_es` only when Spanish text is available.
- If a field does not apply, leave it blank instead of typing placeholder text.

## Publishing The Sheet

The site currently reads from the published CSV URL stored in [`index.html`](/Users/michaelwitham/Desktop/Resource%20Directory/CCSM/index.html#L529).

Publishing the Google Sheet is usually a one-time setup step.

If the sheet is already published, staff can continue editing the sheet normally and the website will keep using the same published CSV link.

You only need to update the `SHEET_URL` value when:

- moving the website to a different Google Sheet
- changing to a different published tab or CSV link
- setting up publishing for the first time

When changing the source sheet or setting up publishing:

1. Open the Google Sheet.
2. Use Google Sheets publishing or sharing settings to create a public CSV link.
3. Replace the `SHEET_URL` value in [`index.html`](/Users/michaelwitham/Desktop/Resource%20Directory/CCSM/index.html#L529).

## If Something Looks Wrong

- If the page shows demo data, the sheet may not be reachable or may not be published correctly.
- If a resource is missing, check that the row has a value in the `name` column.
- If a filter looks odd, check the `category` value for spelling.
- If a button is missing, check whether `phone` or `website` is blank.
