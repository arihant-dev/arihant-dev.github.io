// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeText = document.querySelector('.theme-toggle-text');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
  updateThemeText(savedTheme);
}

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeText(newTheme);
});

function updateThemeText(theme) {
  themeText.textContent = theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE';
}

// Mobile Menu Logic
const hamburger = document.querySelector('.hamburger');
const navLeft = document.querySelector('.nav-left');

hamburger.addEventListener('click', () => {
  navLeft.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLeft.contains(e.target)) {
    navLeft.classList.remove('active');
  }
});
