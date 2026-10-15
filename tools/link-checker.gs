/**
 * Santa Monica Resource Guide — monthly broken-link check.
 *
 * Runs inside the resource Google Sheet (Extensions > Apps Script), visits
 * every website in the sheet once a month, and emails a short report to
 * help@communitycorp.org. Setup steps are in the README, "Monthly link check".
 *
 * Nothing here changes the sheet. It only reads it and sends one email.
 */

const REPORT_TO = 'help@communitycorp.org';
const GUIDE_URL = 'https://mwitham-gif.github.io/CCSM/';

// Run this once by hand (select it above, then click Run) to schedule the
// check for the 1st of every month, around 8am. Running it again replaces
// the old schedule instead of adding a second one.
function scheduleMonthlyCheck() {
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'checkLinks')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('checkLinks').timeBased().onMonthDay(1).atHour(8).create();
}

function checkLinks() {
  const rows = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getDataRange().getDisplayValues();
  const headers = rows[0].map(value => value.trim().toLowerCase());
  const nameCol = findColumn(headers, ['name', 'resource name', 'program name', 'organization name']);
  const siteCol = findColumn(headers, ['website', 'web site', 'url', 'link']);
  if (nameCol === -1 || siteCol === -1) {
    MailApp.sendEmail(REPORT_TO, 'Resource guide link check could not run',
      'The link check could not find the "name" and "website" columns in the first tab of the sheet.');
    return;
  }

  const broken = [];      // the site is gone or answers with an error
  const unchecked = [];   // the site turned the checker away; a person should look
  let checked = 0;

  rows.slice(1).forEach((row, index) => {
    const name = row[nameCol].trim();
    const url = normalizeUrl(row[siteCol]);
    if (!name || !url || name.toLowerCase() === headers[nameCol]) return;
    checked += 1;

    const result = checkUrl(url);
    const entry = `• ${name} (sheet row ${index + 2})\n  ${url}\n  ${result.detail}`;
    if (result.status === 'broken') broken.push(entry);
    if (result.status === 'unchecked') unchecked.push(entry);
  });

  const lines = [
    `Monthly link check for the Santa Monica Resource Guide: ${checked} websites checked.`,
    '',
  ];
  if (broken.length) {
    lines.push(`NEEDS FIXING (${broken.length}): these links look broken. Find the provider's current website and update the sheet, or clear the cell.`, '', ...broken, '');
  }
  if (unchecked.length) {
    lines.push(`PLEASE CHECK BY HAND (${unchecked.length}): these sites blocked the automatic check. They are often fine; open each one in a browser to be sure.`, '', ...unchecked, '');
  }
  if (!broken.length && !unchecked.length) lines.push('Every link worked. Nothing to do this month.', '');
  lines.push(`Guide: ${GUIDE_URL}`, `Sheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`);

  const subject = broken.length
    ? `Resource guide: ${broken.length} broken link${broken.length === 1 ? '' : 's'} to fix`
    : 'Resource guide: monthly link check, all clear';
  MailApp.sendEmail(REPORT_TO, subject, lines.join('\n'));
}

function findColumn(headers, names) {
  for (const name of names) {
    const index = headers.indexOf(name);
    if (index !== -1) return index;
  }
  return -1;
}

// Same rule as the guide: a bare "example.org" becomes https://example.org.
function normalizeUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z]+:/i.test(trimmed)) return '';
  return 'https://' + trimmed;
}

function checkUrl(url) {
  try {
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      validateHttpsCertificates: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (resource guide link check; ' + REPORT_TO + ')' },
    });
    const code = response.getResponseCode();
    if (code < 400) return { status: 'ok' };
    // Many government and nonprofit sites refuse automated visitors.
    if ([401, 403, 405, 406, 429, 503].includes(code)) {
      return { status: 'unchecked', detail: `The site refused the automatic check (error ${code}).` };
    }
    if (code === 404 || code === 410) return { status: 'broken', detail: `Page not found (error ${code}).` };
    return { status: 'broken', detail: `The site answered with error ${code}.` };
  } catch (error) {
    const message = String(error && error.message || error);
    if (/certificate|ssl/i.test(message)) return { status: 'broken', detail: 'The site\'s security certificate is invalid.' };
    if (/DNS|not found|Address unavailable/i.test(message)) return { status: 'broken', detail: 'The web address no longer exists.' };
    if (/timeout|timed out/i.test(message)) return { status: 'unchecked', detail: 'The site took too long to answer.' };
    return { status: 'broken', detail: 'The site could not be reached.' };
  }
}
