// ─────────────────────────────────────────────────────────────────────────────
// UPDATE THIS — staff inbox that receives "Report outdated info" emails
// ─────────────────────────────────────────────────────────────────────────────
const REPORT_EMAIL = 'mwitham@communitycorp.org';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbAtpa7kK10yL2QtdLHRx9q2VbuEIPNG6S2uMbWhQ1GsLGoYA3NqFAlp_E_w8xUGRdcLxT4V3gbiJD/pub?output=csv';
const MAX_CSV_BYTES = 500000;

// Recommended Google Sheet columns:
// name, name_es, category, description, description_es, address, phone, website, hours, notes, notes_es, tags, tags_es
// The importer also accepts several human-friendly variations like "Name", "Resource Name", or "Phone Number".

const T = {
  en: {
    search: 'Search by need, provider, service, or keyword...',
    clearSearch: 'Clear',
    all: 'All',
    showing: n => `Showing ${n} resource${n===1?'':'s'}`,
    bestMatches: 'Best matches first',
    narrowingTo: (visible, total) => `${visible} of ${total} resources`,
    resultsNote: 'Always call or contact providers directly for the most current information.',
    introEyebrow: 'Santa Monica resource guide',
    introTitle: 'What kind of help do you need today?',
    introCopy: 'Choose a need, search by keyword, then call or visit a provider directly for current details.',
    introPointSearch: 'Food, housing, health',
    introPointBrowse: 'Phone-friendly listings',
    introPointShare: 'Easy to share',
    finderLabelShortcuts: 'Start with a need',
    finderHintShortcuts: 'Tap the closest match. You can change it anytime.',
    finderLabelSearch: 'Search the directory',
    finderHintSearch: 'Try food, rent, legal help, youth, a provider name, or an address.',
    finderLabelFilters: 'Explore all support areas',
    activeCategory: 'Need',
    activeSearch: 'Search',
    resetFilters: 'Clear filters',
    noResults: 'No resources found',
    noResultsSub: 'Try a different keyword, provider name, or support area.',
    noResultsReset: 'Show all resources',
    showMoreResults: n => `Show ${n} more resource${n===1?'':'s'}`,
    detailsLabel: 'Key details',
    contactLabel: 'Contact',
    addressLabel: 'Where',
    hoursLabel: 'When',
    notesLabel: 'Details',
    noContact: 'Contact details unavailable',
    showMore: 'Read more',
    showLess: 'Show less',
    call: 'Call',
    website: 'Visit website',
    hours: 'Hours',
    address: 'Address',
    notes: 'Notes',
    loading: 'Loading resources...',
    loadErrorNotice: 'Resources could not load. Please call Resident Services at',
    loadErrorTitle: 'We are having trouble loading resources',
    loadErrorBody: 'Please check your connection and try again. If you need help now, call Resident Services.',
    retry: 'Try again',
    siteTitle: 'Community Resources',
    siteSub: 'Find local help from your phone',
    footerTitle: 'Community Corporation of Santa Monica · Resident Services',
    footerContact: 'Need help using this directory? Call',
    footerNote: 'Services, hours, and eligibility can change. Please confirm details with providers before visiting.',
    reportBtn: 'Report incorrect information',
    share: 'Share',
    shareEmail: 'Email',
    shareCopyLink: 'Copy link',
    linkCopied: 'Link copied',
    copyPrompt: 'Copy this link:',
    shareBack: 'Back to full directory',
    shareEyebrow: 'Shared from Community Resources',
    shareHeading: 'A resource someone wanted to share with you',
    shareSubheading: 'Review the details below, then call, visit the website, or pass this resource along to someone else.',
    shareMetaCommunity: 'Santa Monica resource guide',
    shareMetaUpdated: 'Provider details may change',
    shareMissingTitle: 'This shared resource may have moved',
    shareMissingBody: 'The listing may have been renamed or removed. You can still search the full directory for current support options.',
    searchDirectory: 'Search the directory',
    reportSubject: name => `Outdated listing: ${name}`,
    reportBody: name =>
`Hi CCSM,

I noticed some information for "${name}" on the CCSM Community Resources page may be outdated.

𝗪𝗵𝗮𝘁 𝘀𝗵𝗼𝘂𝗹𝗱 𝗯𝗲 𝘂𝗽𝗱𝗮𝘁𝗲𝗱:

𝗖𝗼𝗿𝗿𝗲𝗰𝘁 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻:

Anything else we should know:

Thank you for keeping this resource up to date!`,
  },
  es: {
    search: 'Buscar por necesidad, proveedor, servicio o palabra clave...',
    clearSearch: 'Borrar',
    all: 'Todo',
    showing: n => `Mostrando ${n} recurso${n===1?'':'s'}`,
    bestMatches: 'Mejores resultados primero',
    narrowingTo: (visible, total) => `${visible} de ${total} recursos`,
    resultsNote: 'Siempre llame o contacte directamente a los proveedores para confirmar la información más actual.',
    introEyebrow: 'Guía de recursos de Santa Mónica',
    introTitle: '¿Qué tipo de ayuda necesita hoy?',
    introCopy: 'Elija una necesidad, busque por palabra clave y luego llame o visite el sitio web del proveedor para confirmar detalles.',
    introPointSearch: 'Comida, vivienda, salud',
    introPointBrowse: 'Listados para teléfono',
    introPointShare: 'Fácil de compartir',
    finderLabelShortcuts: 'Empiece con una necesidad',
    finderHintShortcuts: 'Toque la opción más cercana. Puede cambiarla cuando quiera.',
    finderLabelSearch: 'Buscar en el directorio',
    finderHintSearch: 'Pruebe comida, renta, ayuda legal, juventud, nombre de proveedor o dirección.',
    finderLabelFilters: 'Explorar todas las áreas de apoyo',
    activeCategory: 'Necesidad',
    activeSearch: 'Búsqueda',
    resetFilters: 'Limpiar filtros',
    noResults: 'No se encontraron recursos',
    noResultsSub: 'Intente con otra palabra clave, nombre de proveedor o área de apoyo.',
    noResultsReset: 'Mostrar todos los recursos',
    showMoreResults: n => `Mostrar ${n} recurso${n===1?'':'s'} más`,
    detailsLabel: 'Detalles clave',
    contactLabel: 'Contacto',
    addressLabel: 'Dónde',
    hoursLabel: 'Cuándo',
    notesLabel: 'Detalles',
    noContact: 'Datos de contacto no disponibles',
    showMore: 'Leer más',
    showLess: 'Mostrar menos',
    call: 'Llamar',
    website: 'Visitar sitio web',
    hours: 'Horario',
    address: 'Dirección',
    notes: 'Notas',
    loading: 'Cargando recursos...',
    loadErrorNotice: 'No se pudieron cargar los recursos. Llame a Servicios para Residentes al',
    loadErrorTitle: 'Tenemos problemas para cargar los recursos',
    loadErrorBody: 'Revise su conexión e inténtelo de nuevo. Si necesita ayuda ahora, llame a Servicios para Residentes.',
    retry: 'Intentar de nuevo',
    siteTitle: 'Recursos Comunitarios',
    siteSub: 'Encuentre ayuda local desde su teléfono',
    footerTitle: 'Community Corporation of Santa Monica · Servicios para Residentes',
    footerContact: '¿Necesita ayuda para usar este directorio? Llame al',
    footerNote: 'Los servicios, horarios y requisitos pueden cambiar. Confirme los detalles con los proveedores antes de visitar.',
    reportBtn: 'Reportar información incorrecta',
    share: 'Compartir',
    shareEmail: 'Correo',
    shareCopyLink: 'Copiar enlace',
    linkCopied: 'Enlace copiado',
    copyPrompt: 'Copie este enlace:',
    shareBack: 'Volver al directorio completo',
    shareEyebrow: 'Compartido desde Recursos Comunitarios',
    shareHeading: 'Un recurso que alguien quiso compartir con usted',
    shareSubheading: 'Revise los detalles abajo y luego llame, visite el sitio web o comparta este recurso con otra persona.',
    shareMetaCommunity: 'Guía de recursos de Santa Mónica',
    shareMetaUpdated: 'Los detalles del proveedor pueden cambiar',
    shareMissingTitle: 'Este recurso compartido puede haber cambiado',
    shareMissingBody: 'Es posible que el listado haya cambiado de nombre o se haya eliminado. Todavía puede buscar en el directorio completo opciones de apoyo actuales.',
    searchDirectory: 'Buscar en el directorio',
    reportSubject: name => `Información desactualizada: ${name}`,
    reportBody: name =>
`Hola,

Noté que la información de "${name}" en la página de Recursos Comunitarios puede estar desactualizada.

𝗤𝘂é 𝗱𝗲𝗯𝗲 𝗮𝗰𝘁𝘂𝗮𝗹𝗶𝘇𝗮𝗿𝘀𝗲:

𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝗰𝗶ó𝗻 𝗰𝗼𝗿𝗿𝗲𝗰𝘁𝗮:

Algo más que debamos saber:

Gracias por mantener este recurso actualizado!`,
  }
};

