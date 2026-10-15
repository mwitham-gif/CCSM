// ─────────────────────────────────────────────────────────────────────────────
// UPDATE THIS — staff inbox that receives "Report outdated info" emails
// ─────────────────────────────────────────────────────────────────────────────
const REPORT_EMAIL = 'help@communitycorp.org';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbAtpa7kK10yL2QtdLHRx9q2VbuEIPNG6S2uMbWhQ1GsLGoYA3NqFAlp_E_w8xUGRdcLxT4V3gbiJD/pub?output=csv';
const MAX_CSV_BYTES = 500000;

// Recommended Google Sheet columns:
// name, name_es, category, description, description_es, address, address_es, phone, website, hours, hours_es, notes, notes_es, tags, tags_es
// The importer also accepts several human-friendly variations like "Name", "Resource Name", or "Phone Number".

const T = {
  en: {
    search: 'Search by need, provider, service, or keyword...',
    clearSearch: 'Clear',
    all: 'All',
    showing: n => `Showing ${n} resource${n===1?'':'s'}`,
    bestMatches: 'Best matches first',
    narrowingTo: (visible, total) => `${visible} of ${total} resources`,
    introTitle: 'What kind of help do you need today?',
    introCopy: 'Search by keyword or choose a support area, then call or visit a provider directly for current details.',
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
    siteTitle: 'Santa Monica Resource Guide',
    siteSub: 'Food, rent, health care and more, close to home',
    footerTitle: 'Community Corporation of Santa Monica · Resident Services',
    footerContact: 'Need help using this directory? Call',
    footerNote: 'Services, hours, and eligibility can change. Please confirm details with providers before visiting.',
    reportBtn: 'Report incorrect information',
    share: 'Share',
    shareEmail: 'Email',
    shareCopyLink: 'Copy link',
    sharePrint: 'Print or save as PDF',
    printedOn: date => `Printed ${date}`,
    printPhone: 'Phone',
    printWebsite: 'Website',
    printListEyebrow: 'Resource list',
    printCount: n => `${n} resource${n===1?'':'s'}`,
    printScanTitle: 'Scan for the full guide',
    printScanBody: 'Always up to date, in English and Spanish.',
    printCallFirst: 'Please call before visiting. Hours, services and eligibility can change.',
    printHelp: 'Questions? Resident Services: (310) 395-0220.',
    textLarger: 'Larger text',
    textSmaller: 'Normal text size',
    safetyTitle: 'Browsing safely',
    safetyTips: [
      'If someone checks this phone or computer, they may be able to see the sites you visit.',
      'A private or incognito window keeps this visit out of your history. You can also delete this site from your history afterwards.',
      'A phone or computer at a library, at work, or at a friend\'s home is safer than a shared one.',
      'Quick exit (bottom right) leaves this site at once and erases the copy saved on this device.',
    ],
    safetyUrgent: 'In danger right now? Call 911.',
    offlineNotice: 'You are offline. This is the list saved on this device, so some details may have changed since.',
    quickExit: 'Quick exit',
    jumpToFilters: 'Back to search and filters',
    quickExitHint: 'Leave this site now',
    shareCopyAll: 'Copy all resources',
    linkCopied: 'Link copied',
    resourcesCopied: 'Resources copied',
    copyPrompt: 'Copy this link:',
    shareBack: 'Back to full directory',
    shareEyebrow: 'Shared from the Santa Monica Resource Guide',
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

I noticed some information for "${name}" in the CCSM Santa Monica Resource Guide may be outdated.

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
    introTitle: '¿Qué tipo de ayuda necesita hoy?',
    introCopy: 'Busque por palabra clave o elija un área de apoyo, y luego llame o visite el sitio web del proveedor para confirmar detalles.',
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
    siteTitle: 'Guía de Recursos de Santa Mónica',
    siteSub: 'Comida, renta, salud y más, cerca de casa',
    footerTitle: 'Community Corporation of Santa Monica · Servicios para Residentes',
    footerContact: '¿Necesita ayuda para usar este directorio? Llame al',
    footerNote: 'Los servicios, horarios y requisitos pueden cambiar. Confirme los detalles con los proveedores antes de visitar.',
    reportBtn: 'Reportar información incorrecta',
    share: 'Compartir',
    shareEmail: 'Correo',
    shareCopyLink: 'Copiar enlace',
    sharePrint: 'Imprimir o guardar como PDF',
    printedOn: date => `Impreso el ${date}`,
    printPhone: 'Teléfono',
    printWebsite: 'Sitio web',
    printListEyebrow: 'Lista de recursos',
    printCount: n => `${n} recurso${n===1?'':'s'}`,
    printScanTitle: 'Escanee para ver la guía completa',
    printScanBody: 'Siempre actualizada, en inglés y español.',
    printCallFirst: 'Llame antes de visitar. Los horarios, servicios y requisitos pueden cambiar.',
    printHelp: '¿Preguntas? Servicios para Residentes: (310) 395-0220.',
    textLarger: 'Letra más grande',
    textSmaller: 'Tamaño de letra normal',
    safetyTitle: 'Navegar de forma segura',
    safetyTips: [
      'Si alguien revisa este teléfono o computadora, podría ver los sitios que usted visita.',
      'Una ventana privada o de incógnito no guarda esta visita en su historial. También puede borrar este sitio de su historial después.',
      'Un teléfono o computadora en una biblioteca, en el trabajo o en casa de una amistad es más seguro que uno compartido.',
      'Salida rápida (abajo a la derecha) sale de este sitio de inmediato y borra la copia guardada en este dispositivo.',
    ],
    safetyUrgent: '¿Está en peligro ahora? Llame al 911.',
    offlineNotice: 'No tiene conexión. Esta es la lista guardada en este dispositivo, así que algunos detalles pueden haber cambiado.',
    quickExit: 'Salida rápida',
    jumpToFilters: 'Volver a búsqueda y filtros',
    quickExitHint: 'Salir de este sitio ahora',
    shareCopyAll: 'Copiar todos los recursos',
    linkCopied: 'Enlace copiado',
    resourcesCopied: 'Recursos copiados',
    copyPrompt: 'Copie este enlace:',
    shareBack: 'Volver al directorio completo',
    shareEyebrow: 'Compartido desde la Guía de Recursos de Santa Mónica',
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

Noté que la información de "${name}" en la Guía de Recursos de Santa Mónica de CCSM puede estar desactualizada.

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
const initialLang = urlParams.get('lang') === 'es' ? 'es' : 'en';

// Category icons: Lucide (https://lucide.dev), ISC license. Inline so the
// page makes no extra requests; drawn in each category's color via CSS.
const ICONS = {
  Food: '<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>',
  Rental: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  Housing: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  Medical: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  'Domestic Violence': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  Mental: '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z"/>',
  Benefits: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  Seniors: '<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95"/><path d="m2 15 6 6"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91"/>',
  Disability: '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
  Legal: '<path d="M12 3v18"/><path d="m19 8 3 8a5 5 0 0 1-6 0zV7"/><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"/><path d="m5 8 3 8a5 5 0 0 1-6 0zV7"/><path d="M7 21h10"/>',
  Childcare: '<path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M15 12h.01"/><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/><path d="M9 12h.01"/>',
  Youth: '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
  Employment: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  Transportation: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  Education: '<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/>',
  Other: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
};

function getCategoryIcon(category) {
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[category] || ICONS.Other}</svg>`;
}

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


// Filter pills run most urgent first, so the needs that can't wait are
// visible without scrolling on a phone. Categories not listed here (new
// ones added in the sheet) follow in sheet order; "Other" is always last.
const CATEGORY_ORDER = [
  'Food', 'Rental', 'Housing', 'Medical', 'Domestic Violence', 'Mental',
  'Benefits', 'Seniors', 'Disability', 'Legal', 'Childcare', 'Youth',
  'Employment', 'Transportation', 'Education',
];

function categoryRank(category) {
  if (category === 'Other') return Infinity;
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

const FIELD_ALIASES = {
  name: ['name', 'resource name', 'program name', 'organization name', 'org name'],
  name_es: ['name_es', 'name es', 'resource name es', 'resource name spanish', 'program name es', 'nombre', 'nombre_es'],
  category: ['category', 'service category', 'type', 'service type'],
  description: ['description', 'service description', 'summary', 'details'],
  description_es: ['description_es', 'description es', 'service description es', 'descripcion', 'descripcion_es'],
  address: ['address', 'location', 'street address'],
  address_es: ['address_es', 'address es', 'direccion', 'direccion_es', 'dirección'],
  phone: ['phone', 'phone number', 'telephone', 'contact phone'],
  website: ['website', 'web site', 'url', 'link'],
  hours: ['hours', 'service hours', 'open hours', 'availability'],
  hours_es: ['hours_es', 'hours es', 'horario', 'horario_es', 'horarios'],
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

  // The category stays out of the URL so a reload always starts on "All".
  // A shared ?category= link still opens on that category, then this
  // clears it from the address bar.
  const params = new URLSearchParams();

  if (lang === 'es') params.set('lang', 'es');

  const next = params.toString()
    ? `${getBasePageUrl()}?${params.toString()}`
    : getBasePageUrl();

  window.history.replaceState({}, '', next);
}

function getResourceShareData(resource) {
  const name = getLocalizedValue(resource, 'name');
  const description = getLocalizedValue(resource, 'description');
  const website = normalizeWebsiteUrl(getField(resource, 'website'));
  const address = getLocalizedValue(resource, 'address');
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
    getLocalizedValue(resource, 'address'),
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
    title: `${label} · ${T[lang].siteTitle}`,
    text: `Browse ${label.toLowerCase()} resources.`,
    url: getCategorySharePageUrl(category),
  };
}

function getCategoryShareText(category) {
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
  return lines.join('\n');
}

function getCategoryShareEmailHref(category) {
  return getEmailComposeHref({
    subject: getCategoryShareData(category).title,
    body: getCategoryShareText(category),
  });
}

function closeShareMenus() {
  document.querySelectorAll('.share-menu.show').forEach(menu => menu.classList.remove('show', 'open-down', 'open-left'));
  document.querySelectorAll('.btn-share[aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
}

function toggleShareMenu(idx, event, button) {
  event.stopPropagation();
  const menu = document.getElementById(`share-menu-${idx}`);
  if (!menu) return;

  const isOpen = menu.classList.contains('show');
  closeShareMenus();

  if (!isOpen) {
    menu.classList.add('show');
    button.setAttribute('aria-expanded', 'true');
    keepMenuOnScreen(menu);
  }
}

// Share menus open upward from their button. Near the top of the screen
// (or under the sticky header on larger screens) that would push the first
// options out of sight, so open downward instead; likewise keep the menu
// inside the screen's right edge.
function keepMenuOnScreen(menu) {
  const header = document.querySelector('header');
  const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
  if (menu.getBoundingClientRect().top < headerBottom + 8) menu.classList.add('open-down');
  if (menu.getBoundingClientRect().right > document.documentElement.clientWidth - 8) menu.classList.add('open-left');
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

// window.prompt flattens newlines, so multi-line text falls back to a hidden
// textarea and execCommand when the async clipboard API is unavailable.
function copyTextWithSelection(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (error) {
    copied = false;
  }
  textarea.remove();
  return copied;
}

async function copyCategoryResources() {
  if (activeCategory === 'All') return;

  const text = getCategoryShareText(activeCategory);

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      closeShareMenus();
      showToast(T[lang].resourcesCopied);
      return;
    }
  } catch (error) {
    // Fall through to the selection-based copy below.
  }

  if (copyTextWithSelection(text)) {
    closeShareMenus();
    showToast(T[lang].resourcesCopied);
    return;
  }

  window.prompt(T[lang].copyPrompt, getCategorySharePageUrl(activeCategory));
}

// Print or save as PDF. Builds a branded, large-type page in #print-sheet:
// phone numbers and web addresses written out in full and a QR code back to
// the live guide, so it works on paper, in a PDF, or handed across a desk.
// styles.css shows only that sheet while body has .printing-sheet; a normal
// Ctrl+P is unaffected.
const PRINT_QR_SRC = 'flyer/ccsm-qr.svg';
const PRINT_LOGO_SRC = 'ccsm_logo_web.png';

// Fetch the QR code ahead of time so it is ready the moment Print is tapped.
[PRINT_QR_SRC, PRINT_LOGO_SRC].forEach(src => { new Image().src = src; });

function getPrintField(label, value, extraClass = '') {
  if (!value) return '';
  return `<div class="ps-field ${extraClass}"><span class="ps-label">${escapeHTML(label)}</span><span class="ps-value">${escapeHTML(value)}</span></div>`;
}

function getPrintItemMarkup(resource, { single = false } = {}) {
  const cat = normalizeCategory(resource);
  const website = normalizeWebsiteUrl(getField(resource, 'website'))
    .replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
  const desc = getLocalizedValue(resource, 'description');

  return `
    <section class="ps-item pc-${escapeAttr(getCategoryClass(cat))}${single ? ' ps-single' : ''}">
      ${single ? '' : `<h2>${escapeHTML(getLocalizedValue(resource, 'name'))}</h2>`}
      ${desc && !single ? `<p class="ps-desc">${escapeHTML(desc)}</p>` : ''}
      <div class="ps-grid">
        ${getPrintField(T[lang].call, getField(resource, 'phone'), 'ps-call')}
        ${single ? getPrintField(T[lang].printWebsite, website, 'ps-web') : ''}
        ${getPrintField(T[lang].addressLabel, getLocalizedValue(resource, 'address'))}
        ${getPrintField(T[lang].hoursLabel, getLocalizedValue(resource, 'hours'))}
        ${single ? '' : getPrintField(T[lang].printWebsite, website, 'ps-web ps-wide')}
        ${getPrintField(T[lang].notesLabel, getLocalizedValue(resource, 'notes'), 'ps-wide')}
      </div>
    </section>`;
}

async function printResources(list, { title, eyebrow, lede = '', single = false }) {
  const sheet = document.getElementById('print-sheet');
  if (!sheet || !list.length) return;
  closeShareMenus();

  const date = new Date().toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const siteUrl = getBasePageUrl().replace(/^https?:\/\//, '').replace(/\/$/, '');
  const meta = single ? T[lang].printedOn(date) : `${T[lang].printCount(list.length)} · ${T[lang].printedOn(date)}`;

  sheet.innerHTML = `
    <div class="ps-top">
      <img class="ps-logo" src="${PRINT_LOGO_SRC}" alt="Community Corporation of Santa Monica">
      <div class="ps-brand">
        <div class="ps-brand-name">${escapeHTML(T[lang].siteTitle)}</div>
        <div class="ps-brand-sub">${escapeHTML(T[lang].footerTitle)}</div>
      </div>
    </div>
    <div class="ps-title">
      <div class="ps-eyebrow">${escapeHTML(eyebrow)}</div>
      <h1>${escapeHTML(title)}</h1>
      ${lede ? `<p class="ps-lede">${escapeHTML(lede)}</p>` : ''}
      <div class="ps-meta">${escapeHTML(meta)}</div>
    </div>
    <div class="ps-list">
      ${list.map(resource => getPrintItemMarkup(resource, { single })).join('')}
    </div>
    <div class="ps-foot">
      <img class="ps-qr" src="${PRINT_QR_SRC}" alt="">
      <div class="ps-foot-text">
        <div class="ps-foot-title">${escapeHTML(T[lang].printScanTitle)}</div>
        <div>${escapeHTML(T[lang].printScanBody)}</div>
        <div class="ps-foot-url">${escapeHTML(siteUrl)}</div>
        <div class="ps-foot-help">${escapeHTML(T[lang].printHelp)} ${escapeHTML(T[lang].printCallFirst)}</div>
      </div>
    </div>`;

  // Wait (briefly) for the logo and QR code, or they can print blank.
  const images = Array.from(sheet.querySelectorAll('img'));
  await Promise.race([
    Promise.all(images.map(img => (img.decode ? img.decode() : Promise.resolve()).catch(() => {}))),
    new Promise(resolve => setTimeout(resolve, 1500)),
  ]);

  document.body.classList.add('printing-sheet');
  window.print();
}

function printResource(resource) {
  const cat = normalizeCategory(resource);
  printResources([resource], {
    single: true,
    eyebrow: CAT_LABELS[lang][cat] || cat,
    title: getLocalizedValue(resource, 'name'),
    lede: getLocalizedValue(resource, 'description'),
  });
}

function printCategory() {
  if (activeCategory === 'All') return;
  const pins = getCategoryPins(activeCategory);
  const list = resources
    .filter(resource => normalizeCategory(resource) === activeCategory)
    .sort((a, b) => getPinRank(b, pins) - getPinRank(a, pins) || compareText(getLocalizedValue(a, 'name'), getLocalizedValue(b, 'name')));
  printResources(list, {
    eyebrow: T[lang].printListEyebrow,
    title: CAT_LABELS[lang][activeCategory] || activeCategory,
  });
}

window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing-sheet');
  const sheet = document.getElementById('print-sheet');
  if (sheet) sheet.innerHTML = '';
});

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
    toggleShareMenu(shareButton.dataset.shareMenu, event, shareButton);
    return;
  }

  const copyButton = event.target.closest('[data-copy-index]');
  if (copyButton) {
    copyResourceLink(Number(copyButton.dataset.copyIndex));
    return;
  }

  const printButton = event.target.closest('[data-print-index]');
  if (printButton) {
    const resource = filtered_cache[Number(printButton.dataset.printIndex)];
    if (resource) printResource(resource);
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
    if (action === 'copy-category-all') copyCategoryResources();
    if (action === 'print-category') printCategory();
    if (action === 'show-more') showMoreResults();
    if (action === 'retry-load') loadData();
    if (action === 'back-to-directory') window.location.href = getBasePageUrl();
    if (action !== 'copy-category' && action !== 'copy-category-all') closeShareMenus();
    return;
  }

  closeShareMenus();
});
// Jump back to search and filters. Appears once the filters are off screen
// and the visitor scrolls back UP, the moment they are looking for the top;
// it hides again while they scroll down to read. CSS puts it top-centre on
// laptops and bottom-centre on phones.
const JUMP_SHOW_DELTA = 8;
let jumpLastY = window.scrollY;
let jumpTicking = false;

function updateJumpLabel(rawQuery, count) {
  const label = rawQuery
    ? `“${rawQuery}”`
    : (activeCategory === 'All' ? T[lang].all : (CAT_LABELS[lang][activeCategory] || activeCategory));
  setText('jump-filters-label', `${label} · ${count}`);
  const button = document.getElementById('jump-filters');
  if (button) {
    button.setAttribute('aria-label', `${T[lang].jumpToFilters}: ${label}, ${count}`);
    button.title = T[lang].jumpToFilters;
  }
}

function setJumpVisible(visible) {
  const button = document.getElementById('jump-filters');
  if (!button) return;
  button.classList.toggle('is-visible', visible);
  button.tabIndex = visible ? 0 : -1;
  button.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

function updateJumpButton() {
  jumpTicking = false;
  const controls = document.querySelector('.controls');
  const y = window.scrollY;
  const delta = y - jumpLastY;
  jumpLastY = y;
  if (!controls || shareResourceKey) {
    setJumpVisible(false);
    return;
  }
  const filtersBottom = controls.getBoundingClientRect().bottom + y;
  if (y < filtersBottom + 120) setJumpVisible(false);
  else if (delta <= -JUMP_SHOW_DELTA) setJumpVisible(true);
  else if (delta >= JUMP_SHOW_DELTA) setJumpVisible(false);
}

// Larger text (the A+ button in the header). Scales the whole page by 20%,
// like a browser zoom, so every part grows together. The choice is
// remembered on this device only; if storage is blocked it simply resets.
const TEXT_SIZE_KEY = 'ccsm-large-text';

function setLargeText(on, { save = true } = {}) {
  document.documentElement.classList.toggle('text-large', on);
  const button = document.getElementById('btn-text-size');
  if (button) {
    button.classList.toggle('active', on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
    const label = on ? T[lang].textSmaller : T[lang].textLarger;
    button.setAttribute('aria-label', label);
    button.title = label;
  }
  if (save) {
    try { window.localStorage.setItem(TEXT_SIZE_KEY, on ? '1' : '0'); } catch (error) { /* storage blocked */ }
  }
  updateHeaderHeight();
}

function isLargeText() {
  return document.documentElement.classList.contains('text-large');
}

document.getElementById('btn-text-size')?.addEventListener('click', () => setLargeText(!isLargeText()));

// The header is sticky, so the pill and the scroll target sit just below it.
function updateHeaderHeight() {
  const header = document.querySelector('header');
  if (header) document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
}
updateHeaderHeight();
window.addEventListener('resize', updateHeaderHeight);
window.addEventListener('load', updateHeaderHeight);

window.addEventListener('scroll', () => {
  if (jumpTicking) return;
  jumpTicking = true;
  requestAnimationFrame(updateJumpButton);
}, { passive: true });

function jumpToFilters({ focusSearch = false } = {}) {
  const controls = document.querySelector('.controls');
  const finder = document.querySelector('.finder-card');
  const input = document.getElementById('search');
  if (!controls) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setJumpVisible(false);
  controls.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (focusSearch && input) {
    input.focus({ preventScroll: true });
    input.select();
  } else if (finder) {
    // Move focus for screen readers without opening the phone keyboard.
    finder.setAttribute('tabindex', '-1');
    finder.focus({ preventScroll: true });
  }
}

// Laptops with a mouse get the search box focused, ready to type; touch
// screens only move focus to the card so no keyboard pops up.
document.getElementById('jump-filters')?.addEventListener('click', () => {
  jumpToFilters({ focusSearch: window.matchMedia('(hover: hover) and (pointer: fine)').matches });
});

// "/" jumps to the search box from anywhere, as on GitHub and YouTube.
document.addEventListener('keydown', event => {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select'))) return;
  if (shareResourceKey) return;
  event.preventDefault();
  jumpToFilters({ focusSearch: true });
});

// Quick exit: replaces this page in history (so Back does not return here)
// with a neutral site. Safety feature for anyone browsing domestic violence
// resources on a shared or monitored phone. No keyboard shortcut on purpose:
// Esc already clears search and closes menus, so a double press would eject
// people by accident.
//
// It also erases the copy of the guide that sw.js saves for offline use, so
// the phone keeps no stored trace of the directory beyond normal history.
// The page hides at once; the erase gets a moment to finish before leaving,
// and leaving never waits longer than that.
const QUICK_EXIT_URL = 'https://weather.com/';
const QUICK_EXIT_CLEANUP_MS = 250;

function eraseOfflineCopy() {
  const jobs = [];
  if (window.caches) {
    jobs.push(caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))));
  }
  if (navigator.serviceWorker) {
    jobs.push(navigator.serviceWorker.getRegistrations()
      .then(registrations => Promise.all(registrations.map(registration => registration.unregister()))));
  }
  return Promise.all(jobs).catch(() => {});
}

function quickExit() {
  document.body.style.display = 'none';
  document.title = '';
  let left = false;
  const leave = () => {
    if (left) return;
    left = true;
    window.location.replace(QUICK_EXIT_URL);
  };
  eraseOfflineCopy().then(leave);
  window.setTimeout(leave, QUICK_EXIT_CLEANUP_MS);
}

document.getElementById('quick-exit')?.addEventListener('click', quickExit);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeShareMenus();
});

function getShareModeResource() {
  if (!shareResourceKey) return null;
  return resources.find(resource => getField(resource, 'name') === shareResourceKey) || null;
}

// Elements are addressed by id throughout. Guard every write so that markup
// drifting from this script — a cached copy of either one, or an id renamed in
// index.html — degrades to a no-op instead of throwing and halting page setup.
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
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
    <div class="results-pills">${pills.join('')}${getCategoryShareMarkup()}</div>
    <button class="results-reset" type="button" data-action="clear-all">${escapeHTML(T[lang].resetFilters)}</button>
  `;
}

function getCategoryShareMarkup() {
  if (shareResourceKey || activeCategory === 'All') return '';

  const label = CAT_LABELS[lang][activeCategory] || activeCategory;
  const shareEmailHref = getCategoryShareEmailHref(activeCategory);

  return `
    <div class="share-wrap">
      <button class="btn-share top-share-btn" type="button" data-share-menu="category" aria-label="${escapeAttr(`${T[lang].share} ${label}`)}" aria-expanded="false">
        ${escapeHTML(T[lang].share)} ${escapeHTML(label)}
      </button>
      <div class="share-menu" id="share-menu-category">
        <a class="share-option" href="${escapeAttr(shareEmailHref)}" target="_blank" rel="noopener">${escapeHTML(T[lang].shareEmail)}</a>
        <button class="share-option" type="button" data-action="copy-category-all">${escapeHTML(T[lang].shareCopyAll)}</button>
        <button class="share-option" type="button" data-action="copy-category">${escapeHTML(T[lang].shareCopyLink)}</button>
        <button class="share-option" type="button" data-action="print-category">${escapeHTML(T[lang].sharePrint)}</button>
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
  // A phone cell like "Email hotline via website" has nothing to dial.
  const rawPhone = getField(resource, 'phone');
  const phone = rawPhone.replace(/\D/g, '').length >= 3 ? rawPhone : '';
  const website = normalizeWebsiteUrl(getField(resource, 'website'));
  const address = getLocalizedValue(resource, 'address');
  const hours = getLocalizedValue(resource, 'hours');
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
        <div class="card-icon icon-${escapeAttr(categoryClass)}">${getCategoryIcon(cat)}</div>
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
            <button class="share-option" type="button" data-print-index="${i}">${escapeHTML(T[lang].sharePrint)}</button>
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
  if (resultsInfo) resultsInfo.textContent = '';
  if (resultsContext) resultsContext.innerHTML = '';

  if (!resource) {
    document.title = `${T[lang].shareMissingTitle} · ${T[lang].siteTitle}`;
    updateGridMarkup(`<div class="empty">
      <div class="empty-icon">🔍</div>
      <h3>${escapeHTML(T[lang].shareMissingTitle)}</h3>
      <p>${escapeHTML(T[lang].shareMissingBody)}</p>
      <button class="empty-action" type="button" data-action="back-to-directory">${escapeHTML(T[lang].searchDirectory)}</button>
    </div>`);
    return true;
  }

  document.title = `${getLocalizedValue(resource, 'name')} · ${T[lang].siteTitle}`;
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

  setText('results-info', '');
  setHTML('results-context', '');
  setHTML('filters', '');
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
    buildFilters(); renderCards();
    updateOfflineNotice();
  } catch (e) {
    renderLoadError();
  }
}

// sw.js keeps the last copy of the page and the sheet, so the guide still
// opens with no signal. Say so, since that copy may be out of date.
function updateOfflineNotice() {
  const notice = document.getElementById('offline-notice');
  if (!notice) return;
  notice.textContent = T[lang].offlineNotice;
  notice.classList.toggle('show', !navigator.onLine && resources.length > 0 && !hasLoadError);
}

window.addEventListener('online', updateOfflineNotice);
window.addEventListener('offline', updateOfflineNotice);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
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
  const headerKey = headers.join('|').toLowerCase();
  // Skip repeats of the header row, which File > Import > Append leaves in the sheet.
  return rows.slice(1).filter(values => values.map(v => v.trim()).join('|').toLowerCase() !== headerKey).map(values => {
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

// Everyday words residents type, mapped to the support area they mean, in
// English and Spanish. A search for "groceries", "eviction" or "comida" then
// finds the Food, Rental or Food listings even when the listing never uses
// that word. Words are matched without accents, so "medico" finds "médico".
// To teach search a new word, add it to the right line.
const SEARCH_CONCEPTS = [
  { category: 'Food', words: ['food', 'groceries', 'grocery', 'hungry', 'hunger', 'meal', 'meals', 'eat', 'eating', 'pantry', 'pantries', 'calfresh', 'ebt', 'snap', 'wic', 'lunch', 'dinner', 'breakfast', 'comida', 'comidas', 'alimento', 'alimentos', 'despensa', 'hambre', 'comer', 'mercado', 'almuerzo', 'cena', 'desayuno'] },
  { category: 'Rental', words: ['rent', 'rental', 'evict', 'eviction', 'evicted', 'landlord', 'lease', 'deposit', 'back rent', 'tenant', 'tenants', 'renta', 'alquiler', 'desalojo', 'desalojar', 'casero', 'arrendador', 'inquilino', 'inquilinos', 'deposito'] },
  { category: 'Housing', words: ['housing', 'homeless', 'homelessness', 'unhoused', 'shelter', 'apartment', 'section 8', 'voucher', 'motel', 'sleeping in car', 'vivienda', 'sin hogar', 'desamparado', 'refugio', 'apartamento', 'casa', 'albergue'] },
  { category: 'Medical', words: ['doctor', 'doctors', 'clinic', 'sick', 'health', 'healthcare', 'dental', 'dentist', 'teeth', 'tooth', 'glasses', 'vision', 'eye', 'insurance', 'medi-cal', 'medical', 'medicaid', 'medicare', 'prescription', 'pharmacy', 'medicine', 'pregnant', 'pregnancy', 'prenatal', 'vaccine', 'shots', 'medico', 'clinica', 'enfermo', 'enferma', 'salud', 'dentista', 'dientes', 'lentes', 'seguro medico', 'medicina', 'farmacia', 'embarazada', 'embarazo', 'vacuna'] },
  { category: 'Mental', words: ['mental', 'depression', 'depressed', 'anxiety', 'anxious', 'stress', 'stressed', 'therapy', 'therapist', 'counseling', 'counselor', 'counsellor', 'suicide', 'suicidal', 'crisis', 'addiction', 'drugs', 'alcohol', 'sober', 'recovery', 'grief', 'trauma', '988', 'lonely', 'depresion', 'ansiedad', 'estres', 'terapia', 'terapeuta', 'consejeria', 'consejero', 'suicidio', 'adiccion', 'drogas', 'duelo', 'soledad'] },
  { category: 'Domestic Violence', words: ['abuse', 'abused', 'abusive', 'violence', 'violent', 'hit', 'hits', 'hurt', 'hurts', 'unsafe', 'afraid', 'scared', 'restraining order', 'stalking', 'stalker', 'dv', 'abuso', 'violencia', 'maltrato', 'golpe', 'golpea', 'miedo', 'peligro', 'orden de restriccion', 'acoso'] },
  { category: 'Legal', words: ['lawyer', 'lawyers', 'attorney', 'court', 'legal', 'law', 'immigration', 'immigrant', 'deport', 'deportation', 'citizenship', 'daca', 'green card', 'ticket', 'record', 'expunge', 'expungement', 'rights', 'sued', 'lawsuit', 'abogado', 'abogada', 'corte', 'inmigracion', 'inmigrante', 'ciudadania', 'derechos', 'ley', 'demanda'] },
  { category: 'Benefits', words: ['benefits', 'calfresh', 'medi-cal', 'ssi', 'ssdi', 'social security', 'cash aid', 'calworks', 'gr', 'general relief', 'utility', 'utilities', 'bill', 'bills', 'electric', 'electricity', 'gas bill', 'water bill', 'phone', 'internet', 'lifeline', 'taxes', 'tax', 'beneficios', 'seguro social', 'ayuda en efectivo', 'luz', 'factura', 'facturas', 'cuentas', 'impuestos', 'telefono'] },
  { category: 'Employment', words: ['job', 'jobs', 'work', 'working', 'employment', 'resume', 'hire', 'hiring', 'career', 'unemployed', 'unemployment', 'edd', 'interview', 'training', 'trabajo', 'trabajar', 'empleo', 'curriculum', 'desempleo', 'entrevista', 'capacitacion'] },
  { category: 'Education', words: ['school', 'class', 'classes', 'ged', 'diploma', 'college', 'esl', 'english', 'computer', 'computers', 'library', 'learn', 'reading', 'tutor', 'escuela', 'clase', 'clases', 'ingles', 'computadora', 'biblioteca', 'aprender', 'universidad'] },
  { category: 'Childcare', words: ['childcare', 'child care', 'daycare', 'day care', 'preschool', 'babysitter', 'babysitting', 'baby', 'babies', 'toddler', 'diapers', 'guarderia', 'preescolar', 'cuidado infantil', 'bebe', 'bebes', 'panales'] },
  { category: 'Youth', words: ['youth', 'teen', 'teens', 'teenager', 'kids', 'children', 'after school', 'afterschool', 'tutoring', 'summer camp', 'camp', 'sports', 'jovenes', 'joven', 'adolescente', 'adolescentes', 'ninos', 'hijos', 'tutoria', 'campamento', 'deportes'] },
  { category: 'Seniors', words: ['senior', 'seniors', 'elderly', 'older', 'aging', 'retired', 'retiree', 'grandparent', 'adulto mayor', 'adultos mayores', 'mayores', 'anciano', 'ancianos', 'tercera edad', 'jubilado', 'abuelos'] },
  { category: 'Disability', words: ['disability', 'disabilities', 'disabled', 'wheelchair', 'blind', 'deaf', 'hearing', 'ihss', 'caregiver', 'autism', 'discapacidad', 'discapacitado', 'silla de ruedas', 'ciego', 'sordo', 'cuidador', 'autismo'] },
  { category: 'Transportation', words: ['bus', 'buses', 'ride', 'rides', 'transport', 'transportation', 'metro', 'tap card', 'car', 'gas', 'parking', 'access paratransit', 'dial-a-ride', 'autobus', 'camion', 'transporte', 'carro', 'coche', 'viaje', 'pasaje'] },
];

// Listings that always come first when a search is about a certain need, and
// at the top of their support area's list (the Food support button).
// Matched by a piece of the listing's English name, so small edits to the
// name in the sheet do not break it. CalFresh, EBT and WIC searches are left
// out on purpose: those residents want the benefit itself, not a pantry.
const SEARCH_PINS = [
  {
    name: 'pantry locator',
    category: 'Food',
    words: ['food', 'foods', 'pantry', 'pantries', 'food bank', 'groceries', 'grocery', 'hungry', 'hunger', 'meal', 'meals', 'eat', 'comida', 'comidas', 'alimento', 'alimentos', 'despensa', 'despensas', 'banco de alimentos', 'hambre', 'comer', 'mercado'],
  },
];

// Filler words that say nothing about the need ("I need help with rent").
const SEARCH_STOPWORDS = new Set([
  'a', 'an', 'and', 'the', 'for', 'to', 'of', 'in', 'on', 'at', 'with', 'my', 'me', 'i', 'im', 'we', 'our', 'is', 'it', 'can', 'cant', 'cannot', 'need', 'needs', 'help', 'get', 'find', 'where', 'how', 'want', 'pay', 'free', 'near', 'some', 'do', 'dont', 'have', 'no', 'not',
  'el', 'la', 'los', 'las', 'un', 'una', 'y', 'de', 'del', 'para', 'por', 'con', 'en', 'mi', 'mis', 'yo', 'necesito', 'ayuda', 'quiero', 'donde', 'como', 'que', 'puedo', 'pagar', 'gratis', 'cerca', 'tengo', 'hay',
]);

function foldText(value) {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// One lowercase, accent-free string per listing, covering both languages, so
// a Spanish word finds a listing while the page is in English and vice versa.
const searchTextCache = new WeakMap();

function getSearchText(resource) {
  if (!searchTextCache.has(resource)) {
    const cat = normalizeCategory(resource);
    searchTextCache.set(resource, foldText([
      'name', 'name_es', 'description', 'description_es', 'notes', 'notes_es', 'tags', 'tags_es', 'address', 'address_es',
    ].map(key => getField(resource, key)).concat(CAT_LABELS.en[cat] || cat, CAT_LABELS.es[cat] || '').join(' \n ')));
  }
  return searchTextCache.get(resource);
}

function conceptWordMatches(word, token, phrase) {
  if (word.includes(' ')) return phrase.includes(word);
  if (token === word) return true;
  // "evict" finds "eviction" and a half-typed "groc" finds "groceries".
  if (token.length >= 4 && word.startsWith(token)) return true;
  return word.length >= 4 && token.startsWith(word);
}

function parseSearchQuery(query) {
  const phrase = foldText(query).trim().replace(/\s+/g, ' ');
  const words = phrase.split(/[^a-z0-9]+/).filter(Boolean);
  const tokens = words.filter(word => word.length >= 2 && !SEARCH_STOPWORDS.has(word));
  const categories = new Set();
  SEARCH_CONCEPTS.forEach(concept => {
    if (concept.words.some(word => tokens.some(token => conceptWordMatches(word, token, phrase)))) {
      categories.add(concept.category);
    }
  });
  const pinned = SEARCH_PINS
    .filter(pin => pin.words.some(word => tokens.some(token => conceptWordMatches(word, token, phrase))))
    .map(pin => pin.name);
  return { phrase, tokens, categories, pinned };
}

function getSearchScore(resource, search) {
  if (!search || !search.phrase) return 0;
  const { phrase, tokens, categories } = search;

  const name = foldText(getField(resource, 'name')) + ' \n ' + foldText(getField(resource, 'name_es'));
  const desc = foldText(getField(resource, 'description')) + ' \n ' + foldText(getField(resource, 'description_es'));
  const text = getSearchText(resource);
  const cat = normalizeCategory(resource);

  let score = 0;

  // The whole search, as typed, still counts most.
  if (name.split(' \n ').includes(phrase)) score += 120;
  else if (name.startsWith(phrase)) score += 90;
  else if (name.includes(phrase)) score += 65;
  if (desc.includes(phrase)) score += 20;
  if (text.includes(phrase)) score += 12;

  // Then each meaningful word on its own...
  tokens.forEach(token => {
    if (token.length < 3 && !/\d/.test(token)) return;
    if (name.includes(token)) score += 14;
    else if (text.includes(token)) score += 6;
  });

  // ...and the support area those words point to.
  if (categories.has(cat)) score += 30;

  return score;
}

function getCategoryPins(category) {
  return SEARCH_PINS.filter(pin => pin.category === category).map(pin => pin.name);
}

function getPinRank(resource, pinned) {
  if (!pinned.length) return 0;
  const name = foldText(getField(resource, 'name'));
  const index = pinned.findIndex(pin => name.includes(pin));
  return index === -1 ? 0 : pinned.length - index;
}

function getHighlightTerms(rawQuery) {
  const trimmed = String(rawQuery || '').trim();
  if (!trimmed) return [];
  const words = trimmed.split(/\s+/).filter(word => word.length >= 3 && !SEARCH_STOPWORDS.has(foldText(word)));
  return [trimmed, ...words];
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
  const terms = (Array.isArray(query) ? query : [query])
    .map(term => String(term || '').trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  if (!terms.length) return escapeHTML(text);

  // Match on the raw text and escape each piece, so a search like "amp" or
  // "lt" cannot land inside an HTML entity and garble the card.
  const pattern = new RegExp(terms.map(escapeRegExp).join('|'), 'ig');
  let html = '';
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    html += escapeHTML(text.slice(last, match.index));
    html += `<mark class="match">${escapeHTML(match[0])}</mark>`;
    last = match.index + match[0].length;
  }
  return html + escapeHTML(text.slice(last));
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
  const sheetOrder = [...new Set(resources.map(normalizeCategory))];
  const categories = ['All', ...sheetOrder.sort((a, b) => categoryRank(a) - categoryRank(b))];
  const container = document.getElementById('filters');
  if (!container) return;

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

// Quick exit shows only where someone is looking at domestic violence help:
// the Domestic violence filter, or a shared domestic violence resource.
function updateQuickExit() {
  const button = document.getElementById('quick-exit');
  if (!button) return;
  const shared = getShareModeResource();
  const onDvPage = shared
    ? normalizeCategory(shared) === 'Domestic Violence'
    : !shareResourceKey && activeCategory === 'Domestic Violence';
  button.hidden = !onDvPage;
  document.body.classList.toggle('has-quick-exit', onDvPage);
  updateSafetyTip(onDvPage);
}

// "Browsing safely" note, shown wherever Quick exit is: the Domestic
// violence filter and shared domestic violence listings.
function updateSafetyTip(show) {
  const tip = document.getElementById('safety-tip');
  if (!tip) return;
  tip.hidden = !show;
  if (!show) return;
  tip.setAttribute('aria-label', T[lang].safetyTitle);
  tip.innerHTML = `
    <div class="safety-tip-title">${escapeHTML(T[lang].safetyTitle)}</div>
    <ul>${T[lang].safetyTips.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
    <div class="safety-tip-urgent">${escapeHTML(T[lang].safetyUrgent)}</div>`;
}

function renderCards() {
  updateQuickExit();
  if (shareResourceKey) {
    updateSearchClearButton();
    renderSharePage();
    return;
  }

  const rawQuery = getSearchQuery();
  const query = rawQuery.toLowerCase();
  const search = query ? parseSearchQuery(rawQuery) : null;
  const pinned = search ? search.pinned : getCategoryPins(activeCategory);
  const scores = new Map();

  const filtered = resources.filter(r => {
    const matchCat = activeCategory === 'All' || normalizeCategory(r) === activeCategory;
    if (!matchCat) return false;
    if (!search) return true;
    const score = getSearchScore(r, search);
    scores.set(r, score);
    return score > 0 || getPinRank(r, pinned) > 0;
  }).sort((a, b) => {
    const pinDiff = getPinRank(b, pinned) - getPinRank(a, pinned);
    if (pinDiff !== 0) return pinDiff;
    const scoreDiff = search ? scores.get(b) - scores.get(a) : 0;
    if (scoreDiff !== 0) return scoreDiff;
    return compareText(getLocalizedValue(a, 'name'), getLocalizedValue(b, 'name'));
  });

  filtered_cache = filtered;
  // analytics.js reads this to count searches that found nothing.
  document.getElementById('grid')?.setAttribute('data-result-count', String(filtered.length));
  updateJumpLabel(rawQuery, filtered.length);
  setText('results-info', query
    ? `${T[lang].showing(filtered.length)} · ${T[lang].bestMatches}`
    : T[lang].showing(filtered.length));
  renderResultsContext(rawQuery, filtered.length);
  updateSearchClearButton();
  updateDirectoryUrl();

  if (!filtered.length) {
    updateGridMarkup(`<div class="empty">
      <div class="empty-icon">🔍</div>
      <h3>${escapeHTML(T[lang].noResults)}</h3>
      <p>${escapeHTML(T[lang].noResultsSub)}</p>
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
  const highlightTerms = getHighlightTerms(rawQuery);
  updateGridMarkup(visible.map((r, i) => renderResourceCard(r, i, highlightTerms)).join('') + moreMarkup);
}

function showLoading() {
  updateGridMarkup(`
    <div class="loading"><div class="spinner"></div><div>${escapeHTML(T[lang].loading)}</div></div>`);
}

function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  for (const [id, code] of [['btn-en', 'en'], ['btn-es', 'es']]) {
    const button = document.getElementById(id);
    if (!button) continue;
    button.classList.toggle('active', l === code);
    button.setAttribute('aria-pressed', l === code ? 'true' : 'false');
  }

  const input = document.getElementById('search');
  if (input) input.placeholder = T[l].search;

  const siteTitle = document.getElementById('site-title');
  if (siteTitle && siteTitle.childNodes[0]) siteTitle.childNodes[0].textContent = T[l].siteTitle + ' ';

  setText('clear-search', T[l].clearSearch);
  setText('site-subtitle', T[l].siteSub);
  setText('quick-exit-label', T[l].quickExit);
  document.getElementById('quick-exit')?.setAttribute('title', T[l].quickExitHint);
  setText('intro-title', T[l].introTitle);
  setText('intro-copy', T[l].introCopy);
  setText('finder-label-search', T[l].finderLabelSearch);
  setText('finder-hint-search', T[l].finderHintSearch);
  setText('finder-label-filters', T[l].finderLabelFilters);

  const notice = document.getElementById('status-notice');
  updateStatusNotice(Boolean(notice && notice.classList.contains('show')));

  setText('footer-title', T[l].footerTitle);
  setHTML('footer-contact', `${escapeHTML(T[l].footerContact)} <a href="tel:+13103950220">(310) 395-0220</a>`);
  setText('footer-note', T[l].footerNote);
  updateOfflineNotice();
  setLargeText(isLargeText(), { save: false });
  updateDirectoryUrl();
  if (hasLoadError) {
    renderLoadError();
    return;
  }
  buildFilters(); renderCards();
}

if (sharedCategoryKey) {
  activeCategory = sharedCategoryKey;
}

if (initialSearchQuery) {
  const searchInput = document.getElementById('search');
  if (searchInput) searchInput.value = initialSearchQuery;
}

document.getElementById('search')?.addEventListener('input', handleSearchInput);

try {
  if (window.localStorage.getItem(TEXT_SIZE_KEY) === '1') setLargeText(true, { save: false });
} catch (error) { /* storage blocked: normal size */ }

if (initialLang === 'es') setLang('es');

loadData();
