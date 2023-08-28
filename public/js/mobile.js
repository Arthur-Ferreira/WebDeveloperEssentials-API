const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuElemnt = document.getElementById('mobile-menu');

function toggleMenuMenu() {
  mobileMenuElemnt.classList.toggle('open');
}

mobileMenuBtn.addEventListener('click', toggleMenuMenu);