let resources = [];
let filtered_cache = [];
let lang = 'en';
let activeCategory = 'All';
const INITIAL_RESULT_LIMIT = 24;
const RESULT_LIMIT_INCREMENT = 24;
let visibleResultLimit = INITIAL_RESULT_LIMIT;
let hasLoadError = false;
const expandedSections = new Set();
let toastTimer = null;
const urlParams = new URLSearchParams(window.location.search);
const shareResourceKey = urlParams.get('share');
const sharedCategoryKey = urlParams.get('category');
const initialSearchQuery = urlParams.get('q') || '';

const ICONS = {
  Food:'🥦', Mental:'🧠', Rental:'🏠', Legal:'⚖️', Benefits:'📋', Other:'🤝',
  Transportation:'🚌', Education:'📚', Employment:'💼', Childcare:'👶',
  Youth:'🧒', Seniors:'👴', Housing:'🏡', Disability:'🌼', Medical:'⚕️',
  'Domestic Violence':'🟣',
};

const CAT_LABELS = {
  en: {
    Food:'Food support', Mental:'Mental health support', Rental:'Rental help',
    Legal:'Legal help', Benefits:'Benefits help', Other:'Community support',
    Transportation:'Transportation help', Education:'Education support', Employment:'Job support',
    Childcare:'Childcare support', Youth:'Youth support', Seniors:'Senior support', Housing:'Housing help',
    Disability:'Disability support', Medical:'Medical care', 'Domestic Violence':'Domestic violence support'
  },
  es: {
    Food:'Apoyo con comida', Mental:'Apoyo de salud mental', Rental:'Ayuda con renta',
    Legal:'Ayuda legal', Benefits:'Ayuda con beneficios', Other:'Apoyo comunitario',
    Transportation:'Ayuda con transporte', Education:'Apoyo educativo', Employment:'Ayuda con empleo',
    Childcare:'Apoyo con cuidado infantil', Youth:'Apoyo para jóvenes', Seniors:'Apoyo para personas mayores',
    Housing:'Ayuda con vivienda', Disability:'Apoyo por discapacidad', Medical:'Atención médica',
    'Domestic Violence':'Apoyo por violencia doméstica',
  },
};

