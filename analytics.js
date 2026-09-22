// Google Analytics 4 bootstrap for property G-FT2K5G6SYR.
//
// This lives in its own file rather than inline in index.html because the page
// ships a Content-Security-Policy with `script-src 'self'`. An inline block
// would need 'unsafe-inline' or a hash that has to be recomputed on every edit;
// a same-origin file needs neither, and keeps the CSP strict for everything else.
//
// The gtag.js loader itself is a separate <script async> tag in index.html, and
// googletagmanager.com is allowlisted in script-src for it. Load order does not
// matter: both this file and the loader push to the same window.dataLayer, and
// gtag.js drains whatever is queued when it arrives.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-FT2K5G6SYR');
