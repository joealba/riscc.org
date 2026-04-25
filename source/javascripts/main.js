const navButton = document.querySelector('.nav-button');
const navigation = document.querySelector('.navigation');

navButton.addEventListener('click', () => {
  navigation.classList.toggle('open');
  navButton.classList.toggle('active');
}, false);