const QUICK_LABELS = {
  en: {
    Food: 'I need food',
    Housing: 'I need housing help',
    Mental: 'I need mental health support',
    Benefits: 'I need benefits help',
    Legal: 'I need legal help',
    Youth: 'I need youth support',
  },
  es: {
    Food: 'Necesito comida',
    Housing: 'Necesito ayuda con vivienda',
    Mental: 'Necesito apoyo de salud mental',
    Benefits: 'Necesito ayuda con beneficios',
    Legal: 'Necesito ayuda legal',
    Youth: 'Necesito apoyo para jóvenes',
  },
};

const FIELD_ALIASES = {
  name: ['name', 'resource name', 'program name', 'organization name', 'org name'],
  name_es: ['name_es', 'name es', 'resource name es', 'resource name spanish', 'program name es', 'nombre', 'nombre_es'],
  category: ['category', 'service category', 'type', 'service type'],
  description: ['description', 'service description', 'summary', 'details'],
  description_es: ['description_es', 'description es', 'service description es', 'descripcion', 'descripcion_es'],
  address: ['address', 'location', 'street address'],
  phone: ['phone', 'phone number', 'telephone', 'contact phone'],
  website: ['website', 'web site', 'url', 'link'],
  hours: ['hours', 'service hours', 'open hours', 'availability'],
  notes: ['notes', 'note', 'eligibility', 'requirements', 'instructions'],
  notes_es: ['notes_es', 'notes es', 'eligibility es', 'requirements es', 'notas', 'notas_es'],
  tags: ['tags', 'tag', 'highlights', 'quick tags', 'quick_tag', 'quick tags'],
  tags_es: ['tags_es', 'tags es', 'tag es', 'highlights es', 'etiquetas', 'etiquetas_es'],
};

const CATEGORY_ALIASES = {
  food: 'Food',
  'food pantry': 'Food',
  'food pantries': 'Food',
  groceries: 'Food',
  grocery: 'Food',
  mental: 'Mental',
  'mental health': 'Mental',
  counseling: 'Mental',
  rental: 'Rental',
  'rental assistance': 'Rental',
  eviction: 'Rental',
  legal: 'Legal',
  'legal aid': 'Legal',
  benefits: 'Benefits',
  'public benefits': 'Benefits',
  transportation: 'Transportation',
  transport: 'Transportation',
  education: 'Education',
  employment: 'Employment',
  jobs: 'Employment',
  childcare: 'Childcare',
  'child care': 'Childcare',
  youth: 'Youth',
  seniors: 'Seniors',
  senior: 'Seniors',
  housing: 'Housing',
  disability: 'Disability',
  disabilities: 'Disability',
  medical: 'Medical',
  healthcare: 'Medical',
  health: 'Medical',
  'domestic violence': 'Domestic Violence',
};

const QUICK_CATEGORIES = ['Food', 'Housing', 'Mental', 'Benefits', 'Legal', 'Youth'];

function getReportHref(resource) {
  const name = getLocalizedValue(resource, 'name');
  const boldName = toBoldUnicode(name);
  return getEmailComposeHref({
    to: REPORT_EMAIL,
    subject: T[lang].reportSubject(name),
    body: T[lang].reportBody(boldName),
  });
}

function getBasePageUrl() {
  return window.location.origin + window.location.pathname;
}

function getShareKey(resource) {
  return encodeURIComponent(getField(resource, 'name').trim());
}

function getSharePageUrl(resource) {
  return `${getBasePageUrl()}?share=${getShareKey(resource)}`;
}

function getCategorySharePageUrl(category) {
  return `${getBasePageUrl()}?category=${encodeURIComponent(category)}`;
}

function updateDirectoryUrl() {
  if (shareResourceKey) return;

  const params = new URLSearchParams();

  if (activeCategory !== 'All') params.set('category', activeCategory);

  const next = params.toString()
    ? `${getBasePageUrl()}?${params.toString()}`
    : getBasePageUrl();

  window.history.replaceState({}, '', next);
}

function getResourceShareData(resource) {
  const name = getLocalizedValue(resource, 'name');
  const description = getLocalizedValue(resource, 'description');
  const website = normalizeWebsiteUrl(getField(resource, 'website'));
  const address = getField(resource, 'address');
  const phone = getField(resource, 'phone');
  const parts = [description, address, phone].filter(Boolean);
  const shareUrl = getSharePageUrl(resource);

  return {
    title: name || 'Community resource',
    text: parts.join(' · '),
    url: shareUrl,
  };
}

function getResourceEmailLines(resource, includeShareUrl = true) {
  const shareData = getResourceShareData(resource);
  const website = normalizeWebsiteUrl(getField(resource, 'website'));
  const lines = [
    shareData.title,
    getField(resource, 'address'),
    getField(resource, 'phone'),
    getLocalizedValue(resource, 'description'),
    website,
  ].filter(Boolean);

  if (includeShareUrl) {
    lines.push('', 'View resource:', shareData.url);
  }

  return lines;
}

function isMobileEmailClientPreferred() {
  return /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
}

function getGmailComposeHref({ to = '', subject, body }) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    su: subject,
    body,
  });

  if (to) params.set('to', to);
  return 'https://mail.google.com/mail/?' + params.toString();
}

