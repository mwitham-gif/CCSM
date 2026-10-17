// Safety checks for the Santa Monica Resource Guide.
//
// Runs on every push and pull request (.github/workflows/checks.yml), and
// locally with:  npm install --no-save playwright@1.56.1 && node tests/check.cjs
//
// Part 1 reads the files and fails if a change weakens the browser security
// rules (Content Security Policy) or adds code patterns those rules forbid.
// Part 2 opens the site in a real browser, feeds it a deliberately hostile
// sheet (tests/fixtures/hostile.csv) and the real listings, and fails if any
// sheet text can run code, any link uses an unsafe kind of address, or the
// privacy rules stop holding.

const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const failures = [];
let passes = 0;

function check(label, ok, detail = '') {
  if (ok) {
    passes += 1;
    console.log(`  ok   ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL ${label}${detail ? `\n       ${detail}` : ''}`);
  }
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

// ── Part 1: static checks ──────────────────────────────────────────────────
function staticChecks() {
  console.log('Static checks');
  const html = read('index.html');
  const scripts = ['app.js', 'analytics.js', 'sw.js'].map(file => [file, read(file)]);

  const cspMatch = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
  check('index.html has a Content Security Policy', Boolean(cspMatch));
  const csp = cspMatch ? cspMatch[1] : '';
  const directives = Object.fromEntries(csp.split(';').map(part => part.trim().split(/\s+/)).filter(p => p[0]).map(([name, ...values]) => [name, values]));

  check("CSP default-src is 'none'", String(directives['default-src']) === "'none'", `default-src: ${directives['default-src']}`);
  check("CSP object-src is 'none'", String(directives['object-src']) === "'none'");
  check("CSP base-uri is 'none'", String(directives['base-uri']) === "'none'");
  check("CSP form-action is 'none'", String(directives['form-action']) === "'none'");
  check('CSP never allows unsafe-inline or unsafe-eval', !/unsafe-inline|unsafe-eval|unsafe-hashes|\*\s*;|'strict-dynamic'/.test(csp), csp);

  const allowedScriptSources = ["'self'", 'https://www.googletagmanager.com'];
  const scriptSources = directives['script-src'] || [];
  check('CSP script-src lists only this site and the analytics loader',
    scriptSources.length > 0 && scriptSources.every(source => allowedScriptSources.includes(source)),
    `script-src: ${scriptSources.join(' ')}`);
  check("CSP style-src is only 'self'", String(directives['style-src']) === "'self'");

  const allowedConnect = ["'self'", 'https://docs.google.com', 'https://*.googleusercontent.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'];
  const connect = directives['connect-src'] || [];
  check('CSP connect-src reaches only the sheet and analytics', connect.every(source => allowedConnect.includes(source)), `connect-src: ${connect.join(' ')}`);

  const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(([, attrs, body]) => !/\bsrc=/.test(attrs) || body.trim());
  check('index.html has no inline scripts', inlineScripts.length === 0);
  check('index.html has no inline event handlers (onclick= and similar)', !/\son[a-z]+\s*=/i.test(html.replace(/<!--[\s\S]*?-->/g, '')));
  check('index.html has no inline style attributes', !/\sstyle\s*=/i.test(html));
  check('index.html has no javascript: links', !/javascript:/i.test(html));

  const externalScripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1]).filter(src => /^https?:/i.test(src));
  check('only the analytics loader is loaded from another site',
    externalScripts.every(src => src.startsWith('https://www.googletagmanager.com/gtag/js')), externalScripts.join(', '));

  const localRefs = [...html.matchAll(/(?:src|href)="([^"#:]+?)(?:\?v=\d+)?"/g)].map(m => m[1]).filter(ref => !ref.startsWith('/') && ref.includes('.'));
  const missing = localRefs.filter(ref => !fs.existsSync(path.join(ROOT, ref)));
  check('every file index.html refers to exists', missing.length === 0, missing.join(', '));

  scripts.forEach(([file, source]) => {
    check(`${file} has no eval, new Function, or document.write`, !/\beval\s*\(|new\s+Function\s*\(|document\.write\s*\(/.test(source));
    check(`${file} sets no timers from strings`, !/set(?:Timeout|Interval)\s*\(\s*['"`]/.test(source));
  });

  const app = read('app.js');
  check('website links are limited to http and https', /function normalizeWebsiteUrl[\s\S]*?\^https\?:\\\/\\\//.test(app));
  check('analytics reports to the Santa Monica property only',
    html.includes('gtag/js?id=G-FT2K5G6SYR') && /gtag\('config', 'G-FT2K5G6SYR'/.test(read('analytics.js')) && !/G-S3BPY8ZED8/.test(html + read('analytics.js')));
  check('report emails go to help@communitycorp.org', /const REPORT_EMAIL = 'help@communitycorp\.org';/.test(app));
}

// The one tab and GA4 page title, whatever the view.
const SITE_TITLE = 'Santa Monica Resource Guide · Community Corp Santa Monica';

// ── Part 2: browser checks ────────────────────────────────────────────────
const TYPES = { html: 'text/html', js: 'text/javascript', css: 'text/css', png: 'image/png', svg: 'image/svg+xml', webmanifest: 'application/manifest+json', csv: 'text/csv' };

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let file = decodeURIComponent(url.pathname.replace(/^\/CCSM\/?/, ''));
    if (!file) file = 'index.html';
    const full = path.join(ROOT, file);
    if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(full).slice(1)] || 'application/octet-stream' });
    res.end(fs.readFileSync(full));
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function browserChecks() {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (error) {
    check('Playwright is installed (npm install --no-save playwright@1.56.1)', false);
    return;
  }

  const server = await startServer();
  const base = `http://localhost:${server.address().port}/CCSM/`;
  const launchOptions = {};
  if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(launchOptions);

  async function openWith(csvFile, query = '') {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const csv = fs.readFileSync(path.join(ROOT, csvFile), 'utf8');
    await context.route(/docs\.google\.com/, route => route.fulfill({ body: csv, contentType: 'text/csv', headers: { 'access-control-allow-origin': '*' } }));
    await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.fulfill({ body: '', contentType: 'text/javascript' }));
    await context.route(/weather\.com/, route => route.fulfill({ body: '<title>weather</title>', contentType: 'text/html' }));
    const page = await context.newPage();
    const problems = [];
    page.on('pageerror', error => problems.push(`page error: ${error.message}`));
    page.on('console', message => {
      if (message.type() === 'error' || /Content Security Policy/i.test(message.text())) problems.push(message.text());
    });
    page.on('dialog', dialog => { problems.push(`dialog opened: ${dialog.message()}`); dialog.dismiss(); });
    await page.goto(base + query);
    await page.waitForSelector('.card, .empty', { timeout: 15000 });
    return { context, page, problems };
  }

  // Hostile sheet: every field tries to run code or smuggle in a bad link.
  console.log('Browser checks: hostile sheet');
  {
    const { context, page, problems } = await openWith('tests/fixtures/hostile.csv');
    const cards = await page.locator('.card').count();
    check('hostile rows still show as plain listings (repeated header row skipped)', cards === 6, `cards: ${cards}`);

    // Hover and click over every card to trigger any handler that slipped in.
    for (const card of await page.locator('.card').all()) {
      await card.hover().catch(() => {});
    }
    await page.fill('#search', '<script>window.__pwned="search"</script>');
    await page.waitForTimeout(200);
    await page.fill('#search', 'amp');
    await page.waitForTimeout(200);
    await page.fill('#search', '');
    await page.waitForTimeout(200);

    check('no sheet text ran as code', await page.evaluate(() => window.__pwned === undefined), String(await page.evaluate(() => window.__pwned)));
    const injected = await page.evaluate(() => Array.from(document.querySelectorAll('#grid *'))
      .filter(el => Array.from(el.attributes).some(attr => /^on/i.test(attr.name)) || ['SCRIPT', 'IMG', 'IFRAME', 'OBJECT', 'EMBED'].includes(el.tagName))
      .map(el => el.outerHTML.slice(0, 80)));
    check('no injected elements or event handlers in the listings', injected.length === 0, injected.join(' | '));

    const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('#grid a[href]')).map(a => a.getAttribute('href')));
    const unsafe = hrefs.filter(href => !/^(https:\/\/|tel:\+?\d+$|mailto:)/i.test(href));
    check('every link is https, tel or mailto', unsafe.length === 0, unsafe.join(' | '));
    check('javascript:, data: and vbscript: websites are dropped', !hrefs.some(href => /javascript:|data:|vbscript:/i.test(href)));
    check('phone links contain only digits', hrefs.filter(href => href.startsWith('tel:')).every(href => /^tel:\+?\d+$/.test(href)));
    const openers = await page.evaluate(() => Array.from(document.querySelectorAll('a[target="_blank"]')).filter(a => !/noopener/.test(a.rel)).length);
    check('links that open a new tab use rel=noopener', openers === 0);

    // Quick exit and the safety note on the domestic violence view.
    await page.click('[data-category="Domestic Violence"]');
    await page.waitForTimeout(200);
    check('Quick exit shows on the domestic violence view', await page.locator('#quick-exit').isVisible());
    check('Browsing safely note shows on the domestic violence view', await page.locator('#safety-tip').isVisible());
    await page.click('[data-category="Food"]');
    await page.waitForTimeout(200);
    check('Quick exit and the note hide elsewhere',
      !(await page.locator('#quick-exit').isVisible()) && !(await page.locator('#safety-tip').isVisible()));
    await page.click('[data-category="Domestic Violence"]');
    await page.waitForTimeout(200);
    await Promise.all([page.waitForURL(/weather\.com/, { timeout: 5000 }).catch(() => {}), page.click('#quick-exit')]);
    check('Quick exit leaves for a neutral site', /weather\.com/.test(page.url()), page.url());

    check('no errors or security-policy violations (hostile sheet)', problems.length === 0, problems.join(' | '));
    await context.close();
  }

  // Privacy: what reaches Google Analytics.
  console.log('Browser checks: privacy');
  {
    const { context, page, problems } = await openWith('tests/fixtures/hostile.csv', '?share=Safe%20House&q=secret');
    const config = await page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry)).find(entry => entry[0] === 'config'));
    const settings = (config && config[2]) || {};
    check('a shared link never sends the resource name', /share=%28withheld%29/.test(settings.page_location || '') && !/Safe/.test(JSON.stringify(settings)), JSON.stringify(settings));
    check('an old ?q= link never sends the search', !/secret/.test(JSON.stringify(settings)));
    check('Google signals and ad personalization stay off', settings.allow_google_signals === false && settings.allow_ad_personalization_signals === false);
    check('a shared link keeps the fixed page title', settings.page_title === SITE_TITLE && (await page.title()) === SITE_TITLE, `${settings.page_title} / ${await page.title()}`);
    await context.close();

    const second = await openWith('tests/fixtures/hostile.csv');
    const searches = async term => {
      await second.page.fill('#search', term);
      await second.page.waitForTimeout(1700);
      return second.page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry))
        .filter(entry => entry[0] === 'event' && entry[1] === 'resource_search').map(entry => entry[2].search_term));
    };
    for (const term of ['domestic violence', 'deportation', 'my number is 310 555 1212', 'me@example.com']) {
      const sent = await searches(term);
      check(`sensitive search is withheld: "${term}"`, sent[sent.length - 1] === '(withheld)', `sent: ${sent[sent.length - 1]}`);
    }
    const sent = await searches('groceries');
    check('an ordinary search is still counted', sent[sent.length - 1] === 'groceries');
    await searches('zzqxv nothing');
    const empty = await second.page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry))
      .filter(entry => entry[0] === 'event' && entry[1] === 'search_no_results').map(entry => entry[2].search_term));
    check('a search that finds nothing is reported as such', empty[empty.length - 1] === 'zzqxv nothing', `sent: ${empty.join(', ')}`);
    await searches('asylum zzqxv');
    const emptySensitive = await second.page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry))
      .filter(entry => entry[0] === 'event' && entry[1] === 'search_no_results').map(entry => entry[2].search_term));
    check('a sensitive search that finds nothing is still withheld', emptySensitive[emptySensitive.length - 1] === '(withheld)');

    await second.page.fill('#search', '');
    await second.page.click('[data-category="Domestic Violence"]');
    await second.page.waitForTimeout(200);
    await second.page.evaluate(() => document.querySelector('.card .btn-web')?.addEventListener('click', event => event.preventDefault()));
    await second.page.click('.card .btn-web');
    const click = await second.page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry)).filter(entry => entry[1] === 'resource_click').pop());
    check('a click on a domestic violence listing is counted with its name and link',
      Boolean(click) && click[2].resource_name !== '(withheld)' && /^https:\/\//.test(click[2].link_url), JSON.stringify(click && click[2]));
    check('no errors (privacy checks)', problems.length === 0 && second.problems.length === 0, [...problems, ...second.problems].join(' | '));
    await second.context.close();
  }

  // Real listings: the everyday features still work.
  console.log('Browser checks: real listings');
  {
    const { context, page, problems } = await openWith('tests/fixtures/sample.csv');
    check('the directory loads', (await page.locator('.card').count()) > 0);
    await page.fill('#search', 'groceries');
    await page.waitForTimeout(200);
    check('food searches start with the Pantry Locator', /Pantry Locator/.test(await page.locator('.card-name').first().innerText()));
    await page.fill('#search', '');
    await page.click('#btn-es');
    await page.waitForTimeout(200);
    check('Spanish view shows Spanish hours', /lun–vie/.test(await page.locator('#grid').innerText()));
    await page.click('#btn-text-size');
    check('A+ makes the text larger', await page.evaluate(() => document.documentElement.classList.contains('text-large')));
    check('A+ never makes the page scroll sideways', await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    await page.click('#btn-text-size');
    // A Share menu near the top of the screen must open downward, fully visible.
    await page.click('[data-category="Food"]');
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      const button = document.querySelector('[data-share-menu="category"]');
      const header = document.querySelector('header');
      window.scrollBy(0, button.getBoundingClientRect().top - Math.max(0, header.getBoundingClientRect().bottom) - 10);
    });
    await page.click('[data-share-menu="category"]');
    const menuBox = await page.evaluate(() => {
      const box = document.querySelector('.share-menu.show').getBoundingClientRect();
      const header = document.querySelector('header').getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, right: box.right, limit: Math.max(0, header.bottom), width: document.documentElement.clientWidth, height: innerHeight };
    });
    check('a Share menu near the top of the screen stays fully visible',
      menuBox.top >= menuBox.limit && menuBox.bottom <= menuBox.height && menuBox.right <= menuBox.width, JSON.stringify(menuBox));
    await page.keyboard.press('Escape');
    await page.click('[data-category="All"]');
    await page.waitForTimeout(200);
    await page.evaluate(() => { window.print = () => { window.__printed = true; }; });
    await page.click('[data-category="Food"]');
    await page.click('[data-share-menu="category"]');
    await page.click('[data-action="print-category"]');
    await page.waitForFunction(() => window.__printed, null, { timeout: 5000 }).catch(() => {});
    check('Print or save as PDF builds the printout', (await page.locator('#print-sheet .ps-item').count()) > 0);

    // Every resource link sends a name, category, click type and link, in
    // either language, and the page title never changes.
    await page.evaluate(() => {
      for (const type of ['click', 'auxclick']) {
        document.addEventListener(type, event => { if (event.target.closest('a[href]')) event.preventDefault(); });
      }
      window.print = () => {};
    });
    const lastClick = () => page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry))
      .filter(entry => entry[0] === 'event' && entry[1] === 'resource_click').map(entry => entry[2]).pop());
    const complete = params => Boolean(params) && ['resource_name', 'resource_category', 'click_type', 'link_url']
      .every(key => typeof params[key] === 'string' && params[key] && params[key] !== 'unknown');
    const expectedNames = {};
    for (const l of ['en', 'es']) {
      await page.click(`#btn-${l}`);
      await page.fill('#search', 'groceries');
      await page.waitForTimeout(200);
      const card = page.locator('.card').first();
      const expected = await card.getAttribute('data-track-name');
      expectedNames[l] = expected;
      for (const [selector, type] of [['.btn-call', 'call'], ['.btn-web', 'website'], ['.btn-report', 'report']]) {
        await card.locator(selector).click();
        const params = await lastClick();
        check(`a ${type} click sends every parameter (${l})`, complete(params) && params.click_type === type && params.resource_name === expected, JSON.stringify(params));
      }
      await card.locator('.btn-share').click();
      await card.locator('a.share-option').click();
      const shared = await lastClick();
      check(`a share-by-email click is told apart from contacting the listing (${l})`, complete(shared) && shared.click_type === 'share_email', JSON.stringify(shared));
      await page.locator('#footer-contact a').click();
      const footer = await lastClick();
      check(`the Resident Services number is counted (${l})`, complete(footer) && footer.resource_name === 'CCSM Resident Services' && footer.click_type === 'call', JSON.stringify(footer));
      await page.locator('.card .btn-web').first().click({ button: 'middle' });
      const middle = await lastClick();
      check(`a middle-click (new tab) is counted (${l})`, complete(middle) && middle.click_type === 'website', JSON.stringify(middle));
      await page.click('[data-category="Food"]');
      await page.fill('#search', '');
      await page.waitForTimeout(200);
      check(`the page title stays fixed after filter, search and language changes (${l})`, (await page.title()) === SITE_TITLE, await page.title());
    }
    check('English and Spanish clicks on a listing report the same name',
      Boolean(expectedNames.en) && expectedNames.es === expectedNames.en, JSON.stringify(expectedNames));
    // A link added later with no name still reports, as "unknown" with its address.
    await page.evaluate(() => {
      const card = document.querySelector('.card');
      card.removeAttribute('data-track-name');
      card.querySelector('.card-name').textContent = '';
      const link = document.createElement('a');
      link.href = 'https://example.org/added-later';
      link.className = 'added-later';
      link.textContent = 'Added later';
      card.querySelector('.card-actions').appendChild(link);
    });
    await page.click('.added-later');
    const fallback = await lastClick();
    check('a link with no name reports "unknown" with its link_url', Boolean(fallback) && fallback.resource_name === 'unknown' && fallback.link_url === 'https://example.org/added-later', JSON.stringify(fallback));
    check('no errors (real listings)', problems.length === 0, problems.join(' | '));
    await context.close();
  }

  await browser.close();
  server.close();
}

(async () => {
  staticChecks();
  await browserChecks();
  console.log(`\n${passes} passed, ${failures.length} failed`);
  if (failures.length) {
    console.log(failures.map(label => `  - ${label}`).join('\n'));
    process.exit(1);
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
