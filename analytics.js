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

// Custom GA4 events, pushed straight onto the dataLayer. Everything below uses
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
      window.dataLayer.push({
        event: 'resource_click',
        resource_name: cleanText(card.querySelector('.card-name')),
        resource_category: cleanText(card.querySelector('.card-category')),
        click_type: getClickType(link),
        link_url: link.href
      });
      return;
    }

    var filterButton = target.closest('#filters .filter-btn[data-category]');
    if (filterButton) {
      window.dataLayer.push({
        event: 'filter_select',
        filter_name: cleanText(filterButton.querySelector('span:first-child')),
        filter_group: 'category'
      });
    }
  }, true);

  var SEARCH_DEBOUNCE_MS = 1500;
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
      window.dataLayer.push({ event: 'resource_search', search_term: term });
    }, SEARCH_DEBOUNCE_MS);
  });
})();