function getMailtoHref({ to = '', subject, body }) {
  const prefix = to ? `mailto:${encodeURIComponent(to)}` : 'mailto:';
  return `${prefix}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getEmailComposeHref({ to = '', subject, body }) {
  return isMobileEmailClientPreferred()
    ? getMailtoHref({ to, subject, body })
    : getGmailComposeHref({ to, subject, body });
}

function getShareEmailHref(resource) {
  const shareData = getResourceShareData(resource);
  const lines = getResourceEmailLines(resource);
  return getEmailComposeHref({
    subject: shareData.title,
    body: lines.join('\n'),
  });
}

function getCategoryShareData(category) {
  const label = CAT_LABELS[lang][category] || category;
  return {
    title: `${label} · Community Resources`,
    text: `Browse ${label.toLowerCase()} resources.`,
    url: getCategorySharePageUrl(category),
  };
}

function getCategoryShareEmailHref(category) {
  const shareData = getCategoryShareData(category);
  const categoryResources = resources.filter(resource => normalizeCategory(resource) === category);
  const lines = [
    shareData.title,
    '',
    ...categoryResources.flatMap((resource, index) => {
      const block = getResourceEmailLines(resource, false);
      return index === categoryResources.length - 1 ? block : [...block, ''];
    }),
    '',
    'View resources:',
    shareData.url,
  ].filter((line, index, array) => line || (index > 0 && array[index - 1] !== ''));
  return getEmailComposeHref({
    subject: shareData.title,
    body: lines.join('\n'),
  });
}

function closeShareMenus() {
  document.querySelectorAll('.share-menu.show').forEach(menu => menu.classList.remove('show'));
  document.querySelectorAll('.btn-share[aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
}

function toggleShareMenu(idx, event) {
  event.stopPropagation();
  const menu = document.getElementById(`share-menu-${idx}`);
  const button = event.currentTarget;
  if (!menu) return;

  const isOpen = menu.classList.contains('show');
  closeShareMenus();

  if (!isOpen) {
    menu.classList.add('show');
    button.setAttribute('aria-expanded', 'true');
  }
}

function getSectionStateKey(resourceName, section) {
  return `${resourceName}::${section}`;
}

function isSectionExpanded(resourceName, section) {
  return expandedSections.has(getSectionStateKey(resourceName, section));
}

function toggleCardSection(encodedResourceName, section) {
  const resourceName = decodeURIComponent(encodedResourceName);
  const key = getSectionStateKey(resourceName, section);
  if (expandedSections.has(key)) expandedSections.delete(key);
  else expandedSections.add(key);
  renderCards();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function updateGridMarkup(html) {
  const grid = document.getElementById('grid');
  if (!grid) return;

  const commit = () => {
    grid.innerHTML = html;
    requestAnimationFrame(() => {
      grid.classList.remove('is-updating');
    });
  };

  grid.classList.add('is-updating');
  requestAnimationFrame(commit);
}

async function copyResourceLink(idx) {
  const resource = filtered_cache[idx];
  if (!resource) return;

  const shareData = getResourceShareData(resource);
  const clipboardText = shareData.url;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(clipboardText);
      closeShareMenus();
      showToast(T[lang].linkCopied);
      return;
    }

    window.prompt(T[lang].copyPrompt, clipboardText);
  } catch (error) {
    window.prompt(T[lang].copyPrompt, shareData.url);
  }
}

async function copyCategoryLink() {
  if (activeCategory === 'All') return;

  const shareUrl = getCategorySharePageUrl(activeCategory);

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      closeShareMenus();
      showToast(T[lang].linkCopied);
      return;
    }

    window.prompt(T[lang].copyPrompt, shareUrl);
  } catch (error) {
    window.prompt(T[lang].copyPrompt, shareUrl);
  }
}

document.addEventListener('click', event => {
  const langButton = event.target.closest('[data-lang]');
  if (langButton) {
    setLang(langButton.dataset.lang);
    closeShareMenus();
    return;
  }

  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    setCategory(categoryButton.dataset.category);
    closeShareMenus();
    return;
  }

  const shareButton = event.target.closest('[data-share-menu]');
  if (shareButton) {
    toggleShareMenu(shareButton.dataset.shareMenu, event);
    return;
  }

  const copyButton = event.target.closest('[data-copy-index]');
  if (copyButton) {
    copyResourceLink(Number(copyButton.dataset.copyIndex));
    return;
  }

  const sectionButton = event.target.closest('[data-toggle-section]');
  if (sectionButton) {
    toggleCardSection(sectionButton.dataset.resourceName, sectionButton.dataset.toggleSection);
    closeShareMenus();
    return;
  }

  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    const action = actionButton.dataset.action;
    if (action === 'clear-search') clearSearch();
    if (action === 'clear-all') clearAllFilters();
    if (action === 'copy-category') copyCategoryLink();
    if (action === 'show-more') showMoreResults();
    if (action === 'retry-load') loadData();
    if (action === 'back-to-directory') window.location.href = getBasePageUrl();
    if (action !== 'copy-category') closeShareMenus();
    return;
  }

  closeShareMenus();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeShareMenus();
});

function getShareModeResource() {
  if (!shareResourceKey) return null;
  return resources.find(resource => getField(resource, 'name') === shareResourceKey) || null;
}

function getSearchQuery() {
  const input = document.getElementById('search');
  return input ? input.value.trim() : '';
}

function updateSearchClearButton() {
  const button = document.getElementById('clear-search');
  if (!button) return;
  button.textContent = T[lang].clearSearch;
  button.classList.toggle('show', Boolean(getSearchQuery()));
}

function handleSearchInput() {
  visibleResultLimit = INITIAL_RESULT_LIMIT;
  updateSearchClearButton();
  renderCards();
}

function clearSearch() {
  const input = document.getElementById('search');
  if (!input) return;
  input.value = '';
  visibleResultLimit = INITIAL_RESULT_LIMIT;
  updateSearchClearButton();
  renderCards();
  input.focus();
}

function clearAllFilters() {
  activeCategory = 'All';
  visibleResultLimit = INITIAL_RESULT_LIMIT;
  const input = document.getElementById('search');
  if (input) input.value = '';
  buildFilters();
  updateSearchClearButton();
  renderCards();
}

function showMoreResults() {
  visibleResultLimit += RESULT_LIMIT_INCREMENT;
  renderCards();
}

function renderShortcuts() {
  const container = document.getElementById('shortcut-row');
  if (!container) return;

  const available = QUICK_CATEGORIES.filter(category => resources.some(resource => normalizeCategory(resource) === category));
  container.innerHTML = available.map(category => `
    <button class="shortcut-chip ${activeCategory === category ? 'active' : ''}" type="button" data-category="${escapeAttr(category)}" aria-pressed="${activeCategory === category ? 'true' : 'false'}">
      <span>${escapeHTML((QUICK_LABELS[lang] && QUICK_LABELS[lang][category]) || (CAT_LABELS[lang][category] || category))}</span>
      <span class="chip-count">${resources.filter(resource => normalizeCategory(resource) === category).length}</span>
    </button>
  `).join('');
}

function renderResultsContext(query, visibleCount) {
  const container = document.getElementById('results-context');
  if (!container) return;

  const pills = [];
  if (activeCategory !== 'All' || query) {
    pills.push(`<div class="results-pill"><strong>${escapeHTML(T[lang].narrowingTo(visibleCount, resources.length))}</strong></div>`);
  }
  if (activeCategory !== 'All') {
    pills.push(`<div class="results-pill"><strong>${escapeHTML(T[lang].activeCategory)}:</strong> ${escapeHTML(CAT_LABELS[lang][activeCategory] || activeCategory)}</div>`);
  }
  if (query) {
    pills.push(`<div class="results-pill"><strong>${escapeHTML(T[lang].activeSearch)}:</strong> ${escapeHTML(query)}</div>`);
  }

  if (!pills.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="results-pills">${pills.join('')}</div>
    <button class="results-reset" type="button" data-action="clear-all">${escapeHTML(T[lang].resetFilters)}</button>
  `;
}

