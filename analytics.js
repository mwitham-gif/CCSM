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

// A shared link (?share=Name) names one resource, possibly a domestic violence
// shelter, and an old ?q= link carries whatever was typed. Neither goes to
// Google: the page view is reported with those values withheld, and a shared
// page is titled generically (app.js retitles it with the resource name).
var pageParams = new URLSearchParams(window.location.search);
var isSharePage = pageParams.has('share');
if (isSharePage) pageParams.set('share', '(withheld)');
pageParams.delete('q');
var pageQuery = pageParams.toString();

gtag('config', 'G-FT2K5G6SYR', {
  page_location: window.location.origin + window.location.pathname + (pageQuery ? '?' + pageQuery : ''),
  page_title: isSharePage ? 'Shared resource' : document.title,
  // Visits are counted, never joined to Google accounts or used for ads.
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});

// Custom GA4 events, sent with gtag() so they reach GA4 with their
// parameters (a plain dataLayer push would need a Tag Manager tag to forward
// it, and the old container never did). Everything below uses
// document-level delegation because app.js renders cards and filter buttons
// from the sheet after load, and re-renders them on search, filter, and
// language changes. Listeners use the capture phase so they read the clicked
// element before app.js replaces it (a filter click rebuilds #filters).
(function () {
  function cleanText(el) {
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function getClickType(link) {
    if (link.classList.contains('btn-report')) return 'report';
    var href = link.getAttribute('href') || '';
    if (/^tel:/i.test(href)) return 'call';
    if (/^mailto:/i.test(href)) return 'email';
    return 'website';
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;

    var link = target.closest('.card .card-actions a[href], .card .card-footer a[href]');
    if (link) {
      var card = link.closest('.card');
      // Every listing is counted in full, domestic violence listings included
      // (an October 2026 decision: staff want to see which resources are used).
      gtag('event', 'resource_click', {
        resource_name: cleanText(card.querySelector('.card-name')),
        resource_category: cleanText(card.querySelector('.card-category')),
        click_type: getClickType(link),
        link_url: link.href
      });
      return;
    }

    var filterButton = target.closest('#filters .filter-btn[data-category]');
    if (filterButton) {
      gtag('event', 'filter_select', {
        filter_name: cleanText(filterButton.querySelector('span:first-child')),
        filter_group: 'category'
      });
    }
  }, true);

  var SEARCH_DEBOUNCE_MS = 1500;
  // Searches that could expose someone are counted without the words typed:
  // abuse, immigration status, self-harm, and sexual or reproductive health.
  var SENSITIVE_SEARCH = new RegExp([
    'abus', 'violen', '\\bdv\\b', 'domestic', 'dom[eé]stic', 'shelter', 'refugio', 'maltrat',
    'assault', 'asalto', 'stalk', 'acoso', 'traffick', '\\btrata\\b', '\\brape', 'violaci',
    'immigra', 'inmigra', 'undocumented', 'indocumentad', 'deport', '\\bice\\b', 'asylum', 'asilo',
    'visa', 'daca', 'green card', 'citizenship', 'ciudadan',
    'suicid', 'self.?harm', 'overdose', 'sobredosis',
    '\\bhiv', '\\bvih', '\\bstd\\b', '\\bsti\\b', 'pregnan', 'embaraz', 'abort'
  ].join('|'), 'i');
  // People sometimes type their own phone number, email or case number.
  var PERSONAL_DETAILS = /@|\d[\d\s().-]{5,}\d/;
  var searchTimer = null;
  var lastSearchTerm = '';

  document.addEventListener('input', function (event) {
    var input = event.target;
    if (!(input instanceof Element) || input.id !== 'search') return;

    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      var term = input.value.trim();
      if (!term || term === lastSearchTerm) return;
      lastSearchTerm = term;
      if (SENSITIVE_SEARCH.test(term) || PERSONAL_DETAILS.test(term)) term = '(withheld)';
      // app.js records how many listings matched on #grid. A search that
      // found nothing points to a need the directory does not cover yet.
      var grid = document.getElementById('grid');
      var count = grid ? Number(grid.getAttribute('data-result-count')) : NaN;
      var params = { search_term: term };
      if (!isNaN(count)) params.result_count = count;
      gtag('event', 'resource_search', params);
      if (count === 0) gtag('event', 'search_no_results', { search_term: term });
    }, SEARCH_DEBOUNCE_MS);
  });
})();
