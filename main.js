// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('show');
  }
  
// Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add('show');
      }
    });

function showMessage() {
  alert("The Executable File Is Not Added Yet. It Will Be Available Soon.");
}