function renderCategoryShare() {
  const container = document.getElementById('category-share');
  if (!container) return;

  if (shareResourceKey || activeCategory === 'All') {
    container.innerHTML = '';
    return;
  }

  const label = CAT_LABELS[lang][activeCategory] || activeCategory;
  const shareEmailHref = getCategoryShareEmailHref(activeCategory);

  container.innerHTML = `
    <div class="share-wrap align-right">
      <button class="btn-share top-share-btn" type="button" data-share-menu="category" aria-label="${escapeAttr(`${T[lang].share} ${label}`)}" aria-expanded="false">
        ${escapeHTML(T[lang].share)} ${escapeHTML(label)}
      </button>
      <div class="share-menu" id="share-menu-category">
        <a class="share-option" href="${escapeAttr(shareEmailHref)}" target="_blank" rel="noopener">${escapeHTML(T[lang].shareEmail)}</a>
        <button class="share-option" type="button" data-action="copy-category">${escapeHTML(T[lang].shareCopyLink)}</button>
      </div>
    </div>
  `;
}

function renderResourceCard(resource, i, query = '') {
  const cat = normalizeCategory(resource);
  const name = getLocalizedValue(resource, 'name');
  const desc = getLocalizedValue(resource, 'description');
  const notes = getLocalizedValue(resource, 'notes');
  const tags = getLocalizedTags(resource);
  const phone = getField(resource, 'phone');
  const website = normalizeWebsiteUrl(getField(resource, 'website'));
  const address = getField(resource, 'address');
  const hours = getField(resource, 'hours');
  const categoryClass = getCategoryClass(cat);
  const reportHref = getReportHref(resource);
  const shareEmailHref = getShareEmailHref(resource);
  const actionCount = [phone, website].filter(Boolean).length;
  const actionClass = actionCount <= 1 ? 'card-actions single-action' : 'card-actions';
  const descExpanded = isSectionExpanded(name, 'desc');
  const notesExpanded = isSectionExpanded(name, 'notes');
  const hasLongDesc = desc.length > 190;
  const hasLongNotes = notes.length > 120;
  const encodedName = encodeURIComponent(name);

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-icon icon-${escapeAttr(categoryClass)}">${escapeHTML(ICONS[cat] || '🤝')}</div>
        <div class="card-title-block">
          <div class="card-name">${highlightMatch(name, query)}</div>
          <div class="card-category">
            <span class="cat-dot cat-${escapeAttr(categoryClass)}"></span>
            ${escapeHTML(CAT_LABELS[lang][cat] || cat)}
          </div>
          ${tags.length ? `<div class="card-tags">${tags.map(tag => `<span class="card-tag">${escapeHTML(tag)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
      ${desc ? `
        <div>
          <div class="card-desc ${hasLongDesc && !descExpanded ? 'compact' : ''}">${highlightMatch(desc, query)}</div>
          ${hasLongDesc ? `<button class="card-more" type="button" data-toggle-section="desc" data-resource-name="${escapeAttr(encodedName)}">${escapeHTML(descExpanded ? T[lang].showLess : T[lang].showMore)}</button>` : ''}
        </div>
      ` : ''}
      <div class="card-details">
        <div class="card-section-label">${escapeHTML(T[lang].detailsLabel)}</div>
        ${address ? `<div class="card-detail"><span class="icon"></span><span class="card-detail-content"><span class="card-detail-label">${escapeHTML(T[lang].addressLabel)}</span><span class="card-detail-text">${highlightMatch(address, query)}</span></span></div>` : ''}
        ${hours   ? `<div class="card-detail"><span class="icon"></span><span class="card-detail-content"><span class="card-detail-label">${escapeHTML(T[lang].hoursLabel)}</span><span class="card-detail-text">${highlightMatch(hours, query)}</span></span></div>` : ''}
        ${notes   ? `<div class="card-detail"><span class="icon"></span><span class="card-detail-content"><span class="card-detail-label">${escapeHTML(T[lang].notesLabel)}</span><span class="card-detail-text ${hasLongNotes && !notesExpanded ? 'compact' : ''}">${highlightMatch(notes, query)}</span>${hasLongNotes ? `<button class="card-more" type="button" data-toggle-section="notes" data-resource-name="${escapeAttr(encodedName)}">${escapeHTML(notesExpanded ? T[lang].showLess : T[lang].showMore)}</button>` : ''}</span></div>` : ''}
      </div>
      <div class="${actionClass}">
        ${actionCount ? `<div class="card-section-label">${escapeHTML(T[lang].contactLabel)}</div>` : `<div class="card-empty-actions">${escapeHTML(T[lang].noContact)}</div>`}
        ${phone   ? `<a class="btn-call" href="tel:${escapeAttr(normalizePhoneHref(phone))}"><span class="btn-call-label">${escapeHTML(T[lang].call)}</span><span class="btn-call-number">${escapeHTML(phone)}</span></a>` : ''}
        ${website ? `<a class="btn-web" href="${escapeAttr(website)}" target="_blank" rel="noopener">${escapeHTML(T[lang].website)}</a>` : ''}
      </div>
      <div class="card-footer">
        <div class="share-wrap">
          <button class="btn-share" type="button" data-share-menu="${i}" aria-label="${escapeAttr(`${T[lang].share} ${name}`)}" aria-expanded="false">
            ${escapeHTML(T[lang].share)}
          </button>
          <div class="share-menu" id="share-menu-${i}">
            <a class="share-option" href="${escapeAttr(shareEmailHref)}" target="_blank" rel="noopener">${escapeHTML(T[lang].shareEmail)}</a>
            <button class="share-option" type="button" data-copy-index="${i}">${escapeHTML(T[lang].shareCopyLink)}</button>
          </div>
        </div>
        <a class="btn-report" href="${escapeAttr(reportHref)}" target="_blank" rel="noopener" aria-label="${escapeAttr(`${T[lang].reportBtn}: ${name}`)}">${escapeHTML(T[lang].reportBtn)}</a>
      </div>
    </div>`;
}

function renderSharePage() {
  const resource = getShareModeResource();
  const grid = document.getElementById('grid');
  const resultsInfo = document.getElementById('results-info');
  const resultsContext = document.getElementById('results-context');

  document.body.classList.add('share-mode');
  filtered_cache = resource ? [resource] : [];
  resultsInfo.textContent = '';
  if (resultsContext) resultsContext.innerHTML = '';

  if (!resource) {
    document.title = `${T[lang].shareMissingTitle} · Community Resources`;
    updateGridMarkup(`<div class="empty">
      <div class="empty-icon">🔍</div>
      <h3>${escapeHTML(T[lang].shareMissingTitle)}</h3>
      <p>${escapeHTML(T[lang].shareMissingBody)}</p>
      <button class="empty-action" type="button" data-action="back-to-directory">${escapeHTML(T[lang].searchDirectory)}</button>
    </div>`);
    return true;
  }

  document.title = `${getLocalizedValue(resource, 'name')} · Community Resources`;
  const shareMeta = [
    T[lang].shareMetaCommunity,
    T[lang].shareMetaUpdated
  ];
  updateGridMarkup(`
    <div class="share-hero">
      <div class="share-shell">
        <a class="share-back" href="${escapeAttr(getBasePageUrl())}">← ${escapeHTML(T[lang].shareBack)}</a>
        <div class="share-eyebrow">${escapeHTML(T[lang].shareEyebrow)}</div>
        <div class="share-heading">${escapeHTML(T[lang].shareHeading)}</div>
        <div class="share-subheading">${escapeHTML(T[lang].shareSubheading)}</div>
        <div class="share-meta">
          ${shareMeta.map(item => `<div class="share-meta-pill">${escapeHTML(item)}</div>`).join('')}
        </div>
      </div>
    </div>
    ${renderResourceCard(resource, 0)}
  `);
  return true;
}

function updateStatusNotice(show = false) {
  const notice = document.getElementById('status-notice');
  if (!notice) return;

  notice.innerHTML = `<strong>${escapeHTML(T[lang].loadErrorNotice)}</strong> <a href="tel:+13103950220">(310) 395-0220</a>.`;
  notice.classList.toggle('show', show);
}

function renderLoadError() {
  hasLoadError = true;
  resources = [];
  filtered_cache = [];
  activeCategory = 'All';
  visibleResultLimit = INITIAL_RESULT_LIMIT;

  document.getElementById('results-info').textContent = '';
  document.getElementById('results-context').innerHTML = '';
  document.getElementById('category-share').innerHTML = '';
  document.getElementById('shortcut-row').innerHTML = '';
  document.getElementById('filters').innerHTML = '';
  updateSearchClearButton();
  updateStatusNotice(true);

  updateGridMarkup(`<div class="empty outage">
    <div class="empty-icon">!</div>
    <h3>${escapeHTML(T[lang].loadErrorTitle)}</h3>
    <p>${escapeHTML(T[lang].loadErrorBody)}</p>
    <a class="empty-action empty-link" href="tel:+13103950220">(310) 395-0220</a>
    <button class="empty-action" type="button" data-action="retry-load">${escapeHTML(T[lang].retry)}</button>
  </div>`);
}

async function loadData() {
  if (!SHEET_URL) {
    renderLoadError();
    return;
  }
  hasLoadError = false;
  updateStatusNotice(false);
  showLoading();
  try {
    const res = await fetch(SHEET_URL);
    if (!res.ok) throw new Error(`Sheet request failed: ${res.status}`);
    const csv = await res.text();
    if (csv.length > MAX_CSV_BYTES) throw new Error('Sheet response is too large');
    resources = parseCSV(csv);
    if (!resources.length) throw new Error('No resources found in sheet');
    hasLoadError = false;
    updateStatusNotice(false);
    buildFilters(); renderShortcuts(); renderCards();
  } catch (e) {
    renderLoadError();
  }
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0].map(value => value.trim());
  return rows.slice(1).map(values => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = (values[index] || '').trim();
    });
    return normalizeResource(obj);
  }).filter(r => getField(r, 'name'));
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function getRawField(resource, key) {
  const direct = resource[key];
  if (direct != null && String(direct).trim()) return String(direct).trim();

  const normalizedTarget = normalizeKey(key);
  for (const [fieldName, value] of Object.entries(resource)) {
    if (normalizeKey(fieldName) === normalizedTarget && String(value || '').trim()) {
      return String(value).trim();
    }
  }

  return '';
}

function getAliasField(resource, aliases) {
  for (const alias of aliases) {
    const value = getRawField(resource, alias);
    if (value) return value;
  }
  return '';
}

function normalizeCategoryValue(value) {
  const cleaned = String(value || '').trim();
  if (!cleaned) return 'Other';
  const canonical = CATEGORY_ALIASES[normalizeKey(cleaned)];
  if (canonical) return canonical;
  return cleaned;
}

function normalizeResource(resource) {
  const normalized = {};

  Object.entries(FIELD_ALIASES).forEach(([field, aliases]) => {
    normalized[field] = getAliasField(resource, [field, ...aliases]);
  });

  normalized.category = normalizeCategoryValue(normalized.category);
  return normalized;
}

function getField(resource, key) {
  return getRawField(resource, key);
}

function getLocalizedValue(resource, key) {
  if (lang === 'es') {
    const localized = getField(resource, `${key}_es`);
    if (localized) return localized;
  }
  return getField(resource, key);
}

function getLocalizedTags(resource) {
  const source = lang === 'es' && getField(resource, 'tags_es')
    ? getField(resource, 'tags_es')
    : getField(resource, 'tags');

  return String(source || '')
    .split(/[|,]/)
    .map(tag => tag.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function normalizeCategory(resource) {
  return getField(resource, 'category') || 'Other';
}

function getCategoryClass(category) {
  return String(category || 'Other').replace(/[^A-Za-z0-9]/g, '') || 'Other';
}

function compareText(a, b) {
  return String(a || '').localeCompare(String(b || ''), undefined, { sensitivity: 'base' });
}

function getSearchScore(resource, query) {
  if (!query) return 0;

  const name = getLocalizedValue(resource, 'name').toLowerCase();
  const desc = getLocalizedValue(resource, 'description').toLowerCase();
  const address = getField(resource, 'address').toLowerCase();
  const notes = getLocalizedValue(resource, 'notes').toLowerCase();
  const categoryLabel = (CAT_LABELS[lang][normalizeCategory(resource)] || normalizeCategory(resource)).toLowerCase();

  let score = 0;

  if (name === query) score += 120;
  else if (name.startsWith(query)) score += 90;
  else if (name.includes(query)) score += 65;

  if (categoryLabel.startsWith(query)) score += 48;
  else if (categoryLabel.includes(query)) score += 34;

  if (desc.startsWith(query)) score += 24;
  else if (desc.includes(query)) score += 16;

  if (address.includes(query)) score += 10;
  if (notes.includes(query)) score += 8;

  return score;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function escapeAttr(value) {
  return escapeHTML(value);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatch(value, query) {
  const text = String(value || '');
  const trimmed = String(query || '').trim();
  if (!trimmed) return escapeHTML(text);

  const escapedText = escapeHTML(text);
  const pattern = new RegExp(`(${escapeRegExp(escapeHTML(trimmed))})`, 'ig');
  return escapedText.replace(pattern, '<mark class="match">$1</mark>');
}

function normalizePhoneHref(phone) {
  const digits = String(phone).replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : digits.replace(/\+/g, '');
}

function normalizeWebsiteUrl(url) {
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z]+:/i.test(trimmed)) return '';
  return `https://${trimmed}`;
}

function toBoldUnicode(value) {
  const boldMap = {
    A:'𝗔', B:'𝗕', C:'𝗖', D:'𝗗', E:'𝗘', F:'𝗙', G:'𝗚', H:'𝗛', I:'𝗜', J:'𝗝',
    K:'𝗞', L:'𝗟', M:'𝗠', N:'𝗡', O:'𝗢', P:'𝗣', Q:'𝗤', R:'𝗥', S:'𝗦', T:'𝗧',
    U:'𝗨', V:'𝗩', W:'𝗪', X:'𝗫', Y:'𝗬', Z:'𝗭',
    a:'𝗮', b:'𝗯', c:'𝗰', d:'𝗱', e:'𝗲', f:'𝗳', g:'𝗴', h:'𝗵', i:'𝗶', j:'𝗷',
    k:'𝗸', l:'𝗹', m:'𝗺', n:'𝗻', o:'𝗼', p:'𝗽', q:'𝗾', r:'𝗿', s:'𝘀', t:'𝘁',
    u:'𝘂', v:'𝘃', w:'𝘄', x:'𝘅', y:'𝘆', z:'𝘇',
    0:'𝟬', 1:'𝟭', 2:'𝟮', 3:'𝟯', 4:'𝟰', 5:'𝟱', 6:'𝟲', 7:'𝟳', 8:'𝟴', 9:'𝟵',
  };

  return Array.from(String(value)).map(char => boldMap[char] || char).join('');
}

function buildFilters() {
  const categories = ['All', ...new Set(resources.map(normalizeCategory))];
  const container = document.getElementById('filters');
  const totalCount = resources.length;
  container.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === activeCategory ? 'active' : ''}"
      type="button"
      data-category="${escapeAttr(cat)}"
      aria-pressed="${cat === activeCategory ? 'true' : 'false'}">
      <span>${escapeHTML(cat === 'All' ? T[lang].all : (CAT_LABELS[lang][cat] || cat))}</span>
      <span class="chip-count">${cat === 'All' ? totalCount : resources.filter(resource => normalizeCategory(resource) === cat).length}</span>
    </button>
  `).join('');

}

function setCategory(cat) {
  activeCategory = cat;
  visibleResultLimit = INITIAL_RESULT_LIMIT;
  buildFilters(); renderCards();
}

function renderCards() {
  if (shareResourceKey) {
    updateSearchClearButton();
    renderSharePage();
    renderCategoryShare();
    return;
  }

  const rawQuery = getSearchQuery();
  const query = rawQuery.toLowerCase();
  const grid  = document.getElementById('grid');

  const filtered = resources.filter(r => {
    const cat = normalizeCategory(r);
    const matchCat = activeCategory === 'All' || cat === activeCategory;
    const name = getLocalizedValue(r, 'name').toLowerCase();
    const desc = getLocalizedValue(r, 'description').toLowerCase();
    const address = getField(r, 'address').toLowerCase();
    const notes = getLocalizedValue(r, 'notes').toLowerCase();
    const categoryLabel = (CAT_LABELS[lang][cat] || cat).toLowerCase();
    const matchQ = !query || name.includes(query) || desc.includes(query) || address.includes(query) || notes.includes(query) || categoryLabel.includes(query);
    return matchCat && matchQ;
  }).sort((a, b) => {
    if (!query) {
      return compareText(getLocalizedValue(a, 'name'), getLocalizedValue(b, 'name'));
    }

    const scoreDiff = getSearchScore(b, query) - getSearchScore(a, query);
    if (scoreDiff !== 0) return scoreDiff;
    return compareText(getLocalizedValue(a, 'name'), getLocalizedValue(b, 'name'));
  });

  filtered_cache = filtered;
  document.getElementById('results-info').textContent = query
    ? `${T[lang].showing(filtered.length)} · ${T[lang].bestMatches}`
    : T[lang].showing(filtered.length);
  document.getElementById('results-note').textContent = T[lang].resultsNote;
  renderResultsContext(rawQuery, filtered.length);
  renderCategoryShare();
  updateSearchClearButton();
  updateDirectoryUrl();

  if (!filtered.length) {
    updateGridMarkup(`<div class="empty">
      <div class="empty-icon">🔍</div>
      <h3>${T[lang].noResults}</h3>
      <p>${T[lang].noResultsSub}</p>
      <button class="empty-action" type="button" data-action="clear-all">${escapeHTML(T[lang].noResultsReset)}</button>
    </div>`);
    return;
  }

  document.body.classList.remove('share-mode');
  const visible = filtered.slice(0, visibleResultLimit);
  const remaining = filtered.length - visible.length;
  const moreMarkup = remaining > 0
    ? `<div class="load-more-wrap"><button class="load-more-btn" type="button" data-action="show-more">${escapeHTML(T[lang].showMoreResults(Math.min(remaining, RESULT_LIMIT_INCREMENT)))}</button></div>`
    : '';
  updateGridMarkup(visible.map((r, i) => renderResourceCard(r, i, rawQuery)).join('') + moreMarkup);
}

function showLoading() {
  updateGridMarkup(`
    <div class="loading"><div class="spinner"></div><div>${T[lang].loading}</div></div>`);
}

function setLang(l) {
  lang = l;
  document.getElementById('btn-en').classList.toggle('active', l === 'en');
  document.getElementById('btn-es').classList.toggle('active', l === 'es');
  document.getElementById('btn-en').setAttribute('aria-pressed', l === 'en' ? 'true' : 'false');
  document.getElementById('btn-es').setAttribute('aria-pressed', l === 'es' ? 'true' : 'false');
  document.getElementById('search').placeholder = T[l].search;
  document.getElementById('clear-search').textContent = T[l].clearSearch;
  document.getElementById('site-title').childNodes[0].textContent = T[l].siteTitle + ' ';
  document.getElementById('site-subtitle').textContent = T[l].siteSub;
  document.getElementById('intro-eyebrow').textContent = T[l].introEyebrow;
  document.getElementById('intro-title').textContent = T[l].introTitle;
  document.getElementById('intro-copy').textContent = T[l].introCopy;
  document.getElementById('intro-point-search').textContent = T[l].introPointSearch;
  document.getElementById('intro-point-browse').textContent = T[l].introPointBrowse;
  document.getElementById('intro-point-share').textContent = T[l].introPointShare;
  document.getElementById('finder-label-shortcuts').textContent = T[l].finderLabelShortcuts;
  document.getElementById('finder-hint-shortcuts').textContent = T[l].finderHintShortcuts;
  document.getElementById('finder-label-search').textContent = T[l].finderLabelSearch;
  document.getElementById('finder-hint-search').textContent = T[l].finderHintSearch;
  document.getElementById('finder-label-filters').textContent = T[l].finderLabelFilters;
  updateStatusNotice(document.getElementById('status-notice').classList.contains('show'));
  document.getElementById('results-note').textContent = T[l].resultsNote;
  document.getElementById('footer-title').textContent = T[l].footerTitle;
  document.getElementById('footer-contact').innerHTML = `${escapeHTML(T[l].footerContact)} <a href="tel:+13103950220">(310) 395-0220</a>`;
  document.getElementById('footer-note').textContent = T[l].footerNote;
  if (hasLoadError) {
    renderLoadError();
    return;
  }
  buildFilters(); renderShortcuts(); renderCards();
}

if (sharedCategoryKey) {
  activeCategory = sharedCategoryKey;
}

if (initialSearchQuery) {
  const searchInput = document.getElementById('search');
  if (searchInput) searchInput.value = initialSearchQuery;
}

document.getElementById('search')?.addEventListener('input', handleSearchInput);

loadData();
