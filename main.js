// Mobile nav toggle
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('show');
}

// Close menu on outside click
document.addEventListener('click', function(e) {
  const nav = document.getElementById('nav-links');
  const toggle = document.querySelector('.menu-toggle');
  if (nav && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('show');
  }
});

// Scroll-to-top button
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', function() {
  if (window.scrollY > 120) {
    scrollBtn.style.display = 'block';
  } else {
    scrollBtn.style.display = 'none';
  }
  revealOnScroll();
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reveal on scroll
function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

// Run on load too
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(revealOnScroll, 100);
});
