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

// One title for every view of the site, so GA4 reports a single page title.
// Filters, search, the language toggle and shared links never change it, and
// page_title is set explicitly for every event, so a browser's own page
// translation (which rewrites document.title) cannot split the reports either.
var SITE_TITLE = 'Santa Monica Resource Guide · Community Corp Santa Monica';
document.title = SITE_TITLE;
gtag('set', { page_title: SITE_TITLE });

// A shared link (?share=Name) names one resource, possibly a domestic violence
// shelter, and an old ?q= link carries whatever was typed. Neither goes to
// Google: the page view is reported with those values withheld.
var pageParams = new URLSearchParams(window.location.search);
if (pageParams.has('share')) pageParams.set('share', '(withheld)');
pageParams.delete('q');
var pageQuery = pageParams.toString();

gtag('config', 'G-FT2K5G6SYR', {
  page_location: window.location.origin + window.location.pathname + (pageQuery ? '?' + pageQuery : ''),
  page_title: SITE_TITLE,
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

  // Used when a link carries no listing name, so the event can still be
  // traced back to the page that sent it through link_url.
  var UNKNOWN = 'unknown';

  function getClickType(link) {
    if (link.classList.contains('btn-report')) return 'report';
    // The Share menu's email link writes to a friend, not to the listing.
    if (link.classList.contains('share-option')) return 'share_email';
    var href = link.getAttribute('href') || '';
    if (/^tel:/i.test(href)) return 'call';
    if (/^mailto:/i.test(href)) return 'email';
    return 'website';
  }

  // app.js puts the listing's sheet name and category key on each card (and
  // on the Resident Services fallback links) as data-track-name and
  // data-track-category. Those stay in English whichever language is on
  // screen, and a browser's own page translation never touches them, so one
  // listing is one row in GA4. The visible text is only a fallback.
  function getResourceParams(link) {
    var source = link.closest('[data-track-name]');
    var card = link.closest('.card');
    var name = (source && source.getAttribute('data-track-name')) || cleanText(card && card.querySelector('.card-name'));
    var category = (source && source.getAttribute('data-track-category')) || cleanText(card && card.querySelector('.card-category'));
    return {
      resource_name: name || UNKNOWN,
      resource_category: category || UNKNOWN,
      click_type: getClickType(link),
      link_url: link.href || link.getAttribute('href') || UNKNOWN
    };
  }

  // A resource link is any link on a listing card (directory, shared page or
  // pinned listing alike) or any link marked with data-track-name.
  function findResourceLink(target) {
    var link = target.closest('a[href]');
    if (!link || !(link.closest('.card') || link.closest('[data-track-name]'))) return null;
    return link;
  }

  function trackResourceClick(link) {
    // Every listing is counted in full, domestic violence listings included
    // (an October 2026 decision: staff want to see which resources are used).
    gtag('event', 'resource_click', getResourceParams(link));
  }

  // A middle-click (open in a new tab) fires auxclick, not click.
  document.addEventListener('auxclick', function (event) {
    if (event.button !== 1 || !(event.target instanceof Element)) return;
    var link = findResourceLink(event.target);
    if (link) trackResourceClick(link);
  }, true);

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;

    var link = findResourceLink(target);
    if (link) {
      trackResourceClick(link);
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
