// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference, default to dark
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
}
updateThemeIcon(body.getAttribute('data-theme') || 'dark');

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  // Show sun when dark (click to go light), moon when light (click to go dark)
  themeToggle.textContent = theme === 'dark' ? '\u2600' : '\u263E';
}

// Mobile Menu Logic
const hamburger = document.querySelector('.hamburger');
const navLeft = document.querySelector('.nav-left');

hamburger.addEventListener('click', () => {
  const isOpen = navLeft.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLeft.contains(e.target)) {
    navLeft.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// =============================================
// Maps (Leaflet + Esri Canvas tiles, theme-aware)
// Leaflet downloads only when a map scrolls into view
// =============================================
const PLACES = {
  home:   { at: [48.7942, 2.3268], label: 'home', note: 'Cachan &middot; where I live' },
  school: { at: [48.8157, 2.3633], label: 'school', note: 'EPITA &middot; Le Kremlin-Bic&ecirc;tre' },
  work:   { at: [48.8712, 2.3536], label: 'work', note: 'Prelude HQ &middot; Paris 10e' }
};

const TRIP = [
  { at: [48.8566, 2.3522], label: 'Paris' },
  { at: [52.3676, 4.9041], label: 'Amsterdam' },
  { at: [50.8503, 4.3517], label: 'Brussels' },
  { at: [51.2093, 3.2247], label: 'Bruges' },
  { at: [48.8566, 2.3522], label: 'Paris' }
];

const LEAFLET_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet';
let leafletReady = null;

function loadLeaflet() {
  if (leafletReady) return leafletReady;
  leafletReady = new Promise(function (resolve, reject) {
    let pending = 2;
    const done = function () { if (--pending === 0) resolve(window.L); };

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = LEAFLET_URL + '.css';
    css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    css.crossOrigin = '';
    css.onload = done;
    css.onerror = reject;

    const js = document.createElement('script');
    js.src = LEAFLET_URL + '.js';
    js.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    js.crossOrigin = '';
    js.onload = done;
    js.onerror = reject;

    document.head.appendChild(css);
    document.body.appendChild(js);
  });
  return leafletReady;
}

const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_THEME_Gray_LAYER/MapServer/tile/{z}/{y}/{x}';
const TILE_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors';

function themedTiles(L, map) {
  let layers = [];
  function paint() {
    const theme = (document.body.getAttribute('data-theme') || 'dark') === 'dark' ? 'Dark' : 'Light';
    layers.forEach(function (l) { map.removeLayer(l); });
    layers = [
      L.tileLayer(TILE_URL.replace('THEME', theme).replace('LAYER', 'Base'), { maxZoom: 16, attribution: TILE_ATTRIBUTION }),
      L.tileLayer(TILE_URL.replace('THEME', theme).replace('LAYER', 'Reference'), { maxZoom: 16 })
    ];
    layers.forEach(function (l) { l.addTo(map); });
  }
  paint();
  new MutationObserver(paint).observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
}

function baseMap(L, id, opts) {
  const map = L.map(id, Object.assign({ scrollWheelZoom: false, zoomControl: true }, opts));
  map.attributionControl.setPrefix(false);
  themedTiles(L, map);
  const el = document.getElementById(id);
  el.addEventListener('click', function () { map.scrollWheelZoom.enable(); });
  el.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });
  if ('ResizeObserver' in window) new ResizeObserver(function () { map.invalidateSize(); }).observe(el);
  return map;
}

function pin(L, place, color) {
  return L.circleMarker(place.at, {
    radius: 7, color: color, fillColor: color, fillOpacity: 0.75, weight: 2
  })
    .bindTooltip(place.label, { permanent: true, direction: 'right', offset: [8, 0], className: 'map-label' })
    .bindPopup('<span class="map-popup"><strong>' + place.label + '</strong><br>' + place.note + '</span>');
}

function tripLayer(L) {
  const group = L.layerGroup();
  L.polyline(TRIP.map(function (s) { return s.at; }), {
    color: '#cc0000', weight: 2, dashArray: '6 6', opacity: 0.9
  }).addTo(group);
  TRIP.slice(1, -1).forEach(function (s, i) {
    L.circleMarker(s.at, { radius: 6, color: '#cc0000', fillColor: '#ff4444', fillOpacity: 0.8, weight: 2 })
      .bindTooltip((i + 1) + ' ' + s.label, { permanent: true, direction: 'right', offset: [8, 0], className: 'map-label' })
      .addTo(group);
  });
  return group;
}

function lazyMap(id, init) {
  const el = document.getElementById(id);
  if (!el) return;
  let started = false;
  function start() {
    if (started) return;
    started = true;
    loadLeaflet().then(function (L) { init(L); }).catch(function () {
      el.classList.add('map-failed');
      el.textContent = 'map failed to load';
    });
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { start(); io.disconnect(); }
    }, { rootMargin: '200px' });
    io.observe(el);
  } else {
    start();
  }
}

// Home map: where I live, study and work, plus the July trip one click away
lazyMap('map', function (L) {
  const map = baseMap(L, 'map', {});
  const colors = { home: '#ff4444', school: '#66b3ff', work: '#ffcc00' };
  const pins = Object.keys(PLACES).map(function (k) { return pin(L, PLACES[k], colors[k]).addTo(map); });
  const paris = L.featureGroup(pins).getBounds().pad(0.25);
  tripLayer(L).addTo(map);
  const tripBounds = L.latLngBounds(TRIP.map(function (s) { return s.at; })).pad(0.15);
  map.fitBounds(paris);

  const View = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function () {
      const box = L.DomUtil.create('div', 'map-views');
      [['paris', paris], ["jul '26 trip", tripBounds]].forEach(function (v, i) {
        const b = L.DomUtil.create('button', i === 0 ? 'active' : '', box);
        b.type = 'button';
        b.textContent = v[0];
        L.DomEvent.on(b, 'click', function (e) {
          L.DomEvent.stop(e);
          box.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          map.flyToBounds(v[1], { duration: 0.8 });
        });
      });
      L.DomEvent.disableClickPropagation(box);
      return box;
    }
  });
  new View().addTo(map);
});

// Status page: the July trip
lazyMap('trip-map', function (L) {
  const map = baseMap(L, 'trip-map', {});
  tripLayer(L).addTo(map);
  map.fitBounds(L.latLngBounds(TRIP.map(function (s) { return s.at; })).pad(0.15));
});

// Live Paris time wherever a .paris-time element exists
(function parisClock() {
  const els = document.querySelectorAll('.paris-time');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });
  function tick() {
    const now = fmt.format(new Date());
    els.forEach(function (el) { el.textContent = now; });
  }
  tick();
  setInterval(tick, 30000);
})();

// =============================================
// Keyboard Navigation
// =============================================
(function initKeyboardNav() {
  const pages = [
    'index.html',
    'experience.html',
    'oss.html',
    'journal.html',
    'status.html'
  ];

  document.addEventListener('keydown', (e) => {
    // Don't intercept when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();

    // Number keys 1-5: navigate to pages
    if (key >= '1' && key <= '5') {
      const idx = parseInt(key) - 1;
      if (pages[idx]) {
        window.location.href = pages[idx];
      }
      return;
    }

    // j/k: scroll down/up
    if (key === 'j') {
      window.scrollBy({ top: 120, behavior: 'smooth' });
      return;
    }
    if (key === 'k') {
      window.scrollBy({ top: -120, behavior: 'smooth' });
      return;
    }

    // t: toggle theme
    if (key === 't') {
      themeToggle.click();
      return;
    }
  });
})();
