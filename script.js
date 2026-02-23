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
// Interactive Map (Leaflet + CartoDB theme-aware tiles)
// =============================================
(function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('map', {
    center: [48.7942, 2.3268], // Cachan, France
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: false
  });

  const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTiles = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  function getCurrentTheme() {
    return document.body.getAttribute('data-theme') || 'dark';
  }

  let tileLayer = L.tileLayer(getCurrentTheme() === 'dark' ? darkTiles : lightTiles, {
    maxZoom: 19
  }).addTo(map);

  // Custom retro marker
  const marker = L.circleMarker([48.7942, 2.3268], {
    radius: 8,
    color: '#cc0000',
    fillColor: '#ff4444',
    fillOpacity: 0.8,
    weight: 2
  }).addTo(map);

  marker.bindPopup('<strong style="font-family:monospace;font-size:12px">Cachan, France</strong>');

  // Enable scroll zoom only when map is focused
  mapEl.addEventListener('click', () => map.scrollWheelZoom.enable());
  mapEl.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

  // Watch for theme changes and swap tiles
  const observer = new MutationObserver(() => {
    const theme = getCurrentTheme();
    map.removeLayer(tileLayer);
    tileLayer = L.tileLayer(theme === 'dark' ? darkTiles : lightTiles, {
      maxZoom: 19
    }).addTo(map);
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
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
